'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task } from '@/types';
import { loadTasksFromLocal } from '@/lib/localStorage';
import TaskCard from '@/components/TaskCard';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'tasks'));

        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Task));

        if (tasksData.length > 0) {
          setTasks(tasksData);
        } else {
          const localTasks = loadTasksFromLocal();
          setTasks(localTasks);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);

        const localTasks = loadTasksFromLocal();
        setTasks(localTasks);

        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="mx-auto max-w-6xl">

        {loading ? (
          <div className="text-center text-gray-300">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            No tasks are published yet.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TasksPage;
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
        const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        console.log('Fetched', tasksData.length, 'tasks from Firebase:', tasksData);

        if (tasksData.length > 0) {
          setTasks(tasksData);
        } else {
          // Try local storage fallback
          const localTasks = loadTasksFromLocal();
          console.log('No tasks in Firebase, trying local storage:', localTasks.length, 'tasks');
          setTasks(localTasks);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching from Firebase, using local storage:', error);
        // Fallback to local storage
        const localTasks = loadTasksFromLocal();
        console.log('Loaded tasks from local storage:', localTasks.length, 'tasks');
        setTasks(localTasks);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
        // Show error state
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
          <h1 className="text-4xl font-bold mb-3">Microtask Portal</h1>
          <p className="text-gray-300 max-w-2xl leading-7">
            Browse available tasks and click any task to open the task information page. Read the instructions and watch the video guide, then click the CTA button to start the task on the main website.
          </p>
        </div>

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

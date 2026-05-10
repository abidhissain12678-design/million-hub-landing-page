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
        setLoading(true);
        console.log('Fetching tasks from Firestore...');
        
        // Create a promise that will race between Firestore and a timeout
        const firestorePromise = getDocs(collection(db, 'tasks'));
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        );

        let querySnapshot;
        try {
          querySnapshot = await Promise.race<any>([firestorePromise, timeoutPromise]);
        } catch (timeoutError) {
          console.log('Firestore fetch timed out, falling back to local storage');
          const localTasks = loadTasksFromLocal();
          console.log('Loaded from local storage:', localTasks.length, 'tasks');
          setTasks(localTasks);
          setLoading(false);
          return;
        }

        console.log('Firebase query returned', querySnapshot.size, 'documents');

        const tasksData = querySnapshot.docs.map((doc: any) => {
          const data = doc.data();
          console.log('Mapped task:', { id: doc.id, title: data.title });
          return {
            id: doc.id,
            ...data,
          } as Task;
        });

        console.log('Final tasksData from Firebase:', tasksData.length, 'tasks');

        if (tasksData.length > 0) {
          console.log('Setting tasks from Firestore:', tasksData.length);
          setTasks(tasksData);
        } else {
          console.log('No tasks from Firestore, loading from local storage');
          const localTasks = loadTasksFromLocal();
          console.log('Loaded fallback tasks from local storage:', localTasks.length);
          setTasks(localTasks);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);

        const localTasks = loadTasksFromLocal();
        console.log('Loading fallback tasks from local storage:', localTasks.length);
        setTasks(localTasks);

        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-12">Available Tasks</h1>

        {loading ? (
          <div className="text-center text-gray-300">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-gray-300">
            <p className="mb-4">No tasks are published yet.</p>
            <p className="text-sm text-gray-500">Check back soon for new opportunities!</p>
            <p className="text-xs text-gray-600 mt-4 p-4 bg-gray-900/50 rounded font-mono">
              Debug: State loaded successfully but no tasks found. Check Firebase or local storage.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">Found {tasks.length} task(s):</p>
            {tasks.length > 0 && (
              <p className="text-xs text-gray-600 mb-4 p-2 bg-gray-900/30 rounded">
                Tasks: {tasks.map(t => `${t.title || '?'} (${t.id})`).join(', ')}
              </p>
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TasksPage;
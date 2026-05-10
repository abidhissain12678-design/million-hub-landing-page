'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Task } from '@/types';
import { saveTasksToLocal, loadTasksFromLocal, addTaskToLocal, deleteTaskFromLocal } from '@/lib/localStorage';

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState('');
  const [taskError, setTaskError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    reward: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    youtubeUrl: '',
    ads: {
      top: '',
      middle: '',
      left: '',
      right: '',
      bottom: ''
    },
    slug: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchTasks();
      }
    });
    checkConnection();
    return unsubscribe;
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      // Try to get a document count to test connectivity
      const testQuery = await getDocs(collection(db, 'tasks'));
      setConnectionStatus('online');
      console.log('Firebase connection: ONLINE - Found', testQuery.docs.length, 'documents');
    } catch (error: any) {
      setConnectionStatus('offline');
      console.log('Firebase connection: OFFLINE - Error:', error.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      console.log('Fetched tasks from Firebase:', tasksData.length, 'tasks');
      setTasks(tasksData);
      // Also save to local storage as backup
      saveTasksToLocal(tasksData);
    } catch (error: any) {
      console.error('Error fetching from Firebase, using local storage:', error);
      // Fallback to local storage
      const localTasks = loadTasksFromLocal();
      console.log('Loaded tasks from local storage:', localTasks.length, 'tasks');
      setTasks(localTasks);
      setTaskError('Using local storage - Firebase connection failed. Tasks will be saved locally.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError(error.message || 'Login failed');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setAuthError(error.message || 'Sign up failed');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    setTaskError('');
    const slug = generateSlug(newTask.title!);
    const taskData = {
      ...newTask,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Always save to local storage first (offline-first approach)
    const localTask = addTaskToLocal(taskData);
    console.log('Task created in local storage with ID:', localTask.id, 'and slug:', slug);

    // Try to also save to Firebase (non-blocking)
    try {
      const docRef = await addDoc(collection(db, 'tasks'), taskData);
      console.log('Task also created in Firebase with ID:', docRef.id);
    } catch (error: any) {
      console.error('Firebase create failed, but task is saved locally:', error);
    }

    setTasks(prev => [...prev, localTask]);
    setNewTask({
      title: '',
      reward: '',
      description: '',
      ctaText: '',
      ctaLink: '',
      youtubeUrl: '',
      ads: {
        top: '',
        middle: '',
        left: '',
        right: '',
        bottom: ''
      },
      slug: ''
    });
    setTaskError('');
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      fetchTasks();
    } catch (error: any) {
      console.error('Firebase delete failed, using local storage:', error);
      // Fallback to local storage
      deleteTaskFromLocal(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setTaskError('Task deleted from local storage - Firebase connection failed.');
    }
  };

  const copyToClipboard = async (taskSlug: string, taskId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const taskUrl = `${baseUrl}/task/${taskSlug}`;
    
    try {
      await navigator.clipboard.writeText(taskUrl);
      setCopiedId(taskId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openLink = (taskSlug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const taskUrl = `${baseUrl}/task/${taskSlug}`;
    window.open(taskUrl, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="bg-gray-800 p-8 rounded-lg">
          <h1 className="text-white text-2xl mb-4">{isSignUp ? 'Admin Sign Up' : 'Admin Login'}</h1>
          {authError && (
            <div className="bg-red-600 text-white p-2 rounded mb-4">
              {authError}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 text-white"
            required
          />
          <button type="submit" className="w-full bg-yellow-500 text-black p-2 rounded mb-4">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError('');
            }}
            className="w-full text-gray-400 hover:text-white"
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {connectionStatus === 'offline' && (
        <div className="bg-red-600 text-white p-4 rounded-lg mb-8">
          <h3 className="font-bold mb-2">⚠️ Firebase Connection Issue</h3>
          <p>Firebase is currently offline. Tasks created now will not be saved to the database. Please check your internet connection and try refreshing the connection status.</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'online' ? 'bg-green-500' :
              connectionStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm">
              Firebase: {connectionStatus === 'online' ? 'Online' :
                         connectionStatus === 'offline' ? 'Offline' : 'Checking...'}
            </span>
            <button
              onClick={checkConnection}
              className="text-xs bg-gray-600 px-2 py-1 rounded hover:bg-gray-500"
            >
              Refresh
            </button>
          </div>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleCreateTask} className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl mb-4">Create New Task</h2>
        {taskError && (
          <div className="bg-red-600 text-white p-2 rounded mb-4">
            {taskError}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="p-2 bg-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Reward Amount"
            value={newTask.reward}
            onChange={(e) => setNewTask({ ...newTask, reward: e.target.value })}
            className="p-2 bg-gray-700"
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            className="p-2 bg-gray-700 col-span-2"
            rows={4}
            required
          />
          <input
            type="text"
            placeholder="CTA Button Text"
            value={newTask.ctaText}
            onChange={(e) => setNewTask({ ...newTask, ctaText: e.target.value })}
            className="p-2 bg-gray-700"
            required
          />
          <input
            type="url"
            placeholder="CTA Button Link"
            value={newTask.ctaLink}
            onChange={(e) => setNewTask({ ...newTask, ctaLink: e.target.value })}
            className="p-2 bg-gray-700"
            required
          />
          <input
            type="url"
            placeholder="YouTube URL"
            value={newTask.youtubeUrl}
            onChange={(e) => setNewTask({ ...newTask, youtubeUrl: e.target.value })}
            className="p-2 bg-gray-700 col-span-2"
            required
          />
          <input
            type="url"
            placeholder="Top Ad URL"
            value={newTask.ads?.top || ''}
            onChange={(e) => setNewTask({ ...newTask, ads: { ...newTask.ads, top: e.target.value } })}
            className="p-2 bg-gray-700"
          />
          <input
            type="url"
            placeholder="Middle Ad URL"
            value={newTask.ads?.middle || ''}
            onChange={(e) => setNewTask({ ...newTask, ads: { ...newTask.ads, middle: e.target.value } })}
            className="p-2 bg-gray-700"
          />
          <input
            type="url"
            placeholder="Left Sticky Ad URL"
            value={newTask.ads?.left || ''}
            onChange={(e) => setNewTask({ ...newTask, ads: { ...newTask.ads, left: e.target.value } })}
            className="p-2 bg-gray-700"
          />
          <input
            type="url"
            placeholder="Right Sticky Ad URL"
            value={newTask.ads?.right || ''}
            onChange={(e) => setNewTask({ ...newTask, ads: { ...newTask.ads, right: e.target.value } })}
            className="p-2 bg-gray-700"
          />
          <input
            type="url"
            placeholder="Bottom Ad URL"
            value={newTask.ads?.bottom || ''}
            onChange={(e) => setNewTask({ ...newTask, ads: { ...newTask.ads, bottom: e.target.value } })}
            className="p-2 bg-gray-700 col-span-2"
          />
        </div>
        <button type="submit" className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded">
          Generate Landing Page
        </button>
      </form>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl mb-4 font-bold">Existing Tasks</h2>
        <div className="space-y-4">
          {tasks.map((task) => {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const taskUrl = `${baseUrl}/task/${task.slug}`;
            return (
              <div key={task.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-white">{task.title}</h3>
                  <p className="text-gray-300 text-sm">Reward: {task.reward}</p>
                </div>
                
                <div className="bg-gray-600 p-3 rounded mb-3 break-all">
                  <p className="text-xs text-gray-300 mb-1">Task Link:</p>
                  <p className="text-yellow-300 font-mono text-sm">{taskUrl}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => copyToClipboard(task.slug, task.id!)}
                    className={`px-4 py-2 rounded font-medium transition ${
                      copiedId === task.id
                        ? 'bg-green-500 text-white'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {copiedId === task.id ? '✓ Copied!' : 'Copy Link'}
                  </button>
                  <button
                    onClick={() => openLink(task.slug)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition"
                  >
                    Open Link
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id!)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
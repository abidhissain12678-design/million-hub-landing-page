'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task } from '@/types';
import { loadTasksFromLocal } from '@/lib/localStorage';
import AdBanner from '@/components/AdBanner';
import StickyAd from '@/components/StickyAd';
import VideoGuide from '@/components/VideoGuide';
import CTASection from '@/components/CTASection';
import ShareButtons from '@/components/ShareButtons';
import { useParams } from 'next/navigation';

const TaskPage: React.FC = () => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string | undefined;
  
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('No task slug provided');
      return;
    }

    const fetchTask = async () => {
      try {
        setLoading(true);
        console.log('TaskPage: Looking for task with slug:', slug);
        
        // Try local storage immediately
        const localTasks = loadTasksFromLocal();
        console.log('TaskPage: Local storage tasks:', localTasks);
        
        const foundInLocal = localTasks.find(t => t.slug === slug);
        if (foundInLocal) {
          console.log('TaskPage: Task found in local storage!', foundInLocal);
          setTask(foundInLocal);
          setLoading(false);
          return;
        }

        // Try Firebase
        try {
          const q = query(collection(db, 'tasks'), where('slug', '==', slug));
          const querySnapshot = await getDocs(q);
          console.log('TaskPage: Firebase query returned', querySnapshot.size, 'documents');

          if (!querySnapshot.empty) {
            const taskDoc = querySnapshot.docs[0];
            const foundTask = { id: taskDoc.id, ...taskDoc.data() } as Task;
            console.log('TaskPage: Task found in Firebase!', foundTask);
            setTask(foundTask);
            setLoading(false);
            return;
          }
        } catch (firebaseError) {
          console.log('TaskPage: Firebase query failed:', firebaseError);
        }
        
        // Not found anywhere
        setError(`Task not found with slug: ${slug}`);
        setLoading(false);
      } catch (err: any) {
        console.error('TaskPage: Error fetching task:', err);
        setError(err.message || 'Error loading task');
        setLoading(false);
      }
    };

    fetchTask();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-400">Finding your task...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">❌ Task not found</h1>
          <p className="text-gray-400">{error || 'The task you are looking for does not exist.'}</p>
          <p className="text-gray-500 mt-4">Slug: {slug}</p>
          <p className="text-sm text-gray-600 mt-4">Check the admin panel to create a task</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Sticky Ads */}
      <StickyAd adUrl={task.ads?.left} position="left" />
      <StickyAd adUrl={task.ads?.right} position="right" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Top Ad */}
        <AdBanner adUrl={task.ads?.top} position="top" />

        {/* Task Title and Reward */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            {task.title}
          </h1>
          <p className="text-2xl text-yellow-400 font-semibold">
            Reward: {task.reward}
          </p>
        </div>

        {/* Share Buttons */}
        <ShareButtons taskTitle={task.title} taskSlug={task.slug} />

        {/* Task Description */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Task Details</h2>
          <p className="text-lg leading-relaxed whitespace-pre-wrap">
            {task.description}
          </p>
        </div>

        <div className="rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5 mb-8 text-yellow-100">
          <p className="font-semibold">Read the full instructions and watch the video guide first. When you understand the task, click the CTA button below to start the task on the main website.</p>
        </div>

        {/* Middle Ad */}
        <AdBanner adUrl={task.ads?.middle} position="middle" />

        {/* Video Guide */}
        {task.youtubeUrl && <VideoGuide youtubeUrl={task.youtubeUrl} />}

        {/* CTA Section */}
        <CTASection ctaText={task.ctaText} ctaLink={task.ctaLink} />

        {/* Bottom Ad */}
        <AdBanner adUrl={task.ads?.bottom} position="bottom" />

        {/* Footer */}
        <footer className="text-center py-8 text-gray-400 border-t border-gray-700 mt-8">
          <p>© 2026 Million Hub. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default TaskPage;
import Link from 'next/link';
import { Task } from '@/types';

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const descriptionPreview = task.description ? task.description.slice(0, 140) : '';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-yellow-500/5 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{task.title}</h3>
          <p className="text-sm text-yellow-300 mt-1">Reward: {task.reward}</p>
        </div>
        <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-200">
          Task Page
        </span>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed mb-6">
        {descriptionPreview}{task.description.length > 140 ? '...' : ''}
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/task/${task.slug}`}
          className="rounded-full bg-yellow-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          View Task Details
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <h1 className="text-5xl font-black tracking-tight text-white mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
          Million Hub Task Landing Page Generator
        </h1>
        <p className="text-lg text-gray-300 leading-8 mb-8">
          Build premium task landing pages with video guides, ad placement, social sharing, and a modern admin panel. Designed for fast setup and scalable growth.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 text-black font-semibold shadow-lg shadow-yellow-500/20 hover:scale-[1.01] transition-transform duration-300"
          >
            Go to Admin Panel
          </Link>
          <Link
            href="/tasks"
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-white hover:bg-white/10 transition-colors duration-300"
          >
            Browse Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiSparklingLine } from 'react-icons/ri';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * AuthLayout - Layout for login, register, forgot-password pages
 * Features a split layout with branding on the left and form on the right
 */
export default function AuthLayout() {
  const [stats, setStats] = useState([
    { value: '10K+', label: 'Users' },
    { value: '50K+', label: 'Interviews' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('/rating/stats');
        const data = response.data;
        if (data) {
          setStats([
            { value: data.total_users > 1000 ? `${(data.total_users / 1000).toFixed(1)}K+` : `${data.total_users}+`, label: 'Users' },
            { value: data.total_interviews > 1000 ? `${(data.total_interviews / 1000).toFixed(1)}K+` : `${data.total_interviews}+`, label: 'Interviews' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-[100dvh] flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#FC9145' }}
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-32 right-20 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#C1C1EA' }}
          />
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full opacity-8"
            style={{ backgroundColor: '#FFF3E4' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <Link to="/" className="flex items-center gap-3 text-white mb-12">
            <img src="/PrepAI.png" alt="PrepAI Logo" className="w-10 h-10 object-contain drop-shadow-md" />
            <span className="text-3xl font-bold">PrepAI</span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Ace Your Next<br />
            <span className="text-accent-100">Interview</span> with<br />
            AI Confidence
          </h1>

          <p className="text-lg text-white/70 max-w-md mb-10">
            Practice with AI-powered mock interviews, get instant feedback, and build the confidence you need to land your dream job.
          </p>

          {/* Stats */}
          <div className="flex gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Area */}
      <div className="flex-1 min-w-0 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden w-full flex items-center justify-center p-6 border-b border-neutral-200 dark:border-neutral-800">
          <Link to="/" className="flex items-center gap-3">
            <img src="/PrepAI.png" alt="PrepAI Logo" className="w-8 h-8 object-contain" />
            <span className="text-2xl font-bold gradient-text">PrepAI</span>
          </Link>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}

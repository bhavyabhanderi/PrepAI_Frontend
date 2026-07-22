import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiFileTextLine, RiUserVoiceLine, RiCodeSSlashLine,
  RiBarChartBoxLine, RiArrowUpLine, RiArrowDownLine,
  RiSparklingLine, RiTimeLine, RiTrophyLine,
  RiCalendarLine, RiArrowRightLine, RiMicLine, RiBook2Line
} from 'react-icons/ri';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { useSelector } from 'react-redux';
import { getGreeting, getScoreColor } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { resumeService, profileService, analyticsService } from '../services/api';

const ICON_MAP = {
  'user-voice': RiUserVoiceLine,
  'file-text': RiFileTextLine,
  'code': RiCodeSSlashLine,
  'mic': RiMicLine,
  'trophy': RiTrophyLine,
};

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

/**
 * Dashboard Page - Stats, charts, activity, AI suggestions
 */
export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [atsScore, setAtsScore] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const resumeRes = await resumeService.getLatestAnalysis();
        if (resumeRes.data) {
          setAtsScore(resumeRes.data.ats_score);
        }
      } catch (err) {
        // Ignored
      }
      try {
        const profileRes = await profileService.getProfile();
        if (profileRes.data) {
          setUserProfile(profileRes.data);
        }
      } catch (err) {
        // Ignored
      }
      try {
        const dashboardRes = await analyticsService.getDashboardData();
        if (dashboardRes.data) {
          setDashboardData(dashboardRes.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-120px)] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          Loading dashboard metrics...
        </p>
      </div>
    );
  }

  const stats = (dashboardData?.stats || [
    { label: 'Total Interviews', value: '0', change: '0', up: true, icon: 'user-voice', color: '#533086', bg: 'rgba(83,48,134,0.1)' },
    { label: 'Resume Score', value: atsScore ? `${atsScore}%` : 'N/A', change: '0%', up: true, icon: 'file-text', color: '#FC9145', bg: 'rgba(252,145,69,0.1)' },
    { label: 'Technical Score', value: 'N/A', change: '0%', up: true, icon: 'code', color: '#4A4DC9', bg: 'rgba(74,77,201,0.1)' },
    { label: 'HR Score', value: 'N/A', change: '0%', up: true, icon: 'trophy', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  ]).map(stat => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || RiUserVoiceLine,
  }));

  const weeklyData = dashboardData?.weeklyData || [
    { day: 'Mon', interviews: 0, score: 0 },
    { day: 'Tue', interviews: 0, score: 0 },
    { day: 'Wed', interviews: 0, score: 0 },
    { day: 'Thu', interviews: 0, score: 0 },
    { day: 'Fri', interviews: 0, score: 0 },
    { day: 'Sat', interviews: 0, score: 0 },
    { day: 'Sun', interviews: 0, score: 0 },
  ];

  const recentActivity = (dashboardData?.recentActivity || []).map(act => ({
    ...act,
    icon: ICON_MAP[act.icon] || RiUserVoiceLine,
  }));

  const aiSuggestions = dashboardData?.aiSuggestions || [
    { text: 'Complete an interview or resume analysis to receive AI suggestions.', type: 'improvement' }
  ];



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div {...fadeInUp} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {getGreeting()}, {user?.name || 'User'} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Here's an overview of your interview preparation progress.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border card-hover"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <stat.icon size={22} />
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.up ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}
              >
                {stat.up ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
            <div className="min-w-0">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Weekly Progress
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Your interview scores over the week
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#4A4DC9' }} />
                Score
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FC9145' }} />
                Interviews
              </span>
            </div>
          </div>
          <div className="h-64 sm:h-72 lg:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4A4DC9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4A4DC9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="score" stroke="#4A4DC9" fill="url(#scoreGradient)" strokeWidth={2} />
              <Bar dataKey="interviews" fill="#FC9145" radius={[4, 4, 0, 0]} barSize={20} />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-5">
            <RiSparklingLine className="text-accent-500" size={20} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              AI Suggestions
            </h3>
          </div>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, i) => (
              <div
                key={i}
                className="p-3 rounded-xl text-sm leading-relaxed"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span className="mr-1">{suggestion.type === 'praise' ? '🎉' : '💡'}</span>
                {suggestion.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Activity
            </h3>
            <Link
              to={ROUTES.INTERVIEW_HISTORY}
              className="text-xs font-medium text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              View All <RiArrowRightLine size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary-500/5 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
                >
                  <activity.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {activity.type}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {activity.time}
                  </p>
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ color: getScoreColor(activity.score) }}
                >
                  {activity.score}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'HR Interview', icon: RiUserVoiceLine, path: ROUTES.HR_INTERVIEW, color: '#533086' },
              { label: 'Technical', icon: RiCodeSSlashLine, path: ROUTES.TECHNICAL_INTERVIEW, color: '#4A4DC9' },
              { label: 'Resume Check', icon: RiFileTextLine, path: ROUTES.RESUME_ANALYZER, color: '#FC9145' },
              { label: 'Coding', icon: RiCodeSSlashLine, path: ROUTES.CODING_INTERVIEW, color: '#22C55E' },
              { label: 'Voice Practice', icon: RiMicLine, path: ROUTES.VOICE_INTERVIEW, color: '#533086' },
              { label: 'Aptitude Test', icon: RiCodeSSlashLine, path: ROUTES.APTITUDE_INTERVIEW, color: '#F59E0B' },
              { label: 'Syllabus', icon: RiBook2Line, path: ROUTES.SYLLABUS_ANALYZER, color: '#10B981' },
              { label: 'View Report', icon: RiBarChartBoxLine, path: ROUTES.PERFORMANCE_REPORT, color: '#4A4DC9' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md card-hover"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  <action.icon size={18} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

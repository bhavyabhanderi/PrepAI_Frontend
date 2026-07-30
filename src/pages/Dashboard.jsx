import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiFileTextLine, RiUserVoiceLine, RiCodeSSlashLine,
  RiBarChartBoxLine, RiArrowUpLine, RiArrowDownLine,
  RiSparklingFill, RiTimeLine, RiTrophyLine,
  RiCalendarLine, RiArrowRightLine, RiMicLine, RiBook2Line, RiBrainLine,
  RiNodeTree, RiDatabase2Line, RiBugLine, RiCodeBoxLine,
  RiBookOpenLine, RiHistoryLine
} from 'react-icons/ri';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Bar,
} from 'recharts';
import { useSelector } from 'react-redux';
import { getGreeting, getScoreColor } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { resumeService, profileService, analyticsService, interviewService, codingService, syllabusService } from '../services/api';
import { formatDate } from '../utils/helpers';

const TYPE_META = {
  hr:         { label: 'HR Interview',          icon: RiUserVoiceLine,  color: '#533086' },
  technical:  { label: 'Technical Interview',   icon: RiCodeSSlashLine, color: '#4A4DC9' },
  behavioral: { label: 'Behavioral Interview',  icon: RiUserVoiceLine,  color: '#533086' },
  aptitude:   { label: 'Aptitude Test',         icon: RiBrainLine,      color: '#FC9145' },
  coding:     { label: 'Coding Challenge',      icon: RiCodeSSlashLine, color: '#4A4DC9' },
  company_specific: { label: 'Company Interview', icon: RiUserVoiceLine, color: '#533086' },
  syllabus:   { label: 'Syllabus Analysis',     icon: RiBook2Line,      color: '#10B981' },
  resume:     { label: 'Resume Analysis',       icon: RiBook2Line,      color: '#FC9145' },
  learning_plan: { label: 'Learning Plan',      icon: RiCalendarLine,   color: '#F59E0B' },
  system_design: { label: 'System Design', icon: RiNodeTree, color: '#F59E0B' },
  sql_practice: { label: 'SQL Practice', icon: RiDatabase2Line, color: '#10B981' },
  debugging: { label: 'Debugging', icon: RiBugLine, color: '#EF4444' },
  playground: { label: 'Playground', icon: RiCodeBoxLine, color: '#8B5CF6' },
};

function getTypeMeta(type) {
  return TYPE_META[type] || { label: type, icon: RiHistoryLine, color: '#4A4DC9' };
}

const ICON_MAP = {
  'user-voice': RiUserVoiceLine,
  'file-text': RiFileTextLine,
  'code': RiCodeSSlashLine,
  'mic': RiMicLine,
  'trophy': RiTrophyLine,
  'book': RiBook2Line,
  'calendar': RiCalendarLine,
  'brain': RiBrainLine,
  'node-tree': RiNodeTree,
  'database': RiDatabase2Line,
  'bug': RiBugLine,
  'code-box': RiCodeBoxLine,
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
  const [historyActivity, setHistoryActivity] = useState([]);
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
    async function fetchHistory() {
      try {
        const [intRes, codRes, sylRes, resRes, lpRes] = await Promise.all([
          interviewService.getHistory().catch(() => ({ data: [] })),
          codingService.getHistory().catch(() => ({ data: [] })),
          syllabusService.list().catch(() => ({ data: [] })),
          resumeService.getHistory().catch(() => ({ data: [] })),
          analyticsService.getLearningPlanHistory().catch(() => ({ data: [] }))
        ]);
        
        const interviews = (intRes.data || []).map(i => ({...i}));
        const codings = (codRes.data || []).map(c => ({
          id: c.id || c._id,
          type: 'coding',
          status: 'completed',
          created_at: c.created_at,
          job_role: c.problem_title || 'Coding Challenge',
        }));
        const syllabi = (sylRes.data || []).map(s => ({
          id: s.id || s._id,
          type: 'syllabus',
          status: 'completed',
          created_at: s.created_at,
          subject: s.subject,
          file_name: s.file_name
        }));
        const resumes = (resRes.data || []).map(r => ({
          id: r.id || r._id,
          type: 'resume',
          status: 'completed',
          created_at: r.created_at,
          subject: 'Resume Analysis',
          file_name: r.file_name || 'Resume'
        }));
        const learningPlans = (lpRes.data || []).map(lp => ({
          id: lp.id || lp._id,
          type: 'learning_plan',
          status: 'completed',
          created_at: lp.created_at,
          subject: 'Learning Plan',
        }));

        const combined = [...interviews, ...codings, ...syllabi, ...resumes, ...learningPlans].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setHistoryActivity(combined);
      } catch (err) {
        console.error('Failed to load history', err);
      }
    }
    fetchDashboardData();
    fetchHistory();
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

  // Dynamically calculate stats based on historyActivity
  const getAverageScore = (types) => {
    const matching = historyActivity.filter(item => types.includes(item.type) && item.score != null);
    if (matching.length === 0) return 'N/A';
    const sum = matching.reduce((acc, curr) => acc + Number(curr.score), 0);
    return Math.round(sum / matching.length) + '%';
  };

  const totalInterviews = historyActivity.filter(item => ['hr', 'technical', 'aptitude', 'coding', 'behavioral', 'company_specific'].includes(item.type)).length;
  const technicalScore = getAverageScore(['technical', 'coding', 'system_design', 'debugging', 'sql_practice']);
  const hrScore = getAverageScore(['hr', 'behavioral']);
  const computedResumeScore = atsScore ? `${atsScore}%` : getAverageScore(['resume']);

  const stats = (dashboardData?.stats || [
    { label: 'Total Interviews', value: totalInterviews.toString(), change: '+0', up: true, icon: 'user-voice', color: '#533086', bg: 'rgba(83,48,134,0.1)' },
    { label: 'Resume Score', value: computedResumeScore, change: '+0%', up: true, icon: 'file-text', color: '#FC9145', bg: 'rgba(252,145,69,0.1)' },
    { label: 'Technical Score', value: technicalScore, change: '+0%', up: true, icon: 'code', color: '#4A4DC9', bg: 'rgba(74,77,201,0.1)' },
    { label: 'HR Score', value: hrScore, change: '+0%', up: true, icon: 'trophy', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  ]).map(stat => ({
    ...stat,
    icon: ICON_MAP[stat.icon] || RiUserVoiceLine,
  }));

  const generateWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const result = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      
      const dayStart = new Date(d).setHours(0,0,0,0);
      const dayEnd = new Date(d).setHours(23,59,59,999);
      
      const dayActivities = historyActivity.filter(item => {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at).getTime();
        return itemDate >= dayStart && itemDate <= dayEnd;
      });
      
      let avgScore = 0;
      const scoredActivities = dayActivities.filter(a => a.score != null);
      if (scoredActivities.length > 0) {
        avgScore = Math.round(scoredActivities.reduce((acc, curr) => acc + Number(curr.score), 0) / scoredActivities.length);
      }
      
      result.push({
        day: dayName,
        interviews: dayActivities.length,
        score: avgScore
      });
    }
    return result;
  };

  const weeklyData = dashboardData?.weeklyData || generateWeeklyData();

  const recentActivity = historyActivity.map(item => {
    const meta = getTypeMeta(item.type);
    return {
      id: item.id || item._id,
      type: meta.label,
      time: item.created_at ? formatDate(item.created_at) : 'N/A',
      score: item.score != null ? item.score : null,
      icon: meta.icon,
      color: meta.color
    };
  });

  const aiSuggestions = dashboardData?.aiSuggestions || [
    { text: 'Complete an interview or resume analysis to receive AI suggestions.', type: 'improvement' }
  ];



  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 sm:p-5 rounded-2xl border card-hover"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                <stat.icon className="w-4 h-4 sm:w-[22px] sm:h-[22px]" />
              </div>
              <span
                className={`inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${stat.up ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}
              >
                {stat.up ? <RiArrowUpLine size={10} /> : <RiArrowDownLine size={10} />}
                {stat.change}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div className="text-[10px] sm:text-xs mt-0.5 leading-tight text-balance" style={{ color: 'var(--text-tertiary)' }}>
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
          <div className="h-64 sm:h-72 lg:h-[260px] [&_*]:!outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyData} style={{ outline: 'none' }}>
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
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="interviews" fill="#FC9145" radius={[4, 4, 0, 0]} barSize={20} />
                <Area type="monotone" dataKey="score" stroke="#4A4DC9" fill="url(#scoreGradient)" strokeWidth={2} />
              </ComposedChart>
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
            <RiSparklingFill className="text-accent-500" size={20} />
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
            {recentActivity.slice(0, 7).map((activity) => (
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
                  style={{ color: activity.score != null ? getScoreColor(activity.score) : 'var(--text-tertiary)' }}
                >
                  {activity.score != null ? `${activity.score}%` : 'N/A'}
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
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {[
              { label: 'HR Interview', icon: RiUserVoiceLine, path: ROUTES.HR_INTERVIEW, color: '#533086' },
              { label: 'Technical', icon: RiCodeSSlashLine, path: ROUTES.TECHNICAL_INTERVIEW, color: '#4A4DC9' },
              { label: 'Resume Check', icon: RiFileTextLine, path: ROUTES.RESUME_ANALYZER, color: '#FC9145' },
              { label: 'Coding', icon: RiCodeSSlashLine, path: ROUTES.CODING_INTERVIEW, color: '#22C55E' },
              { label: 'Voice Practice', icon: RiMicLine, path: ROUTES.VOICE_INTERVIEW, color: '#533086' },
              { label: 'Aptitude Test', icon: RiBrainLine, path: ROUTES.APTITUDE_INTERVIEW, color: '#F59E0B' },
              { label: 'Syllabus', icon: RiBook2Line, path: ROUTES.SYLLABUS_ANALYZER, color: '#10B981' },
              { label: 'System Design', icon: RiNodeTree, path: ROUTES.SYSTEM_DESIGN, color: '#F59E0B' },
              { label: 'SQL Practice', icon: RiDatabase2Line, path: ROUTES.SQL_PRACTICE, color: '#10B981' },
              { label: 'Debugging', icon: RiBugLine, path: ROUTES.DEBUGGING, color: '#EF4444' },
              { label: 'Playground', icon: RiCodeBoxLine, path: ROUTES.PLAYGROUND, color: '#8B5CF6' },
              { label: 'Learning Plan', icon: RiBookOpenLine, path: ROUTES.LEARNING_PLAN, color: '#533086' },
              { label: 'View Report', icon: RiBarChartBoxLine, path: ROUTES.PERFORMANCE_REPORT, color: '#4A4DC9' },
              { label: 'History', icon: RiHistoryLine, path: ROUTES.INTERVIEW_HISTORY, color: '#7a7a95' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border transition-all hover:shadow-md card-hover justify-center sm:justify-start"
                style={{
                  borderColor: 'var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${action.color}15`, color: action.color }}
                >
                  <action.icon size={18} />
                </div>
                <span className="text-[10px] sm:text-sm font-medium leading-tight text-balance" style={{ color: 'var(--text-primary)' }}>
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

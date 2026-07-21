import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { RiDownloadLine, RiShareLine, RiCalendarLine } from 'react-icons/ri';
import { getScoreColor } from '../utils/helpers';
import { analyticsService } from '../services/api';
import ratingService from '../services/ratingService';
import { useIsMobile } from '../hooks';
import RatingModal from '../components/RatingModal';

/**
 * Performance Report Page
 */
export default function PerformanceReport() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    async function loadPerformanceData() {
      try {
        const res = await analyticsService.getPerformanceKPIs();
        if (res.data) {
          setKpis(res.data);
        }

        // Check if user has rated
        const ratingCheck = await ratingService.checkRatingStatus();
        if (!ratingCheck.has_rated) {
          setShowRatingModal(true);
        }
      } catch (err) {
        console.error('Failed to load performance KPIs', err);
      } finally {
        setLoading(false);
      }
    }
    loadPerformanceData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-120px)] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          Analyzing your performance metrics...
        </p>
      </div>
    );
  }

  const radarData = kpis?.radarData || [
    { skill: 'Communication', score: 85 },
    { skill: 'Technical', score: 78 },
    { skill: 'Coding', score: 92 },
    { skill: 'Grammar', score: 80 },
    { skill: 'Confidence', score: 75 },
    { skill: 'Time Mgmt', score: 88 },
  ];

  const barData = kpis?.barData || [
    { category: 'HR', score: 82 },
    { category: 'Technical', score: 78 },
    { category: 'Coding', score: 92 },
    { category: 'Voice', score: 70 },
    { category: 'Resume', score: 75 },
  ];

  const rawPieData = kpis?.pieData || [
    { name: 'Excellent', value: 35, color: '#22C55E' },
    { name: 'Good', value: 40, color: '#4A4DC9' },
    { name: 'Average', value: 15, color: '#FC9145' },
    { name: 'Below Avg', value: 10, color: '#EF4444' },
  ];

  const hasPieData = rawPieData.some(d => d.value > 0);
  const pieData = hasPieData ? rawPieData : [
    { name: 'No data', value: 1, color: '#9CA3AF' }
  ];

  const progressData = kpis?.progressData || [
    { week: 'W1', score: 60 },
    { week: 'W2', score: 65 },
    { week: 'W3', score: 70 },
    { week: 'W4', score: 68 },
    { week: 'W5', score: 78 },
    { week: 'W6', score: 82 },
    { week: 'W7', score: 85 },
    { week: 'W8', score: 88 },
  ];

  const overallScore = kpis ? Math.round(kpis.overall_score) : 82;
  const totalInterviews = kpis ? kpis.total_interviews : 24;


  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Performance Report</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Comprehensive analysis of your interview performance.</p>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent-500" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-white/70 text-sm">Overall Performance Score</p>
            <p className="text-4xl sm:text-5xl font-bold mt-2">{overallScore}%</p>
            <p className="text-white/60 text-sm mt-1">Based on {totalInterviews} interviews</p>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {radarData.slice(0, 3).map((item) => (
              <div key={item.skill} className="text-center">
                <div className="text-xl sm:text-2xl font-bold">{item.score}%</div>
                <div className="text-xs text-white/60">{item.skill}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Skills Overview</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
            {/* Shrink radius on mobile so axis labels don't clip the container edge */}
            <RadarChart data={radarData} outerRadius={isMobile ? 70 : 90}>
              <PolarGrid stroke="var(--border-color)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-tertiary)', fontSize: isMobile ? 10 : 11 }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar dataKey="score" stroke="#4A4DC9" fill="#4A4DC9" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Category Scores</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="category" interval={isMobile ? 'preserveStartEnd' : 0} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis width={isMobile ? 28 : 40} domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? '#533086' : '#4A4DC9'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={isMobile ? 45 : 60} outerRadius={isMobile ? 75 : 100} paddingAngle={5} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2">
            {pieData.map((item) => (
              <span key={item.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Progress Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 240 : 280}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="week" interval={isMobile ? 'preserveStartEnd' : 0} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <YAxis width={isMobile ? 28 : 40} domain={[50, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#FC9145" strokeWidth={3} dot={{ fill: '#FC9145', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Scores */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Detailed Skill Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {radarData.map((item) => (
            <div key={item.skill} className="text-center p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" strokeWidth="6" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={getScoreColor(item.score)} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${item.score * 2.64} ${264 - item.score * 2.64}`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  {item.score}
                </span>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>{item.skill}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  );
}

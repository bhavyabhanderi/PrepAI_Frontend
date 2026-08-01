import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiSearchLine, RiCalendarLine,
  RiUserVoiceLine, RiCodeSSlashLine, RiMicLine,
  RiBrainLine, RiArrowRightLine, RiHistoryLine, RiBook2Line,
  RiNodeTree, RiDatabase2Line, RiBugLine, RiCodeBoxLine,
  RiFilter3Line, RiMore2Fill
} from 'react-icons/ri';
import { formatDate, getScoreColor, getScoreLabel, extractScore } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { interviewService, codingService, syllabusService, resumeService, analyticsService } from '../services/api';

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

const STATUS_COLORS = {
  completed:   'bg-success/10 text-success',
  in_progress: 'bg-warning/10 text-warning',
  scheduled:   'bg-primary-500/10 text-primary-500',
  cancelled:   'bg-error/10 text-error',
};

/**
 * Interview History Page
 */
const filters = ['all', 'hr', 'technical', 'aptitude', 'coding', 'syllabus', 'resume', 'learning_plan', 'system_design', 'sql_practice', 'debugging', 'playground'];

export default function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [intRes, codRes, sylRes, resRes, lpRes] = await Promise.all([
          interviewService.getHistory().catch(() => ({ data: [] })),
          codingService.getHistory().catch(() => ({ data: [] })),
          syllabusService.list().catch(() => ({ data: [] })),
          resumeService.getHistory().catch(() => ({ data: [] })),
          analyticsService.getLearningPlanHistory().catch(() => ({ data: [] }))
        ]);
        
        const interviews = (intRes.data || []).map(i => ({...i, score: extractScore(i, ['score', 'overall_score', 'report.overall_score', 'report.score', 'aptitude_score', 'test_score', 'results.score', 'result.score']) }));
        const codings = (codRes.data || []).map(c => ({
          id: c.id || c._id,
          type: 'coding',
          status: 'completed',
          created_at: c.created_at,
          job_role: c.problem_title || 'Coding Challenge',
          score: extractScore(c, ['score', 'code_quality_score', 'review.score', 'review.code_quality_score', 'results.score'])
        }));
        const syllabi = (sylRes.data || []).map(s => ({
          id: s.id || s._id,
          type: 'syllabus',
          status: 'completed',
          created_at: s.created_at,
          subject: s.subject,
          file_name: s.file_name,
          score: extractScore(s, ['score'])
        }));
        const resumes = (resRes.data || []).map(r => ({
          id: r.id || r._id,
          type: 'resume',
          status: 'completed',
          created_at: r.created_at,
          subject: 'Resume Analysis',
          file_name: r.file_name || 'Resume',
          score: extractScore(r, ['score', 'ats_score', 'atsScore'])
        }));
        const learningPlans = (lpRes.data || []).map(lp => ({
          id: lp.id || lp._id,
          type: 'learning_plan',
          status: 'completed',
          created_at: lp.created_at,
          subject: 'Learning Plan',
          score: extractScore(lp, ['score'])
        }));

        const combined = [...interviews, ...codings, ...syllabi, ...resumes, ...learningPlans].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setHistory(combined);
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);


  const filtered = history.filter((item) => {
    const meta = getTypeMeta(item.type);
    const matchesSearch = meta.label.toLowerCase().includes(search.toLowerCase())
      || (item.job_role || '').toLowerCase().includes(search.toLowerCase())
      || (item.subject || '').toLowerCase().includes(search.toLowerCase())
      || (item.file_name || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>History</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Review your previous interviews and syllabus analyses.</p>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full sm:max-w-sm">
          <RiSearchLine
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <label htmlFor="history-search" className="sr-only">Search history</label>
          <input
            id="history-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by activity, role, subject or file..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm border transition-all outline-none focus:border-primary-500"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button type="button" key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all whitespace-nowrap capitalize ${
                filter === f ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'hover:bg-primary-500/5'
              }`}
              style={filter !== f ? { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : undefined}>
              {f === 'all' ? 'All' : getTypeMeta(f).label}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {loading && (
          <div className="p-12 text-center rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading your interviews...</p>
          </div>
        )}

        {!loading && error && (
          <div className="p-12 text-center rounded-2xl border border-error/30" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="p-12 text-center rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <RiHistoryLine size={40} className="mx-auto mb-3" style={{ color: 'var(--text-tertiary)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No history found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {history.length === 0 ? "You haven't started any interviews or analyses yet. Go ahead and take one!" : "No history matches your current filters."}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-5 gap-4 px-4 pb-1 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <div>Activity</div>
              <div>Date</div>
              <div>Subject / Role</div>
              <div>Details</div>
              <div>Score</div>
            </div>

            {/* Cards List */}
            {filtered.map((item, i) => {
              const meta = getTypeMeta(item.type);
              const Icon = meta.icon;

              return (
                <motion.div key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 sm:p-4 rounded-2xl border card-hover grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 items-center"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  {/* Activity */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                      <Icon size={20} />
                    </div>
                    <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{meta.label}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    <RiCalendarLine size={14} /> 
                    <span className="truncate">{item.created_at ? formatDate(item.created_at) : '—'}</span>
                  </div>

                  {/* Subject / Role */}
                  <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {item.job_role || item.subject || '—'}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-2 min-w-0">
                    {item.difficulty_level && (
                      <span className="capitalize text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {item.difficulty_level}
                      </span>
                    )}
                    {item.file_name && (
                      <span className="truncate text-xs bg-primary-500/10 px-2 py-1 rounded-md" style={{ color: 'var(--text-secondary)' }}>
                        {item.file_name}
                      </span>
                    )}
                    {!item.difficulty_level && !item.file_name && <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>—</span>}
                  </div>

                  {/* Score */}
                  <div className="text-sm font-bold" style={{ color: item.score != null ? getScoreColor(item.score) : 'var(--text-tertiary)' }}>
                    {item.score != null ? `${Math.round(Number(item.score))}%` : 'N/A'}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiSearchLine, RiCalendarLine,
  RiUserVoiceLine, RiCodeSSlashLine, RiMicLine,
  RiBrainLine, RiArrowRightLine, RiHistoryLine,
} from 'react-icons/ri';
import { formatDate, getScoreColor, getScoreLabel } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { interviewService } from '../services/api';

const TYPE_META = {
  hr:         { label: 'HR Interview',          icon: RiUserVoiceLine,  color: '#533086' },
  technical:  { label: 'Technical Interview',   icon: RiCodeSSlashLine, color: '#4A4DC9' },
  behavioral: { label: 'Behavioral Interview',  icon: RiUserVoiceLine,  color: '#533086' },
  aptitude:   { label: 'Aptitude Test',         icon: RiBrainLine,      color: '#FC9145' },
  coding:     { label: 'Coding Challenge',      icon: RiCodeSSlashLine, color: '#4A4DC9' },
  company_specific: { label: 'Company Interview', icon: RiUserVoiceLine, color: '#533086' },
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
export default function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await interviewService.getHistory();
        setHistory(res.data || []);
      } catch (err) {
        setError('Failed to load interview history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filters = ['all', 'hr', 'technical', 'aptitude', 'behavioral', 'coding'];

  const filtered = history.filter((item) => {
    const meta = getTypeMeta(item.type);
    const matchesSearch = meta.label.toLowerCase().includes(search.toLowerCase())
      || (item.job_role || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Interview History</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Review your previous interviews and track your progress.</p>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border"
          style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
          <RiSearchLine style={{ color: 'var(--text-tertiary)' }} />
          <input type="text" placeholder="Search interviews..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none" style={{ color: 'var(--text-primary)' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
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
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No interviews found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {history.length === 0 ? "You haven't started any interviews yet. Go ahead and take one!" : "No interviews match your current filters."}
            </p>
          </div>
        )}

        {!loading && filtered.map((item, i) => {
          const meta = getTypeMeta(item.type);
          const Icon = meta.icon;
          const statusClass = STATUS_COLORS[item.status] || 'bg-primary-500/10 text-primary-500';

          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl border flex items-center gap-3 sm:gap-4 card-hover"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{meta.label}</p>
                <div className="flex items-center gap-x-3 gap-y-1 flex-wrap mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="flex items-center gap-1">
                    <RiCalendarLine size={12} /> {item.created_at ? formatDate(item.created_at) : '—'}
                  </span>
                  {item.job_role && <span className="truncate max-w-[120px]">{item.job_role}</span>}
                  {item.difficulty_level && <span className="capitalize">{item.difficulty_level}</span>}
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

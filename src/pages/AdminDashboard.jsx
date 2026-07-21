import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RiDashboardLine, RiUser3Line, RiQuestionLine,
  RiBarChartBoxLine, RiChatSmile2Line, RiSearchLine,
  RiArrowUpLine, RiArrowDownLine, RiMoreLine,
  RiDeleteBinLine, RiEyeLine, RiPencilLine,
} from 'react-icons/ri';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts';
import { formatDate, getScoreColor } from '../utils/helpers';
import { adminService } from '../services/api';

const monthlyData = [
  { month: 'Jan', users: 180, interviews: 1200 },
  { month: 'Feb', users: 220, interviews: 1500 },
  { month: 'Mar', users: 310, interviews: 2100 },
  { month: 'Apr', users: 380, interviews: 2800 },
  { month: 'May', users: 450, interviews: 3500 },
  { month: 'Jun', users: 520, interviews: 4200 },
];

const mockUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', interviews: 24, score: 85, joined: '2026-01-15', status: 'active' },
  { id: 2, name: 'Rahul Patel', email: 'rahul@email.com', interviews: 18, score: 78, joined: '2026-02-20', status: 'active' },
  { id: 3, name: 'Anjali Verma', email: 'anjali@email.com', interviews: 32, score: 92, joined: '2026-01-10', status: 'active' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@email.com', interviews: 12, score: 65, joined: '2026-03-05', status: 'inactive' },
  { id: 5, name: 'Neha Gupta', email: 'neha@email.com', interviews: 28, score: 88, joined: '2026-02-01', status: 'active' },
];

/**
 * Admin Dashboard Page
 */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminService.getDashboardStats();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        // Ignored
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-120px)] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          Loading admin details...
        </p>
      </div>
    );
  }

  const adminStats = [
    { label: 'Total Users', value: stats ? stats.total_users.toString() : '2,450', change: '+12%', up: true, icon: RiUser3Line, color: '#533086' },
    { label: 'Total Interviews', value: stats ? stats.total_interviews.toString() : '15,820', change: '+8%', up: true, icon: RiDashboardLine, color: '#4A4DC9' },
    { label: 'Coding Submissions', value: stats ? stats.total_coding_submissions.toString() : '1,200', change: '+5%', up: true, icon: RiQuestionLine, color: '#FC9145' },
    { label: 'Avg. Score', value: stats ? `${Math.round(stats.average_interview_score)}%` : '76%', change: '+3%', up: true, icon: RiBarChartBoxLine, color: '#22C55E' },
  ];


  const tabs = ['overview', 'users', 'interviews', 'questions', 'feedback'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Manage users, interviews, and platform analytics.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent'
            }`}
            style={activeTab !== tab ? { color: 'var(--text-tertiary)' } : undefined}>
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${stat.up ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                {stat.up ? <RiArrowUpLine size={12} /> : <RiArrowDownLine size={12} />} {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Growth Analytics</h3>
            <div className="h-64 sm:h-72 lg:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#533086" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#533086" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke="#533086" fill="url(#usersGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Interviews Per Month</h3>
            <div className="h-64 sm:h-72 lg:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="interviews" radius={[6, 6, 0, 0]}>
                  {monthlyData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#4A4DC9' : '#FC9145'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {(activeTab === 'overview' || activeTab === 'users') && (
        <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeTab === 'users' ? 'All Users' : 'Recent Users'}
            </h3>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border w-full sm:w-auto" style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)' }}>
              <RiSearchLine size={14} style={{ color: 'var(--text-tertiary)' }} />
              <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none w-full sm:w-40" style={{ color: 'var(--text-primary)' }} />
            </div>
          </div>

          {/* Mobile: stacked cards (table has 7 columns, too wide for a phone) */}
          <div className="md:hidden space-y-3">
            {mockUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
              <div key={user.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{user.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    user.status === 'active' ? 'bg-success/10 text-success' : 'bg-neutral-400/10 text-neutral-500'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Interviews</span>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.interviews}</p>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-tertiary)' }}>Avg Score</span>
                    <p className="font-semibold" style={{ color: getScoreColor(user.score) }}>{user.score}%</p>
                  </div>
                  <div className="min-w-0">
                    <span style={{ color: 'var(--text-tertiary)' }}>Joined</span>
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{formatDate(user.joined)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  <button className="tap-target p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                    <RiEyeLine size={16} />
                  </button>
                  <button className="tap-target p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                    <RiPencilLine size={16} />
                  </button>
                  <button className="tap-target p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors">
                    <RiDeleteBinLine size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="scroll-x hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  {['Name', 'Email', 'Interviews', 'Avg Score', 'Joined', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-medium text-xs uppercase" style={{ color: 'var(--text-tertiary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockUsers.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
                  <tr key={user.id} className="border-b hover:bg-primary-500/3 transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-tertiary)' }}>{user.email}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-primary)' }}>{user.interviews}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold" style={{ color: getScoreColor(user.score) }}>{user.score}%</span>
                    </td>
                    <td className="py-3 px-4" style={{ color: 'var(--text-tertiary)' }}>{formatDate(user.joined)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-success/10 text-success' : 'bg-neutral-400/10 text-neutral-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                          <RiEyeLine size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                          <RiPencilLine size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-error/10 text-error transition-colors">
                          <RiDeleteBinLine size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

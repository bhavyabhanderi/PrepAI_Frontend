/**
 * Route path constants
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  RESUME_ANALYZER: '/resume-analyzer',
  SYLLABUS_ANALYZER: '/syllabus-analyzer',
  HR_INTERVIEW: '/hr-interview',
  TECHNICAL_INTERVIEW: '/technical-interview',
  CODING_INTERVIEW: '/coding-interview',
  VOICE_INTERVIEW: '/voice-interview',
  APTITUDE_INTERVIEW: '/aptitude-interview',
  PERFORMANCE_REPORT: '/performance-report',
  LEARNING_PLAN: '/learning-plan',
  INTERVIEW_HISTORY: '/interview-history',
  PROFILE: '/profile',
  ADMIN: '/admin',
  SETTINGS: '/settings',
  ABOUT: '/about',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  TOPIC_DETAILS: '/topic-details',
  JOB_PORTAL: '/jobs',
  CHALLENGES: '/challenges',
  LEADERBOARD: '/leaderboard',
  PLAYGROUND: '/playground',
  SYSTEM_DESIGN: '/system-design',
  SQL_PRACTICE: '/sql-practice',
  DEBUGGING: '/debugging',
  NOT_FOUND: '*',
};

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'RiDashboardLine' },
  { label: 'Resume Analyzer', path: ROUTES.RESUME_ANALYZER, icon: 'RiFileTextLine' },
  { label: 'Syllabus Analyzer', path: ROUTES.SYLLABUS_ANALYZER, icon: 'RiBook2Line' },
  { 
    label: 'Interviews', 
    icon: 'RiUserVoiceLine',
    subItems: [
       { label: 'Aptitude Test', path: ROUTES.APTITUDE_INTERVIEW, icon: 'RiBrainLine' },
       { label: 'HR Interview', path: ROUTES.HR_INTERVIEW, icon: 'RiUserVoiceLine' },
       { label: 'Technical Interview', path: ROUTES.TECHNICAL_INTERVIEW, icon: 'RiCodeSSlashLine' },
       { label: 'Coding Interview', path: ROUTES.CODING_INTERVIEW, icon: 'RiTerminalBoxLine' },
       { label: 'Voice Interview', path: ROUTES.VOICE_INTERVIEW, icon: 'RiMicLine' },

    ]
  },
  { label: 'System Design', path: ROUTES.SYSTEM_DESIGN, icon: 'RiNodeTree' },
  { label: 'SQL Practice', path: ROUTES.SQL_PRACTICE, icon: 'RiDatabase2Line' },
  { label: 'Debugging', path: ROUTES.DEBUGGING, icon: 'RiBugLine' },
  { label: 'Playground', path: ROUTES.PLAYGROUND, icon: 'RiCodeBoxLine' },
  { label: 'Performance', path: ROUTES.PERFORMANCE_REPORT, icon: 'RiBarChartBoxLine' },
  { label: 'Learning Plan', path: ROUTES.LEARNING_PLAN, icon: 'RiBookOpenLine' },
  { label: 'History', path: ROUTES.INTERVIEW_HISTORY, icon: 'RiHistoryLine' },
];

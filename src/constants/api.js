/**
 * API endpoint constants
 */
export const API_BASE_URL = import.meta.env.PROD ? '/api/v1' : (import.meta.env.VITE_API_URL || '/api/v1');

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  // Profile
  PROFILE: {
    ME: '/profile/me',
  },
  // Resume
  RESUME: {
    UPLOAD: '/resume/upload',
    ANALYSIS: '/resume/analysis',
  },
  // Interview
  INTERVIEW: {
    CREATE: '/interview/',
    NEXT: (interviewId) => `/interview/${interviewId}/next`,
    ANSWER: (interviewId) => `/interview/${interviewId}/answer`,
    HISTORY: '/interview/history',
    APTITUDE_QUESTIONS: (interviewId) => `/interview/${interviewId}/aptitude`,
    APTITUDE_SUBMIT: (interviewId) => `/interview/${interviewId}/aptitude/submit`,
  },
  // Voice
  VOICE: {
    STT: '/voice/stt',
    TTS: '/voice/tts',
    FIRST_QUESTION: '/voice/first-question',
    CHAT: '/voice/chat',
  },
  // Coding
  CODING: {
    EXECUTE: '/coding/execute',
    PROBLEMS: '/coding/problems',
    HISTORY: '/coding/history',
    SQL_PROBLEMS: '/coding/sql-problems',
    DEBUGGING_PROBLEMS: '/coding/debugging-problems',
  },
  // Analytics
  ANALYTICS: {
    REPORT: (interviewId) => `/analytics/report/${interviewId}`,
    LEARNING_PLAN: (reportId) => `/analytics/learning-plan/${reportId}`,
    GET_LATEST_LEARNING_PLAN: '/analytics/learning-plan',
    LEARNING_PLAN_RESUME: '/analytics/learning-plan/resume',
    LEARNING_PLAN_RESUME_WITH_SCORE: '/analytics/learning-plan/resume-with-score',
    SKILLS_TEST: '/analytics/skills-test',
    LEARNING_PLAN_TASK: (planId) => `/analytics/learning-plan/${planId}/task`,
    DASHBOARD: '/analytics/dashboard',
    KPIS: '/analytics/performance-kpis',
  },
  // Admin
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
  // Syllabus
  SYLLABUS: {
    UPLOAD: '/syllabus/upload',
    LIST: '/syllabus/',
    CHAT: '/syllabus/chat',
    DELETE: (id) => `/syllabus/${id}`,
  },
};

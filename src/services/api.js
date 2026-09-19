import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/api';

export const authService = {
  login: (credentials) => {
    const params = new URLSearchParams();
    params.append('username', credentials.email);
    params.append('password', credentials.password);
    return axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (data) => axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data),
  loginWithGoogle: (token) => axiosInstance.post('/auth/google', { token }),
  logout: () => {
    // If backend has no logout endpoint, we do clean up in Redux
    return Promise.resolve();
  },
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPasswordDirect: (email, new_password) => axiosInstance.post('/auth/reset-password-direct', { email, new_password }),
  resetPassword: (data) => Promise.resolve(),
  getProfile: () => axiosInstance.get(API_ENDPOINTS.AUTH.ME),
};

export const profileService = {
  getProfile: () => axiosInstance.get(API_ENDPOINTS.PROFILE.ME),
  updateProfile: (data) => axiosInstance.put(API_ENDPOINTS.PROFILE.ME, data),
};

export const resumeService = {
  upload: (formData) =>
    axiosInstance.post(API_ENDPOINTS.RESUME.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getLatestAnalysis: () => axiosInstance.get(API_ENDPOINTS.RESUME.ANALYSIS),
  getHistory: () => axiosInstance.get('/resume/history'),
};

export const interviewService = {
  create: (data) => axiosInstance.post(API_ENDPOINTS.INTERVIEW.CREATE, data),
  getNextQuestion: (interviewId) => axiosInstance.get(API_ENDPOINTS.INTERVIEW.NEXT(interviewId)),
  submitAnswer: (interviewId, data) => axiosInstance.post(API_ENDPOINTS.INTERVIEW.ANSWER(interviewId), data),
  getAptitudeQuestions: (interviewId) => axiosInstance.get(API_ENDPOINTS.INTERVIEW.APTITUDE_QUESTIONS(interviewId)),
  submitAptitudeTest: (interviewId, data) => axiosInstance.post(API_ENDPOINTS.INTERVIEW.APTITUDE_SUBMIT(interviewId), data),
  getHistory: () => axiosInstance.get(API_ENDPOINTS.INTERVIEW.HISTORY),
};

export const voiceService = {
  stt: (formData) =>
    axiosInstance.post(API_ENDPOINTS.VOICE.STT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  tts: (text) => axiosInstance.post(API_ENDPOINTS.VOICE.TTS, { text }, { responseType: 'blob' }),
  firstQuestion: (data) => axiosInstance.post(API_ENDPOINTS.VOICE.FIRST_QUESTION, data),
  chat: (data) => axiosInstance.post(API_ENDPOINTS.VOICE.CHAT, data),
};

export const codingService = {
  execute: (data) => axiosInstance.post(API_ENDPOINTS.CODING.EXECUTE, data),
  getProblems: (difficulty) => axiosInstance.get(`${API_ENDPOINTS.CODING.PROBLEMS}${difficulty && difficulty !== 'all' ? `?difficulty=${difficulty}` : ''}`),
  getHistory: () => axiosInstance.get(API_ENDPOINTS.CODING.HISTORY),
  getSqlProblems: (difficulty) => axiosInstance.get(`${API_ENDPOINTS.CODING.SQL_PROBLEMS}?difficulty=${difficulty}`),
  getDebuggingProblems: (difficulty) => axiosInstance.get(`${API_ENDPOINTS.CODING.DEBUGGING_PROBLEMS}?difficulty=${difficulty}`),
};

export const analyticsService = {
  generateReport: (interviewId) => axiosInstance.post(API_ENDPOINTS.ANALYTICS.REPORT(interviewId)),
  generateLearningPlan: (reportId) => axiosInstance.post(API_ENDPOINTS.ANALYTICS.LEARNING_PLAN(reportId)),
  getLatestLearningPlan: () => axiosInstance.get(API_ENDPOINTS.ANALYTICS.GET_LATEST_LEARNING_PLAN),
  getLearningPlanHistory: () => axiosInstance.get('/analytics/learning-plan/history'),
  generateLearningPlanFromResume: (formData) => axiosInstance.post(API_ENDPOINTS.ANALYTICS.LEARNING_PLAN_RESUME, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  generateSkillsTest: (formData) => axiosInstance.post(API_ENDPOINTS.ANALYTICS.SKILLS_TEST, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  generateLearningPlanWithScore: (formData) => axiosInstance.post(API_ENDPOINTS.ANALYTICS.LEARNING_PLAN_RESUME_WITH_SCORE, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateLearningPlanTask: (planId, data) => axiosInstance.put(API_ENDPOINTS.ANALYTICS.LEARNING_PLAN_TASK(planId), data),
  getDashboardData: () => axiosInstance.get(API_ENDPOINTS.ANALYTICS.DASHBOARD),
  getPerformanceKPIs: () => axiosInstance.get(API_ENDPOINTS.ANALYTICS.KPIS),
};

export const adminService = {
  getDashboardStats: () => axiosInstance.get(API_ENDPOINTS.ADMIN.DASHBOARD),
};

export const syllabusService = {
  upload: (formData) =>
    axiosInstance.post(API_ENDPOINTS.SYLLABUS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: () => axiosInstance.get(API_ENDPOINTS.SYLLABUS.LIST),
  chat: (data) => axiosInstance.post(API_ENDPOINTS.SYLLABUS.CHAT, data),
  delete: (id) => axiosInstance.delete(API_ENDPOINTS.SYLLABUS.DELETE(id)),
};

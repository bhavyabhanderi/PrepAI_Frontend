import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ScrollToTop from './components/common/ScrollToTop';
import { useIsMobile } from './hooks';
import { ROUTES } from './constants/routes';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy-loaded Pages (code splitting)
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ResumeAnalyzer = lazy(() => import('./pages/ResumeAnalyzer'));
const SyllabusAnalyzer = lazy(() => import('./pages/SyllabusAnalyzer'));
const HRInterview = lazy(() => import('./pages/HRInterview'));

const TechnicalInterview = lazy(() => import('./pages/TechnicalInterview'));
const CodingInterview = lazy(() => import('./pages/CodingInterview'));
const VoiceInterview = lazy(() => import('./pages/VoiceInterview'));
const AptitudeInterview = lazy(() => import('./pages/AptitudeInterview'));
const PerformanceReport = lazy(() => import('./pages/PerformanceReport'));
const LearningPlan = lazy(() => import('./pages/LearningPlan'));
const InterviewHistory = lazy(() => import('./pages/InterviewHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Loading Fallback
function PageLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loading...</p>
      </div>
    </div>
  );
}

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

/**
 * Toasts sit top-right on desktop, but that corner is occupied by the navbar's
 * notification and profile buttons on a phone — center them there instead.
 */
function AppToaster() {
  const isMobile = useIsMobile();

  return (
    <Toaster
      position={isMobile ? 'top-center' : 'top-right'}
      containerStyle={{ top: isMobile ? 12 : 80, left: 12, right: 12 }}
      toastOptions={{
        duration: 3000,
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          fontSize: '14px',
          maxWidth: 'calc(100vw - 2rem)',
        },
      }}
    />
  );
}

/**
 * App Component - Root of the application
 */
export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <ScrollToTop />
              <AppToaster />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path={ROUTES.HOME} element={<LandingPage />} />
                  <Route path={ROUTES.ABOUT} element={<AboutUs />} />
                  <Route path={ROUTES.PRIVACY} element={<PrivacyPolicy />} />
                  <Route path={ROUTES.TERMS} element={<TermsOfService />} />

                  {/* Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                  </Route>

                  {/* Protected Routes */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                    <Route path={ROUTES.RESUME_ANALYZER} element={<ResumeAnalyzer />} />
                    <Route path={ROUTES.SYLLABUS_ANALYZER} element={<SyllabusAnalyzer />} />
                    <Route path={ROUTES.HR_INTERVIEW} element={<HRInterview />} />
                    <Route path={ROUTES.TECHNICAL_INTERVIEW} element={<TechnicalInterview />} />
                    <Route path={ROUTES.CODING_INTERVIEW} element={<CodingInterview />} />
                    <Route path={ROUTES.VOICE_INTERVIEW} element={<VoiceInterview />} />
                    <Route path={ROUTES.APTITUDE_INTERVIEW} element={<AptitudeInterview />} />
                    <Route path={ROUTES.PERFORMANCE_REPORT} element={<PerformanceReport />} />
                    <Route path={ROUTES.LEARNING_PLAN} element={<LearningPlan />} />
                    <Route path={ROUTES.INTERVIEW_HISTORY} element={<InterviewHistory />} />
                    <Route path={ROUTES.PROFILE} element={<Profile />} />
                    <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

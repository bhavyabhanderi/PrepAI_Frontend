import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useCopyGuard } from '../hooks';

/**
 * MainLayout - Authenticated layout with sidebar + navbar + content area
 */
export default function MainLayout() {
  const { sidebarCollapsed } = useSelector((state) => state.ui);
  const interviewActive = useSelector((state) => state.interview.isActive);

  useCopyGuard(interviewActive);

  return (
    <div className="min-h-[100dvh] flex" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content. `min-w-0` lets wide children (tables, editors, charts)
          scroll inside themselves instead of widening the whole page. */}
      <div
        className={`
          flex-1 min-w-0 flex flex-col min-h-[100dvh] transition-[margin] duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'}
        `}
      >
        <Navbar />
        <main className="flex-1 min-w-0 w-full p-4 sm:p-5 lg:p-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

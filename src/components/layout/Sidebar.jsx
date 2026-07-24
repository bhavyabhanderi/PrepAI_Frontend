import { useCallback, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { toggleSidebarCollapse, setSidebarOpen } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { NAV_ITEMS, ROUTES } from '../../constants/routes';
import { useIsDesktop } from '../../hooks';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  RiDashboardLine, RiFileTextLine, RiUserVoiceLine,
  RiCodeSSlashLine, RiTerminalBoxLine, RiMicLine,
  RiBarChartBoxLine, RiBookOpenLine, RiHistoryLine,
  RiUser3Line, RiLogoutBoxRLine, RiMenuFoldLine,
  RiSunLine, RiCloseLine, RiShieldUserLine, RiBrainLine, RiBook2Line,
} from 'react-icons/ri';

const iconMap = {
  RiDashboardLine: RiDashboardLine,
  RiFileTextLine: RiFileTextLine,
  RiUserVoiceLine: RiUserVoiceLine,
  RiCodeSSlashLine: RiCodeSSlashLine,
  RiTerminalBoxLine: RiTerminalBoxLine,
  RiMicLine: RiMicLine,
  RiBarChartBoxLine: RiBarChartBoxLine,
  RiBookOpenLine: RiBookOpenLine,
  RiHistoryLine: RiHistoryLine,
  RiBrainLine: RiBrainLine,
  RiBook2Line: RiBook2Line,
};

/**
 * Sidebar Component - Collapsible navigation with glassmorphism
 */
export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  const { isActive: isInterviewActive } = useSelector((state) => state.interview);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const isDesktop = useIsDesktop();

  // Below `lg` the sidebar is an overlay drawer: it is always full-width there,
  // so the icon-only collapsed treatment must not leak into the drawer.
  const collapsed = isDesktop && sidebarCollapsed;
  const drawerOpen = !isDesktop && sidebarOpen;

  const closeDrawer = useCallback(() => dispatch(setSidebarOpen(false)), [dispatch]);

  // Close the drawer on navigation so the overlay never survives a route change.
  useEffect(() => {
    if (!isDesktop) closeDrawer();
  }, [location.pathname, isDesktop, closeDrawer]);

  // Lock body scroll and wire Escape while the drawer covers the page.
  useEffect(() => {
    if (!drawerOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => e.key === 'Escape' && closeDrawer();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your session.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4A4DC9',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
      }
    });
  };

  const handleNavClick = (e) => {
    if (isInterviewActive) {
      e.preventDefault();
      toast.error("Please end or cancel the current interview process first!");
      return;
    }
    if (!isDesktop) closeDrawer();
  };

  return (
    <>
      {/* Drawer scrim */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeDrawer}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        aria-label="Main navigation"
        aria-hidden={!isDesktop && !sidebarOpen}
        className={`
          fixed top-0 left-0 h-[100dvh] z-50
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          max-w-[85vw]
          transition-transform transition-[width] duration-300 ease-in-out
          flex flex-col
          border-r
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <img src="/PrepAI.png" alt="PrepAI Logo" className="w-12 h-12 object-contain" />
              <span className="font-bold text-lg gradient-text">PrepAI</span>
            </motion.div>
          )}

          {collapsed && (
            <img src="/PrepAI.png" alt="PrepAI Logo" className="w-12 h-12 object-contain mx-auto" />
          )}

          {/* Close button — drawer only */}
          {!isDesktop && (
            <button
              onClick={closeDrawer}
              aria-label="Close navigation menu"
              className="p-2 -mr-1 rounded-lg hover:bg-primary-500/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RiCloseLine size={20} />
            </button>
          )}

          {/* Collapse toggle on desktop */}
          {isDesktop && !collapsed && (
            <button
              onClick={() => dispatch(toggleSidebarCollapse())}
              aria-label="Collapse sidebar"
              className="p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RiMenuFoldLine size={18} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isDesktop && collapsed && (
          <div className="flex justify-center py-3 shrink-0">
            <button
              onClick={() => dispatch(toggleSidebarCollapse())}
              aria-label="Expand sidebar"
              className="p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RiMenuUnfoldLine size={18} />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200 relative
                    ${isActive
                      ? 'text-white'
                      : 'hover:bg-primary-500/8'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  style={!isActive ? { color: 'var(--text-secondary)' } : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl gradient-bg"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                  {!collapsed && (
                    <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </span>
                  )}
                  {collapsed && (
                    <div className="
                      absolute left-full ml-2 px-2.5 py-1 rounded-md
                      text-xs font-medium whitespace-nowrap
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 z-50
                      bg-neutral-900 text-white shadow-lg
                    ">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Admin Link */}
          {user?.role === 'admin' && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <NavLink
                to={ROUTES.ADMIN}
                onClick={handleNavClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200
                  ${location.pathname === ROUTES.ADMIN ? 'gradient-bg text-white' : 'hover:bg-primary-500/8'}
                  ${collapsed ? 'justify-center' : ''}
                `}
                style={location.pathname !== ROUTES.ADMIN ? { color: 'var(--text-secondary)' } : undefined}
              >
                <RiShieldUserLine size={20} />
                {!collapsed && <span className="text-sm font-medium">Admin Panel</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] space-y-1 shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          {/* Logout */}
          <button
            onClick={(e) => {
              if (isInterviewActive) {
                e.preventDefault();
                toast.error("Please end or cancel the current interview process first!");
                return;
              }
              handleLogout();
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              transition-all duration-200 hover:bg-error/10 text-error
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <RiLogoutBoxRLine size={20} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>

          {/* User Profile Mini */}
          {!collapsed && user && (
            <div className="mt-2 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {user.email || 'user@email.com'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

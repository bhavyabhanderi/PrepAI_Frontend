import { useCallback, useEffect, useState, useEffectEvent } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
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
  RiGlobalLine, RiFireLine, RiTrophyLine, RiBriefcaseLine,
  RiCodeBoxLine, RiDatabase2Line, RiBugLine, RiNodeTree, RiMenuUnfoldLine,
  RiArrowDownSLine,
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
  RiFireLine: RiFireLine,
  RiTrophyLine: RiTrophyLine,
  RiBriefcaseLine: RiBriefcaseLine,
  RiCodeBoxLine: RiCodeBoxLine,
  RiDatabase2Line: RiDatabase2Line,
  RiBugLine: RiBugLine,
  RiNodeTree: RiNodeTree,
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
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  // Below `lg` the sidebar is an overlay drawer: it is always full-width there,
  // so the icon-only collapsed treatment must not leak into the drawer.
  const collapsed = isDesktop && sidebarCollapsed;
  const drawerOpen = !isDesktop && sidebarOpen;

  const closeDrawer = useCallback(() => dispatch(setSidebarOpen(false)), [dispatch]);

  // Keep track of which accordion menus are open
  const [expandedMenus, setExpandedMenus] = useState(() => {
    return NAV_ITEMS.reduce((acc, item) => {
      if (item.subItems && item.subItems.some(sub => location.pathname === sub.path)) {
        acc[item.label] = true;
      }
      return acc;
    }, {});
  });

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Auto-expand active menus and close others on navigation
  useEffect(() => {
    setExpandedMenus((prev) => {
      const next = { ...prev };
      NAV_ITEMS.forEach(item => {
        if (item.subItems) {
          const isActive = item.subItems.some(sub => location.pathname === sub.path);
          if (isActive) {
             next[item.label] = true;
          } else {
             next[item.label] = false;
          }
        }
      });
      return next;
    });
  }, [location.pathname]);

  // Close the drawer on navigation so the overlay never survives a route change.
  useEffect(() => {
    if (!isDesktop) closeDrawer();
  }, [location.pathname, isDesktop, closeDrawer]);

  const closeDrawerEvent = useEffectEvent(closeDrawer);

  // Lock body scroll and wire Escape while the drawer covers the page.
  useEffect(() => {
    if (!drawerOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => e.key === 'Escape' && closeDrawerEvent();
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

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
        navigate(ROUTES.HOME);
        setTimeout(() => {
          dispatch(logout());
        }, 50);
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
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(ROUTES.HOME)}
            >
              <img src="/PrepAI.png" alt="PrepAI Logo" className="w-12 h-12 object-contain" />
              <span className="font-bold text-lg gradient-text">PrepAI</span>
            </motion.div>
          )}

          {collapsed && (
            <img 
              src="/PrepAI.png" 
              alt="PrepAI Logo" 
              className="w-12 h-12 object-contain mx-auto cursor-pointer" 
              onClick={() => navigate(ROUTES.HOME)}
            />
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

              if (item.subItems) {
                const isExpanded = expandedMenus[item.label];
                const hasActiveChild = item.subItems.some(sub => location.pathname === sub.path);
                
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => {
                        if (collapsed) {
                           dispatch(toggleSidebarCollapse());
                           setExpandedMenus(prev => ({ ...prev, [item.label]: true }));
                        } else {
                           toggleMenu(item.label);
                        }
                      }}
                      className={`
                        w-full group flex items-center justify-between px-3 py-2.5 rounded-xl
                        transition-all duration-200 relative
                        ${hasActiveChild ? 'bg-primary-500/10 text-primary-500' : 'hover:bg-primary-500/8'}
                        ${collapsed ? 'justify-center' : ''}
                      `}
                      style={!hasActiveChild ? { color: 'var(--text-secondary)' } : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="flex-shrink-0" />
                        {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                      </div>
                      {!collapsed && (
                        <RiArrowDownSLine size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
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
                    </button>
                    
                    <AnimatePresence>
                      {!collapsed && isExpanded && (
                        <motion.div
                          initial={{ scaleY: 0, opacity: 0 }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          exit={{ scaleY: 0, opacity: 0 }}
                          className="overflow-hidden ml-4 pl-3 border-l space-y-1 mt-1"
                          style={{ transformOrigin: 'top', borderColor: 'var(--border-color)' }}
                        >
                          {item.subItems.map(subItem => {
                             const SubIcon = iconMap[subItem.icon];
                             const isSubActive = location.pathname === subItem.path;
                             return (
                               <NavLink
                                  key={subItem.path}
                                  to={subItem.path}
                                  onClick={handleNavClick}
                                  className={`
                                    group flex items-center gap-3 px-3 py-2 rounded-lg
                                    transition-all duration-200 relative
                                    ${isSubActive ? 'text-white' : 'hover:bg-primary-500/8'}
                                  `}
                                  style={!isSubActive ? { color: 'var(--text-secondary)' } : undefined}
                               >
                                 {isSubActive && (
                                   <motion.div
                                     layoutId="sidebar-sub-active"
                                     className="absolute inset-0 rounded-lg gradient-bg"
                                     style={{ zIndex: -1 }}
                                     transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                   />
                                 )}
                                 <SubIcon size={18} className={`flex-shrink-0 ${isSubActive ? 'text-white' : ''}`} />
                                 <span className={`text-sm font-medium truncate ${isSubActive ? 'text-white' : ''}`}>
                                   {subItem.label}
                                 </span>
                               </NavLink>
                             );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

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
          {/* User Profile Mini */}
          {!collapsed && user && (
            <Link 
              to={ROUTES.PROFILE}
              onClick={handleNavClick}
              className="mt-2 p-3 rounded-xl block transition-all duration-200 hover:opacity-80" 
              style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
              <div className="flex items-center gap-3">
                {user.profile_photo ? (
                  <img
                    src={user.profile_photo}
                    alt={user.name || 'User'}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                    {user.email || 'user@email.com'}
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>

      </motion.aside>
    </>
  );
}

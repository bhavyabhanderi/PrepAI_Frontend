import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiMenuLine, RiSearchLine, RiNotification3Line,
  RiUser3Line, RiLogoutBoxRLine,
  RiArrowDownSLine, RiCloseLine,
  RiMoonLine, RiSunLine,
} from 'react-icons/ri';
import { useTheme } from '../../context/ThemeContext';
import { setSidebarOpen } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { useClickOutside } from '../../hooks';
import { getGreeting, getInitials } from '../../utils/helpers';
import { ROUTES } from '../../constants/routes';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

/**
 * Navbar Component - Top navigation bar with search, notifications, and profile
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.ui);
  const { isActive: isInterviewActive } = useSelector((state) => state.interview);
  const { isDark, toggleTheme } = useTheme();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(profileRef, () => setShowProfile(false));
  useClickOutside(notifRef, () => setShowNotifications(false));

  const unreadCount = notifications.filter((n) => !n.read).length;



  return (
    <header
      className="h-16 flex items-center justify-between gap-2 px-3 sm:px-4 lg:px-6 border-b sticky top-0 z-30"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Drawer toggle — shown wherever the sidebar is not docked */}
        <button
          onClick={() => dispatch(setSidebarOpen(true))}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl hover:bg-primary-500/10 transition-colors lg:hidden"
          style={{ color: 'var(--text-secondary)' }}
        >
          <RiMenuLine size={22} />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.DASHBOARD)}>
          <img src="/PrepAI.png" alt="PrepAI Logo" className="w-12 h-12 object-contain" />
        </div>

        {/* Greeting */}
        <div className="hidden md:block min-w-0">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>
            {getGreeting()} 
          </h2>
          <h1 className="text-base lg:text-lg font-bold truncate" style={{ color: 'var(--text-primary)' }}>
            {user?.name || 'Welcome back'}
          </h1>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 mx-4 xl:mx-8"></div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-primary-500/10 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Toggle theme"
        >
          {isDark ? <RiSunLine size={20} /> : <RiMoonLine size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl hover:bg-primary-500/10 transition-colors relative"
            style={{ color: 'var(--text-secondary)' }}
          >
            <RiNotification3Line size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-[min(20rem,calc(100vw-1.5rem))] rounded-xl shadow-xl border overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500 text-white">{unreadCount} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <RiNotification3Line className="mx-auto mb-2 text-2xl" style={{ color: 'var(--text-tertiary)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 border-b hover:bg-primary-500/5 transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary-500/10 transition-colors"
          >
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {getInitials(user?.name || 'User')}
              </div>
            )}
            <span className="text-sm font-medium hidden xl:block max-w-[10rem] truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </span>
            <RiArrowDownSLine
              className={`hidden lg:block transition-transform duration-200 ${showProfile ? 'rotate-180' : ''}`}
              style={{ color: 'var(--text-tertiary)' }}
            />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-[min(14rem,calc(100vw-1.5rem))] rounded-xl shadow-xl border overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{user?.email || 'user@email.com'}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      if (isInterviewActive) {
                        toast.error("Please end or cancel the current interview process first!");
                        return;
                      }
                      navigate(ROUTES.PROFILE);
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-primary-500/8 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <RiUser3Line size={16} />
                    Profile
                  </button>

                </div>

                <div className="border-t py-1" style={{ borderColor: 'var(--border-color)' }}>
                  <button
                    onClick={() => {
                      if (isInterviewActive) {
                        toast.error("Please end or cancel the current interview process first!");
                        return;
                      }
                      setShowProfile(false);
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
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors"
                  >
                    <RiLogoutBoxRLine size={16} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

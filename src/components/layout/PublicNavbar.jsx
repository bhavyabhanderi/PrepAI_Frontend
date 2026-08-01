import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiSparklingFill, RiSunLine, RiMoonLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { ROUTES } from '../../constants/routes';

export default function PublicNavbar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const navLinks = ['Features', 'Benefits', 'Testimonials', 'FAQ'];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME + '#' + targetId);
      setMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass safe-x">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <img src="/PrepAI.png" alt="PrepAI Logo" className="w-16 h-16 scale-125 object-contain mt-1 ml-1" />
            <span className="font-bold text-2xl tracking-tight gradient-text ml-2">PrepAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item.toLowerCase())}
                className="text-sm font-medium hover:text-primary-500 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="tap-target p-2 rounded-lg hover:bg-primary-500/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {isDark ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
            </button>
            {/* Auth actions collapse into the mobile menu below md */}
            {isAuthenticated ? (
              <Link
                to={ROUTES.DASHBOARD}
                className="hidden md:inline-flex text-sm font-medium px-5 py-2.5 rounded-xl gradient-bg text-white hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary-500/10 transition-colors"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="hidden sm:inline-flex text-sm font-medium px-5 py-2.5 rounded-xl gradient-bg text-white hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="tap-target md:hidden p-2 rounded-lg hover:bg-primary-500/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t"
            style={{ transformOrigin: 'top', borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
          >
            <div className="px-4 py-4 flex flex-col gap-1 safe-bottom">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => handleNavClick(e, item.toLowerCase())}
                  className="tap-target flex items-center px-3 py-3 rounded-xl text-base font-medium hover:bg-primary-500/10 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item}
                </a>
              ))}
              <div className="h-px my-2" style={{ backgroundColor: 'var(--border-color)' }} />
              {isAuthenticated ? (
                <Link
                  to={ROUTES.DASHBOARD}
                  onClick={() => setMobileMenuOpen(false)}
                  className="tap-target flex items-center justify-center px-3 py-3 rounded-xl text-base font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={() => setMobileMenuOpen(false)}
                    className="tap-target flex items-center px-3 py-3 rounded-xl text-base font-medium hover:bg-primary-500/10 transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={() => setMobileMenuOpen(false)}
                    className="tap-target flex items-center justify-center px-3 py-3 rounded-xl text-base font-semibold gradient-bg text-white hover:opacity-90 transition-opacity"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

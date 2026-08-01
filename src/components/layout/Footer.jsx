import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RiSparklingFill, RiGithubLine, RiTwitterXLine, RiLinkedinLine, RiMailLine } from 'react-icons/ri';
import { ROUTES } from '../../constants/routes';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Benefits', href: '#benefits' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Testimonials', href: '#testimonials' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: ROUTES.ABOUT },
      { label: 'Privacy Policy', href: ROUTES.PRIVACY },
      { label: 'Terms of Service', href: ROUTES.TERMS },
    ],
  },
];

/**
 * Footer Component - Landing page footer with links and branding
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();



  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      
      if (location.pathname !== ROUTES.HOME) {
        navigate(ROUTES.HOME + href);
        return;
      }

      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '#') {
      e.preventDefault(); // Prevent jump to top for empty placeholders, or let them scroll to top
    }
  };

  return (
    <footer className="border-t safe-x" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/PrepAI.png" alt="PrepAI Logo" className="w-12 h-12 object-contain" />
              <span className="font-bold text-lg gradient-text">PrepAI</span>
            </Link>
            <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
              AI-powered interview preparation platform. Ace your next interview with confidence.
            </p>
            <div className="flex items-center gap-3">
              {[RiGithubLine, RiTwitterXLine, RiLinkedinLine, RiMailLine].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="tap-target w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary-500/10 transition-colors"
                  style={{ color: 'var(--text-tertiary)', border: '1px solid var(--border-color)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm hover:text-primary-500 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className="text-sm hover:text-primary-500 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left safe-bottom"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            © {currentYear} PrepAI. All rights reserved.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Built with ❤️ for interview preparation
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  RiSparklingFill, RiRobot2Line, RiFileTextLine,
  RiMicLine, RiCodeSSlashLine, RiBarChartBoxLine,
  RiShieldCheckLine, RiTimeLine, RiUserVoiceLine,
  RiArrowRightLine, RiStarFill, RiCheckLine,
  RiArrowDownSLine, RiSunLine, RiMoonLine,
  RiBrainLine, RiLightbulbLine, RiTeamLine,
  RiMenuLine, RiCloseLine, RiBook2Line,
  RiTerminalBoxLine, RiBookOpenLine
} from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../constants/routes';
import Footer from '../components/layout/Footer';
import PublicNavbar from '../components/layout/PublicNavbar';
import Snowfall from '../components/common/Snowfall';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

import ratingService from '../services/ratingService';

/**
 * Landing Page - Hero, Features, Benefits, Testimonials, FAQ, CTA
 */
export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ratingStats, setRatingStats] = useState({ average_rating: 0, total_ratings: 0 });
  const [testimonials, setTestimonials] = useState([]);
  const [visibleTestimonials, setVisibleTestimonials] = useState(3);

  useEffect(() => {
    async function fetchData() {
      try {
        const stats = await ratingService.getRatingStats();
        if (stats) setRatingStats(stats);

        const testimonialsData = await ratingService.getTestimonials();
        if (testimonialsData) setTestimonials(testimonialsData);
      } catch (err) {
        console.error('Failed to fetch rating data', err);
      }
    }
    fetchData();
  }, []);

  // Handle scrolling to hash on navigation (e.g. from footer of another page)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const timerId = setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [location]);

  const navLinks = ['Features', 'Benefits', testimonials.length > 0 ? 'Testimonials' : null, 'FAQ'].filter(Boolean);

  // Close the mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  // Scroll Spy for updating URL hash automatically
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'home') {
              window.history.replaceState(null, null, window.location.pathname);
            } else if (id) {
              window.history.replaceState(null, null, `#${id}`);
            }
          }
        });
      },
      { threshold: 0.5 } // trigger when 50% of the section is visible
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <PublicNavbar />

      {/* Global Snowfall Animation */}
      <Snowfall count={70} />

      {/* Hero Section */}
      <section id="home" className="pt-28 sm:pt-32 pb-16 sm:pb-20 relative overflow-hidden">
        {/* Background Effects — sized down on mobile so blur haloes stay subtle */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#533086' }} />
          <div className="absolute top-20 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full opacity-15 blur-3xl" style={{ background: '#4A4DC9' }} />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-10 blur-3xl" style={{ background: '#FC9145' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              <RiSparklingFill className="text-accent-500" />
              Powered by PrepAI
            </motion.div>

            <h1
              className="text-fluid-6xl text-balance font-bold leading-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Master Your Interviews{' '}
              <span className="gradient-text">with AI Precision</span>
            </h1>

            <p
              className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-10"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Practice HR, Technical, and Coding interviews with our AI-powered platform.
              Get real-time feedback, track your progress, and ace your dream job.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Link
                to={ROUTES.REGISTER}
                className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl gradient-bg text-white font-semibold text-lg hover:opacity-90 transition-all hover:shadow-glow-purple"
              >
                Start Practicing Free
                <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-lg border transition-all hover:bg-primary-500/5"
                style={{
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                }}
              >
                See How It Works
              </a>
            </div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-10 sm:gap-16 lg:gap-24 mt-12 sm:mt-16 max-w-3xl mx-auto"
            >
              {[
                { value: `${ratingStats.total_users || 0}+`, label: 'Active Users' },
                { value: `${ratingStats.total_interviews || 0}+`, label: 'Interviews Taken' },
                {
                  value: ratingStats.total_ratings > 0
                    ? `${ratingStats.average_rating}/5`
                    : '0/5',
                  label: 'User Rating'
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs lg:text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 lg:py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12 sm:mb-16">
            <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              Our AI-powered platform provides comprehensive tools to prepare for every aspect of your interview.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: RiFileTextLine, title: 'Resume Analyzer', desc: 'Get your ATS score, identify missing skills, and receive AI-powered suggestions.', color: '#FC9145', route: ROUTES.RESUME_ANALYZER },
              { icon: RiBook2Line, title: 'Syllabus Analyzer', desc: 'Upload your syllabus and get a structured breakdown with an AI tutor for every topic.', color: '#10B981', route: ROUTES.SYLLABUS_ANALYZER },
              { icon: RiBrainLine, title: 'Aptitude Test', desc: 'Evaluate your logical reasoning, quantitative, and verbal skills with adaptive AI tests.', color: '#F59E0B', route: ROUTES.APTITUDE_INTERVIEW },
              { icon: RiRobot2Line, title: 'AI HR Interview', desc: 'Practice behavioral questions with our AI interviewer. Get instant feedback on your answers.', color: '#533086', route: ROUTES.HR_INTERVIEW },
              { icon: RiCodeSSlashLine, title: 'Technical Interview', desc: 'Master DSA & system design with AI-generated questions tailored to your skill level.', color: '#4A4DC9', route: ROUTES.TECHNICAL_INTERVIEW },
              { icon: RiTerminalBoxLine, title: 'Coding Interview', desc: 'Solve coding challenges in a real-time environment with AI-assisted code reviews.', color: '#22C55E', route: ROUTES.CODING_INTERVIEW },
              { icon: RiMicLine, title: 'Voice Interview', desc: 'Practice speaking with AI voice recognition. Improve confidence & communication.', color: '#533086', route: ROUTES.VOICE_INTERVIEW },
              { icon: RiBarChartBoxLine, title: 'Performance Analytics', desc: 'Track your progress with detailed charts, reports, and AI recommendations.', color: '#4A4DC9', route: ROUTES.PERFORMANCE_REPORT },
              { icon: RiBookOpenLine, title: 'AI Learning Plan', desc: 'Personalized study roadmap based on your strengths and areas for improvement.', color: '#FC9145', route: ROUTES.LEARNING_PLAN },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                onClick={() => navigate(feature.route)}
                whileHover={{ y: -10, scale: 1.05, boxShadow: "0 20px 40px -5px rgba(74, 77, 201, 0.4)" }}
                className="group p-6 rounded-2xl border card-hover cursor-pointer transition-all duration-300 hover:border-primary-500"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                >
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Benefits */}
      <section id="benefits" className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeInUp}>
              <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Why AI?</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-6" style={{ color: 'var(--text-primary)' }}>
                AI-Powered Preparation <span className="gradient-text">That Works</span>
              </h2>
              <div className="space-y-5">
                {[
                  { icon: RiLightbulbLine, title: 'Instant Feedback', desc: 'Get real-time analysis of your answers with AI scoring.' },
                  { icon: RiTimeLine, title: 'Practice Anytime', desc: '24/7 availability. No scheduling needed. Practice at your pace.' },
                  { icon: RiShieldCheckLine, title: 'Industry Aligned', desc: 'Questions based on real interviews from top companies.' },
                  { icon: RiTeamLine, title: 'Personalized Path', desc: 'AI adapts difficulty based on your performance level.' },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(83,48,134,0.1)' }}>
                      <benefit.icon className="text-primary-700" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{benefit.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative Card */}
              <div className="rounded-3xl p-8 gradient-bg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white" />
                  <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-accent-500" />
                </div>
                <div className="relative z-10 text-white">
                  <RiRobot2Line size={48} className="mb-6" />
                  <h3 className="text-2xl font-bold mb-3">AI Interview Score</h3>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[
                      { label: 'Communication', score: 92 },
                      { label: 'Technical', score: 88 },
                      { label: 'Problem Solving', score: 85 },
                      { label: 'Confidence', score: 90 },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/10 rounded-xl p-3">
                        <div className="text-sm text-white/70">{item.label}</div>
                        <div className="text-2xl font-bold">{item.score}%</div>
                        <div className="w-full h-1.5 rounded-full bg-white/20 mt-2">
                          <div
                            className="h-full rounded-full bg-white"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="py-16 sm:py-20 lg:py-28" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp} className="text-center mb-12 sm:mb-16">
              <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl lg:text-4xl font-bold mt-3 mb-4" style={{ color: 'var(--text-primary)' }}>
                Loved by <span className="gradient-text">Students & Professionals</span>
              </h2>
            </motion.div>

            {/* Swipeable snap strip on mobile (cards can't shrink), even grid from md up.
                Uses built-in flex/snap so the md:grid display reliably overrides base. */}
            <div className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
              {testimonials.slice(0, visibleTestimonials).map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05, boxShadow: "0 20px 40px -5px rgba(74, 77, 201, 0.4)" }}
                  className="snap-start shrink-0 md:shrink p-6 rounded-2xl border w-[85vw] max-w-sm md:w-auto md:max-w-none transition-all duration-300 hover:border-primary-500"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <RiStarFill key={j} className="text-accent-500" size={16} />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm uppercase">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{testimonial.name}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {testimonials.length > visibleTestimonials && (
              <div className="text-center mt-10 sm:mt-12">
                <button type="button"
                  onClick={() => setVisibleTestimonials((prev) => prev + 3)}
                  className="tap-target px-6 py-3 rounded-xl border font-medium transition-all hover:bg-primary-500/5 hover:scale-105"
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                >
                  Load More Ratings
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12 sm:mb-16">
            <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl lg:text-4xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <FAQAccordion />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center p-8 sm:p-12 rounded-3xl gradient-bg relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent-500" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-white" />
            </div>
            <div className="relative z-10 text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-base sm:text-lg text-white/70 mb-8 max-w-xl mx-auto">
                Join thousands of students and professionals who have transformed their interview skills with AI.
              </p>
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-primary-700 font-semibold text-lg hover:bg-white/90 transition-colors"
              >
                Get Started for Free
                <RiArrowRightLine />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const faqs = [
  { q: 'How does the AI interview work?', a: 'Our AI uses advanced natural language processing to conduct realistic interviews. It generates questions based on your selected topic and difficulty, evaluates your responses in real-time, and provides detailed feedback on communication, technical accuracy, and confidence.' },
  { q: 'Is PrepAI free to use?', a: 'Yes! PrepAI offers a free tier that includes limited mock interviews, resume analysis, and basic performance tracking. Premium plans unlock unlimited interviews, detailed analytics, and personalized learning plans.' },
  { q: 'What types of interviews are supported?', a: 'We support HR/Behavioral interviews, Technical interviews (across 20+ technologies), Coding interviews (with built-in code editor), and Voice interviews with speech analysis.' },
  { q: 'How accurate is the resume analyzer?', a: 'Our ATS scanner uses the same algorithms that major companies use. It checks for keyword optimization, formatting, content gaps, and provides an industry-standard ATS compatibility score.' },
  { q: 'Can I track my progress over time?', a: 'Absolutely! Our analytics dashboard tracks your performance across all interview types with detailed charts, trends, and AI-generated improvement suggestions.' },
];

/* FAQ Accordion Sub-component */
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);


  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
          }}
        >
          <button type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <span className="font-medium pr-4" style={{ color: 'var(--text-primary)' }}>
              {faq.q}
            </span>
            <RiArrowDownSLine
              className={`flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
              size={20}
              style={{ color: 'var(--text-tertiary)' }}
            />
          </button>
          <motion.div
            initial={false}
            animate={{
              scaleY: openIndex === i ? 1 : 0,
              opacity: openIndex === i ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
            style={{ transformOrigin: 'top' }}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {faq.a}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

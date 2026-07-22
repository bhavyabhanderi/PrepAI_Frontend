import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Footer from '../components/layout/Footer';
import PublicNavbar from '../components/layout/PublicNavbar';
import { motion } from 'framer-motion';
import { RiSparklingFill } from 'react-icons/ri';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } },
};

export default function PrivacyPolicy() {
  const lastUpdated = "August 15, 2023";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-[0.15] blur-[100px]" style={{ background: '#533086' }} />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full opacity-[0.15] blur-[100px]" style={{ background: '#4A4DC9' }} />
      </div>

      {/* Navbar */}
      <PublicNavbar />

      {/* Main Content */}
      <main className="flex-1 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full relative z-10 pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider mb-2 block">Legal</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text pb-2">Privacy Policy</h1>
          {/* <p className="text-md mt-4" style={{ color: 'var(--text-tertiary)' }}>Last Updated: {lastUpdated}</p> */}
        </motion.div>
        
        <motion.div 
          variants={staggerContainer} 
          initial="initial" 
          animate="animate"
          className="space-y-8" 
          style={{ color: 'var(--text-secondary)' }}
        >
          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>1. Introduction</h2>
            <p className="text-lg leading-relaxed">
              Welcome to PrepAI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>2. The Data We Collect About You</h2>
            <p className="text-lg leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Identity Data:</strong> includes first name, last name, username or similar identifier.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Contact Data:</strong> includes email address.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Profile Data:</strong> includes your uploaded resumes (for ATS analysis), voice and video recordings (from HR and Voice interviews), code submissions (from Coding interviews), aptitude test results, and AI-generated performance reports/learning plans.</div>
              </li>
            </ul>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>3. How We Use Your Data</h2>
            <p className="text-lg leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to provide our AI interview preparation services to you, to manage our relationship with you, and to improve our website and AI models. We do not sell your personal data to third parties.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>4. Data Security</h2>
            <p className="text-lg leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Your voice recordings and transcripts are encrypted in transit and at rest.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>5. Contact Us</h2>
            <p className="text-lg leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact our Data Privacy Officer at <a href="mailto:privacy@prepai.example.com" className="text-primary-500 hover:underline">privacy@prepai.example.com</a>.
            </p>
          </motion.section>
        </motion.div>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

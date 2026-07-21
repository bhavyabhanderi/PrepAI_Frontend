import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import Footer from '../components/layout/Footer';
import PublicNavbar from '../components/layout/PublicNavbar';
import { motion } from 'framer-motion';
import { RiSparklingLine } from 'react-icons/ri';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } },
};

export default function TermsOfService() {
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text pb-2">Terms of Service</h1>
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
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
            <p className="text-lg leading-relaxed">
              By accessing and using the PrepAI website and services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>2. Use of AI Services</h2>
            <p className="text-lg leading-relaxed mb-4">
              Our platform uses artificial intelligence to analyze resumes, generate technical and behavioral interview questions, process voice/coding inputs, and provide performance evaluations. You understand and agree that:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div>AI-generated feedback is for educational and preparation purposes only.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div>We do not guarantee employment or interview success based on your use of the platform.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div>You will not use the service to generate malicious, offensive, or illegal content.</div>
              </li>
            </ul>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>3. User Accounts</h2>
            <p className="text-lg leading-relaxed">
              To use certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>4. Intellectual Property</h2>
            <p className="text-lg leading-relaxed">
              All content on the platform, including text, graphics, logos, and software, is the property of PrepAI or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>5. Limitation of Liability</h2>
            <p className="text-lg leading-relaxed">
              In no event shall PrepAI be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
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

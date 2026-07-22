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

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-[0.15] blur-[100px]" style={{ background: '#533086' }} />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-80 sm:h-80 rounded-full opacity-[0.15] blur-[100px]" style={{ background: '#4A4DC9' }} />
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
          <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider mb-2 block">Our Story</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text pb-2">About Us</h1>
        </motion.div>
        
        <motion.div 
          variants={staggerContainer} 
          initial="initial" 
          animate="animate"
          className="space-y-8" 
          style={{ color: 'var(--text-secondary)' }}
        >
          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border hover:border-primary-500/30 transition-colors" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 text-xl font-bold">1</div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
            </div>
            <p className="text-lg leading-relaxed">
              At PrepAI, our mission is to democratize interview preparation. We believe that everyone deserves the tools, insights, and practice necessary to ace their dream job interviews. By leveraging advanced artificial intelligence, we provide personalized, realistic, and comprehensive interview practice to students and professionals worldwide.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border hover:border-accent-500/30 transition-colors" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center text-accent-500 text-xl font-bold">2</div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Who We Are</h2>
            </div>
            <p className="text-lg leading-relaxed mb-4">
              We are a team of passionate engineers, recruiters, and data scientists who understand the stress and complexity of the modern hiring process. After going through countless rigorous interview loops ourselves, we realized there had to be a better way to prepare.
            </p>
            <p className="text-lg leading-relaxed">
              PrepAI was born out of the desire to create a safe, judgment-free environment where candidates can practice HR, Technical, and Coding rounds, receive instant feedback, and iterate on their skills before the real thing.
            </p>
          </motion.section>

          <motion.section variants={fadeInUp} className="p-8 sm:p-10 rounded-3xl border hover:border-primary-500/30 transition-colors" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 text-xl font-bold">3</div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Why PrepAI?</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Complete Interview Suite:</strong> Practice across specialized modules including HR Interviews, Technical System Design, DSA Coding Rounds, Spoken Voice Interviews, and Aptitude Tests.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Resume Analyzer:</strong> Get instant ATS scoring and actionable feedback to ensure your resume passes the initial screen.</div>
              </li>
              <li className="flex items-start gap-3 text-lg">
                <span className="text-accent-500 mt-1">✦</span>
                <div><strong style={{ color: 'var(--text-primary)' }}>Personalized Learning Plans:</strong> Our AI generates a custom syllabus based on your performance, tracking your growth across communication, technical, and problem-solving metrics.</div>
              </li>
            </ul>
          </motion.section>
        </motion.div>
      </main>

      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

import loginBackImg from "../assets/loginBack.png";
import prepAiLogo from "../assets/PrepAI.png";

export default function AuthLayout() {
  const location = useLocation();
  const [stats, setStats] = useState([
    {
      value: "0",
      label: "Users",
    },
    {
      value: "0",
      label: "Interviews",
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/rating/stats");

        if (data) {
          setStats([
            {
              value:
                data.total_users > 1000
                  ? `${(data.total_users / 1000).toFixed(1)}K+`
                  : `${data.total_users}+`,
              label: "Users",
            },
            {
              value:
                data.total_interviews > 1000
                  ? `${(data.total_interviews / 1000).toFixed(1)}K+`
                  : `${data.total_interviews}+`,
              label: "Interviews",
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-primary)' }}>

      {/* ================= LEFT PANEL ================= */}

      <div
        key={location.pathname}
        className="hidden md:flex md:w-[70%] relative overflow-hidden md:rounded-r-[30px] lg:rounded-r-[40px]"
      >

        {/* Background Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,#5B34D6 0%,#3A1D8F 45%,#17072F 100%)",
          }}
        />

        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05, x: 30 }}
          animate={{ opacity: 0.75, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${loginBackImg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundSize: "cover",
          }}
        />

        {/* Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,rgba(23,7,47,.96) 0%,rgba(23,7,47,.90) 28%,rgba(23,7,47,.72) 48%,rgba(23,7,47,.28) 72%,rgba(23,7,47,0) 100%)",
          }}
        />

        {/* Ambient Glow Animations */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-violet-500/30 blur-[150px]"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-fuchsia-500/30 blur-[150px]"
        />

        {/* Snow Animation - Native Framer Motion */}
        {[...Array(50)].map((_, i) => {
          const size = Math.random() * 4 + 2;
          const left = Math.random() * 100;
          const duration = 10 + Math.random() * 15;
          // By giving a random starting 'top' (via y), we scatter them immediately!
          return (
            <motion.div
              key={`snow-${i}`}
              className="absolute z-10 rounded-full bg-white/70 pointer-events-none"
              initial={{ y: "-10vh", opacity: 0 }}
              animate={{ 
                y: ["-10vh", "110vh"],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0, 0.8, 0.8, 0]
              }}
              transition={{
                y: {
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * -duration, // negative delay spreads them out immediately!
                },
                x: {
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * -5,
                },
                opacity: {
                  duration: duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * -duration,
                }
              }}
              style={{
                left: `${left}%`,
                top: 0,
                width: `${size}px`,
                height: `${size}px`,
                filter: `blur(${Math.random() > 0.5 ? 1 : 0}px)`,
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.4)",
              }}
            />
          );
        })}

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col justify-center h-full px-6 md:px-8 lg:px-12 xl:px-20 text-white">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 md:gap-3 mb-10 md:mb-12 xl:mb-16"
            >
              <img
                src={prepAiLogo}
                alt="PrepAI"
                className="w-12 h-12 md:w-14 md:h-14 xl:w-16 xl:h-16"
              />

              <span className="text-xl md:text-2xl xl:text-3xl font-bold">
                PrepAI
              </span>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl md:text-3xl lg:text-[40px] xl:text-[50px] font-extrabold leading-[1.15] md:leading-[1.1] xl:leading-[1.05] tracking-tight max-w-xl"
          >
            Ace Your Next
            <br />
            Interview with
            <br />
            <span className="text-violet-200">
              AI Confidence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 md:mt-6 xl:mt-8 max-w-lg text-sm md:text-base xl:text-lg leading-relaxed xl:leading-8 text-white/75"
          >
            Practice with AI-powered mock interviews,
            receive instant feedback,
            improve your communication,
            and build the confidence you need
            to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-6 md:gap-8 lg:gap-10 xl:gap-16 mt-8 md:mt-10 xl:mt-14"
          >
            {stats.map((item) => (
              <div key={item.label}>
                <h2 className="text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-1 xl:mt-2 text-xs md:text-sm xl:text-base text-white/60">
                  {item.label}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div 
        className="flex-1 md:w-[30%] md:flex-none flex items-center justify-center px-4 sm:px-6 md:px-8 py-6"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-sm lg:max-w-md p-6 sm:p-8 rounded-2xl border"
          style={{ 
            backgroundColor: 'var(--bg-card)', 
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={prepAiLogo}
                alt="PrepAI"
                className="w-14 h-14"
              />
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                PrepAI
              </span>
            </Link>
          </div>

          <Outlet />
        </motion.div>
      </div>

    </div>
  );
}
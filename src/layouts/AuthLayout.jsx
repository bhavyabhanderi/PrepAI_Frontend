import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

import loginBackImg from "../assets/loginBack.png";
import prepAiLogo from "../assets/PrepAI.png";

export default function AuthLayout() {
  const [stats, setStats] = useState([
    {
      value: "10K+",
      label: "Users",
    },
    {
      value: "50K+",
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
    <div className="min-h-screen flex bg-white">

      {/* ================= LEFT PANEL ================= */}

      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden lg:rounded-r-[40px]">

        {/* Background Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,#5B34D6 0%,#3A1D8F 45%,#17072F 100%)",
          }}
        />

        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${loginBackImg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right bottom",
            backgroundSize: "cover",
            opacity: 0.75,
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

        {/* Purple Glow */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-violet-500/20 blur-[180px]" />

        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-fuchsia-500/20 blur-[150px]" />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col justify-center h-full px-16 xl:px-20 text-white">

          <Link
            to="/"
            className="flex items-center gap-3 mb-16"
          >
            <img
              src={prepAiLogo}
              alt="PrepAI"
              className="w-11 h-11"
            />

            <span className="text-3xl font-bold">
              PrepAI
            </span>
          </Link>

          <h1 className="text-[0px] xl:text-[50px] font-extrabold leading-[1.05] tracking-tight max-w-xl">
            Ace Your Next
            <br />
            Interview with
            <br />
            <span className="text-violet-200">
              AI Confidence
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-8 text-white/75">
            Practice with AI-powered mock interviews,
            receive instant feedback,
            improve your communication,
            and build the confidence you need
            to land your dream job.
          </p>

          <div className="flex gap-16 mt-14">
            {stats.map((item) => (
              <div key={item.label}>
                <h2 className="text-4xl font-bold">
                  {item.value}
                </h2>

                <p className="mt-2 text-white/60">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={prepAiLogo}
                alt="PrepAI"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-violet-700">
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
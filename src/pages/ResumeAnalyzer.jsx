import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  RiUploadCloud2Line, RiFileTextLine, RiCheckLine,
  RiCloseLine, RiDownloadLine, RiAlertLine,
  RiStarLine, RiSparklingFill, RiShieldCheckLine,
  RiArrowRightLine, RiRefreshLine,
} from 'react-icons/ri';
import { formatFileSize, getScoreColor, getScoreLabel } from '../utils/helpers';
import { resumeService } from '../services/api';
import ratingService from '../services/ratingService';
import { useIsMobile } from '../hooks';
import toast from 'react-hot-toast';
import RatingModal from '../components/RatingModal';

/**
 * Resume Analyzer Page
 */
export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function loadLatest() {
      try {
        const res = await resumeService.getLatestAnalysis();
        if (res.data) {
          const data = res.data;
          setAnalysis({
            atsScore: data.ats_score,
            sections: {
              formatting: data.formatting_score,
              grammar: data.grammar_score,
              content: Math.round((data.ats_score + data.formatting_score) / 2),
            },
            missingSkills: data.missing_skills || [],
            suggestions: data.improvement_suggestions || [],
            strengths: (data.recommended_skills && data.recommended_skills.length > 0)
              ? data.recommended_skills.map(s => `Recommended skill: ${s}`)
              : ['Good layout structure', 'Valid education details'],
          });
        }
      } catch (err) {
        // No resume uploaded yet or failed
      }
    }
    loadLatest();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setAnalysis(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await resumeService.upload(formData);
      const data = res.data;
      setAnalysis({
        atsScore: data.ats_score,
        sections: {
          formatting: data.formatting_score,
          grammar: data.grammar_score,
          content: Math.round((data.ats_score + data.formatting_score) / 2),
        },
        missingSkills: data.missing_skills || [],
        suggestions: data.improvement_suggestions || [],
        strengths: (data.recommended_skills && data.recommended_skills.length > 0)
          ? data.recommended_skills.map(s => `Recommended skill: ${s}`)
          : ['Good layout structure', 'Valid education details'],
      });
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error('Failed to upload/analyze resume');
      return;
    } finally {
      setIsAnalyzing(false);
    }

    // A failing rating check must not report the analysis itself as failed.
    try {
      const ratingCheck = await ratingService.checkRatingStatus();
      if (!ratingCheck.has_rated) {
        setShowRatingModal(true);
      }
    } catch (err) {
      // Prompting for a rating is optional; stay quiet if the check fails.
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Resume Analyzer
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Upload your resume to get an ATS score and AI-powered improvement suggestions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Upload Resume
            </h3>

            {!file ? (
              <div
                {...getRootProps()}
                className={`
                  w-full min-h-[12rem] sm:min-h-[14rem] flex flex-col items-center justify-center
                  border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer
                  transition-all duration-300
                  ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'hover:border-primary-400 hover:bg-primary-500/3'}
                `}
                style={{ borderColor: isDragActive ? '#4A4DC9' : 'var(--border-color)' }}
              >
                <input {...getInputProps()} />
                <RiUploadCloud2Line
                  className="mx-auto mb-3"
                  size={48}
                  style={{ color: isDragActive ? '#4A4DC9' : 'var(--text-tertiary)' }}
                />
                <p className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                  {isDragActive ? 'Drop your resume here' : isMobile ? 'Tap to upload your resume' : 'Drag & drop your resume'}
                </p>
                {/* "Drag & drop" is meaningless on touch, so surface an explicit tap-to-browse affordance */}
                <span className="mt-2 inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold gradient-bg text-white">
                  Browse files
                </span>
                <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                  PDF format, max 5MB
                </p>
              </div>
            ) : (
              <div>
                {/* File Preview */}
                <div
                  className="flex items-center gap-3 p-4 rounded-xl mb-4"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center">
                    <RiFileTextLine className="text-accent-500" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button onClick={handleReset} className="p-1 rounded-lg hover:bg-error/10 transition-colors">
                    <RiCloseLine className="text-error" size={18} />
                  </button>
                </div>

                {/* Analyze Button */}
                {!analysis && (
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-3 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <RiSparklingFill size={16} />
                        Analyze Resume
                      </>
                    )}
                  </button>
                )}

                {analysis && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-xl border text-sm font-medium hover:bg-primary-500/5 transition-colors"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    >
                      <RiRefreshLine className="inline mr-1" size={14} />
                      New Upload
                    </button>
                    <button className="flex-1 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium hover:opacity-90 transition-opacity">
                      <RiDownloadLine className="inline mr-1" size={14} />
                      Download Report
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 rounded-2xl border text-center"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <RiSparklingFill className="text-white text-2xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  AI is analyzing your resume...
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Checking ATS compatibility, keywords, formatting, and more.
                </p>
                <div className="w-48 h-1.5 rounded-full mx-auto mt-6 overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                  <motion.div
                    className="h-full rounded-full gradient-bg"
                    style={{ width: '100%', transformOrigin: 'left' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}

            {analysis && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* ATS Score */}
                <div
                  className="p-6 rounded-2xl border"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke={getScoreColor(analysis.atsScore)}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${analysis.atsScore * 2.64} ${264 - analysis.atsScore * 2.64}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                          {analysis.atsScore}%
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>ATS Score</span>
                      </div>
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {getScoreLabel(analysis.atsScore)}
                      </h3>
                      <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-tertiary)' }}>
                        Your resume has a {analysis.atsScore}% chance of passing ATS filters.
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.entries(analysis.sections).slice(0, 3).map(([key, value]) => (
                          <div key={key}>
                            <div className="text-xs capitalize mb-1" style={{ color: 'var(--text-tertiary)' }}>{key}</div>
                            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-color)' }}>
                              <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Scores */}
                <div
                  className="p-6 rounded-2xl border"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Detailed Analysis
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(analysis.sections).map(([key, value]) => (
                      <div
                        key={key}
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm capitalize font-medium" style={{ color: 'var(--text-primary)' }}>
                            {key}
                          </span>
                          <span className="text-sm font-bold" style={{ color: getScoreColor(value) }}>
                            {value}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-color)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills & Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Missing Skills */}
                  <div
                    className="p-6 rounded-2xl border"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <RiAlertLine className="text-warning" /> Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)',
                            backgroundColor: 'var(--bg-tertiary)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  <div
                    className="p-6 rounded-2xl border"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <RiShieldCheckLine className="text-success" /> Strengths
                    </h3>
                    <div className="space-y-2">
                      {analysis.strengths.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <RiCheckLine className="text-success flex-shrink-0" size={16} />
                          <span className="text-sm min-w-0 break-words" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div
                  className="p-6 rounded-2xl border"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <RiSparklingFill className="text-accent-500" /> AI Suggestions
                  </h3>
                  <div className="space-y-3">
                    {analysis.suggestions.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                      >
                        <span className="text-sm mt-0.5 shrink-0" style={{ color: 'var(--text-tertiary)' }}>{i + 1}.</span>
                        <span className="text-sm min-w-0 break-words" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {!file && !analysis && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 rounded-2xl border text-center"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <RiFileTextLine className="mx-auto mb-4 text-5xl" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  No Resume Uploaded
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Upload your resume to get started with the AI analysis.
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
      />
    </div>
  );
}

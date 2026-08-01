import { useState, useEffect, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiCalendarLine,
  RiSparklingFill, RiCheckLine, RiTimeLine,
  RiExternalLinkLine, RiPlayCircleLine,
  RiCodeSSlashLine,
  RiUploadCloud2Line, RiFileTextLine, RiCloseLine,
  RiDiscussLine, RiBrainLine, RiArrowRightLine,
  RiTrophyLine, RiAlertLine
} from 'react-icons/ri';
import { analyticsService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { parseMarkdown } from '../utils/helpers';

const MINS_PER_QUESTION = 1; // 1 minute per question (equal to number of questions)

/**
 * Learning Plan Page — 3-step wizard:
 * Step 1: Upload Resume
 * Step 2: Skills Assessment Quiz (timed)
 * Step 3: Personalized Learning Plan
 */
export default function LearningPlan() {
  const navigate = useNavigate();

  // Global state
  const [step, setStep] = useState('upload'); // 'upload' | 'quiz' | 'plan'
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizSkills, setQuizSkills] = useState([]);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: selectedOption }
  const [timeLeft, setTimeLeft] = useState(MINS_PER_QUESTION * 60);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null); // { score, weakTopics }
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const timerRef = useRef(null);

  // Plan view state
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Upload/Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  // Load existing plan on mount — show it if available
  useEffect(() => {
    async function loadPlan() {
      try {
        const res = await analyticsService.getLatestLearningPlan();
        if (res.data) { setPlan(res.data); setStep('plan'); }
      } catch { /* no plan yet, stay on upload */ }
      finally { setLoading(false); }
    }
    loadPlan();
  }, []);

  // Countdown timer for quiz
  useEffect(() => {
    if (step !== 'quiz' || quizSubmitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, quizSubmitted]);

  useEffect(() => {
    if (timeLeft === 0 && step === 'quiz' && !quizSubmitted) {
      clearInterval(timerRef.current);
      handleSubmitQuiz(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, step, quizSubmitted]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartTest = async () => {
    if (!file) return;
    setIsGeneratingTest(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await analyticsService.generateSkillsTest(formData);
      const qs = res.data.questions || [];
      setQuizQuestions(qs);
      setQuizSkills(res.data.skills || []);
      setTimeLeft(qs.length * MINS_PER_QUESTION * 60);
      setCurrentQ(0);
      setAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
      setStep('quiz');
    } catch {
      toast.error('Failed to generate skills test. Please try again.');
    } finally {
      setIsGeneratingTest(false);
    }
  };

  // Generate plan directly from resume (no quiz)
  const handleGenerateDirectly = async () => {
    if (!file) return;
    setIsGeneratingPlan(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await analyticsService.generateLearningPlanFromResume(formData);
      setPlan(res.data);
      setStep('plan');
      toast.success('Learning Plan generated!');
    } catch {
      toast.error('Failed to generate learning plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleSelectAnswer = (qId, option) => {
    if (quizSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = useCallback(async (autoSubmit = false) => {
    if (quizSubmitted) return;
    clearInterval(timerRef.current);
    setQuizSubmitted(true);

    // Calculate score and per-skill breakdown
    let correct = 0;
    const skillStats = {}; // { skillName: { correct: 0, total: 0 } }
    
    quizQuestions.forEach(q => {
      if (!skillStats[q.skill]) {
        skillStats[q.skill] = { correct: 0, total: 0 };
      }
      skillStats[q.skill].total++;

      if (answers[q.id] === q.correct_answer) {
        correct++;
        skillStats[q.skill].correct++;
      }
    });

    const weakTopics = Object.entries(skillStats).map(
      ([skill, stats]) => `${skill} (Score: ${stats.correct}/${stats.total})`
    );

    const score = Math.round((correct / quizQuestions.length) * 100);
    setQuizResult({ score, correct, total: quizQuestions.length, weakTopics });

    if (autoSubmit) toast('⏰ Time\'s up! Auto-submitted.');
  }, [quizSubmitted, quizQuestions, answers]);

  const handleGeneratePlan = async () => {
    if (!quizResult) return;
    setIsGeneratingPlan(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quiz_score', quizResult.score.toString());
      formData.append('weak_topics', quizResult.weakTopics.join(','));
      const res = await analyticsService.generateLearningPlanWithScore(formData);
      setPlan(res.data);
      setStep('plan');
      toast.success('Your personalized learning plan is ready!');
    } catch {
      toast.error('Failed to generate learning plan. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const toggleTaskExpansion = (id) => setExpandedTaskId(p => p === id ? null : id);

  const toggleTask = async (day, taskIndex, currentStatus) => {
    if (!plan?.id) return;
    const newStatus = !currentStatus;
    const updatedPlan = { ...plan, weekly_schedule: { ...plan.weekly_schedule } };
    const tasks = [...updatedPlan.weekly_schedule[day]];
    tasks[taskIndex] = { ...tasks[taskIndex], done: newStatus };
    updatedPlan.weekly_schedule[day] = tasks;
    setPlan(updatedPlan);
    try {
      await analyticsService.updateLearningPlanTask(plan.id, { day, task_index: taskIndex, done: newStatus });
    } catch {
      setPlan(plan);
    }
  };

  // ── Loading screen ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-120px)] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  // ── STEP 1: Upload Resume ──
  if (step === 'upload') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Learning Plan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Upload your resume to get a skills assessment test, then receive a personalized study roadmap.</p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center gap-4">
          {['Upload Resume', 'Skills Test', 'Learning Plan'].map((label, i) => {
            const isActive = i === 0; // Update this logic if step changes
            return (
              <div key={i} className="flex items-center gap-4 flex-1 last:flex-none">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isActive ? 'gradient-bg text-white' : 'border'}`}
                    style={!isActive ? { borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' } : undefined}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block whitespace-nowrap" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />}
              </div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Upload Resume</h3>
          {!file ? (
            <div {...getRootProps()}
              className={`w-full min-h-[14rem] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'hover:border-primary-400'}`}
              style={{ borderColor: isDragActive ? '#4A4DC9' : 'var(--border-color)' }}>
              <input {...getInputProps()} />
              <RiUploadCloud2Line className="mx-auto mb-3" size={48} style={{ color: isDragActive ? '#4A4DC9' : 'var(--text-tertiary)' }} />
              <p className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}</p>
              <span className="mt-2 inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold gradient-bg text-white">Browse files</span>
              <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>PDF format, max 5MB</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <RiFileTextLine size={24} className="text-primary-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button type="button" onClick={() => setFile(null)} className="p-1 rounded-lg hover:bg-error/10 text-error transition-colors"><RiCloseLine size={18} /></button>
              </div>
              <div className="p-4 rounded-xl mb-4 border border-primary-500/20 bg-primary-500/5">
                <p className="text-sm font-semibold text-primary-500 mb-1">What happens next?</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>We'll analyze your resume and generate a <strong>10-question skills test</strong> (15 minute timer). Your score will be used to create a personalized learning plan!</p>
              </div>
              {/* Two option cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {/* Option 1: Skills Test */}
                <button type="button"
                  onClick={handleStartTest}
                  disabled={isGeneratingTest || isGeneratingPlan}
                  className="flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:border-primary-500 hover:bg-primary-500/5 disabled:opacity-50"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center mb-3">
                    {isGeneratingTest
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <RiSparklingFill size={18} className="text-white" />}
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {isGeneratingTest ? 'Generating Test…' : 'Take Skills Test'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Answer a timed quiz per skill. Plan is personalized based on your score.
                  </p>
                </button>

                {/* Option 2: Generate Directly */}
                <button type="button"
                  onClick={handleGenerateDirectly}
                  disabled={isGeneratingTest || isGeneratingPlan}
                  className="flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all hover:border-primary-500 hover:bg-primary-500/5 disabled:opacity-50"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                  <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
                    {isGeneratingPlan
                      ? <div className="w-4 h-4 border-2 border-warning/30 border-t-warning rounded-full animate-spin" />
                      : <RiCalendarLine size={18} className="text-warning" />}
                  </div>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {isGeneratingPlan ? 'Generating Plan…' : 'Generate Plan Directly'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Skip the test. Get an AI learning plan instantly from your resume.
                  </p>
                </button>
              </div>

            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ── STEP 2: Quiz ──
  if (step === 'quiz') {
    const q = quizQuestions[currentQ];
    const totalQ = quizQuestions.length;
    const progress = ((currentQ + 1) / totalQ) * 100;
    const isLast = currentQ === totalQ - 1;
    const answered = answers[q?.id] !== undefined;
    const timerColor = timeLeft < 60 ? '#EF4444' : timeLeft < 180 ? '#FC9145' : '#4A4DC9';

    if (quizSubmitted && quizResult) {
      const scoreColor = quizResult.score >= 80 ? '#22C55E' : quizResult.score >= 50 ? '#FC9145' : '#EF4444';
      const scoreLabel = quizResult.score >= 80 ? 'Excellent!' : quizResult.score >= 50 ? 'Good effort!' : 'Needs improvement';
      return (
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <RiTrophyLine size={56} className="mx-auto mb-4" style={{ color: scoreColor }} />
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Test Complete!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>Here's how you did on your skills assessment</p>
            <div className="text-6xl font-bold mb-2" style={{ color: scoreColor }}>{quizResult.score}%</div>
            <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{scoreLabel}</p>
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>{quizResult.correct} out of {quizResult.total} correct</p>

            {quizResult.weakTopics.length > 0 && (
              <div className="p-4 rounded-xl mb-6 text-left" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                  <RiAlertLine size={14} className="text-warning" /> Areas to improve:
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Your learning plan will focus on the questions you missed to help you improve!</p>
              </div>
            )}

            <button type="button"
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full py-3 rounded-xl font-semibold text-sm gradient-bg text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
              {isGeneratingPlan ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Your Plan...</>
              ) : (
                <><RiSparklingFill size={16} /> Generate My Personalized Plan</>
              )}
            </button>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Timer & Progress Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>Question {currentQ + 1} of {totalQ}</p>
            <div className="w-48 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="h-full rounded-full gradient-bg transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: `${timerColor}15` }}>
            <RiTimeLine size={18} style={{ color: timerColor }} />
            <span className="text-xl font-bold font-mono" style={{ color: timerColor }}>{formatTime(timeLeft)}</span>
          </div>
        </motion.div>

        {/* Skill Section Header */}
        {quizQuestions[currentQ - 1]?.skill !== q?.skill && (
          <motion.div key={q?.skill} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="px-4 py-2 rounded-xl border-l-4 border-primary-500 gradient-bg/10"
            style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Skill</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{q?.skill}</p>
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-semibold leading-relaxed flex-1 mr-4" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: parseMarkdown(q?.question) }} />
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full flex-shrink-0 ${
                q?.difficulty === 'easy' ? 'bg-success/10 text-success' :
                q?.difficulty === 'hard' ? 'bg-error/10 text-error' :
                'bg-warning/10 text-warning'
              }`}>{q?.difficulty}</span>
            </div>
            <div className="space-y-3">
              {q?.options.map((option, oi) => {
                const isSelected = answers[q.id] === option;
                return (
                  <button type="button"
                    key={oi}
                    onClick={() => handleSelectAnswer(q.id, option)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      isSelected ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'hover:border-primary-400 hover:bg-primary-500/5'
                    }`}
                    style={!isSelected ? { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : undefined}>
                    <span className="font-bold mr-3">{['A', 'B', 'C', 'D'][oi]}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button type="button"
            onClick={() => setCurrentQ(p => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            Previous
          </button>
          {isLast ? (
            <button type="button"
              onClick={() => handleSubmitQuiz(false)}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 flex items-center gap-2">
              <RiCheckLine size={16} /> Submit Test
            </button>
          ) : (
            <button type="button"
              onClick={() => setCurrentQ(p => Math.min(totalQ - 1, p + 1))}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 flex items-center gap-2">
              Next <RiArrowRightLine size={16} />
            </button>
          )}
        </div>

        {/* Skip */}
        <p className="text-center text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Answered: {Object.keys(answers).length}/{totalQ} &nbsp;·&nbsp;
          <button type="button" onClick={() => handleSubmitQuiz(false)} className="underline hover:text-primary-500 transition-colors">Submit early</button>
        </p>
      </div>
    );
  }

  // ── STEP 3: Plan View ──
  const recommendations = plan?.recommended_topics || [];
  const schedule = Object.entries(plan?.weekly_schedule || {}).map(([day, tasks]) => ({
    day,
    tasks: tasks.map(t => ({
      title: t.title || t,
      type: t.type || 'study',
      done: t.done || false,
      resource: t.resource || null
    }))
  }));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Learning Plan</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Your personalized AI-generated study roadmap.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button type="button"
            onClick={() => { setPlan(null); setStep('upload'); setQuizQuestions([]); setAnswers({}); setQuizSubmitted(false); setQuizResult(null); }}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center justify-center gap-2 hover:bg-primary-500/5"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
            <RiCalendarLine size={18} />
            Regenerate
          </button>
          <button type="button"
            onClick={() => { setPlan(null); setFile(null); setStep('upload'); setQuizQuestions([]); setAnswers({}); setQuizSubmitted(false); setQuizResult(null); }}
            className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2 gradient-bg hover:opacity-90">
            <RiUploadCloud2Line size={18} />
            New Resume
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Plan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-5">
            <RiCalendarLine className="text-primary-500" />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Weekly Plan</h3>
          </div>

          {schedule.length > 0 && (
            <>
              {/* Week Tabs */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-1">
                {schedule.map((day, idx) => (
                  <button type="button"
                    key={day.day}
                    onClick={() => setActiveWeekIndex(idx)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeWeekIndex === idx ? 'gradient-bg text-white' : 'hover:bg-primary-500/10'
                    }`}
                    style={activeWeekIndex !== idx ? { color: 'var(--text-secondary)', backgroundColor: 'var(--bg-tertiary)' } : undefined}>
                    {day.day}
                  </button>
                ))}
              </div>

              {/* Tasks for selected week */}
              <div className="space-y-2">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-tertiary)' }}>{schedule[activeWeekIndex]?.day} Focus</p>
                {schedule[activeWeekIndex]?.tasks.map((task, taskIndex) => {
                  const taskId = `${activeWeekIndex}-${taskIndex}`;
                  const isExpanded = expandedTaskId === taskId;
                  return (
                    <div key={taskId} className="rounded-xl border overflow-hidden transition-all duration-200"
                      style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                      <div
                        className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-primary-500/5 transition-colors"
                        onClick={() => toggleTaskExpansion(taskId)}>
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleTask(schedule[activeWeekIndex].day, taskIndex, task.done); }}
                          className={`cursor-pointer w-5 h-5 mt-0.5 sm:mt-0 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                            task.done ? 'bg-success text-white scale-110' : 'border hover:bg-black/5 dark:hover:bg-white/5'
                          }`} style={!task.done ? { borderColor: 'var(--border-color)' } : undefined}>
                          {task.done && <RiCheckLine size={12} />}
                        </div>
                        <span className={`text-sm min-w-0 break-words flex-1 transition-all duration-300 ${task.done ? 'line-through opacity-60' : ''}`}
                          style={{ color: task.done ? 'var(--text-tertiary)' : 'var(--text-secondary)' }}>
                          {task.title}
                        </span>
                        <span className="px-2 py-1 rounded text-[10px] font-medium shrink-0 capitalize"
                          style={{
                            backgroundColor: task.type === 'coding' ? 'rgba(74,77,201,0.1)' : task.type === 'interview' ? 'rgba(252,145,69,0.1)' : task.type === 'aptitude' ? 'rgba(83,48,134,0.1)' : 'rgba(83,48,134,0.1)',
                            color: task.type === 'coding' ? '#4A4DC9' : task.type === 'interview' ? '#FC9145' : task.type === 'aptitude' ? '#533086' : '#533086',
                          }}>
                          {task.type}
                        </span>
                      </div>

                      {/* Expanded Resource Section */}
                      {isExpanded && (
                        <div className="px-3 pb-4 pt-1 ml-8">
                          <div className="p-3 rounded-lg flex items-center justify-between border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                task.type === 'coding' ? 'bg-primary-500/10' :
                                task.type === 'interview' ? 'bg-[#FC9145]/10' :
                                task.type === 'aptitude' ? 'bg-[#533086]/10' : 'bg-error/10'
                              }`}>
                                {task.type === 'coding' ? <RiCodeSSlashLine className="text-primary-500" size={18} /> :
                                 task.type === 'interview' ? <RiDiscussLine color="#FC9145" size={18} /> :
                                 task.type === 'aptitude' ? <RiBrainLine color="#533086" size={18} /> :
                                 <RiPlayCircleLine className="text-error" size={18} />}
                              </div>
                              <div>
                                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                                  {task.type === 'coding' ? 'Solve Coding Challenges' :
                                   task.type === 'interview' ? 'Practice Technical Interview' :
                                   task.type === 'aptitude' ? 'Take an Aptitude Test' :
                                   (task.resource ? task.resource.title : 'Recommended Video Resource')}
                                </p>
                                <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                                  {task.type === 'coding' ? 'Practice algorithmic problems natively' :
                                   task.type === 'interview' ? 'Start a voice-based mock interview' :
                                   task.type === 'aptitude' ? 'Test your logic and reasoning skills' :
                                   'Watch tutorial on YouTube'}
                                </p>
                              </div>
                            </div>

                            {task.type === 'coding' ? (
                              <button type="button" onClick={() => navigate('/coding-interview')}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors flex items-center gap-1">
                                Practice <RiExternalLinkLine size={12} />
                              </button>
                            ) : task.type === 'interview' || task.type === 'aptitude' ? (
                              <button type="button" onClick={() => navigate(task.type === 'interview' ? '/technical-interview' : '/aptitude-interview')}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors flex items-center gap-1 hover:opacity-90"
                                style={{ backgroundColor: task.type === 'interview' ? '#FC9145' : '#533086' }}>
                                Start <RiExternalLinkLine size={12} />
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button type="button"
                                  onClick={() => navigate(`/topic-details?topic=${encodeURIComponent(task.title)}`)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium gradient-bg text-white hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
                                >
                                  Learn with AI <RiSparklingFill size={12} />
                                </button>
                                <a href={task.resource ? task.resource.link : `https://www.youtube.com/results?search_query=${encodeURIComponent(task.title + ' tutorial')}`}
                                  target="_blank" rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-error text-white hover:bg-error/90 transition-colors flex items-center gap-1">
                                  Watch <RiExternalLinkLine size={12} />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-4">
              <RiSparklingFill className="text-warning" />
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>AI Recommendations</h3>
            </div>
            <div className="space-y-2">
              {recommendations.slice(0, 10).map((topic, i) => (
                <button type="button" 
                  key={i} 
                  onClick={() => navigate(`/topic-details?topic=${encodeURIComponent(topic)}`)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all hover:bg-primary-500/10 border border-transparent hover:border-primary-500/30 group" 
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div className="flex items-center gap-2">
                    <RiBrainLine size={14} className="text-warning flex-shrink-0" />
                    <span className="text-xs group-hover:text-primary-500 font-medium transition-colors text-left" style={{ color: 'var(--text-secondary)' }}>{topic}</span>
                  </div>
                  <RiArrowRightLine size={14} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

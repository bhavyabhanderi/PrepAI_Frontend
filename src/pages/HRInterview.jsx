import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  RiSendPlaneFill, RiMicLine, RiMicOffLine,
  RiTimeLine, RiSparklingFill, RiUser3Line, RiUserVoiceLine,
  RiRobot2Line, RiStopCircleLine, RiRefreshLine,
} from 'react-icons/ri';
import { formatTimer, parseMarkdown } from '../utils/helpers';
import { useTimer, useTabSwitchGuard } from '../hooks';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { addNotification } from '../redux/slices/uiSlice';
import { startInterview, endInterview } from '../redux/slices/interviewSlice';
import { interviewService, analyticsService } from '../services/api';
import { playNotificationSound } from '../utils/audio';

/**
 * AI HR Interview Page
 */
export default function HRInterview() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const [jobRole, setJobRole] = useState('Software Engineer');
  const [company, setCompany] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [jobDescription, setJobDescription] = useState('');

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { time, isRunning, start, stop, reset } = useTimer();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Tracks the live interview rather than `interviewStarted`, which stays true
  // while the finished report is on screen.
  const interviewActive = useSelector((state) => state.interview.isActive);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInput(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to exit? Your active interview progress will be lost.';
      return e.returnValue;
    };

    if (interviewStarted && isRunning) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [interviewStarted, isRunning]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleStartInterview = async (voiceMode = false) => {
    const result = await Swal.fire({
      title: 'Start HR Interview?',
      text: 'You are about to start an HR interview session. Make sure you are ready!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Start!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4A4DC9',
      cancelButtonColor: '#6b7280',
    });
    if (!result.isConfirmed) return;

    setIsVoiceMode(voiceMode);
    setIsThinking(true);
    setInterviewStarted(true);
    start();
    try {
      // 1. Create interview on backend
      const res = await interviewService.create({
        type: 'hr',
        company: company || 'AI Portal',
        difficulty_level: difficultyLevel,
        job_role: jobRole || 'Software Engineer',
        job_description: jobDescription || undefined,
      });
      const intId = res.data.id;
      setInterviewId(intId);
      localStorage.setItem('latest-interview-id', intId);
      dispatch(startInterview({ id: intId, type: 'hr' }));

      // 2. Fetch the first question
      const qRes = await interviewService.getNextQuestion(intId);
      const firstQ = qRes.data;
      setCurrentQuestion(firstQ);

      playNotificationSound();
      setMessages([
        {
          id: firstQ.id,
          role: 'ai',
          content: `Hello! I'm your AI HR interviewer. I'll be conducting a behavioral interview today.\n\n**Question 1: ${firstQ.question_text}**`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      toast.error('Failed to start interview. Please try again.');
      setInterviewStarted(false);
      stop();
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking || !interviewId || !currentQuestion) return;

    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsRecording(false);
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const answerText = input.trim();
    setInput('');
    setIsThinking(true);

    try {
      // 1. Submit answer
      await interviewService.submitAnswer(interviewId, {
        question_id: currentQuestion.id,
        answer_text: answerText,
      });

      // 2. Fetch the next question
      try {
        const nextQRes = await interviewService.getNextQuestion(interviewId);
        const nextQ = nextQRes.data;
        setCurrentQuestion(nextQ);
        
        playNotificationSound();
        setMessages((prev) => [
          ...prev,
          {
            id: nextQ.id,
            role: 'ai',
            content: `**Question ${nextQ.order_index}: ${nextQ.question_text}**`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (nextErr) {
        // If getNextQuestion fails or returns 400 (completed)
        await handleEndInterview();
      }
    } catch (err) {
      toast.error('Failed to submit answer');
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (!isRecording) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setInput('');
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
      setIsRecording(false);
    }
  };

  const handleEndInterview = async ({ forceAutoSubmit = false, showScoreSwal = false } = {}) => {
    stop();
    dispatch(endInterview());
    setIsThinking(true);
    
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsRecording(false);
    }

    try {
      // Generate performance report via analytics
      const reportRes = await analyticsService.generateReport(interviewId);
      const report = reportRes.data;
      
      // Add to notification center
      dispatch(addNotification({
        title: 'Performance Report Ready',
        message: `Your HR interview performance report is ready with a score of ${Math.round(report.overall_score)}%!`
      }));

      playNotificationSound();

      if (forceAutoSubmit) {
        Swal.fire({
          icon: 'warning',
          title: 'Interview Auto-Ended',
          text: `We detected that you left the interview tab. Your interview was automatically ended to ensure academic integrity.\n\nYour Overall Score: ${Math.round(report.overall_score)}/100`,
          confirmButtonColor: '#7c3aed'
        });
      } else if (showScoreSwal) {
        Swal.fire({
          icon: 'success',
          title: 'Interview Complete!',
          html: `Your HR interview performance report is ready.<br><br><b>Overall Score: ${Math.round(report.overall_score)}/100</b>`,
          confirmButtonColor: '#7c3aed'
        }).then(() => {
          navigate(ROUTES.PERFORMANCE_REPORT);
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: 'ai',
          content: `**Interview Complete!** 🎉\n\nThank you for completing the HR interview. Here's a quick summary:\n\n- **Technical Score:** ${Math.round(report.technical_score)}/100\n- **Coding Score:** ${Math.round(report.coding_score)}/100\n- **Communication Score:** ${Math.round(report.communication_score)}/100\n- **Overall Score:** ${Math.round(report.overall_score)}/100\n\nVisit your Performance Report for detailed analytics and feedback.`,
          timestamp: new Date().toISOString(),
        },
      ]);
      
      if (!showScoreSwal) {
        toast((t) => (
          <div className="flex items-center gap-3">
            <span>Performance report generated!</span>
            <button type="button"
              onClick={() => { toast.dismiss(t.id); navigate(ROUTES.PERFORMANCE_REPORT); }}
              className="px-3 py-1.5 rounded-lg gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              View Report
            </button>
          </div>
        ), { duration: 8000 });
      }
    } catch (err) {
      if (showScoreSwal) {
        Swal.fire({
          icon: 'info',
          title: 'Interview Ended',
          text: 'The interview was ended. No score could be generated (you may not have answered any questions).',
          confirmButtonColor: '#7c3aed'
        }).then(() => {
          navigate(ROUTES.DASHBOARD);
        });
      } else {
        toast.error('Failed to generate final report');
      }
    } finally {
      setIsThinking(false);
    }
  };

  const confirmEnd = () => {
    Swal.fire({
      title: 'End Interview?',
      text: 'Are you sure you want to end the interview? Your performance report will be generated.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, end it!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleEndInterview({ showScoreSwal: true });
      }
    });
  };

  // Leaving the tab ends the interview and grades it where it stands.
  useTabSwitchGuard(interviewActive, () => {
    handleEndInterview({ forceAutoSubmit: true });
  });

  if (!interviewStarted) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh-120px)] py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left w-full max-w-xl p-6 sm:p-8 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6">
            <RiUserVoiceLine className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            AI HR Interview Setup
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Specify your target job role and description so the AI can ask relevant behavioral questions.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="hr-job-role" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Target Job Designation *
              </label>
              <input
                id="hr-job-role"
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Frontend React Developer"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-primary-500"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hr-company" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Target Company
                </label>
                <input
                  id="hr-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-primary-500"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Difficulty Level
                </label>
                <select
                  value={difficultyLevel}
                  onChange={(e) => setDifficultyLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-primary-500"
                  style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="medium">Medium</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="hr-job-description" className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Job Description
              </label>
              <textarea
                id="hr-job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for highly customized questions (optional)..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-primary-500 resize-none"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button type="button"
              onClick={() => handleStartInterview(false)}
              disabled={!jobRole.trim() || isThinking}
              className="flex-1 px-6 py-3 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isThinking && !isVoiceMode ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <RiSparklingFill size={16} /> Text Interview
                </>
              )}
            </button>
            <button type="button"
              onClick={() => handleStartInterview(true)}
              disabled={!jobRole.trim() || isThinking}
              className="flex-1 px-6 py-3 rounded-xl border font-medium text-sm hover:bg-primary-500/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              {isThinking && isVoiceMode ? (
                <div className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              ) : (
                <>
                  <RiMicLine size={16} /> Voice Interview
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)]">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-3 rounded-xl mb-4 border gap-3"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <RiRobot2Line className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI HR Interviewer</h3>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {isThinking ? 'Thinking...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
          >
            <RiTimeLine size={14} />
            {formatTimer(time)}
          </div>
          <button type="button"
            onClick={confirmEnd}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-error/10 text-error hover:bg-error/20 transition-colors flex items-center gap-1"
          >
            <RiStopCircleLine size={14} />
            End
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto rounded-xl p-4 space-y-4 border no-scrollbar"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                msg.role === 'ai' ? 'gradient-bg' : ''
              }`}
              style={msg.role === 'user' ? { backgroundColor: 'var(--bg-tertiary)' } : undefined}
            >
              {msg.role === 'ai' ? (
                <RiRobot2Line className="text-white text-sm" />
              ) : (
                <RiUser3Line size={14} style={{ color: 'var(--text-tertiary)' }} />
              )}
            </div>
            <div
              className={`max-w-[85%] sm:max-w-[75%] min-w-0 break-words p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-bg text-white rounded-tr-md'
                  : 'rounded-tl-md'
              }`}
              style={msg.role === 'ai' ? {
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
              } : undefined}
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(msg.content),
              }}
            />
          </motion.div>
        ))}

        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <RiRobot2Line className="text-white text-sm" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-md" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 flex items-end gap-2">
        <div
          className="flex-1 flex items-end gap-2 px-4 py-3 rounded-xl border transition-colors focus-within:border-primary-500"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <label htmlFor="hr-answer-input" className="sr-only">Your answer</label>
          <textarea
            id="hr-answer-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none"
            style={{ color: 'var(--text-primary)', maxHeight: '120px' }}
          />
          {isVoiceMode && (
            <button type="button"
              onClick={toggleRecording}
              className={`tap-target p-2 rounded-lg transition-colors ${
                isRecording ? 'bg-error/10 text-error animate-pulse' : 'hover:bg-primary-500/10'
              }`}
              style={!isRecording ? { color: 'var(--text-tertiary)' } : undefined}
            >
              {isRecording ? <RiMicOffLine size={18} /> : <RiMicLine size={18} />}
            </button>
          )}
        </div>
        <button type="button"
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          className="tap-target p-3 rounded-xl gradient-bg text-white hover:opacity-90 transition-all disabled:opacity-30"
        >
          <RiSendPlaneFill size={18} />
        </button>
      </div>
    </div>
  );
}

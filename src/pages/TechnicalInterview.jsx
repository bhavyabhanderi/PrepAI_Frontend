import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  RiCodeSSlashLine, RiCheckLine, RiCloseLine,
  RiTimeLine, RiArrowRightLine, RiSparklingFill,
  RiTrophyLine, RiStarLine, RiSendPlaneFill, RiMicLine,
  RiMicOffLine, RiRobot2Line, RiUser3Line, RiStopCircleLine
} from 'react-icons/ri';
import { formatTimer, getScoreColor, parseMarkdown } from '../utils/helpers';
import { useTimer, useTabSwitchGuard } from '../hooks';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { addNotification } from '../redux/slices/uiSlice';
import { startInterview, endInterview } from '../redux/slices/interviewSlice';
import { interviewService, analyticsService } from '../services/api';
import { playNotificationSound } from '../utils/audio';

const technologies = [
  'React', 'Node.js', 'Python', 'Java', 'JavaScript', 'SQL', 'System Design', 'Data Structures',
  'React Native', 'Android', 'iOS', 'Flutter', 'Go', 'C++', 'C#', 'Ruby', 'PHP',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Vue.js', 'Angular', 'TypeScript',
  'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'Next.js'
];
const difficulties = ['Easy', 'Medium', 'Hard'];

/**
 * AI Technical Interview Page
 */
export default function TechnicalInterview() {
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const messagesEndRef = useRef(null);
  const { time, isRunning, start, stop, reset } = useTimer();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Tracks the live interview rather than `started`, which stays true while the
  // finished report is on screen.
  const interviewActive = useSelector((state) => state.interview.isActive);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Prevent page refresh / close during active interview
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to exit? Your active interview progress will be lost.';
      return e.returnValue;
    };

    if (started && isRunning) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [started, isRunning]);

  const handleStart = async () => {
    const result = await Swal.fire({
      title: 'Start Technical Interview?',
      text: 'You are about to start a technical interview session. Make sure you are ready!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Start!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4A4DC9',
      cancelButtonColor: '#6b7280',
    });
    if (!result.isConfirmed) return;

    setIsThinking(true);
    setStarted(true);
    start();
    try {
      // 1. Create technical interview on backend
      const res = await interviewService.create({
        type: 'technical',
        company: 'AI Portal',
        difficulty_level: selectedDifficulty ? selectedDifficulty.toLowerCase() : 'medium',
        job_role: selectedTech || 'Software Engineer',
      });
      const intId = res.data.id;
      setInterviewId(intId);
      localStorage.setItem('latest-interview-id', intId);
      dispatch(startInterview({ id: intId, type: 'technical' }));

      // 2. Fetch the first question
      const qRes = await interviewService.getNextQuestion(intId);
      const firstQ = qRes.data;
      setCurrentQuestion(firstQ);

      playNotificationSound();
      setMessages([
        {
          id: firstQ.id,
          role: 'ai',
          content: `Welcome to your Technical Interview for **${selectedTech}** (${selectedDifficulty} level).\n\n**Question 1: ${firstQ.question_text}**`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      toast.error('Failed to start interview. Please try again.');
      setStarted(false);
      stop();
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking || !interviewId || !currentQuestion) return;

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
    setIsRecording(!isRecording);
    // Mock voice input
    if (!isRecording) {
      setTimeout(() => {
        setInput('A closure is the combination of a function bundled together with references to its surrounding state.');
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleEndInterview = async ({ forceAutoSubmit = false, showScoreSwal = false } = {}) => {
    stop();
    dispatch(endInterview());
    setIsThinking(true);
    try {
      // Generate performance report via analytics
      const reportRes = await analyticsService.generateReport(interviewId);
      const report = reportRes.data;
      
      // Add to notification center
      dispatch(addNotification({
        title: 'Technical Report Ready',
        message: `Your ${selectedTech} technical interview performance report is ready!`
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
          html: `Your technical interview performance report is ready.<br><br><b>Overall Score: ${Math.round(report.overall_score)}/100</b>`,
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
          content: `**Interview Complete!** 🎉\n\nThank you for completing the technical interview. Here's a quick summary:\n\n- **Technical Score:** ${Math.round(report.technical_score)}/100\n- **Coding Score:** ${Math.round(report.coding_score)}/100\n- **Communication Score:** ${Math.round(report.communication_score)}/100\n- **Overall Score:** ${Math.round(report.overall_score)}/100\n\nVisit your Performance Report for detailed analytics and feedback.`,
          timestamp: new Date().toISOString(),
        },
      ]);
      
      if (!showScoreSwal) {
        toast((t) => (
          <div className="flex items-center gap-3">
            <span>Performance report generated!</span>
            <button
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

  // Start Screen
  if (!started) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            AI Technical Interview
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Select your technology and difficulty to begin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Technology Selection */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Technology</h3>
            <div className="grid grid-cols-2 gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                    selectedTech === tech ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'hover:bg-primary-500/5'
                  }`}
                  style={selectedTech !== tech ? { borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : undefined}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Select Difficulty</h3>
            <div className="space-y-3">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                    selectedDifficulty === diff ? 'border-primary-500 bg-primary-500/10' : 'hover:bg-primary-500/5'
                  }`}
                  style={selectedDifficulty !== diff ? { borderColor: 'var(--border-color)' } : undefined}
                >
                  <div>
                    <div className="font-medium text-sm" style={{ color: selectedDifficulty === diff ? '#4A4DC9' : 'var(--text-primary)' }}>{diff}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                      {diff === 'Easy' ? '5 questions · 10 min' : diff === 'Medium' ? '5 questions · 15 min' : '5 questions · 20 min'}
                    </div>
                  </div>
                  {selectedDifficulty === diff && <RiCheckLine className="text-primary-500" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              disabled={!selectedTech || !selectedDifficulty || isThinking}
              className="w-full mt-6 py-3 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {isThinking ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <RiSparklingFill size={16} />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </div>
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
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Technical Interviewer</h3>
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
          <button
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
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none"
            style={{ color: 'var(--text-primary)', maxHeight: '120px' }}
          />
          {isVoiceMode && (
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-lg transition-colors tap-target ${
                isRecording ? 'bg-error/10 text-error animate-pulse' : 'hover:bg-primary-500/10'
              }`}
              style={!isRecording ? { color: 'var(--text-tertiary)' } : undefined}
            >
              {isRecording ? <RiMicOffLine size={18} /> : <RiMicLine size={18} />}
            </button>
          )}
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isThinking}
          className="p-3 rounded-xl gradient-bg text-white hover:opacity-90 transition-all disabled:opacity-30 tap-target flex-shrink-0"
        >
          <RiSendPlaneFill size={18} />
        </button>
      </div>
    </div>
  );
}


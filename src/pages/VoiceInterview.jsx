import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  RiMicLine, RiMicOffLine, RiStopCircleLine,
  RiPlayLine, RiTimeLine, RiSpeedLine,
  RiEmotionHappyLine, RiVoiceprintLine, RiSparklingFill,
} from 'react-icons/ri';
import { formatTimer } from '../utils/helpers';
import { useTimer, usePrefersReducedMotion, useTabSwitchGuard } from '../hooks';
import { voiceService } from '../services/api';
import { useDispatch } from 'react-redux';
import { startInterview, endInterview } from '../redux/slices/interviewSlice';
import toast from 'react-hot-toast';

/**
 * Voice Interview Page
 */
export default function VoiceInterview() {
  const [started, setStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [speakingSpeed, setSpeakingSpeed] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [conversations, setConversations] = useState([]);

  const [jobRole, setJobRole] = useState('Software Engineer');
  const [company, setCompany] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('medium');
  const [jobDescription, setJobDescription] = useState('');

  const { time, start, stop, isRunning } = useTimer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(endInterview());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to exit? Your active voice interview progress will be lost.';
      return e.returnValue;
    };

    if (started && isRunning) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [started, isRunning]);

  // Simulate waveform animation
  const [waveform, setWaveform] = useState(new Array(20).fill(0));

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveform(prev => prev.map(() => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setWaveform(new Array(20).fill(0));
    }
  }, [isRecording]);

  const handleStart = async () => {
    setIsThinking(true);
    try {
      const greetRes = await voiceService.firstQuestion({
        job_role: jobRole,
        job_description: jobDescription || undefined,
      });
      const welcomeText = greetRes.data.text;
      setStarted(true);
      setAiResponse(welcomeText);
      playTTS(welcomeText);
      start();
      dispatch(startInterview({ id: 'voice-session', type: 'voice' }));
    } catch (err) {
      toast.error('Failed to start voice interview. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleEnd = () => {
    stop();
    dispatch(endInterview());
    setStarted(false);
    setConversations([]);
  };

  // Leaving the tab ends the interview.
  useTabSwitchGuard(started, () => {
    handleEnd();
    toast.error('You left the tab. The voice interview has been ended.');
  });

  const playTTS = async (text) => {
    try {
      const res = await voiceService.tts(text);
      const url = URL.createObjectURL(res.data);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error('Failed to play TTS audio', err);
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          setIsAnalyzing(true);
          setTranscript('Processing your response...');
          try {
            const formData = new FormData();
            formData.append('audio_file', audioBlob, 'recording.wav');
            formData.append('duration_sec', 5);
            const res = await voiceService.stt(formData);
            const data = res.data;
            
            setTranscript(data.transcription);
            const speed = Math.round(data.words_per_minute || data.speaking_speed_wpm || 0);
            setSpeakingSpeed(speed);
            setConfidence(Math.round(data.confidence_score));

            setConversations(prev => [...prev, { role: 'user', text: data.transcription }]);

            // Generate AI response
            const chatRes = await voiceService.chat({
              job_role: jobRole,
              job_description: jobDescription || undefined,
              transcription: data.transcription,
              history: conversations,
            });
            const aiText = chatRes.data.text;
            setAiResponse(aiText);
            playTTS(aiText);
            setConversations(prev => [...prev, { role: 'ai', text: aiText }]);
          } catch (err) {
            toast.error('Failed to parse speech input');
            setTranscript('Speech recognition failed');
          } finally {
            setIsAnalyzing(false);
          }
        };

        recorder.start();
        setIsRecording(true);
        setTranscript('');
      } catch (err) {
        toast.error('Cannot access your microphone');
      }
    } else {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        // Stop all audio tracks to release microphone
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    }
  };

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh-120px)] py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left w-full max-w-xl p-6 sm:p-8 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6">
            <RiMicLine className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Voice Interview Setup</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
            Practice speaking with AI voice recognition. Specify your target designation and job details.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Target Job Designation *
              </label>
              <input
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
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Target Company
                </label>
                <input
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
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for highly customized questions (optional)..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:border-primary-500 resize-none"
                style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!jobRole.trim() || isThinking}
            className="w-full mt-8 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isThinking ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <RiPlayLine /> Start Voice Interview
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Voice Interview</h1>
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <RiTimeLine size={14} /> {formatTimer(time)}
          </div>
          <button
            onClick={() => {
              handleEnd();
              toast.success('Voice interview ended.');
            }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-error/10 text-error hover:bg-error/20 flex items-center gap-1"
          >
            <RiStopCircleLine size={14} /> End
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Recording Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Response */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <RiSparklingFill className="text-accent-500" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Interviewer</span>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-line break-words max-h-[40dvh] overflow-y-auto" style={{ color: 'var(--text-secondary)' }}>
              {aiResponse}
            </p>
          </div>

          {/* Waveform & Recording */}
          <div className="p-6 rounded-2xl border text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            {/* Waveform Visualization — bars stay full-width and scale by percentage so it fits any phone width */}
            <div className="flex items-center justify-center gap-1 h-20 mb-6">
              {waveform.map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{ backgroundColor: isRecording ? '#4A4DC9' : 'var(--border-color)' }}
                  animate={{ height: isRecording ? `${Math.max(h * 0.8, 8)}%` : '8%' }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.1 }}
                />
              ))}
            </div>

            {/* Record Button */}
            <button
              onClick={toggleRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                isRecording ? 'bg-error animate-pulse scale-110' : 'gradient-bg hover:scale-105'
              }`}
            >
              {isRecording ? (
                <RiMicOffLine className="text-white text-2xl" />
              ) : (
                <RiMicLine className="text-white text-2xl" />
              )}
            </button>
            <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
              {isRecording ? 'Recording... Click to stop' : 'Click to start speaking'}
            </p>

            {/* Live Transcript */}
            {transcript && (
              <div className="mt-4 p-4 rounded-xl text-left max-h-[40dvh] overflow-y-auto" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>Live Transcription:</p>
                <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--text-primary)' }}>{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Metrics */}
        <div className="space-y-4">
          {/* Speaking Speed */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <RiSpeedLine className="text-primary-500" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Speaking Speed</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {speakingSpeed} <span className="text-sm font-normal" style={{ color: 'var(--text-tertiary)' }}>WPM</span>
            </div>
            <div className="w-full h-2 rounded-full mt-3" style={{ backgroundColor: 'var(--border-color)' }}>
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${Math.min((speakingSpeed / 200) * 100, 100)}%` }} />
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>Ideal: 120-160 WPM</p>
          </div>

          {/* Confidence Meter */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <RiEmotionHappyLine className="text-accent-500" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Confidence</span>
            </div>
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-color)" strokeWidth="8" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#FC9145" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${confidence * 2.64} ${264 - confidence * 2.64}`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{confidence}%</span>
              </div>
            </div>
          </div>

          {/* Vocal Clarity */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-3">
              <RiVoiceprintLine className="text-success" />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Vocal Analysis</span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Clarity', value: 82 },
                { label: 'Tone', value: 75 },
                { label: 'Filler Words', value: 88 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-tertiary)' }}>{metric.label}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{metric.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div className="h-full rounded-full bg-success" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

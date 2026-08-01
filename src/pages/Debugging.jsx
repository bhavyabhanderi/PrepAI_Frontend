import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  RiBugLine, RiCheckDoubleLine, RiPlayLine,
  RiArrowRightLine, RiInformationLine, RiCodeBoxLine,
  RiLoader4Line
} from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks';
import toast from 'react-hot-toast';
import { codingService } from '../services/api';
import { parseMarkdown } from '../utils/helpers';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function Debugging() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [difficulty, setDifficulty] = useState('all');
  
  const [sessionQuestionNumber, setSessionQuestionNumber] = useState(1);
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null); // { success: boolean, diff: string, explanation: string }

  const fetchChallenge = async (diff) => {
    try {
      setIsGenerating(true);
      setResult(null);
      const apiDiff = diff === 'all' ? 'medium' : diff; // AI endpoint expects specific difficulty
      const response = await codingService.getDebuggingProblems(apiDiff);
      const newChallenge = response.data[0];
      setChallenge(newChallenge);
      setCode(newChallenge.brokenCode);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast.error('Failed to generate challenge.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchChallenge(difficulty);
  }, []);

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    setSessionQuestionNumber(1);
    fetchChallenge(newDiff);
  };

  const handleNextChallenge = () => {
    setSessionQuestionNumber(prev => prev + 1);
    fetchChallenge(difficulty);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setResult(null);

    // Simulate validation
    setTimeout(() => {
      // Very naive string comparison for demo purposes
      const isFixed = code.replace(/\s+/g, '') === challenge.targetCode.replace(/\s+/g, '');
      
      if (isFixed) {
        setResult({
          success: true,
          explanation: `Great job! ${challenge.explanation}`
        });
        toast.success('Bug fixed successfully!');
      } else {
        setResult({
          success: false,
          explanation: 'Not quite right yet. The code still fails on the hidden test cases. Try to look at it from another angle.'
        });
        toast.error('The bug is still present.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 lg:h-[calc(100dvh-120px)] flex flex-col">
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <RiBugLine className="text-white text-xl" />
            </div>
            Debugging Challenges
          </h1>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Identify subtle bugs in existing code snippets, fix them, and understand the root cause with AI explanations.
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
          {['all', 'easy', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${difficulty === level ? 'bg-white dark:bg-neutral-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
            >
              {level}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        
        {/* Left pane: Problem & Result */}
        <motion.div 
          {...fadeInUp}
          className="rounded-2xl border flex flex-col h-[40dvh] lg:h-full overflow-y-auto no-scrollbar relative"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="p-5 space-y-6 relative">
            {isGenerating || !challenge ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <RiLoader4Line className="text-3xl text-primary-500 animate-spin" />
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Generating dynamic debugging challenge...</p>
              </div>
            ) : (
              <>
                {/* Challenge Info */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-mono text-xs font-bold rounded uppercase">
                      {challenge.language}
                    </span>
                    <span className={`px-2 py-1 font-mono text-xs font-bold rounded uppercase ${
                      challenge.difficulty === 'easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                      challenge.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                      'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {challenge.difficulty}
                    </span>
                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                      Challenge {sessionQuestionNumber}: {challenge.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(challenge.description) }}
                  />
                </div>

            {/* AI Explanation Result */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, scaleY: 0, y: -10 }} 
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${result.success ? 'bg-success/5 border-success/30' : 'bg-error/5 border-error/30'}`}
                  style={{ transformOrigin: 'top' }}
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold mb-2">
                      {result.success ? (
                        <><RiCheckDoubleLine className="text-success text-lg" /> <span className="text-success">Bug Resolved</span></>
                      ) : (
                        <><RiBugLine className="text-error text-lg" /> <span className="text-error">Bug Still Present</span></>
                      )}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(result.explanation) }}
                    />
                  </div>
                  
                  {result.success && (
                    <button
                      onClick={handleNextChallenge}
                      className="px-4 py-2 rounded-lg text-sm font-bold bg-success text-white shadow-md hover:bg-green-600 transition-colors whitespace-nowrap self-end sm:self-auto"
                    >
                      Next Challenge →
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </>
            )}

          </div>
        </motion.div>

        {/* Right pane: Editor */}
        <motion.div 
          {...fadeInUp} transition={{ delay: 0.1 }}
          className="rounded-2xl border flex flex-col h-[50dvh] lg:h-full overflow-hidden"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <RiCodeBoxLine className="text-primary-500" /> Source Code
            </h3>
            
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium gradient-bg text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <>
                  <RiPlayLine size={16} /> Run Tests
                </>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0 relative">
            {isGenerating || !challenge ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <RiLoader4Line className="text-3xl text-neutral-300 dark:text-neutral-700 animate-spin" />
              </div>
            ) : (
              <Editor
                height="100%"
                language={challenge.language?.toLowerCase()}
                value={code}
                onChange={(val) => setCode(val || '')}
                theme={isDark ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: isMobile ? 13 : 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  roundedSelection: true,
                  padding: { top: 16 },
                  tabSize: 2,
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

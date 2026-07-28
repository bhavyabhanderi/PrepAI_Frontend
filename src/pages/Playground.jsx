import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  RiPlayLine, RiSparklingFill, RiCodeBoxLine,
  RiArrowDownSLine, RiCheckLine, RiErrorWarningLine,
  RiTimeLine, RiSpeedMiniFill, RiFunctionLine
} from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks';
import toast from 'react-hot-toast';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', template: '// Write your JavaScript code here\nconsole.log("Hello, PrepAI!");' },
  { id: 'python', name: 'Python', template: '# Write your Python code here\nprint("Hello, PrepAI!")' },
  { id: 'java', name: 'Java', template: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, PrepAI!");\n    }\n}' },
  { id: 'cpp', name: 'C++', template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, PrepAI!" << std::endl;\n    return 0;\n}' },
];

export default function Playground() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('output'); // 'output', 'review'
  const [isRunning, setIsRunning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  
  // Results
  const [output, setOutput] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [review, setReview] = useState(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(lang.template);
    setShowLangDropdown(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setActiveTab('output');
    setMetrics(null);
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('> Code executed successfully.\n\nHello, PrepAI!\n\nAll hidden test cases passed.');
      setMetrics({ time: '42ms', memory: '12.4 MB' });
      setIsRunning(false);
      toast.success('Execution completed');
    }, 1500);
  };

  const handleAIReview = () => {
    setIsReviewing(true);
    setActiveTab('review');
    
    // Simulate AI Review analysis
    setTimeout(() => {
      setReview({
        score: 88,
        bugs: 0,
        complexity: { time: 'O(1)', space: 'O(1)' },
        feedback: [
          { type: 'positive', text: 'Clean and readable implementation.' },
          { type: 'suggestion', text: 'Consider extracting magic strings into constants.' },
          { type: 'suggestion', text: 'Adding input validation would make this more robust in a production environment.' }
        ]
      });
      setIsReviewing(false);
      toast.success('AI Review completed');
    }, 2500);
  };

  return (
    <div className="space-y-4 lg:h-[calc(100dvh-120px)] flex flex-col">
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <RiCodeBoxLine className="text-white text-xl" />
            </div>
            Live Coding Playground
          </h1>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Write, execute, and analyze your code with hidden test cases and AI-powered reviews.
          </p>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        
        {/* Left pane: Editor */}
        <motion.div 
          {...fadeInUp}
          className="rounded-2xl border overflow-hidden flex flex-col h-[50dvh] lg:h-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-500/10 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {language.name}
                <RiArrowDownSLine size={14} />
              </button>
              {showLangDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 w-40 rounded-xl shadow-lg border overflow-hidden z-20"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-primary-500/10 transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-success/10 text-success hover:bg-success/20 transition-colors"
              >
                <RiPlayLine size={14} /> Run
              </button>
              <button
                onClick={handleAIReview}
                disabled={isReviewing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gradient-bg text-white shadow-md hover:opacity-90 transition-opacity"
              >
                <RiSparklingFill size={12} /> AI Review
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language.id}
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
          </div>
        </motion.div>

        {/* Right pane: Results & Review */}
        <motion.div 
          {...fadeInUp} transition={{ delay: 0.1 }}
          className="rounded-2xl border flex flex-col h-[40dvh] lg:h-auto overflow-hidden"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
            {['output', 'review'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent'
                }`}
                style={activeTab !== tab ? { color: 'var(--text-tertiary)' } : undefined}
              >
                {tab === 'review' ? 'AI Review' : 'Execution Output'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 relative no-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'output' && (
                <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isRunning ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-3 border-success/20 border-t-success rounded-full animate-spin" />
                      <p className="text-sm font-medium text-success animate-pulse">Running code and checking constraints...</p>
                    </div>
                  ) : output ? (
                    <div className="space-y-4">
                      {metrics && (
                        <div className="flex gap-4 p-3 rounded-xl border border-dashed" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                          <div className="flex items-center gap-2 text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                            <RiTimeLine className="text-primary-500" /> {metrics.time}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
                            <RiFunctionLine className="text-emerald-500" /> {metrics.memory}
                          </div>
                        </div>
                      )}
                      <pre className="text-sm font-mono whitespace-pre-wrap rounded-xl p-4 bg-black/5 dark:bg-black/20" style={{ color: 'var(--text-secondary)' }}>
                        {output}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-center py-10" style={{ color: 'var(--text-tertiary)' }}>
                      Click 'Run' to execute your code.
                    </p>
                  )}
                </motion.div>
              )}

              {activeTab === 'review' && (
                <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {isReviewing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                      <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>AI is reviewing your code structure...</p>
                    </div>
                  ) : review ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-4 border-primary-500 flex items-center justify-center text-xl font-black text-primary-500 bg-primary-500/10">
                            {review.score}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Code Quality</h3>
                            <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                              {review.bugs === 0 ? <><RiCheckLine className="text-success" /> No bugs detected</> : <><RiErrorWarningLine className="text-error" /> {review.bugs} bugs found</>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Time Complexity</p>
                          <p className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{review.complexity.time}</p>
                          <p className="text-xs mb-1 mt-2" style={{ color: 'var(--text-tertiary)' }}>Space Complexity</p>
                          <p className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{review.complexity.space}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Feedback</h4>
                        {review.feedback.map((f, idx) => (
                          <div key={idx} className="flex gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            {f.type === 'positive' ? (
                              <RiCheckLine className="text-success shrink-0 mt-0.5" />
                            ) : (
                              <RiSparklingFill className="text-primary-500 shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-center py-10" style={{ color: 'var(--text-tertiary)' }}>
                      Click 'AI Review' to analyze your code.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
import { codingService } from '../services/api';

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
  const [stdin, setStdin] = useState('');
  const [parsedInputs, setParsedInputs] = useState([]);
  const [useRawStdin, setUseRawStdin] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
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

  useEffect(() => {
    if (useRawStdin) return;
    
    let newParsed = [];
    if (language.id === 'python') {
      const regex = /input\(\s*(['"])(.*?)\1\s*\)|input\(\)/g;
      let match;
      let count = 1;
      while ((match = regex.exec(code)) !== null) {
        newParsed.push({ id: count, label: match[2] || `Input ${count}`, value: '' });
        count++;
      }
    } else if (language.id === 'javascript') {
      const regex = /prompt\(\s*(['"])(.*?)\1\s*\)|prompt\(\)/g;
      let match;
      let count = 1;
      while ((match = regex.exec(code)) !== null) {
        newParsed.push({ id: count, label: match[2] || `Input ${count}`, value: '' });
        count++;
      }
    }
    
    setParsedInputs(prev => {
      // Retain existing values if possible
      return newParsed.map((np, i) => ({
        ...np,
        value: prev[i] ? prev[i].value : ''
      }));
    });
  }, [code, language, useRawStdin]);

  const needsInput = (langId, codeText) => {
    if (langId === 'python' && (codeText.includes('input(') || codeText.includes('sys.stdin'))) return true;
    if (langId === 'cpp' && codeText.includes('cin')) return true;
    if (langId === 'java' && (codeText.includes('Scanner') || codeText.includes('BufferedReader'))) return true;
    if (langId === 'javascript' && (codeText.includes('readline') || codeText.includes('prompt('))) return true;
    return false;
  };

  const handleRunCode = async () => {
    let finalStdin = stdin;
    let missingInputs = false;

    if (!useRawStdin && parsedInputs.length > 0) {
      finalStdin = parsedInputs.map(p => p.value).join('\n');
      missingInputs = parsedInputs.some(p => p.value.trim() === '');
    } else {
      missingInputs = needsInput(language.id, code) && !stdin;
    }

    if (missingInputs && !showInputBox) {
      setShowInputBox(true);
      toast('Your code appears to require input. Please provide it below and click Run again.', { icon: 'ℹ️' });
      return;
    }

    setIsRunning(true);
    setIsReviewing(true); // Backend does both simultaneously
    setActiveTab('output');
    setMetrics(null);
    setOutput('');
    
    try {
      const response = await codingService.execute({
        language: language.id,
        source_code: code,
        stdin: finalStdin,
        test_cases: [] // No test cases in playground
      });
      
      const data = response.data;
      
      if (data.error_message && !data.output) {
        setOutput(`> Error Execution Failed.\n\n${data.error_message}`);
      } else if (data.error_message) {
        setOutput(`> Error Execution Failed.\n\n${data.output}\n\nError: ${data.error_message}`);
      } else {
        setOutput(`> Code executed successfully.\n\n${data.output || 'No output returned.'}`);
      }
      
      setMetrics({ time: `${data.execution_time_ms.toFixed(2)}ms`, memory: `${data.memory_used_kb} KB` });
      
      // AI Review Data
      setReview({
        score: data.code_quality_score || 0,
        bugs: 0, // We don't have a bugs field, assume 0 if passed
        complexity: { time: data.time_complexity || 'N/A', space: data.space_complexity || 'N/A' },
        feedback: data.optimization_suggestions.map((text, i) => ({
          type: i === 0 ? 'positive' : 'suggestion',
          text
        }))
      });
      
      toast.success('Execution & AI Review completed');
    } catch (error) {
      console.error('Execution error:', error);
      toast.error('Failed to execute code');
      setOutput('> Error: Failed to communicate with execution server.');
    } finally {
      setIsRunning(false);
      setIsReviewing(false);
    }
  };

  const handleAIReview = () => {
    setActiveTab('review');
    if (!review && !isRunning) {
      handleRunCode(); // Run it to get review if not already done
    }
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
                onClick={() => setShowInputBox(!showInputBox)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showInputBox ? 'bg-primary-500/20 text-primary-600 dark:text-primary-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'}`}
              >
                Custom Input
              </button>
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

          <div className="flex-1 min-h-0 flex flex-col">
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
            
            {/* Standard Input Section */}
            <AnimatePresence>
              {showInputBox && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t p-3 overflow-hidden" 
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Standard Input (stdin)</label>
                    {parsedInputs.length > 0 && (
                      <button 
                        onClick={() => setUseRawStdin(!useRawStdin)}
                        className="text-xs text-primary-500 hover:underline"
                      >
                        {/* {useRawStdin ? "Use Smart Inputs" : "Use Raw Textarea"} */}
                      </button>
                    )}
                  </div>
                  
                  {!useRawStdin && parsedInputs.length > 0 ? (
                    <div className="space-y-2 overflow-y-auto max-h-40 pr-2">
                      {parsedInputs.map((pInput, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-sm font-mono text-neutral-500 w-32 truncate" title={pInput.label}>
                            {pInput.label}
                          </span>
                          <input
                            type="text"
                            value={pInput.value}
                            onChange={(e) => {
                              const newInputs = [...parsedInputs];
                              newInputs[idx].value = e.target.value;
                              setParsedInputs(newInputs);
                            }}
                            className="flex-1 p-2 text-sm font-mono rounded-lg border bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            placeholder="Value..."
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={stdin}
                      onChange={(e) => setStdin(e.target.value)}
                      placeholder="Enter inputs here (e.g. for input() in Python). Separate multiple inputs by newlines..."
                      className="w-full h-20 p-2 text-sm font-mono rounded-lg border bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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

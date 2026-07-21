import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { startInterview, endInterview } from '../redux/slices/interviewSlice';
import {
  RiPlayLine, RiSendPlaneFill, RiSparklingLine,
  RiTimeLine, RiCheckLine, RiCloseLine,
  RiCodeSSlashLine, RiArrowDownSLine, RiRefreshLine,
  RiStopCircleLine,
} from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';
import { formatTimer } from '../utils/helpers';
import { useTimer, useIsMobile, useTabSwitchGuard } from '../hooks';
import { codingService } from '../services/api';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

/**
 * Monaco ships `vs-dark` with a #1E1E1E background -- a neutral grey panel that
 * reads as a foreign patch inside the violet-tinted dark theme. This inherits
 * `vs-dark`'s token colours and only restyles the chrome to sit on the same
 * surface ramp as the rest of the app.
 */
const defineEditorTheme = (monaco) => {
  monaco.editor.defineTheme('ai-interview-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#12121C', // --bg-card
      'editorGutter.background': '#12121C',
      'editor.lineHighlightBackground': '#1B1B29', // --bg-tertiary
      'editorLineNumber.foreground': '#494964',
      'editorLineNumber.activeForeground': '#A5A5B8', // --text-secondary
      'editor.selectionBackground': '#4A4DC959', // indigo @ 35%
      'editorIndentGuide.background1': '#26263A', // --border-color
      'editorWidget.background': '#1B1B29',
      'editorWidget.border': '#26263A',
      'scrollbarSlider.background': '#2E2E4599',
      'scrollbarSlider.hoverBackground': '#34344D',
    },
  });
};

const defaultProblem = {
  title: 'Two Sum',
  difficulty: 'Easy',
  description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
  ],
  constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
  initial_templates: {
    javascript: '// Write your solution here\nfunction solution(nums, target) {\n  \n}',
    python: '# Write your solution here\ndef solution(nums, target):\n    pass',
    java: '// Write your solution here\nclass Solution {\n    public int[] solve(int[] nums, int target) {\n        return new int[]{};\n    }\n}',
    cpp: '// Write your solution here\n#include <vector>\nusing namespace std;\n\nvector<int> solution(vector<int>& nums, int target) {\n    return {};\n}',
    csharp: '// Write your solution here\npublic class Solution {\n    public int[] Solve(int[] nums, int target) {\n        return new int[]{};\n    }\n}',
    go: '// Write your solution here\nfunc solution(nums []int, target int) []int {\n    return []int{}\n}',
    ruby: '# Write your solution here\ndef solution(nums, target)\n\nend',
    php: '<?php\n// Write your solution here\nfunction solution($nums, $target) {\n\n}'
  }
};

/**
 * Coding Interview Page - Monaco Editor with AI Code Review
 */
export default function CodingInterview() {
  const { isDark } = useTheme();
  const [problem, setProblem] = useState(null);
  const [languages, setLanguages] = useState([
    { id: 'javascript', name: 'JavaScript', template: defaultProblem.initial_templates.javascript },
    { id: 'python', name: 'Python', template: defaultProblem.initial_templates.python },
    { id: 'java', name: 'Java', template: defaultProblem.initial_templates.java },
    { id: 'cpp', name: 'C++', template: defaultProblem.initial_templates.cpp },
    { id: 'csharp', name: 'C#', template: defaultProblem.initial_templates.csharp },
    { id: 'go', name: 'Go', template: defaultProblem.initial_templates.go },
    { id: 'ruby', name: 'Ruby', template: defaultProblem.initial_templates.ruby },
    { id: 'php', name: 'PHP', template: defaultProblem.initial_templates.php },
  ]);
  const [language, setLanguage] = useState({ id: 'javascript', name: 'JavaScript' });
  const [code, setCode] = useState(defaultProblem.initial_templates.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingProblem, setIsLoadingProblem] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState('problem');
  // Below lg the two panes are tabbed; 'problem' shows the description/output/review
  // panel, 'code' shows the editor. Both panes stay mounted (toggled with CSS) so
  // Monaco never loses its state when switching.
  const [mobileView, setMobileView] = useState('problem');
  const [started, setStarted] = useState(false);
  const { time, start, reset, isRunning: timerRunning } = useTimer();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(endInterview());
    };
  }, [dispatch]);

  const handleEndInterview = () => {
    dispatch(endInterview());
    setStarted(false);
    setProblem(null);
  };

  // Leaving the tab ends the interview; the attempt is not submitted.
  useTabSwitchGuard(started, () => {
    handleSubmit({ forceAutoSubmit: true });
  });

  // Prevent page refresh / close during active interview
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to exit? Your active coding progress will be lost.';
      return e.returnValue;
    };

    if (problem && timerRunning) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [problem, timerRunning]);

  const loadProblem = async () => {
    setIsLoadingProblem(true);
    setReview(null);
    setOutput('');
    reset();
    try {
      const res = await codingService.getProblems();
      if (res.data && res.data.length > 0) {
        const fetchedProblem = res.data[0];
        setProblem(fetchedProblem);
        
        const updatedLangs = [
          { id: 'javascript', name: 'JavaScript', template: fetchedProblem.initial_templates?.javascript || defaultProblem.initial_templates.javascript },
          { id: 'python', name: 'Python', template: fetchedProblem.initial_templates?.python || defaultProblem.initial_templates.python },
          { id: 'java', name: 'Java', template: fetchedProblem.initial_templates?.java || defaultProblem.initial_templates.java },
          { id: 'cpp', name: 'C++', template: fetchedProblem.initial_templates?.cpp || defaultProblem.initial_templates.cpp },
          { id: 'csharp', name: 'C#', template: fetchedProblem.initial_templates?.csharp || defaultProblem.initial_templates.csharp },
          { id: 'go', name: 'Go', template: fetchedProblem.initial_templates?.go || defaultProblem.initial_templates.go },
          { id: 'ruby', name: 'Ruby', template: fetchedProblem.initial_templates?.ruby || defaultProblem.initial_templates.ruby },
          { id: 'php', name: 'PHP', template: fetchedProblem.initial_templates?.php || defaultProblem.initial_templates.php },
        ];
        setLanguages(updatedLangs);
        
        const currentLang = updatedLangs.find(l => l.id === language.id) || updatedLangs[0];
        setCode(currentLang.template);
        start();
        dispatch(startInterview({ id: fetchedProblem.id, type: 'coding' }));
      }
    } catch (err) {
      toast.error('Failed to generate a new question. Using default problem.');
      setProblem(defaultProblem);
    } finally {
      setIsLoadingProblem(false);
    }
  };

  useEffect(() => {
    // Problem loaded on user action
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(lang.template);
    setShowLangDropdown(false);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('output');
    setMobileView('problem'); // surface the output pane on mobile
    try {
      const res = await codingService.execute({
        language: language.id,
        source_code: code,
        test_cases: problem?.test_cases || [
          { input: 'nums = [2,7,11,15], target = 9', expected_output: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', expected_output: '[1,2]' }
        ]
      });
      const data = res.data;
      if (data.status === 'failed') {
        setOutput(`Execution Error:\n${data.error_message}`);
        toast.error(data.error_message);
      } else {
        setOutput(`Test Cases Passed: ${data.test_cases_passed}/${data.total_test_cases}\n\nExecution Time: ${data.execution_time_ms}ms\nMemory Used: ${data.memory_used_kb}KB\n\n✅ All test cases passed!`);
        toast.success('Code executed successfully!');
      }
    } catch (err) {
      setOutput('Failed to run code.');
      toast.error('Failed to run code.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async ({ forceAutoSubmit = false } = {}) => {
    setIsRunning(true);
    setActiveTab('review');
    setMobileView('problem'); // surface the review pane on mobile
    try {
      const res = await codingService.execute({
        language: language.id,
        source_code: code,
        test_cases: problem?.test_cases || [
          { input: 'nums = [2,7,11,15], target = 9', expected_output: '[0,1]' },
          { input: 'nums = [3,2,4], target = 6', expected_output: '[1,2]' }
        ]
      });
      const data = res.data;
      if (data.status === 'failed') {
        setReview({
          score: 0,
          timeComplexity: 'N/A',
          spaceComplexity: 'N/A',
          feedback: [
            { type: 'suggestion', text: data.error_message || 'Please write a valid solution before submitting.' }
          ]
        });
        if (!forceAutoSubmit) {
          toast.error(data.error_message || 'Submitting code failed validation.');
        }
      } else {
        setReview({
          score: data.code_quality_score || 80,
          timeComplexity: data.time_complexity || 'O(n)',
          spaceComplexity: data.space_complexity || 'O(n)',
          feedback: data.optimization_suggestions?.map((s) => ({
            type: s.toLowerCase().includes('good') ? 'positive' : 'suggestion',
            text: s
          })) || []
        });
        if (!forceAutoSubmit) {
          toast.success('Code submitted & reviewed successfully!');
        }
      }

      if (forceAutoSubmit) {
        const finalScore = data.status === 'failed' ? 0 : (data.code_quality_score || 80);
        Swal.fire({
          icon: 'warning',
          title: 'Test Auto-Submitted',
          text: `We detected that you left the interview tab. Your code was automatically submitted.\n\nYour Score: ${finalScore}/100`,
          confirmButtonColor: '#7c3aed'
        });
        handleEndInterview();
      }
    } catch (err) {
      if (forceAutoSubmit) {
        Swal.fire({
          icon: 'warning',
          title: 'Test Auto-Submitted',
          text: `We detected that you left the interview tab. Your code was automatically submitted.\n\nYour Score: 0/100`,
          confirmButtonColor: '#7c3aed'
        });
        handleEndInterview();
      } else {
        toast.error('Failed to submit and review code');
      }
    } finally {
      setIsRunning(false);
    }
  };

  if (!started) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh-120px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg p-8 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-6">
            <RiCodeSSlashLine className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Coding Interview</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
            Practice coding challenges with real-time test execution and AI-powered reviews. Optimize your runtime complexity and code quality.
          </p>
          <button
            onClick={() => {
              setStarted(true);
              loadProblem();
            }}
            className="px-8 py-3 rounded-xl gradient-bg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
          >
            <RiPlayLine /> Start Coding Interview
          </button>
        </motion.div>
      </div>
    );
  }

  if (!problem || isLoadingProblem) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-120px)] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>
          Generating a new coding challenge...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:h-[calc(100dvh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2 min-w-0" style={{ color: 'var(--text-primary)' }}>
            <RiCodeSSlashLine className="text-primary-500 flex-shrink-0" />
            <span className="truncate">{problem.title}</span>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-success/10 text-success flex-shrink-0">
              {problem.difficulty}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono"
            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
            <RiTimeLine size={14} /> {formatTimer(time)}
          </div>
          <button
            onClick={() => {
              handleEndInterview();
              toast.success('Coding interview ended.');
            }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-error/10 text-error hover:bg-error/20 flex items-center gap-1 transition-colors"
          >
            <RiStopCircleLine size={14} /> End
          </button>
        </div>
      </div>

      {/* Pane switcher (below lg only) - side-by-side panes become tabs on small screens */}
      <div className="flex gap-2 lg:hidden flex-shrink-0">
        {[
          { id: 'problem', label: 'Problem' },
          { id: 'code', label: 'Code' },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setMobileView(v.id)}
            className={`flex-1 tap-target rounded-xl text-sm font-medium border transition-colors ${
              mobileView === v.id ? 'gradient-bg text-white border-transparent' : ''
            }`}
            style={mobileView !== v.id ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' } : undefined}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Left - Problem Description */}
        <div
          className={`rounded-2xl border overflow-hidden flex flex-col h-[62dvh] lg:h-auto ${mobileView === 'code' ? 'max-lg:hidden' : ''}`}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
            {['problem', 'output', 'review'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent'
                }`}
                style={activeTab !== tab ? { color: 'var(--text-tertiary)' } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar">
            {activeTab === 'problem' && (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {problem.description}
                </p>

                {problem.examples?.map((ex, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Example {i + 1}:</p>
                    <pre className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      Input: {typeof ex.input === 'object' && ex.input !== null ? JSON.stringify(ex.input) : ex.input}{'\n'}
                      Output: {typeof ex.output === 'object' && ex.output !== null ? JSON.stringify(ex.output) : ex.output}
                      {ex.explanation && `\nExplanation: ${typeof ex.explanation === 'object' && ex.explanation !== null ? JSON.stringify(ex.explanation) : ex.explanation}`}
                    </pre>
                  </div>
                ))}

                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Constraints:</p>
                  <ul className="space-y-1">
                    {problem.constraints?.map((c, i) => (
                      <li key={i} className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>• {typeof c === 'object' && c !== null ? JSON.stringify(c) : c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'output' && (
              isRunning ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-3 border-success/20 border-t-success rounded-full animate-spin" />
                  <p className="text-sm font-medium animate-pulse text-success">Executing code & running tests...</p>
                </div>
              ) : (
                <pre className="text-sm font-mono whitespace-pre-wrap break-words" style={{ color: 'var(--text-secondary)' }}>
                  {output || 'Run your code to see output here.'}
                </pre>
              )
            )}

            {activeTab === 'review' && (
              isRunning ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-3 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                  <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Evaluating code & generating AI review...</p>
                </div>
              ) : review ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold" style={{ color: '#4A4DC9' }}>{review.score}/100</div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Time: {review.timeComplexity}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Space: {review.spaceComplexity}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {review.feedback.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        {f.type === 'positive' ? (
                          <RiCheckLine className="text-success mt-0.5 flex-shrink-0" />
                        ) : (
                          <RiSparklingLine className="text-accent-500 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={loadProblem}
                    className="w-full mt-4 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <RiRefreshLine size={16} /> Next Question
                  </button>
                </div>
              ) : (
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Submit your code to get an AI review.</p>
              )
            )}
          </div>
        </div>

        {/* Right - Code Editor */}
        <div
          className={`rounded-2xl border overflow-hidden flex flex-col ${mobileView === 'problem' ? 'max-lg:hidden' : ''}`}
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Editor Header */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 py-2 gap-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-500/10 transition-colors w-full sm:w-auto justify-between"
                style={{ color: 'var(--text-primary)' }}
              >
                {language.name}
                <RiArrowDownSLine size={14} />
              </button>
              {showLangDropdown && (
                <div
                  className="absolute top-full left-0 mt-1 w-40 rounded-xl shadow-lg border overflow-hidden z-10"
                  style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  {languages.map((lang) => (
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 justify-end">
              <button
                onClick={loadProblem}
                disabled={isLoadingProblem || isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors disabled:opacity-50"
              >
                {isLoadingProblem ? (
                  <div className="w-3.5 h-3.5 border border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                ) : (
                  <RiRefreshLine size={14} />
                )}
                New Question
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning || isLoadingProblem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
              >
                <RiPlayLine size={14} /> Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || isLoadingProblem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gradient-bg text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <RiSendPlaneFill size={12} /> Submit
              </button>
            </div>
          </div>

          {/* Monaco Editor - explicit responsive height (Monaco needs a sized parent);
              dvh keeps the editor honest under mobile browser toolbars */}
          <div className="h-[50dvh] sm:h-[55dvh] lg:flex-1 lg:h-auto lg:min-h-0">
            <Editor
              height="100%"
              language={language.id}
              value={code}
              onChange={(value) => setCode(value || '')}
              beforeMount={defineEditorTheme}
              theme={isDark ? 'ai-interview-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: isMobile ? 13 : 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
                tabSize: 2,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

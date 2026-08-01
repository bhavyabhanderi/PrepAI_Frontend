import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  RiDatabase2Line, RiPlayLine, RiTableLine,
  RiCheckDoubleLine, RiKey2Line, RiSparklingFill,
  RiLoader4Line
} from 'react-icons/ri';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks';
import toast from 'react-hot-toast';
import { codingService } from '../services/api';
import { parseMarkdown } from '../utils/helpers';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function SQLPractice() {
  const { isDark } = useTheme();
  const isMobile = useIsMobile();
  const [difficulty, setDifficulty] = useState('all');
  
  const [sessionQuestionNumber, setSessionQuestionNumber] = useState(1);
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('-- Write your SQL query here\n');
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);

  const fetchQuestion = async (diff) => {
    try {
      setIsGenerating(true);
      setResults(null);
      const apiDiff = diff === 'all' ? 'medium' : diff; // AI endpoint expects specific difficulty
      const response = await codingService.getSqlProblems(apiDiff);
      const newQuestion = response.data[0];
      setQuestion(newQuestion);
      setCode(`-- Write your SQL query here\n\n`);
    } catch (error) {
      console.error('Error fetching question:', error);
      toast.error('Failed to generate question.');
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchQuestion(difficulty);
  }, []);

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    setSessionQuestionNumber(1);
    fetchQuestion(newDiff);
  };

  const handleNextQuestion = () => {
    setSessionQuestionNumber(prev => prev + 1);
    fetchQuestion(difficulty);
  };

  const handleRunQuery = () => {
    setIsRunning(true);
    setResults(null);
    
    // Simulate query execution
    setTimeout(() => {
      setResults(question.mockResults);
      setIsRunning(false);
      toast.success('Query executed successfully');
    }, 1200);
  };

  return (
    <div className="space-y-4 lg:h-[calc(100dvh-120px)] flex flex-col">
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <RiDatabase2Line className="text-white text-xl" />
            </div>
            SQL Interview Practice
          </h1>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Write complex SQL queries, analyze schema relationships, and receive AI optimization tips.
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        
        {/* Left pane: Database Schema (3 cols) */}
        <motion.div 
          {...fadeInUp}
          className="rounded-2xl border flex flex-col lg:col-span-3 h-[40dvh] lg:h-auto overflow-hidden"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <RiTableLine className="text-primary-500" /> Current Question
            </h3>
            <button 
              onClick={handleNextQuestion}
              className="text-xs font-semibold px-2 py-1 rounded bg-primary-500/10 text-primary-600 dark:text-primary-400 hover:bg-primary-500/20 transition-colors"
            >
              Next Question
            </button>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto relative">
            {isGenerating || !question ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <RiLoader4Line className="text-3xl text-primary-500 animate-spin" />
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Generating dynamic SQL challenge...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Question {sessionQuestionNumber}</h4>
                  <span className={`px-2 py-1 font-mono text-xs font-bold rounded uppercase ${
                    question.difficulty === 'easy' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                    question.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    'bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(question.question) }}
                />
            
            <div className="mt-6 p-4 rounded-xl border border-dashed flex flex-col gap-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Hint</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(question.hint) }}
                />
              </div>

                {question.tables.map((table, idx) => (
                  <div key={idx} className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                    <div className="bg-primary-500/10 px-3 py-2 font-mono text-sm font-bold text-primary-600 dark:text-primary-400">
                      {table.name}
                    </div>
                    <div className="px-3 py-2 space-y-1">
                      {table.columns.map((col, cIdx) => (
                        <div key={cIdx} className="flex justify-between items-center text-xs font-mono">
                          <span className={`flex items-center gap-1 ${col.isPrimaryKey ? 'font-bold text-neutral-700 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400 pl-4'}`}>
                            {col.isPrimaryKey && <RiKey2Line className="text-amber-500" />}
                            {col.name}
                          </span>
                          <span className="text-neutral-400">
                            {col.type} {col.isPrimaryKey ? 'PK' : col.isForeignKey ? 'FK' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
            )}
          </div>
        </motion.div>

        {/* Right pane: Editor & Output (9 cols) */}
        <div className="lg:col-span-9 flex flex-col gap-4 min-h-0">
          
          {/* Editor */}
          <motion.div 
            {...fadeInUp} transition={{ delay: 0.1 }}
            className="rounded-2xl border flex flex-col flex-1 min-h-[30dvh] lg:min-h-0"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="px-4 py-2 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>SQL Editor</h3>
              <button
                onClick={handleRunQuery}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium gradient-bg text-white shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <RiPlayLine size={16} /> {isRunning ? 'Running...' : 'Run Query'}
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language="sql"
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
                }}
              />
            </div>
          </motion.div>

          {/* Results */}
          <motion.div 
            {...fadeInUp} transition={{ delay: 0.2 }}
            className="rounded-2xl border flex flex-col h-[40dvh] lg:h-64 overflow-hidden flex-shrink-0"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Query Results</h3>
              {results && (
                <span className="text-xs font-mono text-neutral-500">
                  Execution Time: {results.executionTime}
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900 relative">
              {!results ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <RiTableLine className="text-3xl text-neutral-300 dark:text-neutral-700" />
                  <p className="text-sm text-neutral-500">Run a query to see the output here.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 sticky top-0 shadow-sm">
                    <tr>
                      {results.columns.map(col => (
                        <th key={col} className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-neutral-500 border-r border-b dark:border-neutral-700 last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.rows.map((row, i) => (
                      <tr key={i} className="border-b dark:border-neutral-800 last:border-b-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 px-4 text-sm font-mono border-r dark:border-neutral-700 last:border-r-0 text-neutral-700 dark:text-neutral-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* AI Optimization Feedback */}
            {results && (
              <div className="border-t p-3 bg-primary-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-start gap-3">
                  <RiSparklingFill className="text-primary-500 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">AI Optimization Score: {results.optimizationScore}/100</h4>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(results.feedback) }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-500 text-white shadow-md hover:bg-primary-600 transition-colors whitespace-nowrap self-end sm:self-auto"
                >
                  Next Question →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiArrowGoBackLine,
  RiFileList3Line,
  RiRobot2Line,
  RiQuestionnaireLine,
  RiSendPlaneFill,
  RiUser3Line,
  RiRestartLine,
  RiDashboardLine
} from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { syllabusService } from '../services/api';

// Initialize mermaid with settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  flowchart: { htmlLabels: false },
});

// Mermaid block renderer
function MermaidBlock({ code }) {
  const ref = useRef(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Math.random().toString(36).substring(2, 10)}`;
    
    // First validate the syntax using mermaid.parse
    // If it's invalid, this will throw and we can catch it silently WITHOUT mermaid drawing global errors
    mermaid.parse(code, { suppressErrors: true })
      .then(() => mermaid.render(id, code))
      .then(({ svg: renderedSvg }) => {
        if (!cancelled) {
          if (renderedSvg.toLowerCase().includes('syntax error')) {
             setSvg('');
          } else {
             setSvg(renderedSvg);
          }
        }
      })
      .catch((e) => {
        if (!cancelled) setSvg('');
      })
      .finally(() => {
        // Mermaid sometimes leaves stray error elements in the DOM (like 'd'+id) when it crashes
        const sandbox = document.getElementById('d' + id);
        if (sandbox) sandbox.remove();
        
        // Also remove any global error boxes it might have attached to the body
        const errorBoxes = document.querySelectorAll('.mermaid-error');
        errorBoxes.forEach(box => box.remove());
      });

    return () => { cancelled = true; };
  }, [code]);

  if (!svg) {
    // Silent fallback to a nice code block if Mermaid fails to parse the AI's syntax
    return (
      <div className="my-4 rounded-xl border p-4 overflow-x-auto bg-[var(--bg-tertiary)]" style={{ borderColor: 'var(--border-color)' }}>
        <pre className="font-mono text-[13px] whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-diagram overflow-x-auto w-full my-6 rounded-xl border p-4 bg-[var(--bg-tertiary)]/30" 
      style={{ borderColor: 'var(--border-color)' }}
      dangerouslySetInnerHTML={{ __html: svg }} 
    />
  );
}

function NotesTab({ topic }) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Removed auto-generate useEffect so user can click a button instead

  const generateNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const promptMessage = `You are an expert tutor creating premium study notes. Generate the ultimate, comprehensive study guide for the topic: "${topic}".

CRITICAL FORMATTING RULES — follow these exactly:
1. Use markdown headings (## and ###) to structure sections clearly.
2. Make all **key terms**, **definitions**, and **important concepts** bold.
3. Use bullet points and numbered lists for step-by-step explanations.
4. Use markdown tables (with | and ---) to compare concepts, list properties, or show data.
5. For any process flow, architecture, or relationship diagram, use Mermaid diagram syntax inside a \`\`\`mermaid code block. Examples:
   - Use "graph TD" for top-down flowcharts
   - Use "graph LR" for left-right flowcharts
   - CRITICAL MERMAID RULE: You MUST wrap all node labels in quotes if they contain spaces or special characters! Example: \`A["This is a label (with parens)"] --> B["Another label"]\`. Never use unquoted text with parentheses.
6. Provide real-world examples with practical calculations where applicable.
7. Add formulas in bold or inline code.
8. Separate major sections with horizontal rules (---).
9. Use blockquotes (>) for important tips or key takeaways.
10. Use plenty of whitespace between sections.

Generate deep, accurate, and visually rich notes that a student can use as their primary study material.`;

      const res = await syllabusService.chat({
        topic,
        message: promptMessage,
        history: []
      });
      setNotes(res.data.response);
    } catch (err) {
      console.error(err);
      setError('Failed to generate notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Custom code renderer for mermaid
  const codeRenderer = useCallback(({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (language === 'mermaid') {
      return <MermaidBlock code={String(children).replace(/\n$/, '')} />;
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Generating AI notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-error mb-4">{error}</p>
        <button onClick={generateNotes} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:opacity-90 transition-opacity">Try Again</button>
      </div>
    );
  }

  if (!notes) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border bg-white dark:bg-gray-800" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4">
          <RiFileList3Line size={32} className="text-primary-500" />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Generate AI Notes</h3>
        <p className="text-sm max-w-md mb-6" style={{ color: 'var(--text-tertiary)' }}>
          Get comprehensive study notes for <strong>{topic}</strong>, including definitions, flowcharts, tables, and real-world examples.
        </p>
        <button 
          onClick={generateNotes} 
          className="px-6 py-3 gradient-bg text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/20"
        >
          Generate Best Notes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={generateNotes} 
          className="text-sm flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 transition-colors font-medium"
        >
          <RiRestartLine size={16} /> Regenerate Notes
        </button>
      </div>
      <div className="p-8 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="ai-notes-content max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: codeRenderer,
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-6 rounded-xl border border-[var(--border-color)]">
                  <table {...props} className="w-full min-w-[600px]" />
                </div>
              ),
            }}
          >
            {notes}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function TutorTab({ topic }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Artificial delay for UX
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitializing && topic && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi there! I'm your AI tutor for **${topic}**. What would you like to know about this topic?`
        }
      ]);
    }
  }, [topic, isInitializing, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputMessage.trim() };
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = currentHistory.map(m => ({ role: m.role, content: m.content }));
      
      const res = await syllabusService.chat({
        topic,
        message: userMsg.content,
        history
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! I encountered an error while thinking. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[600px] rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-6" />
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Starting AI Tutor...</h3>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Preparing learning environment for {topic}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] rounded-2xl overflow-hidden border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-500/20' : 'gradient-bg'}`}>
                {isUser ? <RiUser3Line size={16} className="text-primary-500" /> : <RiRobot2Line size={16} className="text-white" />}
              </div>
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm overflow-hidden ${
                  isUser 
                    ? 'bg-primary-500 text-white rounded-tr-none whitespace-pre-wrap' 
                    : 'border rounded-tl-none'
                }`}
                style={!isUser ? { backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } : {}}
              >
                {isUser ? (
                  msg.content
                ) : (
                  <div className="prose-sm max-w-none dark:prose-invert prose-primary [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>h1]:font-bold [&>h1]:text-lg [&>h2]:font-bold [&>h2]:text-base [&>h3]:font-bold [&>h3]:text-sm [&>strong]:font-bold [&>strong]:text-primary-500">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
              <RiRobot2Line size={16} className="text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-none px-4 py-3 border flex items-center gap-1.5" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t shrink-0" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about this topic..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 rounded-xl border text-sm focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50 bg-transparent"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <button 
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg text-white gradient-bg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <RiSendPlaneFill size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function PracticeTab({ topic }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (topic && questions.length === 0 && !loading && !error) {
      generateMCQs();
    }
  }, [topic]);

  const generateMCQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `You are a test generator. Create exactly 10 completely new and unique multiple choice questions for the topic: "${topic}". 
Ensure they test different concepts and do not repeat typical examples.
Respond ONLY with a valid JSON array of objects. Do not include markdown code blocks or any other text.
Each object must have this exact structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0,
    "explanation": "Why this is correct"
  }
]`;

      const res = await syllabusService.chat({
        topic,
        message: prompt,
        history: []
      });

      let jsonStr = res.data.response.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error('Invalid JSON format returned');
      }
      setQuestions(parsed);
      
      // Reset state for new quiz
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
      setIsFinished(false);
    } catch (err) {
      console.error(err);
      setError('Failed to generate practice questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIdx) => {
    if (showExplanation) return;
    setSelectedOption(optIdx);
    setShowExplanation(true);
    
    if (optIdx === questions[currentIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4" />
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Generating 10 new MCQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-error mb-4">{error}</p>
        <button onClick={generateMCQs} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:opacity-90 transition-opacity">Try Again</button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  if (isFinished) {
    return (
      <div className="p-8 rounded-2xl border text-center bg-white dark:bg-gray-800" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Practice Complete!
        </h3>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your Score: <span className="font-bold text-primary-500">{score}</span> out of {questions.length}
        </p>
        <button
          onClick={generateMCQs}
          className="px-6 py-3 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/20"
        >
          Practice Again (New Questions)
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-primary-500 bg-primary-500/10 px-3 py-1.5 rounded-lg border border-primary-500/20">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          Score: {score}
        </span>
      </div>
      
      <div className="p-6 rounded-2xl border bg-white dark:bg-gray-800" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          {currentQ.question}
        </h3>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = showExplanation && optIdx === currentQ.correctAnswerIndex;
            const isWrong = showExplanation && isSelected && optIdx !== currentQ.correctAnswerIndex;
            
            let borderClass = 'border-[var(--border-color)]';
            let bgClass = 'bg-[var(--bg-tertiary)]';
            
            if (showExplanation) {
              if (isCorrect) {
                borderClass = 'border-green-500';
                bgClass = 'bg-green-500/10 text-green-700 dark:text-green-400';
              } else if (isWrong) {
                borderClass = 'border-red-500';
                bgClass = 'bg-red-500/10 text-red-700 dark:text-red-400';
              }
            } else if (isSelected) {
              borderClass = 'border-primary-500';
              bgClass = 'bg-primary-500/10 text-primary-500';
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-xl border transition-all ${borderClass} ${bgClass} ${!showExplanation ? 'hover:border-primary-400 hover:bg-black/5 dark:hover:bg-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${isCorrect ? 'bg-green-500 border-green-500 text-white' : isWrong ? 'bg-red-500 border-red-500 text-white' : 'border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                    {String.fromCharCode(65 + optIdx)}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        {showExplanation && (
          <div className="mt-6 p-5 rounded-xl bg-primary-500/5 border border-primary-500/20 animate-[fadeIn_0.3s_ease-out]">
            <p className="text-sm font-bold text-primary-500 mb-2 uppercase tracking-wider">Explanation</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{currentQ.explanation}</p>
            
            <button
              onClick={handleNextQuestion}
              className="mt-6 w-full py-3.5 rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ topic, onSelectTab }) {
  const cards = [
    {
      id: 'notes',
      title: 'AI Notes',
      description: 'Generate comprehensive, premium study notes with flowcharts, tables, and bold key terms.',
      icon: RiFileList3Line,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10'
    },
    {
      id: 'tutor',
      title: 'AI Tutor',
      description: 'Chat with an intelligent tutor to clarify doubts, explain concepts, and dive deeper into the topic.',
      icon: RiRobot2Line,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      id: 'practice',
      title: 'Practice Test',
      description: 'Test your knowledge with an interactive 10-question MCQ quiz with detailed explanations.',
      icon: RiQuestionnaireLine,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      {cards.map(card => (
        <button
          key={card.id}
          onClick={() => onSelectTab(card.id)}
          className="flex flex-col text-left p-6 rounded-2xl border transition-all hover:border-primary-500 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ${card.bg}`}>
            <card.icon size={28} className={card.color} />
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{card.title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {card.description}
          </p>
          <div className="mt-6 font-semibold text-primary-500 flex items-center gap-2 text-sm mt-auto group">
            Open {card.title}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function TopicDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topic = searchParams.get('topic') || '';
  const subject = searchParams.get('subject') || '';
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'notes', 'tutor', 'practice'

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[calc(100vh-100px)]">
        <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No topic selected.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 gradient-bg text-white rounded-lg flex items-center gap-2 mx-auto"
        >
          <RiArrowGoBackLine /> Go Back
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: RiDashboardLine },
    { id: 'notes', label: 'AI Notes', icon: RiFileList3Line },
    { id: 'tutor', label: 'AI Tutor', icon: RiRobot2Line },
    { id: 'practice', label: 'Practice', icon: RiQuestionnaireLine }
  ];

  return (
    <div className="space-y-6 mx-auto pb-12 min-h-full w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1.5 -ml-3 rounded-lg hover:bg-primary-500/10 hover:text-primary-500 transition-colors w-fit"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <RiArrowGoBackLine /> Back to Syllabus
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{topic}</h1>
          </div>
          {subject && <p className="text-sm mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Subject: {subject}</p>}
        </div>
      </motion.div>

      <div className="flex border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--border-color)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-primary-500 text-primary-500 bg-primary-500/5' 
                : 'border-transparent hover:text-primary-500 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            style={{ color: activeTab === tab.id ? undefined : 'var(--text-tertiary)' }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-6"
      >
        {activeTab === 'overview' && <OverviewTab topic={topic} onSelectTab={setActiveTab} />}
        {activeTab === 'notes' && <NotesTab topic={topic} />}
        {activeTab === 'tutor' && <TutorTab topic={topic} />}
        {activeTab === 'practice' && <PracticeTab topic={topic} />}
      </motion.div>
    </div>
  );
}

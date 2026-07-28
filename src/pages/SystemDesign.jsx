import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mermaid from 'mermaid';
import {
  RiNodeTree, RiSparklingFill, RiSendPlaneFill,
  RiServerLine, RiDatabase2Line, RiGlobalLine,
  RiCheckDoubleLine
} from 'react-icons/ri';
import toast from 'react-hot-toast';

const fadeInUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function SystemDesign() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram', 'feedback'
  const mermaidRef = useRef(null);

  // Initialize mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#4A4DC9',
        primaryTextColor: '#fff',
        primaryBorderColor: '#34368B',
        lineColor: '#6B7280',
        secondaryColor: '#10b981',
        tertiaryColor: '#fff'
      }
    });
  }, []);

  const MermaidDiagram = ({ chart }) => {
    const containerRef = useRef(null);
  
    useEffect(() => {
      if (!containerRef.current) return;
      
      const renderChart = async () => {
        try {
          containerRef.current.innerHTML = '';
          const id = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          if (containerRef.current) {
             containerRef.current.innerHTML = svg;
          }
        } catch (e) {
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div style="color: red; padding: 20px;">Failed to render: ${e.message}</div>`;
          }
        }
      };
      renderChart();
    }, [chart]);
  
    return <div ref={containerRef} className="w-full flex justify-center py-4 overflow-x-auto" />;
  };

  // Hardcoded mock response for demo
  const mockMermaidSyntax = `
graph TD
    Client["Client Browser / Mobile"] --> LB["Load Balancer"]
    LB --> API1["API Server 1"]
    LB --> API2["API Server 2"]
    API1 --> Cache[("Redis Cache")]
    API2 --> Cache
    API1 --> DB[("Primary PostgreSQL")]
    API2 --> DB
    DB -.-> ReadRep[("Read Replica")]
    API1 --> MQ["Message Queue"]
    MQ --> Worker["Async Workers"]
  `;

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please describe your architecture first.');
      return;
    }
    
    setIsGenerating(true);
    setHasSubmitted(true);
    setActiveTab('diagram');

    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('Architecture evaluated & drawn!');
    }, 2500);
  };

  return (
    <div className="space-y-4 lg:h-[calc(100dvh-120px)] flex flex-col">
      {/* Header */}
      <motion.div {...fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg">
              <RiNodeTree className="text-white text-xl" />
            </div>
            System Design Interview
          </h1>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: 'var(--text-tertiary)' }}>
            Describe your architecture in plain text. PrepAI will draw the diagram and provide scalability feedback.
          </p>
        </div>
        
        {/* Sample Question Box */}
        <div className="px-4 py-2 rounded-xl border flex items-center gap-2" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
          <RiCheckDoubleLine className="text-primary-500" />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Prompt: Design a URL Shortener</span>
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        
        {/* Left pane: Input */}
        <motion.div 
          {...fadeInUp}
          className="rounded-2xl border flex flex-col h-[40dvh] lg:h-auto"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Architecture Description</h3>
          </div>
          <div className="flex-1 p-4 flex flex-col relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Clients connect to a Load Balancer. The LB routes traffic to 3 API servers. The APIs read from a Redis cache. If cache misses, they query a PostgreSQL Primary DB. There is a Read Replica for the DB..."
              className="flex-1 w-full resize-none bg-transparent outline-none text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            />
            
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleSubmit}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl gradient-bg text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-70"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <RiSendPlaneFill size={16} />
                )}
                Evaluate Design
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right pane: Output (Diagram / Feedback) */}
        <motion.div 
          {...fadeInUp} transition={{ delay: 0.1 }}
          className="rounded-2xl border flex flex-col h-[50dvh] lg:h-auto overflow-hidden relative"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
            {['diagram', 'feedback'].map((tab) => (
              <button
                key={tab}
                onClick={() => hasSubmitted && !isGenerating && setActiveTab(tab)}
                disabled={!hasSubmitted || isGenerating}
                className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab 
                    ? 'border-primary-500 text-primary-500' 
                    : 'border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                style={activeTab !== tab ? { color: 'var(--text-tertiary)' } : undefined}
              >
                {tab === 'feedback' ? 'AI Scalability Feedback' : 'Auto-Generated Diagram'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 relative">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/5 dark:bg-black/20">
                  <RiSparklingFill className="text-4xl text-primary-500 animate-pulse" />
                  <p className="text-sm font-medium animate-pulse" style={{ color: 'var(--text-secondary)' }}>Analyzing components and rendering architecture...</p>
                </motion.div>
              ) : !hasSubmitted ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <RiNodeTree className="text-4xl text-neutral-300 dark:text-neutral-700" />
                  <p className="text-sm max-w-xs text-center" style={{ color: 'var(--text-tertiary)' }}>Submit your architecture description to see the generated diagram.</p>
                </motion.div>
              ) : (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                  
                  {/* Diagram Tab */}
                  <div className={`h-full flex flex-col items-center justify-center bg-white dark:bg-neutral-900 rounded-xl border border-dashed ${activeTab === 'diagram' ? 'flex' : 'hidden'}`} style={{ borderColor: 'var(--border-color)' }}>
                    <MermaidDiagram chart={mockMermaidSyntax} />
                  </div>

                  {/* Feedback Tab */}
                  <div className={`h-full space-y-6 ${activeTab === 'feedback' ? 'block' : 'hidden'}`}>
                    
                    {/* Score / Grade */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-success/10 border-2 border-success/30 flex items-center justify-center text-2xl font-black text-success shadow-lg shadow-success/10">
                        A-
                      </div>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>System Scalability</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Solid foundational architecture. Meets basic scaling requirements.</p>
                      </div>
                    </div>

                    {/* Bottlenecks & Suggestions */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Identified Improvements</h4>
                      
                      <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-primary)' }}>
                          <RiDatabase2Line className="text-warning" /> Single Point of Failure (DB)
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          Your PostgreSQL Primary database handles all writes. As traffic scales, this will become a bottleneck. Consider horizontal sharding or partitioning based on region.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-primary)' }}>
                          <RiGlobalLine className="text-primary-500" /> Missing CDN
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          You didn't mention serving static assets. A CDN (Content Delivery Network) should be placed in front of your Load Balancer to reduce origin traffic and improve latency.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                        <div className="flex items-center gap-2 font-bold" style={{ color: 'var(--text-primary)' }}>
                          <RiServerLine className="text-success" /> Good choice on Cache & MQ
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          Using Redis for caching read-heavy paths and a Message Queue for async workers is a standard and robust approach for decoupling heavy tasks.
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

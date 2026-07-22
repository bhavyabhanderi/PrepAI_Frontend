import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiCloseLine, RiSendPlaneFill, RiRobot2Line, RiUser3Line } from 'react-icons/ri';
import ReactMarkdown from 'react-markdown';
import { syllabusService } from '../../services/api';

export default function TopicChatModal({ isOpen, onClose, topic }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && topic) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi there! I'm your AI tutor for **${topic}**. What would you like to know about this topic?`
        }
      ]);
      setInputMessage('');
    }
  }, [isOpen, topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputMessage.trim() };
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Map history to the format expected by backend
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

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden shadow-2xl border"
          style={{ height: '80vh', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                <RiRobot2Line size={20} className="text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>AI Tutor</h3>
                <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>Topic: {topic}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RiCloseLine size={24} />
            </button>
          </div>

          {/* Messages */}
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
                      <div className="prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&>h1]:font-bold [&>h1]:text-lg [&>h2]:font-bold [&>h2]:text-base [&>h3]:font-bold [&>h3]:text-sm [&>strong]:font-bold [&>strong]:text-primary-500">
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

          {/* Input Area */}
          <div className="p-4 border-t shrink-0" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about this topic..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 rounded-xl border text-sm focus:outline-none focus:border-primary-500 transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiCloseLine,
  RiSparklingFill,
  RiBook2Line,
  RiCheckDoubleLine,
  RiTimeLine,
  RiChatSmile3Line,
  RiArrowGoBackLine
} from 'react-icons/ri';
import { syllabusService } from '../services/api';
import TopicChatModal from '../components/common/TopicChatModal';

export default function SyllabusAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syllabusData, setSyllabusData] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  // Saved Syllabi state
  const [savedSyllabi, setSavedSyllabi] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  // Chat state
  const [chatTopic, setChatTopic] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch saved syllabi on mount
  useEffect(() => {
    fetchSavedSyllabi();
  }, []);

  const fetchSavedSyllabi = async () => {
    try {
      setLoadingSaved(true);
      const res = await syllabusService.list();
      setSavedSyllabi(res.data);
    } catch (error) {
      console.error('Failed to fetch saved syllabi:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  // Upload/Dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const handleUploadSyllabus = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await syllabusService.upload(formData);

      setSyllabusData(res.data);
      toast.success('Syllabus successfully analyzed and saved!');
      fetchSavedSyllabi(); // Refresh saved list
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze syllabus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSavedSyllabus = (savedItem) => {
    setSyllabusData(savedItem);
    toast.success(`Loaded ${savedItem.subject}`);
  };

  const handleReset = () => {
    setFile(null);
    setSyllabusData(null);
    setExpandedChapter(null);
  };

  const handleTopicClick = (topic) => {
    setChatTopic(topic);
    setIsChatOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div {...getRootProps()} className="space-y-6 mx-auto pb-12 min-h-full relative">
      <input {...getInputProps()} />
      {isDragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <div className="absolute inset-4 rounded-3xl border-4 border-primary-500 border-dashed" />
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            <RiUploadCloud2Line size={64} className="text-primary-500 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Drop your syllabus here</h2>
            <p className="mt-2" style={{ color: 'var(--text-tertiary)' }}>Release to analyze this file instantly</p>
          </div>
        </div>
      )}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Syllabus Analyzer</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Upload your syllabus PDF and let AI break it down into chapters and topics.</p>
        </div>
        {syllabusData && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2 gradient-bg hover:opacity-90">
            <RiArrowGoBackLine size={18} />
            Back
          </button>
        )}
      </motion.div>

      {!syllabusData ? (
        <div className="flex flex-col gap-6 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="w-full p-6 rounded-2xl border flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>

            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <RiUploadCloud2Line className="text-primary-500" /> Upload New Syllabus
            </h3>

            {!file ? (
              <div onClick={open}
                className={`flex-1 w-full min-h-[16rem] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'hover:border-primary-400'}`}
                style={{ borderColor: isDragActive ? '#4A4DC9' : 'var(--border-color)' }}>
                <RiUploadCloud2Line className="mx-auto mb-4" size={56} style={{ color: isDragActive ? '#4A4DC9' : 'var(--text-tertiary)' }} />
                <p className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{isDragActive ? 'Drop your syllabus here' : 'Drag & drop your syllabus PDF'}</p>
                <span className="mt-2 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity">Browse files</span>
                <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>PDF format only, max 5MB</p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 p-5 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                  <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                    <RiFileTextLine size={24} className="text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{file.name}</p>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => setFile(null)} className="p-2 rounded-lg hover:bg-error/10 text-error transition-colors"><RiCloseLine size={20} /></button>
                </div>

                <div className="p-4 rounded-xl border border-primary-500/20 bg-primary-500/5 flex gap-3">
                  <RiSparklingFill size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-primary-500 mb-1">AI Powered Extraction</p>
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>We'll use advanced NLP models to scan your document, extract the syllabus, and save it to your account.</p>
                  </div>
                </div>

                <button
                  onClick={handleUploadSyllabus}
                  disabled={loading}
                  className="w-full py-3.5 mt-auto rounded-xl text-sm font-semibold gradient-bg text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing & Saving...</>
                  ) : (
                    <><RiSparklingFill size={18} /> Extract Topics & Chapters</>
                  )}
                </button>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="w-full p-6 rounded-2xl border flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <RiBook2Line className="text-primary-500" /> Saved Syllabus
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingSaved ? (
                <div className="col-span-full flex flex-col items-center justify-center h-32 gap-3 opacity-50">
                  <div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Loading saved syllabi...</p>
                </div>
              ) : savedSyllabi.length > 0 ? (
                savedSyllabi.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleLoadSavedSyllabus(item)}
                    className="w-full text-left p-4 rounded-xl border hover:border-primary-500 hover:bg-primary-500/5 transition-all group flex flex-col gap-2"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
                  >
                    <p className="text-sm font-semibold truncate group-hover:text-primary-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {item.subject || 'Unknown Subject'}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                        <RiFileTextLine /> {item.file_name || 'Uploaded File'}
                      </p>
                      <p className="text-[10px] flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full" style={{ color: 'var(--text-secondary)' }}>
                        <RiTimeLine /> {formatDate(item.created_at)}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No saved syllabi</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Upload one to see it here!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <RiBook2Line size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Subject Detected</p>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{syllabusData.subject || 'Unknown Subject'}</h2>
              </div>
            </div>

            <div className="space-y-3">
              {syllabusData.chapters && syllabusData.chapters.map((ch, idx) => {
                const isExpanded = expandedChapter === idx;
                return (
                  <div key={idx} className="rounded-xl border overflow-hidden transition-all duration-300" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={() => setExpandedChapter(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{ch.chapter}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{ch.topics?.length || 0} topics</span>
                        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 pl-[3.25rem] space-y-2">
                            {ch.topics && ch.topics.map((topic, tIdx) => (
                              <button
                                key={tIdx}
                                onClick={() => handleTopicClick(topic)}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-primary-500/30 hover:bg-primary-500/10 transition-all group text-left"
                              >
                                <div className="flex items-start gap-2">
                                  <RiCheckDoubleLine size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm font-medium group-hover:text-primary-500 transition-colors" style={{ color: 'var(--text-secondary)' }}>{topic}</span>
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1 text-[10px] font-bold text-primary-500 bg-primary-500/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                  <RiChatSmile3Line size={12} /> Ask AI
                                </div>
                              </button>
                            ))}
                            {(!ch.topics || ch.topics.length === 0) && (
                              <p className="text-sm italic p-2" style={{ color: 'var(--text-tertiary)' }}>No specific topics detected.</p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {(!syllabusData.chapters || syllabusData.chapters.length === 0) && (
                <div className="p-6 text-center rounded-xl border border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No chapters could be extracted from this document.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Topic Chat Modal */}
      <TopicChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        topic={chatTopic}
      />
    </div>
  );
}

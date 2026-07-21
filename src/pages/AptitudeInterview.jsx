import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiBrainLine, RiCheckLine, RiLoader4Line } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { startInterview, endInterview } from '../redux/slices/interviewSlice';
import { interviewService, analyticsService } from '../services/api';
import { useTabSwitchGuard } from '../hooks';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function AptitudeInterview() {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [interviewId, setInterviewId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleStartTest = async () => {
    setLoading(true);
    setInterviewStarted(true);
    try {
      const res = await interviewService.create({
        type: 'aptitude',
        difficulty_level: 'medium',
      });
      const intId = res.data.id;
      setInterviewId(intId);
      
      const qRes = await interviewService.getAptitudeQuestions(intId);
      setQuestions(qRes.data);
      dispatch(startInterview({ id: intId, type: 'aptitude' }));
    } catch (err) {
      toast.error('Failed to start aptitude test.');
      setInterviewStarted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(endInterview());
    };
  }, [dispatch]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async ({ force = false } = {}) => {
    // Check if all answered. A forced submit (tab switch) can't prompt -- the
    // tab is already hidden, so nobody would see the dialog.
    if (!force && Object.keys(answers).length < questions.length) {
      if (!window.confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const answersArray = Object.keys(answers).map(qId => ({
        question_id: qId,
        answer_text: answers[qId]
      }));

      const res = await interviewService.submitAptitudeTest(interviewId, { answers: answersArray });
      setResult(res.data);
      
      // Also trigger analytics report generation so it appears in the dashboard
      await analyticsService.generateReport(interviewId);
      
      if (force) {
        Swal.fire({
          icon: 'warning',
          title: 'Test Auto-Submitted',
          text: `We detected that you left the test tab. Your test was automatically submitted to ensure academic integrity.\n\nYour Score: ${res.data.score.toFixed(0)}%`,
          confirmButtonColor: '#7c3aed'
        });
      } else {
        toast.success('Test submitted successfully!');
      }
    } catch (err) {
      toast.error('Failed to submit test.');
    } finally {
      setSubmitting(false);
    }
  };

  // Leaving the tab forfeits the attempt: the test is submitted as it stands.
  useTabSwitchGuard(interviewStarted && !loading && !result && !submitting, () => {
    toast.error('You left the test. Auto-submitting...');
    handleSubmit({ force: true });
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RiLoader4Line className="w-12 h-12 animate-spin text-primary-500" />
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Generating your aptitude test...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <RiCheckLine className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Test Complete!</h2>
          <p className="text-xl mb-6 text-neutral-600 dark:text-neutral-400">
            You scored {result.score.toFixed(0)}%
          </p>
          <p className="mb-8 text-neutral-500">
            You got {result.correct_count} out of {result.total_questions} questions correct.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!interviewStarted && !result) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100dvh-120px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg p-8 rounded-2xl border"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RiBrainLine className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Aptitude Test
          </h1>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            Take a 20-question randomized aptitude test covering Mathematics, Logical Reasoning, and basic Coding skills. 
            There is no time limit, but try to complete it in one sitting!
          </p>
          <button
            onClick={handleStartTest}
            disabled={loading}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
          >
            {loading ? (
              <><RiLoader4Line className="w-5 h-5 animate-spin" /> Preparing...</>
            ) : (
              'Start Test Now'
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl flex items-center justify-center">
          <RiBrainLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Aptitude Test</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Answer all {questions.length} questions below.</p>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <h3 className="text-lg font-medium mb-4">
              <span className="text-primary-600 mr-2">{idx + 1}.</span>
              {q.question_text}
            </h3>
            
            {q.options && q.options.length > 0 ? (
              <div className="space-y-3">
                {q.options.map((opt, oIdx) => (
                  <label 
                    key={oIdx} 
                    className={`flex items-center p-4 rounded-xl cursor-pointer border transition-colors ${
                      answers[q.id] === opt 
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => handleOptionSelect(q.id, opt)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-3 text-sm md:text-base">{opt}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-red-500 text-sm">Error: Options not generated for this question.</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => handleSubmit()}
          disabled={submitting}
          className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {submitting ? (
            <>
              <RiLoader4Line className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Test'
          )}
        </button>
      </div>
    </div>
  );
}

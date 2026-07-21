import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RiMailLine, RiArrowLeftLine, RiCheckLine } from 'react-icons/ri';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

/**
 * Forgot Password Page
 */
export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      toast.success('Reset link sent!');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
          <RiCheckLine className="text-3xl text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
          We've sent a password reset link to your email address. Please check your inbox.
        </p>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          <RiArrowLeftLine /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Forgot password?</h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
        No worries, we'll send you reset instructions.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Email</label>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors focus-within:border-primary-500"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: errors.email ? '#EF4444' : 'var(--border-color)' }}
          >
            <RiMailLine style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="john@example.com"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
            />
          </div>
          {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1 font-medium text-primary-500 hover:text-primary-600 transition-colors">
          <RiArrowLeftLine size={14} /> Back to login
        </Link>
      </p>
    </div>
  );
}

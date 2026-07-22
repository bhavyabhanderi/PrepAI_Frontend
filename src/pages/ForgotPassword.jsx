import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RiMailLine, RiArrowLeftLine, RiCheckLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

/**
 * Forgot Password Page
 */
export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.resetPasswordDirect(data.email, data.newPassword);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      let errorMessage = 'Something went wrong';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      toast.error(errorMessage);
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
        <h2 className="text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Reset successful</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-tertiary)' }}>
          Your password for <span className="font-semibold text-primary-500">{submittedEmail}</span> has been successfully updated. You can now login with your new password.
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
      <h2 className="text-5xl font-bold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>Reset Password</h2>
      <p className="text-lg mb-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
        Enter your email and your new password to reset it directly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
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

        {/* New Password */}
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>New Password</label>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors focus-within:border-primary-500"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: errors.newPassword ? '#EF4444' : 'var(--border-color)' }}
          >
            <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('newPassword', { 
                required: 'New password is required', 
                minLength: { value: 8, message: 'Password must be at least 8 characters' } 
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="tap-target text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
          {errors.newPassword && <p className="text-xs text-error mt-1">{errors.newPassword.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors focus-within:border-primary-500"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: errors.confirmPassword ? '#EF4444' : 'var(--border-color)' }}
          >
            <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('confirmPassword', { 
                required: 'Please confirm your password', 
                validate: (val) => {
                  if (watch('newPassword') !== val) {
                    return "Passwords do not match";
                  }
                }
              })}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
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

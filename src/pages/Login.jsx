import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine, RiGoogleLine } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/api';
import { loginSuccess, loginStart, loginFailure } from '../redux/slices/authSlice';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

/**
 * Login Page
 */
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        dispatch(loginStart());
        // Send the access token to backend
        const res = await authService.loginWithGoogle(tokenResponse.access_token);
        const token = res.data.access_token;
        
        dispatch(loginSuccess({ user: null, token: token }));
        
        const profileRes = await authService.getProfile();
        dispatch(loginSuccess({ user: profileRes.data, token: token }));
        
        toast.success('Successfully logged in with Google!');
        navigate(ROUTES.DASHBOARD);
      } catch (err) {
        const errorMsg = err.response?.data?.detail || 'Google login failed';
        dispatch(loginFailure(errorMsg));
        toast.error(errorMsg);
      }
    },
    onError: () => toast.error('Google login failed'),
  });

  const onSubmit = async (data) => {
    dispatch(loginStart());
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });
      const token = response.data.access_token;
      
      // Dispatch token first so interceptor can use it for profile call
      dispatch(loginSuccess({
        user: null,
        token: token,
      }));
      
      // Fetch profile
      const profileResponse = await authService.getProfile();
      const user = profileResponse.data;
      
      // Save full credentials
      dispatch(loginSuccess({
        user: user,
        token: token,
      }));
      
      toast.success('Welcome back!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      let errorMessage = 'Invalid credentials';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Welcome back
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
        Sign in to continue your interview preparation
      </p>

      {/* Social Login */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-primary-500/5"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <RiGoogleLine size={18} />
          Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or continue with email</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>
            Email
          </label>
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              errors.email ? 'border-error' : 'focus-within:border-primary-500'
            }`}
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: errors.email ? '#EF4444' : 'var(--border-color)',
            }}
          >
            <RiMailLine style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="john@example.com"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-error mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>
            Password
          </label>
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
              errors.password ? 'border-error' : 'focus-within:border-primary-500'
            }`}
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: errors.password ? '#EF4444' : 'var(--border-color)',
            }}
          >
            <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
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
          {errors.password && (
            <p className="text-xs text-error mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember & Forgot */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-primary-700" />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remember me</span>
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--text-tertiary)' }}>
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-primary-500 hover:text-primary-600 transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}

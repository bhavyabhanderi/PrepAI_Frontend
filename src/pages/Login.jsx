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
      <h2 className="text-2xl sm:text-3xl font-bold mb-1.5 text-center" style={{ color: 'var(--text-primary)' }}>
        Welcome back
      </h2>
      <p className="text-sm sm:text-base mb-5 text-center" style={{ color: 'var(--text-tertiary)' }}>
        Sign in to continue your interview preparation
      </p>

      {/* Social Login */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-primary-500/5"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
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

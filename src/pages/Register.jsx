import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RiMailLine, RiLockLine, RiUser3Line, RiEyeLine, RiEyeOffLine, RiGoogleLine } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/api';
import { loginSuccess } from '../redux/slices/authSlice';
import { ROUTES } from '../constants/routes';
import toast from 'react-hot-toast';

/**
 * Register Page
 */
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const res = await authService.loginWithGoogle(tokenResponse.access_token);
        const token = res.data.access_token;
        
        dispatch(loginSuccess({ user: null, token: token }));
        
        const profileRes = await authService.getProfile();
        dispatch(loginSuccess({ user: profileRes.data, token: token }));
        
        toast.success('Successfully registered & logged in with Google!');
        navigate(ROUTES.DASHBOARD);
      } catch (err) {
        const errorMsg = err.response?.data?.detail || 'Google registration failed';
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => toast.error('Google login failed'),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Create user account
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Login user immediately
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password,
      });
      const token = loginResponse.data.access_token;
      
      // Dispatch token first
      dispatch(loginSuccess({
        user: null,
        token: token,
      }));

      // Fetch user profile info
      const profileResponse = await authService.getProfile();
      const user = profileResponse.data;

      // Dispatch full user details
      dispatch(loginSuccess({
        user: user,
        token: token,
      }));

      toast.success('Account created successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      let errorMessage = 'Registration failed. Try again.';
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Create your account
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--text-tertiary)' }}>
        Start your interview preparation journey today
      </p>

      {/* Social */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleGoogleLogin()}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-primary-500/5"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <RiGoogleLine size={18} />
          Google
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or register with email</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Full Name</label>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors focus-within:border-primary-500"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: errors.name ? '#EF4444' : 'var(--border-color)' }}
          >
            <RiUser3Line style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('name', { required: 'Name is required' })}
            />
          </div>
          {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
        </div>

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

        {/* Password */}
        <div>
          <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-primary)' }}>Password</label>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors focus-within:border-primary-500"
            style={{ backgroundColor: 'var(--input-bg)', borderColor: errors.password ? '#EF4444' : 'var(--border-color)' }}
          >
            <RiLockLine style={{ color: 'var(--text-tertiary)' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Min 8 characters"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="tap-target" style={{ color: 'var(--text-tertiary)' }}>
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded mt-0.5 accent-primary-700" {...register('terms', { required: true })} />
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            I agree to the <a href="#" className="text-primary-500">Terms of Service</a> and <a href="#" className="text-primary-500">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-sm text-center mt-6" style={{ color: 'var(--text-tertiary)' }}>
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-500 hover:text-primary-600 transition-colors">Sign in</Link>
      </p>
    </div>
  );
}

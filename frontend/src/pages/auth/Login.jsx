import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const Login = () => {
  const { login, isLoggingIn } = useAuth();
  const { syncCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Logged in successfully!');
      // Sync guest cart to user cart
      await syncCart();
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8 md:p-10 space-y-8 bg-glass border border-gray-150/40 dark:border-dark-750/30 shadow-hover animate-slide-up">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm font-semibold text-dark-500 dark:text-dark-400">
            Sign in to continue your shopping journey on ShopNow
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="label">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                className={`input pl-11 ${errors.email ? 'input-error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="label">Password</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-bold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`input pl-11 pr-11 ${errors.password ? 'input-error' : ''}`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark-700 dark:hover:text-white"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-semibold">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full btn-primary py-3.5 font-bold shadow-glow text-sm mt-3"
          >
            {isLoggingIn ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm font-semibold text-dark-500 dark:text-dark-400 pt-2 border-t border-gray-100 dark:border-dark-800">
          New to ShopNow?{' '}
          <Link
            to="/auth/register"
            className="text-primary-500 hover:text-primary-600 transition-colors font-bold underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

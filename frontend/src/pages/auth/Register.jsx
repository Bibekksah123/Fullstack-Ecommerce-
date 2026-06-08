import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const Register = () => {
  const { register: signup, isRegistering } = useAuth();
  const { syncCart } = useCart();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      // Omit confirmPassword from backend submission
      const { name, email, password } = data;
      await signup({ name, email, password });
      toast.success('Registration successful! Welcome to ShopNow.');
      // Sync guest cart to user cart
      await syncCart();
      navigate('/');
    } catch (err) {
      toast.error(err.data?.message || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8 md:p-10 space-y-8 bg-glass border border-gray-150/40 dark:border-dark-750/30 shadow-hover animate-slide-up">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
            Create an Account
          </h2>
          <p className="text-sm font-semibold text-dark-500 dark:text-dark-400">
            Sign up to track orders, save wishlists, and write reviews
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="label">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                className={`input pl-11 ${errors.name ? 'input-error' : ''}`}
                {...register('name', { required: 'Name is required' })}
              />
              <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 font-semibold">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="label">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="john@example.com"
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
            <label className="label">Password</label>
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="label">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`input pl-11 pr-11 ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === passwordValue || 'Passwords do not match',
                })}
              />
              <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 font-semibold">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full btn-primary py-3.5 font-bold shadow-glow text-sm mt-3"
          >
            {isRegistering ? 'Registering Account...' : 'Register'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm font-semibold text-dark-500 dark:text-dark-400 pt-2 border-t border-gray-100 dark:border-dark-800">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-primary-500 hover:text-primary-600 transition-colors font-bold underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

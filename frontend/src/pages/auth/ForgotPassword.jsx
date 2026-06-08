import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../features/auth/authApi';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const ForgotPassword = () => {
  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    try {
      const res = await forgotPasswordApi(data).unwrap();
      toast.success(res.message || 'Recovery email sent! Please check your inbox.');
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send recovery email');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8 md:p-10 space-y-8 bg-glass border border-gray-150/40 dark:border-dark-750/30 shadow-hover animate-slide-up">
        
        {/* Back Link */}
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-dark-500 hover:text-primary-500 transition-colors uppercase tracking-wider"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to Sign In
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
            Reset Password
          </h2>
          <p className="text-sm font-semibold text-dark-500 dark:text-dark-400">
            Enter your email and we'll send you instructions to reset your password.
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 font-bold shadow-glow text-sm mt-3"
          >
            {isLoading ? 'Sending Email...' : 'Send Recovery Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

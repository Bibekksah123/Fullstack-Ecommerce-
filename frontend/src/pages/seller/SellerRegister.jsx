import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRegisterSellerMutation } from '../../features/seller/sellerApi';
import useAuth from '../../hooks/useAuth';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { BuildingStorefrontIcon, SparklesIcon, WalletIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const SellerRegister = () => {
  const navigate = useNavigate();
  const { updateProfileState } = useAuth();
  const [registerSellerApi, { isLoading }] = useRegisterSellerMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      storeName: '',
      description: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        branchCode: '',
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerSellerApi(data).unwrap();
      if (res.success) {
        toast.success('Congratulations! You are now a seller.');
        
        // Update user state role to 'seller'
        updateProfileState({ role: 'seller' });
        navigate('/seller/dashboard');
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to register seller profile');
    }
  };

  return (
    <div className="section py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Become a Seller' }]} />

      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="p-4 bg-primary-50 dark:bg-primary-500/10 text-primary-500 rounded-full w-fit mx-auto shadow-glow">
            <BuildingStorefrontIcon className="w-12 h-12" />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
            Register Your Store
          </h2>
          <p className="text-sm font-semibold text-dark-500 max-w-md mx-auto">
            Set up your shop on ShopNow and start selling to thousands of customers today.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white flex items-center gap-1.5">
            <SparklesIcon className="w-5 h-5 text-primary-500" /> Store Information
          </h3>

          <div className="space-y-4">
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="label">Store Name *</label>
              <input
                type="text"
                className={`input ${errors.storeName ? 'input-error' : ''}`}
                placeholder="e.g. Gizmo Gadgets Store"
                {...register('storeName', { required: 'Store name is required' })}
              />
              {errors.storeName && (
                <p className="text-xs text-red-500 font-semibold">{errors.storeName.message}</p>
              )}
            </div>

            {/* Store Description */}
            <div className="space-y-1.5">
              <label className="label">Store Description *</label>
              <textarea
                rows="4"
                className={`input ${errors.description ? 'input-error' : ''}`}
                placeholder="Briefly describe what products you sell..."
                {...register('description', { required: 'Store description is required' })}
              />
              {errors.description && (
                <p className="text-xs text-red-500 font-semibold">{errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-dark-800 my-6" />

          {/* Bank details */}
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white flex items-center gap-1.5">
            <WalletIcon className="w-5 h-5 text-secondary-500" /> Payout Bank Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label">Account Holder Name *</label>
              <input
                type="text"
                className="input"
                {...register('bankDetails.accountName', { required: 'Account holder name is required' })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="label">Account Number *</label>
              <input
                type="text"
                className="input"
                {...register('bankDetails.accountNumber', { required: 'Account number is required' })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="label">Bank Name *</label>
              <input
                type="text"
                className="input"
                placeholder="e.g. Standard Chartered Bank"
                {...register('bankDetails.bankName', { required: 'Bank name is required' })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="label">Branch Code / Swift Code</label>
              <input
                type="text"
                className="input"
                {...register('bankDetails.branchCode')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3.5 font-bold shadow-glow text-sm"
          >
            {isLoading ? 'Creating Store...' : 'Create Store and Open Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerRegister;

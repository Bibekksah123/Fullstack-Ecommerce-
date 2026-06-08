import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../../features/user/userApi';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import formatCurrency from '../../utils/formatCurrency';
import { useAuth } from '../../hooks/useAuth';
import { SparklesIcon, KeyIcon, PhotoIcon, WalletIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const Profile = () => {
  const { updateProfileState } = useAuth();
  const { data: profileData, isLoading } = useGetProfileQuery();
  const profile = profileData?.data;

  const [updateProfileApi, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePasswordApi, { isLoading: isUpdatingPassword }] = useChangePasswordMutation();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  const { register: profileReg, handleSubmit: profileSubmit, formState: { errors: profileErr } } = useForm();
  const { register: passReg, handleSubmit: passSubmit, formState: { errors: passErr }, reset: passReset } = useForm();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onProfileUpdate = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name || profile.name);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
    try {
      const res = await updateProfileApi(formData).unwrap();
      if (res.success) {
        updateProfileState(res.data);
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordUpdate = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await changePasswordApi({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success('Password changed successfully');
      passReset();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to change password');
    }
  };

  if (isLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="30%" height="2rem" />
        <Skeleton variant="rectangular" className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'My Account' }, { label: 'Profile' }]} />

      <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
        Profile Settings
      </h2>

      {/* Account stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Wallet Balance */}
        <div className="card p-6 flex items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-dark-400 uppercase tracking-wider block">Wallet Balance</span>
            <span className="text-xl sm:text-2xl font-black text-secondary-500">
              {formatCurrency(profile?.walletBalance || 0)}
            </span>
          </div>
          <div className="p-3 bg-secondary-50 dark:bg-secondary-500/10 text-secondary-500 rounded-2xl">
            <WalletIcon className="w-8 h-8" />
          </div>
        </div>

        {/* Loyalty Points */}
        <div className="card p-6 flex items-center justify-between gap-4">
          <div className="space-y-1 text-left">
            <span className="text-xs font-bold text-dark-400 uppercase tracking-wider block">Loyalty Points</span>
            <span className="text-xl sm:text-2xl font-black text-primary-500">
              {profile?.loyaltyPoints || 0} pts
            </span>
          </div>
          <div className="p-3 bg-primary-50 dark:bg-primary-500/10 text-primary-500 rounded-2xl">
            <TrophyIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Profile Card */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white flex items-center gap-2">
            <PhotoIcon className="w-5 h-5 text-primary-500" /> Public Details
          </h3>

          <form onSubmit={profileSubmit(onProfileUpdate)} className="space-y-5">
            {/* Avatar upload */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-gray-50 dark:bg-dark-950/20 p-4.5 rounded-2xl border border-gray-150/40 dark:border-dark-800">
              <img
                src={avatarPreview || profile?.avatar || 'https://via.placeholder.com/150'}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-primary-500/20 ring-4 ring-primary-500/5"
              />
              <div className="space-y-2 text-center sm:text-left">
                <label className="btn border border-gray-200 dark:border-dark-750 hover:bg-gray-100 dark:hover:bg-dark-850 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-dark-400">Supported files: PNG, JPG, JPEG (Max 5MB)</p>
              </div>
            </div>

            {/* Email (Read only) */}
            <div className="space-y-1.5">
              <label className="label text-xs">Email Address (Cannot change)</label>
              <input
                type="text"
                value={profile?.email}
                disabled
                className="input cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-dark-900 dark:border-dark-800"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="label text-xs">Full Name</label>
              <input
                type="text"
                defaultValue={profile?.name}
                className="input"
                {...profileReg('name', { required: 'Name is required' })}
              />
              {profileErr.name && (
                <p className="text-xs text-red-500">{profileErr.name.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="btn-primary py-2.5 font-bold shadow-glow text-xs"
            >
              {isUpdatingProfile ? 'Saving Details...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Change password card */}
        <div className="card p-6 sm:p-8 space-y-6">
          <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white flex items-center gap-2">
            <KeyIcon className="w-5 h-5 text-secondary-500" /> Account Security
          </h3>

          <form onSubmit={passSubmit(onPasswordUpdate)} className="space-y-5">
            {/* Old Password */}
            <div className="space-y-1.5">
              <label className="label text-xs">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                {...passReg('oldPassword', { required: 'Current password is required' })}
              />
              {passErr.oldPassword && (
                <p className="text-xs text-red-500">{passErr.oldPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="label text-xs">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                {...passReg('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              {passErr.newPassword && (
                <p className="text-xs text-red-500">{passErr.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="label text-xs">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                {...passReg('confirmPassword', { required: 'Please confirm your new password' })}
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="btn bg-dark-900 text-white dark:bg-dark-800 dark:hover:bg-dark-700 py-2.5 font-bold text-xs"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

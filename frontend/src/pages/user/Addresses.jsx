import { useState } from 'react';
import { useGetAddressesQuery, useAddAddressMutation, useDeleteAddressMutation, useUpdateAddressMutation } from '../../features/user/userApi';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import { PlusIcon, TrashIcon, PencilIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const Addresses = () => {
  const { data: addressesData, isLoading, refetch } = useGetAddressesQuery();
  const addresses = addressesData?.data || [];

  const [addAddressApi] = useAddAddressMutation();
  const [deleteAddressApi] = useDeleteAddressMutation();
  const [updateAddressApi] = useUpdateAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nepal',
    isDefault: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || 'Nepal',
      isDefault: address.isDefault || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddressApi(id).unwrap();
      toast.success('Address deleted successfully');
      refetch();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAddressApi({ id: editingId, ...formData }).unwrap();
        toast.success('Address updated successfully');
      } else {
        await addAddressApi(formData).unwrap();
        toast.success('Address added successfully');
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Nepal',
        isDefault: false,
      });
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to save address');
    }
  };

  if (isLoading) {
    return (
      <div className="section py-8 space-y-6">
        <Skeleton variant="text" width="30%" height="2rem" />
        <Skeleton variant="rectangular" className="h-44 w-full" />
      </div>
    );
  }

  return (
    <div className="section py-6 space-y-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'My Account', path: '/account/profile' }, { label: 'Saved Addresses' }]} />

      <div className="flex justify-between items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
          Saved Addresses
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 max-w-xl space-y-4 border-2 border-primary-500/10 animate-slide-down">
          <h3 className="font-display font-bold text-base text-dark-900 dark:text-white">
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Contact Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">State / Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="input"
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="isDefault" className="text-sm font-semibold text-dark-700 dark:text-dark-300">
              Set as default shipping address
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-800">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn border border-gray-250 dark:border-dark-750 text-dark-500 text-xs px-4 py-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs px-6 py-2">
              Save Address
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-dark-800 rounded-3xl">
          <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-dark-500 font-semibold">No Saved Addresses</p>
          <p className="text-xs text-dark-400 mt-1">Add your shipping addresses for a faster checkout experience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="card p-5 flex justify-between items-start border border-gray-100 dark:border-dark-800 hover:border-gray-200 dark:hover:border-dark-700 transition-colors"
            >
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-dark-900 dark:text-white">
                    {address.name}
                  </span>
                  {address.isDefault && (
                    <span className="text-[10px] font-bold bg-secondary-100 dark:bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-dark-600 dark:text-dark-300 leading-relaxed">
                  {address.street}, {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-xs text-dark-400 font-semibold">
                  Phone: {address.phone} | Country: {address.country}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 text-dark-500 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="p-2 text-dark-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;

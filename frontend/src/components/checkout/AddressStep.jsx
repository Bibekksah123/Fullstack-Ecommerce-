import { useState } from 'react';
import { useGetAddressesQuery, useAddAddressMutation } from '../../features/user/userApi';
import Skeleton from '../ui/Skeleton';
import { PlusIcon, CheckIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const AddressStep = ({ selectedAddress, onSelect, onNext }) => {
  const { data: addressesData, isLoading } = useGetAddressesQuery();
  const addresses = addressesData?.data || [];
  const [addAddressApi, { isLoading: isAdding }] = useAddAddressMutation();

  const [showAddForm, setShowAddForm] = useState(false);
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

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.street || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      const res = await addAddressApi(formData).unwrap();
      if (res.success) {
        toast.success('Address added successfully');
        setShowAddForm(false);
        // Clear form
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
      }
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add address');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton variant="rectangular" className="h-24 w-full" />
        <Skeleton variant="rectangular" className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white">
          Shipping Address
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn bg-primary-50 text-primary-500 dark:bg-primary-500/10 hover:opacity-90 py-1.5 px-3 text-xs font-bold rounded-lg flex items-center gap-1"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          {showAddForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddAddress} className="card p-6 border-2 border-primary-500/25 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
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
          <div className="md:col-span-2 flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              name="isDefault"
              id="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="isDefault" className="text-sm font-semibold text-dark-700 dark:text-dark-300">
              Set as default address
            </label>
          </div>
          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={isAdding}
              className="btn-primary w-full py-2.5 text-sm"
            >
              {isAdding ? 'Saving Address...' : 'Save and Select Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address Selection list */}
      <div className="grid grid-cols-1 gap-4">
        {addresses.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-dark-800 rounded-2xl">
            <MapPinIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-dark-500 font-semibold">No saved addresses</p>
            <p className="text-xs text-dark-400 mt-1">Please add a shipping address above to proceed.</p>
          </div>
        ) : (
          addresses.map((address) => {
            const isSelected = selectedAddress?._id === address._id;
            return (
              <div
                key={address._id}
                onClick={() => onSelect(address)}
                className={`card p-5 border-2 transition-all cursor-pointer flex justify-between items-start ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/10'
                    : 'border-gray-100 hover:border-gray-250 dark:border-dark-800 dark:hover:border-dark-700'
                }`}
              >
                <div className="space-y-1">
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
                  <p className="text-sm font-semibold text-dark-700 dark:text-dark-300">
                    {address.street}, {address.city}, {address.state ? `${address.state}, ` : ''}{address.postalCode}
                  </p>
                  <p className="text-xs text-dark-400 font-medium">
                    Phone: {address.phone} | Country: {address.country}
                  </p>
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-primary-500 text-white shadow-glow">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!selectedAddress}
          className="btn-primary px-8"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AddressStep;

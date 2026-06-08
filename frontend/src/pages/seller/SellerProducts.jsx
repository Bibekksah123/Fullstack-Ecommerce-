import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useGetSellerProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../../features/seller/sellerApi';
import { useGetCategoriesQuery } from '../../features/products/productsApi';
import { SellerSidebar } from './SellerDashboard';
import Skeleton from '../../components/ui/Skeleton';
import Breadcrumb from '../../components/layout/Breadcrumb';
import EmptyState from '../../components/ui/EmptyState';
import formatCurrency from '../../utils/formatCurrency';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export const SellerProducts = () => {
  const [page, setPage] = useState(1);
  const { data: productsData, isLoading, refetch } = useGetSellerProductsQuery({ page, limit: 10 });
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || { pages: 1 };

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  const [createProductApi] = useCreateProductMutation();
  const [updateProductApi] = useUpdateProductMutation();
  const [deleteProductApi] = useDeleteProductMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setValue('name', prod.name);
    setValue('brand', prod.brand);
    setValue('price', prod.price);
    setValue('discountPrice', prod.discountPrice);
    setValue('stock', prod.stock);
    setValue('category', prod.category?._id || prod.category);
    setValue('description', prod.description);
    setValue('images', prod.images?.join(', ') || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await deleteProductApi(id).unwrap();
      toast.success('Product deleted successfully');
      refetch();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const onSubmit = async (data) => {
    const imagesArray = data.images
      ? data.images.split(',').map((img) => img.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: data.name,
      brand: data.brand,
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : 0,
      stock: Number(data.stock),
      category: data.category,
      description: data.description,
      images: imagesArray,
    };

    try {
      if (editingProduct) {
        await updateProductApi({ id: editingProduct._id, ...productPayload }).unwrap();
        toast.success('Product updated successfully');
      } else {
        await createProductApi(productPayload).unwrap();
        toast.success('Product created successfully');
      }
      setShowForm(false);
      setEditingProduct(null);
      reset();
      refetch();
    } catch (err) {
      toast.error(err.data?.message || 'Failed to save product');
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
      <Breadcrumb items={[{ label: 'Seller Central', path: '/seller/dashboard' }, { label: 'Products' }]} />

      <div className="flex justify-between items-center">
        <h2 className="font-display font-black text-2xl sm:text-3xl text-dark-900 dark:text-white">
          My Store Products
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingProduct(null);
            reset();
          }}
          className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
        >
          <PlusIcon className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <SellerSidebar />

        {/* Dashboard Main Area */}
        <div className="lg:col-span-3 space-y-8">
          
          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 md:p-8 space-y-4 border-2 border-primary-500/10 animate-slide-down">
              <h3 className="font-display font-bold text-lg text-dark-900 dark:text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label">Product Name *</label>
                  <input
                    type="text"
                    className="input"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Brand Name</label>
                  <input
                    type="text"
                    className="input"
                    {...register('brand')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Retail Price (Rs.) *</label>
                  <input
                    type="number"
                    className="input"
                    {...register('price', { required: 'Price is required' })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Discounted Price (Rs.)</label>
                  <input
                    type="number"
                    className="input"
                    {...register('discountPrice')}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Stock Units *</label>
                  <input
                    type="number"
                    className="input"
                    {...register('stock', { required: 'Stock count is required' })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="label">Category *</label>
                  <select
                    className="input"
                    {...register('category', { required: 'Category is required' })}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="label">Image URLs (comma separated)</label>
                  <textarea
                    rows="2"
                    placeholder="https://picsum.photos/400/300, https://picsum.photos/400/301"
                    className="input"
                    {...register('images')}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="label">Product Description *</label>
                  <textarea
                    rows="5"
                    className="input"
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>
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
                  Save Product
                </button>
              </div>
            </form>
          )}

          {/* Product list */}
          {products.length === 0 ? (
            <div className="card p-16 flex justify-center items-center">
              <EmptyState
                title="No Products in Inventory"
                description="You haven't listed any products yet. Click the Add Product button to start listing items."
                actionLabel="List First Product"
                onAction={() => setShowForm(true)}
              />
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-dark-800 text-[10px] uppercase font-extrabold text-dark-400">
                      <th className="p-4">Item Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-dark-850 text-xs sm:text-sm font-semibold">
                    {products.map((p) => {
                      const finalPrice = p.discountPrice > 0 ? p.discountPrice : p.price;
                      return (
                        <tr key={p._id}>
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={p.thumbnail || (p.images && p.images[0]) || 'https://via.placeholder.com/60'}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-150 dark:border-dark-800"
                            />
                            <div>
                              <p className="font-bold text-dark-900 dark:text-white line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-dark-400">ID: {p._id.substring(18)}</p>
                            </div>
                          </td>
                          <td className="p-4 text-dark-600 dark:text-dark-300">
                            {p.category?.name || 'N/A'}
                          </td>
                          <td className="p-4 text-dark-900 dark:text-white font-bold">
                            {formatCurrency(finalPrice)}
                          </td>
                          <td className="p-4">
                            {p.stock <= 0 ? (
                              <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">Out</span>
                            ) : (
                              <span className="text-dark-700 dark:text-dark-350">{p.stock} units</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-2 text-dark-500 hover:text-primary-500 hover:bg-gray-50 dark:hover:bg-dark-800 rounded-lg"
                              >
                                <PencilIcon className="w-4.5 h-4.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(p._id)}
                                className="p-2 text-dark-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                              >
                                <TrashIcon className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SellerProducts;

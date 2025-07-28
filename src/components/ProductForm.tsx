import { useState } from 'react';
import type { Product, ProductType } from '../types/product';

interface ProductFormProps {
  readonly product?: Product;
  readonly productTypes: ProductType[];
  readonly onSubmit: (productData: Partial<Product>) => Promise<void>;
  readonly onCancel: () => void;
}

export default function ProductForm({
  product,
  productTypes,
  onSubmit,
  onCancel
}: Readonly<ProductFormProps>) {
  const [formData, setFormData] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    basePrice: product?.basePrice ? (product.basePrice / 100).toString() : '',
    currency: product?.currency ?? 'usd',
    productTypeId: product?.metadata.productTypeId ?? '',
    category: product?.metadata.category ?? '',
    brand: product?.metadata.brand ?? '',
    sku: product?.metadata.sku ?? '',
    tags: product?.metadata.tags.join(', ') ?? '',
    active: product?.active ?? true,
    images: product?.images ?? [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = 'Valid price is required';
    }

    if (!formData.productTypeId) {
      newErrors.productTypeId = 'Product type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      basePrice: Math.round(parseFloat(formData.basePrice) * 100),
      currency: formData.currency,
      metadata: {
        productTypeId: formData.productTypeId,
        category: formData.category.trim() || undefined,
        brand: formData.brand.trim() || undefined,
        sku: formData.sku.trim() || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      },
      active: formData.active,
      images: formData.images,
    };

    onSubmit(productData).catch((error: unknown) => {
      console.error('Error submitting product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // For now, we'll just store the file names
    // In a real implementation, you'd upload these to a CDN
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value })); }}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <select
              id="productType"
              value={formData.productTypeId}
              onChange={(e) => { setFormData(prev => ({ ...prev, productTypeId: e.target.value })); }}
              className={`input ${errors.productTypeId ? 'border-red-500' : ''}`}
            >
              <option value="">Select a product type</option>
              {productTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.productTypeId && <p className="mt-1 text-sm text-red-600">{errors.productTypeId}</p>}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => { setFormData(prev => ({ ...prev, description: e.target.value })); }}
            className={`input ${errors.description ? 'border-red-500' : ''}`}
            placeholder="Enter product description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
              Base Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="basePrice"
                step="0.01"
                min="0"
                value={formData.basePrice}
                onChange={(e) => { setFormData(prev => ({ ...prev, basePrice: e.target.value })); }}
                className={`input pl-8 ${errors.basePrice ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
            </div>
            {errors.basePrice && <p className="mt-1 text-sm text-red-600">{errors.basePrice}</p>}
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => { setFormData(prev => ({ ...prev, currency: e.target.value })); }}
              className="input"
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="cad">CAD (C$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => { setFormData(prev => ({ ...prev, category: e.target.value })); }}
              className="input"
              placeholder="e.g., Clothing, Electronics"
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => { setFormData(prev => ({ ...prev, brand: e.target.value })); }}
              className="input"
              placeholder="e.g., Nike, Apple"
            />
          </div>

          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={(e) => { setFormData(prev => ({ ...prev, sku: e.target.value })); }}
              className="input"
              placeholder="Stock keeping unit"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => { setFormData(prev => ({ ...prev, tags: e.target.value })); }}
              className="input"
              placeholder="tag1, tag2, tag3"
            />
            <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="input"
            />
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product ${String(index + 1)}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => { removeImage(index); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={formData.active}
            onChange={(e) => { setFormData(prev => ({ ...prev, active: e.target.checked })); }}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
            Product is active and visible to customers
          </label>
        </div>
      </div>

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}

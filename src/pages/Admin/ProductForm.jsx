import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { toArray } from '../../utils';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [sizes, setSizes] = useState(['S', 'M', 'L']);
  const [sizeInputs, setSizeInputs] = useState([]);
  const [newSize, setNewSize] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    collection: '',
    price: '',
    salePrice: '',
    sku: '',
    images: [''],
    thumbnail: '',
    sizes: [],
    colors: [],
    stock: 0,
    lowStockThreshold: 5,
    featured: false,
    newArrival: false,
    bestSeller: false,
    status: 'draft',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await adminApi.get('/categories?status=active&limit=100');
         setCategories(toArray(res.data.categories));
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    const fetchCollections = async () => {
      try {
        const res = await adminApi.get('/collections?status=active&limit=100');
         setCollections(toArray(res.data.collections));
      } catch (err) {
        console.error('Failed to fetch collections:', err);
      }
    };

    fetchCategories();
    fetchCollections();

    if (isEdit) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const res = await adminApi.get(`/products/${id}`);
          const product = res.data.product;
          setFormData({
            name: product.name || '',
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            category: product.category?._id || product.category || '',
            collection: product.collection?._id || product.collection || '',
            price: product.price || '',
            salePrice: product.salePrice || '',
            sku: product.sku || '',
            images: product.images && product.images.length > 0 ? product.images : [''],
            thumbnail: product.thumbnail || '',
            sizes: toArray(product.sizes),
            colors: toArray(product.colors),
            stock: product.stock || 0,
            lowStockThreshold: product.lowStockThreshold || 5,
            featured: product.featured || false,
            newArrival: product.newArrival || false,
            bestSeller: product.bestSeller || false,
            status: product.status || 'draft',
          });
          setSizeInputs(toArray(product.sizes));
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addSize = () => {
    if (newSize.trim() && !sizeInputs.includes(newSize.trim())) {
      setSizeInputs([...sizeInputs, newSize.trim()]);
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, newSize.trim()] }));
    }
    setNewSize('');
  };

  const removeSize = (sizeToRemove) => {
    setSizeInputs(sizeInputs.filter((s) => s !== sizeToRemove));
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== sizeToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      stock: Number(formData.stock),
      lowStockThreshold: Number(formData.lowStockThreshold),
      images: formData.images.filter((img) => img.trim() !== ''),
      sizes: sizeInputs,
      colors: formData.colors,
    };

    if (!payload.category) {
      delete payload.category;
    }
    if (!payload.collection) {
      delete payload.collection;
    }

    try {
      if (isEdit) {
        await adminApi.put(`/products/${id}`, payload);
      } else {
        await adminApi.post('/products', payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <button
          onClick={() => navigate('/admin/products')}
          className="text-gray-600 hover:text-charcoal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">Product Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              <select
                name="collection"
                value={formData.collection}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="">None</option>
                {collections.map((coll) => (
                  <option key={coll._id} value={coll._id}>
                    {coll.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                min="0"
              />
            </div>

            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleChange}
                  className="text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-700">New Arrival</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleChange}
                  className="text-gold focus:ring-gold"
                />
                <span className="text-sm text-gray-700">Best Seller</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">Images & Variants</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder={`Image URL ${idx + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-sm text-charcoal hover:text-deep-brown flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Image
            </button>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {sizeInputs.map((size, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-1">
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add a size (e.g., S, M, L)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSize();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSize}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colors (comma separated)
            </label>
            <input
              type="text"
              value={formData.colors.join(', ')}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                }))
              }
              placeholder="Red, Blue, Green"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-charcoal text-ivory rounded-md font-medium hover:bg-deep-brown transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { toArray } from '../../utils';
import { getImageUrl } from '../../services/imageUrl';
import ImageUploadField from '../../components/ui/ImageUploadField';

const initialFormData = {
  name: '',
  slug: '',
  description: '',
  image: '',
  imageMetadata: {},
  video: '',
  videoMetadata: {},
  status: 'active',
  order: 0,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        limit: 100,
      });

      if (search) {
        params.set('search', search);
      }

      const res = await adminApi.get(`/categories?${params}`);

      const data = toArray(res.data, ['categories']);

      // Remove invalid/undefined category entries
      setCategories(
        Array.isArray(data)
          ? data.filter((category) => category && category._id)
          : []
      );
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  const resetForm = () => {
    setFormData({
      ...initialFormData,
      imageMetadata: {},
      videoMetadata: {},
    });

    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory?._id) {
        await adminApi.put(
          `/categories/${editingCategory._id}`,
          formData
        );
      } else {
        await adminApi.post('/categories', formData);
      }

      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error('Failed to save category:', err);
    }
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (category) => {
    // Prevent undefined category from crashing the page
    if (!category || !category._id) {
      console.error('Invalid category passed to handleEdit:', category);
      return;
    }

    setEditingCategory(category);

    setFormData({
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      image: category?.image || '',
      imageMetadata: category?.imageMetadata || {},
      video: category?.video || '',
      videoMetadata: category?.videoMetadata || {},
      status: category?.status || 'active',
      order: category?.order ?? 0,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('Invalid category ID');
      return;
    }

    if (!window.confirm('Delete this category?')) {
      return;
    }

    try {
      await adminApi.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">
          Categories
        </h1>

        <button
          type="button"
          onClick={handleAdd}
          className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      {/* Categories Table */}
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">
                  Name
                </th>

                <th className="text-left p-3 font-medium">
                  Slug
                </th>

                <th className="text-center p-3 font-medium">
                  Products
                </th>

                <th className="text-center p-3 font-medium">
                  Status
                </th>

                <th className="text-center p-3 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => {
                if (!cat || !cat._id) {
                  return null;
                }

                return (
                  <tr
                    key={cat._id}
                    className="border-b last:border-0"
                  >
                    {/* Name */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {cat.image ? (
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name || ''}
                            className="w-6 h-6 rounded object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded bg-gray-100" />
                        )}

                        {cat.name || 'Unnamed Category'}
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-3 text-gray-600">
                      {cat.slug || '-'}
                    </td>

                    {/* Products */}
                    <td className="p-3 text-center">
                      {cat.productCount || 0}
                    </td>

                    {/* Status */}
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          cat.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {cat.status || 'inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="p-1 text-gray-600 hover:text-charcoal hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(cat._id)}
                          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold">
                {editingCategory
                  ? 'Edit Category'
                  : 'Add Category'}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 flex flex-col min-h-0"
            >
              <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>

                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Category Image */}
                <ImageUploadField
                  label="Category Image"
                  value={formData.image}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: url || '',
                    }))
                  }
                  onMetadataChange={(meta) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageMetadata: meta || {},
                    }))
                  }
                  accept="image/jpeg,image/jpg,image/jfif,image/png,image/webp,image/gif,image/bmp,image/tiff"
                  maxSize={10 * 1024 * 1024}
                  mimeType={
                    formData?.imageMetadata?.mimeType || ''
                  }
                  mediaType="image"
                />

                {/* Manual Image URL */}
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.value,
                    })
                  }
                  placeholder="Or enter image URL manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                />

                {/* Category Video */}
                <ImageUploadField
                  label="Category Video"
                  value={formData.video}
                  onChange={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      video: url || '',
                    }))
                  }
                  onMetadataChange={(meta) =>
                    setFormData((prev) => ({
                      ...prev,
                      videoMetadata: meta || {},
                    }))
                  }
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  maxSize={50 * 1024 * 1024}
                  mimeType={
                    formData?.videoMetadata?.mimeType || ''
                  }
                  mediaType="video"
                />

                {/* Manual Video URL */}
                <input
                  type="text"
                  value={formData.video}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      video: e.target.value,
                    })
                  }
                  placeholder="Or enter video URL manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                />

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>

                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-charcoal text-ivory rounded-md hover:bg-deep-brown"
                >
                  {editingCategory
                    ? 'Save Changes'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import adminApi from '../../services/adminApi';
import { toArray } from '../../utils';
import ImageUploadField from '../../components/ui/ImageUploadField';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    heroImage: '',
    heroImageMetadata: {},
    heroVideo: '',
    heroVideoMetadata: {},
    bannerImage: '',
    bannerImageMetadata: {},
    bannerVideo: '',
    bannerVideoMetadata: {},
    featured: false,
    status: 'active',
  });

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (search) params.set('search', search);
      const res = await adminApi.get(`/collections?${params}`);
       setCollections(toArray(res.data, ['collections']));
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCollection) {
        await adminApi.put(`/collections/${editingCollection._id}`, formData);
      } else {
        await adminApi.post('/collections', formData);
      }
      setShowModal(false);
      setEditingCollection(null);
      setFormData({ name: '', slug: '', description: '', heroImage: '', heroVideo: '', bannerImage: '', bannerVideo: '', featured: false, status: 'active' });
      fetchCollections();
    } catch (err) {
      console.error('Failed to save collection:', err);
    }
  };

  const handleEdit = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug || '',
      description: collection.description || '',
      heroImage: collection.heroImage || '',
      heroVideo: collection.heroVideo || '',
      bannerImage: collection.bannerImage || '',
      bannerVideo: collection.bannerVideo || '',
      featured: collection.featured || false,
      status: collection.status || 'active',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this collection?')) return;
    try {
      await adminApi.delete(`/collections/${id}`);
      fetchCollections();
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Collections</h1>
        <button
          onClick={() => { setShowModal(true); setEditingCollection(null); }}
          className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search collections..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      {loading ? (
        <p>Loading collections...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-center p-3 font-medium">Featured</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((coll) => (
                <tr key={coll._id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{coll.name}</td>
                  <td className="p-3 text-gray-600">{coll.slug}</td>
                  <td className="p-3 text-center">{coll.featured ? '✓' : '—'}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        coll.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {coll.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(coll)}
                        className="p-1 text-gray-600 hover:text-charcoal hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(coll._id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">

            {/* Header - fixed */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold">
                {editingCollection ? 'Edit Collection' : 'Add Collection'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Form body - ONLY THIS PART SCROLLS */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  />
                </div>
                <ImageUploadField
                  label="Hero Image"
                  value={formData.heroImage}
                  onChange={(url) => setFormData({ ...formData, heroImage: url })}
                  onMetadataChange={(meta) => setFormData((prev) => ({
                    ...prev,
                    heroImageMetadata: meta || {},
                  }))}
                  accept="image/jpeg,image/jpg,image/jfif,image/png,image/webp,image/gif,image/bmp"
                  maxSize={10 * 1024 * 1024}
                  mimeType={formData.heroImageMetadata?.mimeType || ''}
                  mediaType="image"
                />
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  placeholder="Or enter image URL manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                />
                <ImageUploadField
                  label="Hero Video"
                  value={formData.heroVideo}
                  onChange={(url) => setFormData({ ...formData, heroVideo: url })}
                  onMetadataChange={(meta) => setFormData((prev) => ({
                    ...prev,
                    heroVideoMetadata: meta || {},
                  }))}
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  maxSize={50 * 1024 * 1024}
                  mimeType={formData.heroVideoMetadata?.mimeType || ''}
                  mediaType="video"
                />
                <input
                  type="text"
                  value={formData.heroVideo}
                  onChange={(e) => setFormData({ ...formData, heroVideo: e.target.value })}
                  placeholder="Or enter video URL manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                />
                <ImageUploadField
                  label="Banner Image"
                  value={formData.bannerImage}
                  onChange={(url) => setFormData({ ...formData, bannerImage: url })}
                  onMetadataChange={(meta) => setFormData((prev) => ({
                    ...prev,
                    bannerImageMetadata: meta || {},
                  }))}
                  accept="image/jpeg,image/jpg,image/jfif,image/png,image/webp,image/gif,image/bmp"
                  maxSize={10 * 1024 * 1024}
                  mimeType={formData.bannerImageMetadata?.mimeType || ''}
                  mediaType="image"
                />
                <input
                  type="text"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  placeholder="Or enter image URL manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                />
                <ImageUploadField
                  label="Banner Video"
                  value={formData.bannerVideo}
                  onChange={(url) => setFormData({ ...formData, bannerVideo: url })}
                  onMetadataChange={(meta) => setFormData((prev) => ({
                    ...prev,
                    bannerVideoMetadata: meta || {},
                  }))}
                  accept="video/mp4,video/webm,video/quicktime,video/ogg"
                  maxSize={50 * 1024 * 1024}
                  mimeType={formData.bannerVideoMetadata?.mimeType || ''}
                  mediaType="video"
                />
                <input
                  type="text"
                  value={formData.bannerVideo}
                  onChange={(e) => setFormData({ ...formData, bannerVideo: e.target.value })}
                  placeholder="Or enter video URL manually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                />
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="text-gold focus:ring-gold"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="ml-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Footer action buttons - fixed at bottom */}
              <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-charcoal text-ivory rounded-md hover:bg-deep-brown"
                >
                  {editingCollection ? 'Save Changes' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;

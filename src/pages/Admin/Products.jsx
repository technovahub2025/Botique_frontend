import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Edit, Trash2, Plus, Eye, MoreVertical } from 'lucide-react';
import { formatPrice } from '../../utils';
import adminApi from '../../services/adminApi';
import { getImageUrl } from '../../services/imageUrl';

const STATUSES = ['all', 'draft', 'active', 'archived'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
      });
      if (search) params.set('search', search);
      if (filter !== 'all') params.set('status', filter);

      const res = await adminApi.get(`/products?${params}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleteLoading(id);
    try {
      await adminApi.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-charcoal text-ivory px-4 py-2 rounded-md font-medium hover:bg-deep-brown transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium">Product</th>
                    <th className="text-left p-3 font-medium">SKU</th>
                    <th className="text-right p-3 font-medium">Price</th>
                    <th className="text-center p-3 font-medium">Stock</th>
                    <th className="text-center p-3 font-medium">Status</th>
                    <th className="text-center p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b last:border-0">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                            {product.thumbnail && (
                              <img
                                src={getImageUrl(product.thumbnail)}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.sizes?.join(', ') || 'No sizes'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600">{product.sku || '-'}</td>
                      <td className="p-3 text-right">
                        {product.salePrice ? (
                          <div>
                            <span className="text-gray-500 line-through text-xs">{formatPrice(product.price)}</span>
                            <div className="font-medium">{formatPrice(product.salePrice)}</div>
                          </div>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`${
                            product.stock === 0
                              ? 'text-red-600'
                              : product.stock < (product.lowStockThreshold || 5)
                              ? 'text-orange-600'
                              : 'text-green-600'
                          }`}
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : 'Out of stock'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'archived'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="p-1 text-gray-600 hover:text-charcoal hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleteLoading === product._id}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete"
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
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <p>Page {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;

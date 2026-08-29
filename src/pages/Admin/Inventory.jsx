import { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [newStock, setNewStock] = useState(0);

  const FILTERS = [
    { value: 'all', label: 'All Products' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out', label: 'Out of Stock' },
    { value: 'in', label: 'In Stock' },
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/products?limit=100');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (id, stock) => {
    setUpdatingId(id);
    setNewStock(stock);
    try {
      await adminApi.put(`/products/${id}`, { stock });
      fetchProducts();
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const isLowStock = (product) => {
    if (product.stockBySize && product.stockBySize.length > 0) {
      return product.stockBySize.some((s) => s.quantity < (product.lowStockThreshold || 5));
    }
    return (product.stock || 0) < (product.lowStockThreshold || 5);
  };

  const isOutOfStock = (product) => {
    if (product.stockBySize && product.stockBySize.length > 0) {
      return product.stockBySize.every((s) => s.quantity === 0);
    }
    return (product.stock || 0) === 0;
  };

  const filteredProducts = products
    .filter((p) => {
      if (filter === 'low') return isLowStock(p) && !isOutOfStock(p);
      if (filter === 'out') return isOutOfStock(p);
      if (filter === 'in') return !isOutOfStock(p);
      return true;
    })
    .filter(
      (p) =>
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );

  const lowStockCount = products.filter(isLowStock).length;
  const outOfStockCount = products.filter(isOutOfStock).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Inventory</h1>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1 text-red-600">
            <XCircle className="w-4 h-4" />
            Out of Stock: {outOfStockCount}
          </span>
          <span className="flex items-center gap-1 text-orange-600">
            <AlertTriangle className="w-4 h-4" />
            Low Stock: {lowStockCount}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or SKU..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">SKU</th>
                <th className="text-center p-3 font-medium">Stock</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const low = isLowStock(product);
                  const out = isOutOfStock(product);
                  return (
                    <tr key={product._id} className="border-b last:border-0">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {product.thumbnail && (
                            <img src={product.thumbnail} alt="" className="w-8 h-8 rounded object-cover" />
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{product.sku || '-'}</td>
                      <td className="p-3 text-center">
                        {product.stockBySize && product.stockBySize.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {product.stockBySize.map((s, idx) => (
                              <span key={idx} className="text-xs">
                                {s.size}: {s.quantity}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span
                            className={`font-medium ${out ? 'text-red-600' : low ? 'text-orange-600' : 'text-green-600'}`}
                          >
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {out ? (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        ) : low ? (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {product.stockBySize && product.stockBySize.length > 0 ? (
                          <span className="text-xs text-gray-500">Size-based stock</span>
                        ) : (
                          <div className="flex justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              defaultValue={product.stock}
                              onBlur={(e) => updateStock(product._id, Number(e.target.value))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const input = e.target;
                                  updateStock(product._id, Number(input.value));
                                }
                              }}
                              className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-gold"
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;

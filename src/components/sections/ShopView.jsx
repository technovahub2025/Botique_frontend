import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import { toArray } from '../../utils';
import ProductCard from '../ui/ProductCard';
import ShopFilters from './ShopFilters';

const sortOptions = [
  { label: 'New Arrivals', value: { sortBy: 'createdAt', order: 'desc' } },
  { label: 'Price: Low to High', value: { sortBy: 'price', order: 'asc' } },
  { label: 'Price: High to Low', value: { sortBy: 'price', order: 'desc' } },
  { label: 'Name: A to Z', value: { sortBy: 'name', order: 'asc' } },
  { label: 'Name: Z to A', value: { sortBy: 'name', order: 'desc' } },
];

const ShopView = ({ categorySlug = null, collectionSlug = null, title = 'Shop All' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMobileOpen, setFilterMobileOpen] = useState(false);

  const params = Object.fromEntries(searchParams);
  const page = parseInt(params.page) || 1;
  const limit = 12;

  const currentFilters = {
    search: params.search || '',
    category: params.category || (categorySlug || ''),
    collection: params.collection || (collectionSlug || ''),
    minPrice: params.minPrice || '',
    maxPrice: params.maxPrice || '',
    sizes: params.sizes ? params.sizes.split(',') : [],
    colors: params.colors ? params.colors.split(',') : [],
    inStock: params.inStock === 'true',
    newArrival: params.newArrival === 'true',
    salePrice: params.salePrice === 'true',
    sortBy: params.sortBy || 'createdAt',
    order: params.order || 'desc',
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, collRes] = await Promise.all([
          api.get('/categories?status=active'),
          api.get('/collections?status=active'),
        ]);
         setCategories(toArray(catRes.data, ['categories']));
         setCollections(toArray(collRes.data, ['collections']));
      } catch {
        setCategories([]);
        setCollections([]);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const apiParams = {
          limit,
          page,
          sortBy: currentFilters.sortBy,
          order: currentFilters.order,
        };

        if (currentFilters.search) apiParams.search = currentFilters.search;
        if (currentFilters.category) apiParams.category = currentFilters.category;
        if (currentFilters.collection) apiParams.collection = currentFilters.collection;
        if (currentFilters.minPrice) apiParams.minPrice = currentFilters.minPrice;
        if (currentFilters.maxPrice) apiParams.maxPrice = currentFilters.maxPrice;
        if (currentFilters.newArrival) apiParams.newArrival = true;
        if (currentFilters.sizes.length || currentFilters.colors.length || currentFilters.inStock || currentFilters.salePrice) {
          apiParams.status = 'active';
        }

        const res = await api.get('/products', { params: apiParams });
         setProducts(toArray(res.data, ['products']));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const { filteredProducts, availableSizes, availableColors } = useMemo(() => {
    let result = Array.isArray(products) ? products : [];

    if (currentFilters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes?.some((s) => currentFilters.sizes.includes(s))
      );
    }

    if (currentFilters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors?.some((c) => currentFilters.colors.includes(c))
      );
    }

    if (currentFilters.inStock) {
      result = result.filter((p) => p.stock > 0);
    }

    if (currentFilters.salePrice) {
      result = result.filter((p) => p.salePrice && p.salePrice < p.price);
    }

    const sizes = [...new Set(products.flatMap((p) => p.sizes || []))];
    const colors = [...new Set(products.flatMap((p) => p.colors || []))];

    return { filteredProducts: result, availableSizes: sizes, availableColors: colors };
  }, [products, currentFilters.sizes, currentFilters.colors, currentFilters.inStock, currentFilters.salePrice]);

  const totalResults = filteredProducts.length;

  const updateFilters = (newFilters) => {
    const newParams = {};
    if (newFilters.search) newParams.search = newFilters.search;
    if (newFilters.category) newParams.category = newFilters.category;
    if (newFilters.collection) newParams.collection = newFilters.collection;
    if (newFilters.minPrice) newParams.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice) newParams.maxPrice = newFilters.maxPrice;
    if (newFilters.sizes?.length) newParams.sizes = newFilters.sizes.join(',');
    if (newFilters.colors?.length) newParams.colors = newFilters.colors.join(',');
    if (newFilters.inStock) newParams.inStock = 'true';
    if (newFilters.newArrival) newParams.newArrival = 'true';
    if (newFilters.salePrice) newParams.salePrice = 'true';
    newParams.sortBy = newFilters.sortBy;
    newParams.order = newFilters.order;
    newParams.page = '1';
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const newParams = {};
    if (categorySlug) newParams.category = categorySlug;
    if (collectionSlug) newParams.collection = collectionSlug;
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const selected = sortOptions.find((opt) => opt.value.sortBy === e.target.value);
    if (selected) {
      const newParams = { ...params };
      newParams.sortBy = selected.value.sortBy;
      newParams.order = selected.value.order;
      newParams.page = '1';
      setSearchParams(newParams);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    const newParams = { ...params };
    if (query) newParams.search = query;
    else delete newParams.search;
    newParams.page = '1';
    setSearchParams(newParams);
  };

  const goToPage = (pageNum) => {
    const newParams = { ...params, page: String(pageNum) };
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8">
      {/* Page Title */}
      <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-6">{title}</h1>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <input
            type="search"
            placeholder="Search products..."
            value={currentFilters.search || ''}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={currentFilters.sortBy || 'createdAt'}
            onChange={handleSortChange}
            className="text-sm text-charcoal border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy"
          >
            {sortOptions.map((opt) => (
              <option key={opt.label} value={opt.value.sortBy}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setFilterMobileOpen(true)}
            className="md:hidden flex items-center gap-2 text-sm text-charcoal border border-gray-300 px-3 py-2 hover:bg-cream"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {loading ? 'Loading...' : `${totalResults} product${totalResults !== 1 ? 's' : ''} found`}
      </p>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <ShopFilters
              categories={categories}
              collections={collections}
              availableSizes={availableSizes}
              availableColors={availableColors}
              filters={currentFilters}
              onChange={updateFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        {/* Mobile Filter Overlay */}
        {filterMobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
            <div className="fixed inset-y-0 right-0 w-80 max-w-sm bg-ivory shadow-xl overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-heading text-lg text-charcoal">Filters</h3>
                <button
                  onClick={() => setFilterMobileOpen(false)}
                  className="text-charcoal hover:text-burgundy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <ShopFilters
                  categories={categories}
                  collections={collections}
                  availableSizes={availableSizes}
                  availableColors={availableColors}
                  filters={currentFilters}
                  onChange={updateFilters}
                  onClear={clearFilters}
                />
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products match your filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-burgundy hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 text-charcoal hover:text-burgundy disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-charcoal">
                Page {page}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={filteredProducts.length < limit}
                className="p-2 text-charcoal hover:text-burgundy disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopView;

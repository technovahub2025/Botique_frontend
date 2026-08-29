const ShopFilters = ({
  categories = [],
  collections = [],
  availableSizes = [],
  availableColors = [],
  filters,
  onChange,
  onClear,
}) => {
  const {
    category = '',
    collection = '',
    minPrice = '',
    maxPrice = '',
    sizes = [],
    colors = [],
    inStock = false,
  } = filters;

  const toggleSize = (size) => {
    const newSizes = sizes.includes(size)
      ? sizes.filter((s) => s !== size)
      : [...sizes, size];
    onChange({ ...filters, sizes: newSizes });
  };

  const toggleColor = (color) => {
    const newColors = colors.includes(color)
      ? colors.filter((c) => c !== color)
      : [...colors, color];
    onChange({ ...filters, colors: newColors });
  };

  const handleCheckbox = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-medium text-charcoal uppercase tracking-wider">
          Filters
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-gray-500 hover:text-burgundy underline"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-medium text-sm text-charcoal mb-3">Category</h4>
        <select
          value={category}
          onChange={(e) => handleCheckbox('category', e.target.value)}
          className="w-full text-sm text-charcoal border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Collection */}
      <div>
        <h4 className="font-medium text-sm text-charcoal mb-3">Collection</h4>
        <select
          value={collection}
          onChange={(e) => handleCheckbox('collection', e.target.value)}
          className="w-full text-sm text-charcoal border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy"
        >
          <option value="">All Collections</option>
          {collections.map((coll) => (
            <option key={coll._id} value={coll.slug}>
              {coll.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <h4 className="font-medium text-sm text-charcoal mb-3">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => handleCheckbox('minPrice', e.target.value)}
            className="w-full text-sm text-charcoal border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => handleCheckbox('maxPrice', e.target.value)}
            className="w-full text-sm text-charcoal border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-burgundy"
          />
        </div>
      </div>

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-charcoal mb-3">Size</h4>
          <div className="space-y-1">
            {availableSizes.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={sizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="w-4 h-4 rounded border-gray-300 text-burgundy focus:ring-burgundy"
                />
                <span className={sizes.includes(size) ? 'text-burgundy' : 'text-charcoal'}>
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h4 className="font-medium text-sm text-charcoal mb-3">Color</h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                title={color}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  colors.includes(color)
                    ? 'border-charcoal ring-2 ring-gold-light'
                    : 'border-gray-300 hover:border-charcoal'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="inStock"
          checked={inStock}
          onChange={(e) => handleCheckbox('inStock', e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-burgundy focus:ring-burgundy"
        />
        <label htmlFor="inStock" className="text-sm text-charcoal cursor-pointer">
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default ShopFilters;

"use client";

import { ShoppingCart, Search, Filter, X } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";

const Marketplace = ({ language = "en" }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [stockFilter, setStockFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rowOrder, setRowOrder] = useState([]);
  const itemsPerPage = 12;

  // Translations
  const translations = {
    en: {
      title: "Marketplace",
      subtitle: "Discover what farmers offer",
      search: "Search products...",
      filter: "Filter",
      price: "Price",
      perKg: "/kg",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      view: "View",
      viewDetail: "View Detail",
      viewProduct: "Product Details",
      productName: "Product Name",
      productPrice: "Price per kg",
      productDescription: "Description",
      productStock: "Stock Status",
      productCategory: "Category",
      selectCategory: "Select a category",
      close: "Close",
      seller: "Seller",
      sellerPhone: "Seller Phone",
      error: "Failed to load data. Please try again later.",
      loading: "Loading marketplace data...",
      page: "Page",
      of: "of",
      applyFilters: "Apply Filters",
      clearFilters: "Clear Filters",
      stock: "Stock",
      all: "All",
      priceRange: "Price Range",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      noProducts: "No products available",
    },
    km: {
      title: "ទីផ្សារ",
      subtitle: "ស្វែងរកអ្វីដែលកសិករផ្តល់ជូន",
      search: "ស្វែងរកផលិតផល...",
      filter: "តម្រង",
      price: "តម្លៃ",
      perKg: "/គ.ក",
      inStock: "មានស្តុក",
      outOfStock: "អស់ស្តុក",
      view: "មើល",
      viewDetail: "មើលលម្អិត",
      viewProduct: "ព័ត៌មានលម្អិតផលិតផល",
      productName: "ឈ្មោះផលិតផល",
      productPrice: "តម្លៃក្នុងមួយគីឡូក្រាម",
      productDescription: "ការពិពណ៌នា",
      productStock: "ស្ថានភាពស្តុក",
      productCategory: "ប្រភេទ",
      selectCategory: "ជ្រើសរើសប្រភេទ",
      close: "បិទ",
      seller: "អ្នកលក់",
      sellerPhone: "លេខទូរស័ព្ទអ្នកលក់",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      loading: "កំពុងផ្ទុកទិន្នន័យទីផ្សារ...",
      page: "ទំព័រ",
      of: "នៃ",
      applyFilters: "អនុវត្តតម្រង",
      clearFilters: "លុបតម្រង",
      stock: "ស្តុក",
      all: "ទាំងអស់",
      priceRange: "ជួរតម្លៃ",
      minPrice: "តម្លៃអប្បបរមា",
      maxPrice: "តម្លៃអតិបរមា",
      noProducts: "មិនមានផលិតផល",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products";
  const CATEGORIES_API_URL = "http://127.0.0.1:8000/api/categories";
  const AUTH_TOKEN = localStorage.getItem("token");

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch(API_URL, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${AUTH_TOKEN}`,
            },
          }),
          fetch(CATEGORIES_API_URL, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${AUTH_TOKEN}`,
            },
          }),
        ]);

        if (!productResponse.ok) {
          const text = await productResponse.text();
          throw new Error(`Products fetch failed: HTTP ${productResponse.status} ${productResponse.statusText} - ${text}`);
        }
        if (!categoryResponse.ok) {
          const text = await categoryResponse.text();
          throw new Error(`Categories fetch failed: HTTP ${categoryResponse.status} ${categoryResponse.statusText} - ${text}`);
        }

        const [productData, categoryData] = await Promise.all([
          productResponse.json(),
          categoryResponse.json(),
        ]);

        if (!Array.isArray(productData)) throw new Error("Products API response is not an array");
        if (!Array.isArray(categoryData)) throw new Error("Categories API response is not an array");

        const transformedProducts = productData.map((item) => ({
          id: item.id,
          name: item.name || "Unnamed Product",
          price: item.price ? Number(item.price) : 0,
          priceDisplay: item.price ? `$${Number(item.price).toFixed(2)}` : "$0.00",
          image: item.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image",
          seller: item.user?.name || "",
          sellerPhone: item.user?.phone || "N/A",
          stock: item.quantity > 0 ? "In Stock" : "Out of Stock",
          description: item.description || "No description available",
          category: item.category?.name || "",
          category_id: item.category_id,
        }));
        setProducts(transformedProducts);

        setCategories(categoryData);
      } catch (err) {
        console.error("Fetch data error:", err);
        setError(`${t.error}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error]);

  // Filter products using useMemo for performance
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product) return false;

      const lowerSearchTerm = searchTerm.toLowerCase().trim();
      const matchesSearch =
        (product.name?.toLowerCase()?.includes(lowerSearchTerm) ?? false) ||
        (product.description?.toLowerCase()?.includes(lowerSearchTerm) ?? false) ||
        (product.seller?.toLowerCase()?.includes(lowerSearchTerm) ?? false) ||
        (product.category?.toLowerCase()?.includes(lowerSearchTerm) ?? false);

      const matchesCategory =
        !selectedCategory || (product.category_id && product.category_id === Number.parseInt(selectedCategory));

      const matchesStock = stockFilter === "all" || product.stock === stockFilter;

      const minPriceNum = minPrice !== "" ? Number(minPrice) : -Infinity;
      const maxPriceNum = maxPrice !== "" ? Number(maxPrice) : Infinity;
      const matchesPrice =
        typeof product.price === "number" && product.price >= minPriceNum && product.price <= maxPriceNum;

      return matchesSearch && matchesCategory && matchesStock && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, stockFilter, minPrice, maxPrice]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate columns per row for responsive grid
  const getColumnsPerRow = () => {
    if (typeof window === "undefined") return 1; // Default for server-side rendering
    if (window.innerWidth >= 1280) return 4; // xl:grid-cols-4
    if (window.innerWidth >= 1024) return 3; // lg:grid-cols-3
    if (window.innerWidth >= 768) return 2; // md:grid-cols-2
    return 1; // grid-cols-1
  };

  // Initialize row order and reset page when filters or products change
  useEffect(() => {
    setCurrentPage(1); // Reset page to 1 whenever filters change
    const colsPerRow = getColumnsPerRow();
    const numRows = Math.ceil(paginatedProducts.length / colsPerRow);
    // Initialize rowOrder to a simple sequential order
    setRowOrder(Array.from({ length: numRows }, (_, i) => i));
  }, [searchTerm, selectedCategory, stockFilter, minPrice, maxPrice, products.length]);

  // Handle filter click with row animation
  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  // Handle view product
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Cycle rows: move first row to bottom, shift others up
    setRowOrder((prev) => {
      if (prev.length <= 1) return prev; // No change if less than 2 rows
      const newOrder = [...prev.slice(1), prev[0]]; // Shift first row to end
      return newOrder;
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCategory("");
    setStockFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setShowFilterModal(false);
    setCurrentPage(1);
    // Reset row order
    setRowOrder((prev) => Array.from({ length: prev.length }, (_, i) => i));
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
    setCurrentPage(1);
    // Cycle rows: move first row to bottom, shift others up
    setRowOrder((prev) => {
      if (prev.length <= 1) return prev; // No change if less than 2 rows
      const newOrder = [...prev.slice(1), prev[0]]; // Shift first row to end
      return newOrder;
    });
  };

  // Render products grouped by rows
  const renderProductRows = () => {
    const colsPerRow = getColumnsPerRow();
    const rows = [];
    for (let i = 0; i < paginatedProducts.length; i += colsPerRow) {
      rows.push(paginatedProducts.slice(i, i + colsPerRow));
    }

    return rowOrder.map((rowIndex, index) => (
      <div
        key={rowIndex}
        className="grid gap-6"
        style={{
          gridTemplateColumns: `repeat(${colsPerRow}, minmax(0, 1fr))`,
          transform: `translateY(${(index - rowOrder.indexOf(rowIndex)) * 100}%)`,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {rows[rowIndex]?.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300 h-96 cursor-pointer"
            onClick={() => handleViewProduct(product)}
          >
            <div className="absolute top-2 right-2 z-10">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                  product.stock === "In Stock" ? "bg-green-100/90 text-green-800" : "bg-red-100/90 text-red-800"
                }`}
              >
                {product.stock === "In Stock" ? t.inStock : t.outOfStock}
              </span>
            </div>
            <div className="relative w-full h-full">
              <img
                src={product.image || "/placeholder.svg?height=400&width=400"}
                alt={product.name || "Product"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-bold text-lg mb-1" style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}>
                  {product.name}
                </h3>
                <p
                  className="text-sm text-gray-200 mb-2 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                  }}
                >
                  {product.description}
                </p>
                {product.category && (
                  <p className="text-xs text-gray-300 mb-2">{t.productCategory}: {product.category}</p>
                )}
                <div className="flex items-center justify-between mb-2">
                  {product.seller && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-300">{product.seller}</span>
                    </div>
                  )}
                  <div className="text-xl font-bold text-green-400">
                    {product.priceDisplay}
                    <span className="text-xs text-gray-300">{t.perKg}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewProduct(product)}
                  className="w-full px-3 py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <ShoppingCart className="h-3 w-3" />
                  {t.viewDetail}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">{t.selectCategory}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleFilterClick}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t.filter}
            </button>
          </div>
        </div>
        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t.filter}</h2>
                <button onClick={() => setShowFilterModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-6">
                {/* Stock Filter */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">{t.stock}</label>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">{t.all}</option>
                    <option value="In Stock">{t.inStock}</option>
                    <option value="Out of Stock">{t.outOfStock}</option>
                  </select>
                </div>
                {/* Price Range Filter */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">{t.priceRange}</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder={t.minPrice}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      placeholder={t.maxPrice}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  {t.clearFilters}
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {t.applyFilters}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Loading, Error, and Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">{t.loading}</div>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 || products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">{t.noProducts}</div>
          </div>
        ) : (
          <>
            <div className="space-y-6">{renderProductRows()}</div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  {t.page} {currentPage} {t.of} {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {/* View Product Modal */}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t.viewProduct}</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-8 w-8" />
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <img
                        src={selectedProduct.image || "/placeholder.svg"}
                        alt={selectedProduct.name || "Product"}
                        className="w-full h-96 object-cover rounded-lg border shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.productName}</label>
                      <p className="text-2xl font-bold text-gray-900">{selectedProduct.name}</p>
                    </div>
                    {selectedProduct.category && (
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">{t.productCategory}</label>
                        <p className="text-xl text-gray-900">{selectedProduct.category}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.productPrice}</label>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedProduct.priceDisplay}
                        <span className="text-lg text-gray-500 font-normal">{t.perKg}</span>
                      </p>
                    </div>
                    {selectedProduct.seller && (
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">{t.seller}</label>
                        <p className="text-xl text-gray-900">{selectedProduct.seller}</p>
                      </div>
                    )}
                    {selectedProduct.sellerPhone && (
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">{t.sellerPhone}</label>
                        <p className="text-xl text-gray-900">{selectedProduct.sellerPhone}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.productStock}</label>
                      <span
                        className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                          selectedProduct.stock === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedProduct.stock === "In Stock" ? t.inStock : t.outOfStock}
                      </span>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.productDescription}</label>
                      <p className="text-lg text-gray-900 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-8 mt-8 border-t">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="w-full px-6 py-3 text-lg bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {t.close}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
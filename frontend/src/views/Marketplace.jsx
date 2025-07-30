"use client";

import { ShoppingCart, Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";

const Marketplace = ({ language = "en" }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false); // New state for filter modal
  const [stockFilter, setStockFilter] = useState("all"); // New state for stock filter
  const [minPrice, setMinPrice] = useState(""); // New state for min price
  const [maxPrice, setMaxPrice] = useState(""); // New state for max price
  const itemsPerPage = 8;

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
      error: "Failed to load data. Please try again later.",
      page: "Page",
      of: "of",
      applyFilters: "Apply Filters",
      clearFilters: "Clear Filters",
      stock: "Stock",
      all: "All",
      priceRange: "Price Range",
      minPrice: "Min Price",
      maxPrice: "Max Price",
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
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      page: "ទំព័រ",
      of: "នៃ",
      applyFilters: "អនុវត្តតម្រង",
      clearFilters: "លុបតម្រង",
      stock: "ស្តុក",
      all: "ទាំងអស់",
      priceRange: "ជួរតម្លៃ",
      minPrice: "តម្លៃអប្បបរមា",
      maxPrice: "តម្លៃអតិបរមា",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products";
  const CATEGORIES_API_URL = "http://127.0.0.1:8000/api/categories";
  const AUTH_TOKEN = "your-auth-token-here";

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const productResponse = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH_TOKEN}`,
          },
        });
        if (!productResponse.ok) {
          const text = await productResponse.text();
          throw new Error(`Products fetch failed: HTTP ${productResponse.status} ${productResponse.statusText} - ${text}`);
        }
        const productData = await productResponse.json();
        if (!Array.isArray(productData)) {
          throw new Error("Products API response is not an array");
        }
        const transformedProducts = productData.map((item) => ({
          id: item.id,
          name: item.name || "Unnamed Product",
          price: item.price ? Number(item.price) : 0, // Store as number for filtering
          priceDisplay: item.price ? `$${Number(item.price).toFixed(2)}` : "$0.00",
          image: item.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image",
          seller: item.user?.name || "",
          stock: item.quantity > 0 ? "In Stock" : "Out of Stock",
          description: item.description || "No description available",
          category: item.category?.name || "",
          category_id: item.category_id,
        }));
        setProducts(transformedProducts);

        const categoryResponse = await fetch(CATEGORIES_API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH_TOKEN}`,
          },
        });
        if (!categoryResponse.ok) {
          const text = await categoryResponse.text();
          throw new Error(`Categories fetch failed: HTTP ${categoryResponse.status} ${categoryResponse.statusText} - ${text}`);
        }
        const categoryData = await categoryResponse.json();
        if (!Array.isArray(categoryData)) {
          throw new Error("Categories API response is not an array");
        }
        setCategories(categoryData);
      } catch (err) {
        console.error("Fetch data error:", err);
        setError(`${t.error}: ${err.message}`);
      }
    };
    fetchData();
  }, [t.error]);

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      product &&
      ((product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.seller && product.seller.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (!selectedCategory || product.category_id === parseInt(selectedCategory)) &&
      (stockFilter === "all" || product.stock === stockFilter) &&
      (!minPrice || product.price >= Number(minPrice)) &&
      (!maxPrice || product.price <= Number(maxPrice)),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, stockFilter, minPrice, maxPrice]);

  // Handle view product
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSelectedCategory("");
    setStockFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setShowFilterModal(false);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
    setCurrentPage(1);
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
              onClick={() => setShowFilterModal(true)}
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
        {/* Error and Product Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
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
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.price}</label>
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
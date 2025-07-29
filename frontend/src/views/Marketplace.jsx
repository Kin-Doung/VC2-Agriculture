"use client";

import { ShoppingCart, Plus, Search, Filter, Star, X, Upload, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const Marketplace = ({ language = "en" }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    stock: "In Stock",
    image: "",
    imageFile: null,
    category_id: "",
  });
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    stock: "In Stock",
    image: "",
    imageFile: null,
    category_id: "",
  });

  // Translations for multilingual support
  const translations = {
    en: {
      title: "Marketplace",
      subtitle: "Sell your products and discover what other farmers offer",
      addProduct: "Add Product",
      search: "Search products...",
      filter: "Filter",
      price: "Price",
      perKg: "/kg",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      contact: "Contact Seller",
      rating: "Rating",
      addNewProduct: "Add New Product",
      editProduct: "Edit Product",
      viewProduct: "Product Details",
      productName: "Product Name",
      productPrice: "Price per kg",
      productDescription: "Description",
      productStock: "Stock Status",
      productCategory: "Category",
      selectCategory: "Select a category",
      uploadImage: "Upload Image",
      cancel: "Cancel",
      save: "Save Product",
      update: "Update Product",
      close: "Close",
      enterProductName: "Enter product name...",
      enterPrice: "Enter price...",
      enterDescription: "Enter product description...",
      noProductsFound: "No products found matching your search.",
      confirmDelete: "Are you sure you want to delete this product?",
      seller: "Seller",
      loading: "Loading products...",
      error: "Failed to load data. Please try again later.",
      updateError: "Failed to update product. Please try again.",
    },
    km: {
      title: "ទីផ្សារ",
      subtitle: "លក់ផលិតផលរបស់អ្នក និងស្វែងរកអ្វីដែលកសិករដទៃផ្តល់ជូន",
      addProduct: "បន្ថែមផលិតផល",
      search: "ស្វែងរកផលិតផល...",
      filter: "តម្រង",
      price: "តម្លៃ",
      perKg: "/គ.ក",
      inStock: "មានស្តុក",
      outOfStock: "អស់ស្តុក",
      edit: "កែប្រែ",
      delete: "លុប",
      view: "មើល",
      contact: "ទាក់ទងអ្នកលក់",
      rating: "ការវាឯតម្លៃ",
      addNewProduct: "បន្ថែមផលិតផលថ្មី",
      editProduct: "កែប្រែផលិតផល",
      viewProduct: "ព័ត៌មានលម្អិតផលិតផល",
      productName: "ឈ្មោះផលិតផល",
      productPrice: "តម្លៃក្នុងមួយគីឡូក្រាម",
      productDescription: "ការពិពណ៌នា",
      productStock: "ស្ថានភាពស្តុក",
      productCategory: "ប្រភេទ",
      selectCategory: "ជ្រើសរើសប្រភេទ",
      uploadImage: "ផ្ទុករូបភាព",
      cancel: "បោះបង់",
      save: "រក្សាទុកផលិតផល",
      update: "ធ្វើបច្ចុប្បន្នភាពផលិតផល",
      close: "បិទ",
      enterProductName: "បញ្ចូលឈ្មោះផលិតផល...",
      enterPrice: "បញ្ចូលតម្លៃ...",
      enterDescription: "បញ្ចូលការពិពណ៌នាផលិតផល...",
      noProductsFound: "រកមិនឃើញផលិតផលដែលត្រូវនឹងការស្វែងរករបស់អ្នក។",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះមែនទេ?",
      seller: "អ្នកលក់",
      loading: "កំពុងផ្ទុកផលិតផល...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      updateError: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពផលិតផល។ សូមព្យាយាមម្តងទៀត។",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products";
  const CATEGORIES_API_URL = "http://127.0.0.1:8000/api/categories";
  const AUTH_TOKEN = "your-auth-token-here"; // Replace with actual token or use auth context

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch products
        console.log("Attempting to fetch products from:", API_URL);
        const productResponse = await fetch(API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH_TOKEN}`, // Add auth header
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
          price: item.price ? `$${Number(item.price).toFixed(2)}` : "$0.00",
          image: item.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image",
          seller: item.user?.name || "Unknown Seller",
          rating: item.rating || 0,
          stock: item.quantity > 0 ? "In Stock" : "Out of Stock",
          description: item.description || "No description available",
          category: item.category?.name || "Uncategorized",
          category_id: item.category_id,
        }));
        setProducts(transformedProducts);

        // Fetch categories
        console.log("Attempting to fetch categories from:", CATEGORIES_API_URL);
        const categoryResponse = await fetch(CATEGORIES_API_URL, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH_TOKEN}`, // Add auth header
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error]);

  // Filter products based on search term and selected category
  const filteredProducts = products.filter(
    (product) =>
      product &&
      ((product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.seller && product.seller.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (!selectedCategory || product.category_id === parseInt(selectedCategory)),
  );

  // Toggle dropdown menu for product actions
  const toggleMenu = (productId) => {
    setActiveMenu(activeMenu === productId ? null : productId);
  };

  // View product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
    setActiveMenu(null);
  };

  // Prepare product for editing
  const handleEditProduct = (product) => {
    setEditProduct({
      id: product.id,
      name: product.name || "",
      price: product.price ? product.price.replace("$", "") : "",
      description: product.description || "",
      stock: product.stock || "In Stock",
      image: product.image || "",
      imageFile: null,
      category_id: product.category_id || "",
    });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        console.log("Deleting product:", productId);
        const response = await fetch(`${API_URL}/${productId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${AUTH_TOKEN}`, // Add auth header
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText} - ${text}`);
        }
        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        console.error("Delete product error:", err);
        alert(`${t.error}: ${err.message}`);
      }
    }
    setActiveMenu(null);
  };

  // Handle input changes for new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for edit product form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload for new product
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct((prev) => ({
          ...prev,
          image: e.target.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image upload for edit product
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditProduct((prev) => ({
          ...prev,
          image: e.target.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category_id) {
      alert("Please fill in all required fields, including category");
      return;
    }
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("quantity", newProduct.stock === "In Stock" ? 10 : 0);
    formData.append("user_id", 1); // Replace with actual user ID from auth context
    formData.append("category_id", newProduct.category_id);
    formData.append("crop_id", 1); // Replace with actual crop ID if needed
    if (newProduct.imageFile) {
      formData.append("image", newProduct.imageFile);
    }
    try {
      console.log("Adding product with data:", Object.fromEntries(formData));
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`, // Add auth header
        },
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} ${response.statusText} - ${text}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Response is not JSON: ${text.slice(0, 100)}...`);
      }
      const savedProduct = await response.json();
      const transformedProduct = {
        id: savedProduct.id,
        name: savedProduct.name || "Unnamed Product",
        price: savedProduct.price ? `$${Number(savedProduct.price).toFixed(2)}` : "$0.00",
        image: savedProduct.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image",
        seller: savedProduct.user?.name || "Unknown Seller",
        rating: savedProduct.rating || 0,
        stock: savedProduct.quantity > 0 ? "In Stock" : "Out of Stock",
        description: savedProduct.description || "No description available",
        category: savedProduct.category?.name || "Uncategorized",
        category_id: savedProduct.category_id,
      };
      setProducts((prev) => [transformedProduct, ...prev]);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        stock: "In Stock",
        image: "",
        imageFile: null,
        category_id: "",
      });
      setShowAddModal(false);
    } catch (err) {
      console.error("Add product error:", err);
      alert(`${t.error}: ${err.message}`);
    }
  };

  // Update existing product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct.name || !editProduct.price || !editProduct.description || !editProduct.category_id) {
      alert("Please fill in all required fields, including category");
      return;
    }
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("price", parseFloat(editProduct.price));
    formData.append("description", editProduct.description);
    formData.append("quantity", editProduct.stock === "In Stock" ? 10 : 0);
    formData.append("user_id", 1); // Replace with actual user ID from auth context
    formData.append("category_id", editProduct.category_id);
    formData.append("crop_id", 1); // Replace with actual crop ID if needed
    if (editProduct.imageFile) {
      formData.append("image", editProduct.imageFile);
    }
    // Add _method field for Laravel if needed
    formData.append("_method", "PUT");
    try {
      console.log("Updating product with data:", Object.fromEntries(formData));
      const response = await fetch(`${API_URL}/${editProduct.id}`, {
        method: "POST", // Use POST with _method=PUT for Laravel compatibility
        headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`, // Add auth header
        },
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Update failed: HTTP ${response.status} ${response.statusText} - ${text}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Response is not JSON: ${text.slice(0, 100)}...`);
      }
      const updatedProduct = await response.json();
      const transformedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name || "Unnamed Product",
        price: updatedProduct.price ? `$${Number(updatedProduct.price).toFixed(2)}` : "$0.00",
        image: updatedProduct.image_url || "/placeholder.svg?height=400&width=400&text=Product+Image",
        seller: updatedProduct.user?.name || "Unknown Seller",
        rating: updatedProduct.rating || 0,
        stock: updatedProduct.quantity > 0 ? "In Stock" : "Out of Stock",
        description: updatedProduct.description || "No description available",
        category: updatedProduct.category?.name || "Uncategorized",
        category_id: updatedProduct.category_id,
      };
      setProducts(products.map((product) => (product.id === editProduct.id ? transformedProduct : product)));
      setEditProduct({
        id: null,
        name: "",
        price: "",
        description: "",
        stock: "In Stock",
        image: "",
        imageFile: null,
        category_id: "",
      });
      setShowEditModal(false);
    } catch (err) {
      console.error("Update product error:", err);
      alert(`${t.updateError}: ${err.message}`);
    }
  };

  // Handle clicking outside to close menu
  const handleClickOutside = () => {
    setActiveMenu(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6" onClick={handleClickOutside}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
            <p className="text-green-600">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t.addProduct}
          </button>
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
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t.filter}
            </button>
          </div>
        </div>
        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t.loading}</div>
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">{t.noProductsFound}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300 h-96"
              >
                {/* Menu Button */}
                <div className="absolute top-2 right-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(product.id);
                    }}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 duration-200"
                  >
                    <MoreVertical className="h-3 w-3 text-gray-600" />
                  </button>
                  {activeMenu === product.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProduct(product);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye className="h-3 w-3" />
                        {t.view}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(product);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit className="h-3 w-3" />
                        {t.edit}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        {t.delete}
                      </button>
                    </div>
                  )}
                </div>
                {/* Stock Status Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                      product.stock === "In Stock" ? "bg-green-100/90 text-green-800" : "bg-red-100/90 text-red-800"
                    }`}
                  >
                    {product.stock === "In Stock" ? t.inStock : t.outOfStock}
                  </span>
                </div>
                {/* 100% Full Image Container */}
                <div className="relative w-full h-full">
                  <img
                    src={product.image || "/placeholder.svg?height=400&width=400"}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient Overlay for Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  {/* Product Info Overlay */}
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
                    <p className="text-xs text-gray-300 mb-2">{t.productCategory}: {product.category}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{product.rating}</span>
                        <span className="text-xs text-gray-300">• {product.seller}</span>
                      </div>
                      <div className="text-xl font-bold text-green-400">
                        {product.price}
                        <span className="text-xs text-gray-300">{t.perKg}</span>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                      <ShoppingCart className="h-3 w-3" />
                      {t.contact}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.addNewProduct}</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.productName} *</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder={t.enterProductName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.productPrice} *</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder={t.enterPrice}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.productDescription} *</label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder={t.enterDescription}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.productCategory} *</label>
                  <select
                    name="category_id"
                    value={newProduct.category_id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.productStock}</label>
                  <select
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="In Stock">{t.inStock}</option>
                    <option value="Out of Stock">{t.outOfStock}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.uploadImage}</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </label>
                    {newProduct.image && (
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Edit Product Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t.editProduct}</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-8 w-8" />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Image */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-4">{t.uploadImage}</label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="hidden"
                          id="edit-image-upload"
                        />
                        <label
                          htmlFor="edit-image-upload"
                          className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[200px]"
                        >
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-lg text-gray-600">Choose Image or Drag & Drop</span>
                          <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span>
                        </label>
                        {editProduct.image && (
                          <div className="mt-4">
                            <img
                              src={editProduct.image}
                              alt="Preview"
                              className="w-full h-64 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Right Column - Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">{t.productName} *</label>
                      <input
                        type="text"
                        name="name"
                        value={editProduct.name}
                        onChange={handleEditInputChange}
                        placeholder={t.enterProductName}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">{t.productPrice} *</label>
                      <input
                        type="number"
                        name="price"
                        value={editProduct.price}
                        onChange={handleEditInputChange}
                        placeholder={t.enterPrice}
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">{t.productDescription} *</label>
                      <textarea
                        name="description"
                        value={editProduct.description}
                        onChange={handleEditInputChange}
                        placeholder={t.enterDescription}
                        rows={6}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">{t.productCategory} *</label>
                      <select
                        name="category_id"
                        value={editProduct.category_id}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">{t.selectCategory}</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">{t.productStock}</label>
                      <select
                        name="stock"
                        value={editProduct.stock}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="In Stock">{t.inStock}</option>
                        <option value="Out of Stock">{t.outOfStock}</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-8 mt-8 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 text-lg border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t.update}
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                  {/* Left Column - Image */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <img
                        src={selectedProduct.image || "/placeholder.svg"}
                        alt={selectedProduct.name || "Product"}
                        className="w-full h-96 object-cover rounded-lg border shadow-lg"
                      />
                    </div>
                  </div>
                  {/* Right Column - Product Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.productName}</label>
                      <p className="text-2xl font-bold text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.productCategory}</label>
                      <p className="text-xl text-gray-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.price}</label>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedProduct.price}
                        <span className="text-lg text-gray-500 font-normal">{t.perKg}</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.seller}</label>
                      <p className="text-xl text-gray-900">{selectedProduct.seller}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.rating}</label>
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-400 fill-current" />
                        <span className="text-xl font-semibold text-gray-900">{selectedProduct.rating}</span>
                        <span className="text-lg text-gray-500">out of 5</span>
                      </div>
                    </div>
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
                      className="flex-1 px-6 py-3 text-lg bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {t.close}
                    </button>
                    <button className="flex-1 px-6 py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3">
                      <ShoppingCart className="h-5 w-5" />
                      {t.contact}
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
"use client";

import { ShoppingCart, Plus, Search, Filter, Star, X, Upload, MoreVertical, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const Product = ({ language = "en" }) => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  const translations = {
    en: {
      title: "My Product",
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
      deleteSuccess: "Product deleted successfully.",
      updateSuccess: "Product updated successfully.",
      image: "Image",
      addError: "Failed to add product. Please try again. Check console for details.",
      prevPage: "Previous",
      nextPage: "Next",
    },
    km: {
      title: "ផលិតផលរបស់ខ្ញុំ",
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
      loading: "Loading products...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      updateError: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពផលិតផល។ សូមព្យាឯយាមម្តងទៀត។",
      deleteSuccess: "ផលិតផលត្រូវបានលុបដោយជោគជ័យ។",
      updateSuccess: "ផលិតផលត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
      image: "រូបភាព",
      addError: "Failed to add product. Please try again. Check console for details.",
      prevPage: "មុន",
      nextPage: "បន្ទាប់",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products";
  const CATEGORIES_API_URL = "http://127.0.0.1:8000/api/categories";
  const AUTH_TOKEN = "your-auth-token-here"; // Replace with a valid token

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productResponse = await fetch(API_URL, {
          headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
        });
        if (!productResponse.ok) throw new Error(`Products fetch failed: ${await productResponse.text()}`);
        const productData = await productResponse.json();
        if (!Array.isArray(productData)) throw new Error("Products API response is not an array");
        const transformedProducts = productData.map((item) => ({
          id: item.id || null,
          name: item.name || "Unnamed Product",
          price: item.price ? `$${Number(item.price).toFixed(2)}` : "$0.00",
          image: item.image_url || "/placeholder.svg",
          seller: item.user?.name || "Unknown Seller",
          rating: item.rating || 0,
          stock: item.quantity > 0 ? "In Stock" : "Out of Stock",
          description: item.description || "No description",
          category: item.category?.name || "Uncategorized",
          category_id: item.category_id || null,
        }));
        setProducts(transformedProducts);

        const categoryResponse = await fetch(CATEGORIES_API_URL, {
          headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
        });
        if (!categoryResponse.ok) throw new Error(`Categories fetch failed: ${await categoryResponse.text()}`);
        const categoryData = await categoryResponse.json();
        if (!Array.isArray(categoryData)) throw new Error("Categories API response is not an array");
        setCategories(categoryData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`${t.error}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error]);

  const filteredProducts = products.filter((product) =>
    product &&
    ((product.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (product.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (product.seller?.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (product.category?.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (!selectedCategory || product.category_id === parseInt(selectedCategory))
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleMenu = (productId) => setActiveMenu(activeMenu === productId ? null : productId);
  const handleViewProduct = (product) => { setSelectedProduct(product); setShowViewModal(true); setActiveMenu(null); };
  const handleEditProduct = (product) => { setEditProduct({ ...product, price: product.price.replace("$", ""), imageFile: null }); setShowEditModal(true); setActiveMenu(null); };
  const handleDeleteProduct = async (productId) => {
    if (!productId || !window.confirm(t.confirmDelete)) return;
    try {
      const response = await fetch(`${API_URL}/${productId}`, { method: "DELETE", headers: { "Authorization": `Bearer ${AUTH_TOKEN}` } });
      if (!response.ok) throw new Error(`Delete failed: ${await response.text()}`);
      setProducts(products.filter((p) => p.id !== productId));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`${t.error}: ${err.message}`);
    }
    setActiveMenu(null);
  };

  const handleInputChange = (e) => setNewProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditInputChange = (e) => setEditProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setNewProduct((prev) => ({ ...prev, image: e.target.result, imageFile: file }));
      reader.readAsDataURL(file);
    }
  };
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setEditProduct((prev) => ({ ...prev, image: e.target.result, imageFile: file }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category_id) {
      alert("Please fill in all required fields, including category");
      return;
    }
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", parseFloat(newProduct.price));
    formData.append("description", newProduct.description);
    formData.append("quantity", newProduct.stock === "In Stock" ? 10 : 0);
    formData.append("user_id", 1); // Replace with dynamic user ID from auth context
    formData.append("category_id", newProduct.category_id);
    formData.append("crop_id", 1); // Replace with dynamic crop ID if applicable
    if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

    try {
      console.log("Adding product to:", API_URL);
      const formDataLog = {};
      for (let [key, value] of formData.entries()) formDataLog[key] = value instanceof File ? value.name : value;
      console.log("FormData:", formDataLog);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${AUTH_TOKEN}` }, // No Content-Type needed for FormData
        body: formData,
      });
      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);
      let savedProduct;
      try {
        savedProduct = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }
      if (!response.ok) throw new Error(`Add failed: ${response.status} - ${responseText}`);
      if (!savedProduct.id) throw new Error("API response missing product ID");
      const transformedProduct = {
        id: savedProduct.id,
        name: savedProduct.name,
        price: `$${Number(savedProduct.price).toFixed(2)}`,
        image: savedProduct.image_url || "/placeholder.svg",
        seller: savedProduct.user?.name || "Unknown Seller",
        rating: savedProduct.rating || 0,
        stock: savedProduct.quantity > 0 ? "In Stock" : "Out of Stock",
        description: savedProduct.description,
        category: savedProduct.category?.name || "Uncategorized",
        category_id: savedProduct.category_id,
      };
      setProducts((prev) => [transformedProduct, ...prev]);
      setNewProduct({ name: "", price: "", description: "", stock: "In Stock", image: "", imageFile: null, category_id: "" });
      setShowAddModal(false);
      alert(t.save);
    } catch (err) {
      console.error("Add product error:", err);
      alert(`${t.addError}: ${err.message}`);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editProduct.id || !editProduct.name || !editProduct.price || !editProduct.description || !editProduct.category_id) {
      alert("Please fill in all required fields, including category");
      return;
    }
    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("price", parseFloat(editProduct.price));
    formData.append("description", editProduct.description);
    formData.append("quantity", editProduct.stock === "In Stock" ? 10 : 0);
    formData.append("user_id", 1); // Replace with dynamic user ID
    formData.append("category_id", editProduct.category_id);
    formData.append("crop_id", 1); // Replace with dynamic crop ID if needed
    if (editProduct.imageFile) formData.append("image", editProduct.imageFile);
    formData.append("_method", "PUT");

    try {
      console.log("Updating product ID:", editProduct.id, "to:", API_URL);
      const formDataLog = {};
      for (let [key, value] of formData.entries()) formDataLog[key] = value instanceof File ? value.name : value;
      console.log("FormData:", formDataLog);
      const response = await fetch(`${API_URL}/${editProduct.id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${AUTH_TOKEN}` },
        body: formData,
      });
      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);
      let updatedProduct;
      try {
        updatedProduct = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }
      if (!response.ok) throw new Error(`Update failed: ${response.status} - ${responseText}`);
      if (!updatedProduct.id) throw new Error("Updated product response missing ID");
      const transformedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: `$${Number(updatedProduct.price).toFixed(2)}`,
        image: updatedProduct.image_url || "/placeholder.svg",
        seller: updatedProduct.user?.name || "Unknown Seller",
        rating: updatedProduct.rating || 0,
        stock: updatedProduct.quantity > 0 ? "In Stock" : "Out of Stock",
        description: updatedProduct.description,
        category: updatedProduct.category?.name || "Uncategorized",
        category_id: updatedProduct.category_id,
      };
      setProducts(products.map((p) => p.id === editProduct.id ? transformedProduct : p));
      setEditProduct({ id: null, name: "", price: "", description: "", stock: "In Stock", image: "", imageFile: null, category_id: "" });
      setShowEditModal(false);
      alert(t.updateSuccess);
    } catch (err) {
      console.error("Update product error:", err);
      alert(`${t.updateError}: ${err.message}`);
    }
  };

  const handleClickOutside = () => setActiveMenu(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6" onClick={handleClickOutside}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
            <p className="text-green-600">{t.subtitle}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t.addProduct}
          </button>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">{t.selectCategory}</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="h-4 w-4" /> {t.filter}
            </button>
          </div>
        </div>
        {loading || error || paginatedProducts.length === 0 ? (
          error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg">{error}</div>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>
            </div>
          ) : null
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("image")} className="flex items-center gap-1">
                      {t.image} {sortConfig.key === "image" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("name")} className="flex items-center gap-1">
                      {t.productName} {sortConfig.key === "name" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("price")} className="flex items-center gap-1">
                      {t.price} {sortConfig.key === "price" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("category")} className="flex items-center gap-1">
                      {t.productCategory} {sortConfig.key === "category" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("stock")} className="flex items-center gap-1">
                      {t.productStock} {sortConfig.key === "stock" && (sortConfig.direction === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded-lg shadow-sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} {t.perKg}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button onClick={(e) => { e.stopPropagation(); toggleMenu(product.id); }} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all">
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                      {activeMenu === product.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                          <button onClick={(e) => { e.stopPropagation(); handleViewProduct(product); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                            <Eye className="h-4 w-4" /> {t.view}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleEditProduct(product); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                            <Edit className="h-4 w-4" /> {t.edit}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" /> {t.delete}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex justify-between items-center">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300">
                {t.prevPage}
              </button>
              <span className="text-sm text-gray-600">{t.page} {currentPage} {t.of} {totalPages}</span>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300">
                {t.nextPage}
              </button>
            </div>
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.addNewProduct}</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
              </div>
              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.productName} *</label><input type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder={t.enterProductName} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.productPrice} *</label><input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder={t.enterPrice} step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.productDescription} *</label><textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder={t.enterDescription} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.productCategory} *</label><select name="category_id" value={newProduct.category_id} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required><option value="">{t.selectCategory}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.productStock}</label><select name="stock" value={newProduct.stock} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="In Stock">{t.inStock}</option><option value="Out of Stock">{t.outOfStock}</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">{t.uploadImage}</label><div className="flex items-center space-x-4"><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" /><label htmlFor="image-upload" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-2"><Upload className="h-4 w-4" /> Choose Image</label>{newProduct.image && <img src={newProduct.image} alt="Preview" className="h-12 w-12 object-cover rounded-lg" />}</div></div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">{t.cancel}</button><button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{t.save}</button></div>
              </form>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t.editProduct}</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-8 w-8" /></button>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6"><div><label className="block text-lg font-medium text-gray-700 mb-4">{t.uploadImage}</label><div className="space-y-4"><input type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" id="edit-image-upload" /><label htmlFor="edit-image-upload" className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[200px]"><Upload className="h-8 w-8 text-gray-400" /><span className="text-lg text-gray-600">Choose Image or Drag & Drop</span><span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span></label>{editProduct.image && <div className="mt-4"><img src={editProduct.image} alt="Preview" className="w-full h-64 object-cover rounded-lg border" /></div>}</div></div></div>
                  <div className="space-y-6">
                    <div><label className="block text-lg font-medium text-gray-700 mb-3">{t.productName} *</label><input type="text" name="name" value={editProduct.name} onChange={handleEditInputChange} placeholder={t.enterProductName} className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required /></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-3">{t.productPrice} *</label><input type="number" name="price" value={editProduct.price} onChange={handleEditInputChange} placeholder={t.enterPrice} step="0.01" min="0" className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required /></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-3">{t.productDescription} *</label><textarea name="description" value={editProduct.description} onChange={handleEditInputChange} placeholder={t.enterDescription} rows={6} className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none" required /></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-3">{t.productCategory} *</label><select name="category_id" value={editProduct.category_id} onChange={handleEditInputChange} className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required><option value="">{t.selectCategory}</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-3">{t.productStock}</label><select name="stock" value={editProduct.stock} onChange={handleEditInputChange} className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"><option value="In Stock">{t.inStock}</option><option value="Out of Stock">{t.outOfStock}</option></select></div>
                  </div>
                </div>
                <div className="flex gap-4 pt-8 mt-8 border-t"><button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-6 py-3 text-lg border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">{t.cancel}</button><button type="submit" className="flex-1 px-6 py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700">{t.update}</button></div>
              </form>
            </div>
          </div>
        )}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t.viewProduct}</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-8 w-8" /></button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6"><div className="text-center"><img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-96 object-cover rounded-lg border shadow-lg" /></div></div>
                  <div className="space-y-6">
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.productName}</label><p className="text-2xl font-bold text-gray-900">{selectedProduct.name}</p></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.productCategory}</label><p className="text-xl text-gray-900">{selectedProduct.category}</p></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.price}</label><p className="text-3xl font-bold text-green-600">{selectedProduct.price}<span className="text-lg text-gray-500 font-normal">{t.perKg}</span></p></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.seller}</label><p className="text-xl text-gray-900">{selectedProduct.seller}</p></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.rating}</label><div className="flex items-center gap-2"><Star className="h-6 w-6 text-yellow-400 fill-current" /><span className="text-xl font-semibold text-gray-900">{selectedProduct.rating}</span><span className="text-lg text-gray-500">out of 5</span></div></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.productStock}</label><span className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${selectedProduct.stock === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{selectedProduct.stock}</span></div>
                    <div><label className="block text-lg font-medium text-gray-700 mb-2">{t.productDescription}</label><p className="text-lg text-gray-900 leading-relaxed">{selectedProduct.description}</p></div>
                  </div>
                </div>
                <div className="pt-8 mt-8 border-t"><div className="flex gap-4"><button onClick={() => setShowViewModal(false)} className="w-full px-6 py-3 text-lg bg-gray-600 text-white rounded-lg hover:bg-gray-700">{t.close}</button></div></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
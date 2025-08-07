"use client";

import { Plus, Search, Filter, X, Upload, MoreVertical, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const Product = ({ language = "en" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    quantity: "",
    image: "",
    imageFile: null,
    category_id: "",
    crop_id: null,
    user_id: localStorage.getItem("user_id") || "1",
    creation_date: new Date().toISOString().split("T")[0], // Date only
    expiration_date: "",
  });
  const [editProduct, setEditProduct] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    quantity: "",
    image: "",
    imageFile: null,
    category_id: "",
    crop_id: null,
    user_id: localStorage.getItem("user_id") || "1",
    creation_date: new Date().toISOString().split("T")[0], // Date only
    expiration_date: "",
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
      enterProductName: "Enter product name",
      enterPrice: "Enter price",
      enterDescription: "Enter product description",
      enterQuantity: "Enter quantity",
      selectCategoryRequired: "Select a category",
      noProducts: "No products available. Add a new product to get started!",
      noFilteredProducts: "No products match your search or filters.",
      confirmDelete: "Are you sure you want to delete this product?",
      loading: "Loading products...",
      error: "Failed to load data. Please try again later.",
      updateError: "Failed to update product: ",
      deleteSuccess: "Product deleted successfully.",
      updateSuccess: "Product updated successfully.",
      addError: "Failed to add product: ",
      prevPage: "Previous",
      nextPage: "Next",
      stockStatus: "Stock Status",
      all: "All",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      applyFilters: "Apply Filters",
      resetFilters: "Reset Filters",
      creationDate: "Creation Date",
      expirationDate: "Expiration Date",
      enterExpirationDate: "Enter expiration date",
      invalidDate: "Invalid date format",
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
      enterProductName: "បញ្ចូលឈ្មោះផលិតផល",
      enterPrice: "បញ្ចូលតម្លៃ",
      enterDescription: "បញ្ចូលការពិពណ៌នាផលិតផល",
      enterQuantity: "បញ្ចូលបរិមាណ",
      selectCategoryRequired: "ជ្រើសរើសប្រភេទ",
      noProducts: "មិនមានផលិតផល។ បន្ថែមផលិតផលថ្មីដើម្បីចាប់ផ្តើម!",
      noFilteredProducts: "រកមិនឃើញផលិតផលដែលត្រូវនឹងការស្វែងរក ឬតម្រងរបស់អ្នក។",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះមែនទេ?",
      loading: "កំពុងផ្ទុកផលិតផល...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      updateError: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពផលិតផល៖ ",
      deleteSuccess: "ផលិតផលត្រូវបានលុបដោយជោគជ័យ។",
      updateSuccess: "ផលិតផលត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
      addError: "បរាជ័យក្នុងការបន្ថែមផលិតផល៖ ",
      prevPage: "មុន",
      nextPage: "បន្ទាប់",
      stockStatus: "ស្ថានភាពស្តុក",
      all: "ទាំងអស់",
      minPrice: "តម្លៃអប្បបរមា",
      maxPrice: "តម្លៃអតិបរមា",
      applyFilters: "អនុវត្តតម្រង",
      resetFilters: "កំណត់តម្រងឡើងវិញ",
      creationDate: "កាលបរិច្ឆេទបង្កើត",
      expirationDate: "កាលបរិច្ឆេទផុតកំណត់",
      enterExpirationDate: "បញ្ចូលកាលបរិច្ឆេទផុតកំណត់",
      invalidDate: "ទម្រង់កាលបរិច្ឆេទមិនត្រឹមត្រូវ",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products?only_mine=true";
  const CATEGORIES_API_URL = "http://127.0.0.1:8000/api/categories";
  const AUTH_TOKEN = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch(API_URL, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
          }),
          fetch(CATEGORIES_API_URL, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
          }),
        ]);

        if (!productResponse.ok) {
          const errorText = await productResponse.text();
          throw new Error(`Failed to fetch products: ${errorText}`);
        }
        const productData = await productResponse.json();
        console.log("Raw Product Data:", productData);
        if (!Array.isArray(productData)) throw new Error("Products API response is not an array");

        if (!categoryResponse.ok) {
          const errorText = await categoryResponse.text();
          throw new Error(`Failed to fetch categories: ${errorText}`);
        }
        const categoryData = await categoryResponse.json();
        console.log("Raw Category Data:", categoryData);
        if (!Array.isArray(categoryData)) throw new Error("Categories API response is not an array");

        const transformedProducts = productData.length
          ? productData.map((item) => ({
              id: item.id || null,
              name: item.name || "Unnamed Product",
              price: item.price ? `$${Number(item.price).toFixed(2)}` : "$0.00",
              image: item.image_url || "/placeholder.svg",
              stock: item.quantity > 0 ? t.inStock : t.outOfStock,
              description: item.description || "No description",
              category: item.category?.name || "Uncategorized",
              category_id: item.category_id || null,
              quantity: item.quantity || 0,
              creation_date: item.creation_date ? item.creation_date.split("T")[0] : new Date().toISOString().split("T")[0],
              expiration_date: item.expiration_date ? item.expiration_date.split("T")[0] : "",
            }))
          : [];

        setProducts(transformedProducts);
        console.log("Transformed Products:", transformedProducts);
        setCategories(
          categoryData.length
            ? categoryData.map((item) => ({ id: item.id, name: item.name || "Uncategorized" }))
            : [{ id: 1, name: "Sample Category" }]
        );
        console.log("Categories:", categories);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`${t.error}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error, t.inStock, t.outOfStock]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, stockStatus, minPrice, maxPrice]);

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const nameMatch = (product.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = (product.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = (product.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    const searchMatch = nameMatch || descriptionMatch || categoryMatch;
    const categoryFilter = !selectedCategory || product.category_id === parseInt(selectedCategory);
    const stockFilter = !stockStatus || product.stock === stockStatus;
    const priceValue = parseFloat(product.price?.replace("$", "") || 0);
    const minPriceFilter = !minPrice || priceValue >= parseFloat(minPrice);
    const maxPriceFilter = !maxPrice || priceValue <= parseFloat(maxPrice);
    return searchMatch && categoryFilter && stockFilter && minPriceFilter && maxPriceFilter;
  });

  console.log("Filtered Products:", filteredProducts);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("Paginated Products:", paginatedProducts, "Current Page:", currentPage, "Total Pages:", totalPages);

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleMenu = (productId) => setActiveMenu(activeMenu === productId ? null : productId);

  const handleClickOutside = () => setActiveMenu(null);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
    setActiveMenu(null);
  };

  const handleEditProduct = (product) => {
    setEditProduct({
      id: product.id,
      name: product.name,
      price: product.price.replace("$", ""),
      description: product.description,
      quantity: product.quantity || 0,
      image: product.image,
      imageFile: null,
      category_id: product.category_id || "",
      crop_id: product.crop_id || null,
      user_id: localStorage.getItem("user_id") || "1",
      creation_date: product.creation_date || new Date().toISOString().split("T")[0],
      expiration_date: product.expiration_date || "",
    });
    setSelectedCategory(product.category_id || "");
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId || !window.confirm(t.confirmDelete)) return;
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete failed: ${errorText}`);
      }
      setProducts(products.filter((p) => p.id !== productId));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`${t.error}: ${err.message}`);
    }
    setActiveMenu(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setNewProduct((prev) => ({ ...prev, category_id: categoryId }));
  };

  const handleEditCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setEditProduct((prev) => ({ ...prev, category_id: categoryId }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: "Please upload a valid image (JPEG, JPG, PNG)" }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, image: "Image size must be less than 10MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) =>
        setNewProduct((prev) => ({ ...prev, image: e.target.result, imageFile: file }));
      reader.readAsDataURL(file);
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: "Please upload a valid image (JPEG, JPG, PNG)" }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, image: "Image size must be less than 10MB" }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) =>
        setEditProduct((prev) => ({ ...prev, image: e.target.result, imageFile: file }));
      reader.readAsDataURL(file);
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = t.enterProductName;
    if (!data.price || parseFloat(data.price) <= 0) errors.price = t.enterPrice;
    if (!data.description.trim()) errors.description = t.enterDescription;
    if (!data.category_id) errors.category_id = t.selectCategoryRequired;
    if (data.quantity === "" || parseInt(data.quantity) < 0) errors.quantity = t.enterQuantity;
    if (!data.creation_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.creation_date))
      errors.creation_date = t.invalidDate;
    if (data.quantity == 0 && !data.expiration_date) errors.expiration_date = t.enterExpirationDate;
    if (data.expiration_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.expiration_date))
      errors.expiration_date = t.invalidDate;
    return errors;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const errors = validateForm(newProduct);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", parseFloat(newProduct.price));
    formData.append("description", newProduct.description);
    formData.append("quantity", parseInt(newProduct.quantity));
    formData.append("category_id", newProduct.category_id);
    formData.append("crop_id", newProduct.crop_id || 1);
    formData.append("user_id", newProduct.user_id);
    formData.append("creation_date", newProduct.creation_date);
    if (newProduct.expiration_date) formData.append("expiration_date", newProduct.expiration_date);
    if (newProduct.imageFile) formData.append("image", newProduct.imageFile);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Add Product Response:", responseText);
      if (!response.ok) {
        let errorMessage = `${t.addError}Unexpected error`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = `${t.addError}${errorData.message || "Unknown error"}`;
        } catch (parseErr) {
          errorMessage = `${t.addError}${responseText.slice(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      let savedProduct;
      try {
        savedProduct = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.addError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      const category = categories.find((c) => c.id === parseInt(newProduct.category_id));
      console.log("Selected Category ID:", newProduct.category_id, "Category Found:", category);

      const transformedProduct = {
        id: savedProduct.id,
        name: savedProduct.name,
        price: `$${Number(savedProduct.price).toFixed(2)}`,
        image: savedProduct.image_url || "/placeholder.svg",
        stock: savedProduct.quantity > 0 ? t.inStock : t.outOfStock,
        description: savedProduct.description,
        category: category ? category.name : "Uncategorized",
        category_id: savedProduct.category_id || newProduct.category_id,
        quantity: savedProduct.quantity,
        creation_date: savedProduct.creation_date ? savedProduct.creation_date.split("T")[0] : newProduct.creation_date,
        expiration_date: savedProduct.expiration_date ? savedProduct.expiration_date.split("T")[0] : newProduct.expiration_date,
      };

      console.log("New Product:", transformedProduct);

      setProducts((prev) => [transformedProduct, ...prev]);
      setNewProduct({
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: "",
        imageFile: null,
        category_id: "",
        crop_id: null,
        user_id: localStorage.getItem("user_id") || "1",
        creation_date: new Date().toISOString().split("T")[0],
        expiration_date: "",
      });
      setFormErrors({});
      setShowAddModal(false);
      setSelectedCategory("");
      setCurrentPage(1);
      alert(t.save);
    } catch (err) {
      console.error("Add product error:", err);
      alert(err.message);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const errors = validateForm(editProduct);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editProduct.name);
    formData.append("price", parseFloat(editProduct.price));
    formData.append("description", editProduct.description);
    formData.append("quantity", parseInt(editProduct.quantity));
    formData.append("category_id", editProduct.category_id);
    formData.append("crop_id", editProduct.crop_id || 1);
    formData.append("user_id", editProduct.user_id);
    formData.append("creation_date", editProduct.creation_date);
    if (editProduct.expiration_date) formData.append("expiration_date", editProduct.expiration_date);
    if (editProduct.imageFile) formData.append("image", editProduct.imageFile);
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/${editProduct.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        body: formData,
      });

      const responseText = await response.text();
      console.log("Update Product Response:", responseText);
      if (!response.ok) {
        let errorMessage = `${t.updateError}Unexpected error`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = `${t.updateError}${errorData.message || "Unknown error"}`;
        } catch (parseErr) {
          errorMessage = `${t.updateError}${responseText.slice(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }

      let updatedProduct;
      try {
        updatedProduct = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.updateError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      const category = categories.find((c) => c.id === parseInt(updatedProduct.category_id));
      const transformedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: `$${Number(updatedProduct.price).toFixed(2)}`,
        image: updatedProduct.image_url || "/placeholder.svg",
        stock: updatedProduct.quantity > 0 ? t.inStock : t.outOfStock,
        description: updatedProduct.description,
        category: category ? category.name : "Uncategorized",
        category_id: updatedProduct.category_id,
        quantity: updatedProduct.quantity,
        creation_date: updatedProduct.creation_date ? updatedProduct.creation_date.split("T")[0] : editProduct.creation_date,
        expiration_date: updatedProduct.expiration_date ? updatedProduct.expiration_date.split("T")[0] : editProduct.expiration_date,
      };

      setProducts(products.map((p) => (p.id === updatedProduct.id ? transformedProduct : p)));
      setEditProduct({
        id: null,
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: "",
        imageFile: null,
        category_id: "",
        crop_id: null,
        user_id: localStorage.getItem("user_id") || "1",
        creation_date: new Date().toISOString().split("T")[0],
        expiration_date: "",
      });
      setFormErrors({});
      setShowEditModal(false);
      setSelectedCategory("");
      alert(t.updateSuccess);
    } catch (err) {
      console.error("Update product error:", err);
      alert(err.message);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setStockStatus("");
    setMinPrice("");
    setMaxPrice("");
    setShowFilterModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6" onClick={handleClickOutside}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
            <p className="text-green-600">{t.subtitle}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> {t.addProduct}
          </button>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" /> {t.filter}
            </button>
          </div>
        </div>
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t.filter}</h2>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.stockStatus}
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{t.all}</option>
                    <option value={t.inStock}>{t.inStock}</option>
                    <option value={t.outOfStock}>{t.outOfStock}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.minPrice}
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder={t.minPrice}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.maxPrice}
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder={t.maxPrice}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t.resetFilters}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFilterModal(false)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t.applyFilters}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
        ) : paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">
              {products.length === 0 ? t.noProducts : t.noFilteredProducts}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.image}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("name")} className="flex items-center gap-1">
                      {t.productName}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("price")} className="flex items-center gap-1">
                      {t.price}
                      {sortConfig.key === "price" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("category")} className="flex items-center gap-1">
                      {t.productCategory}
                      {sortConfig.key === "category" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("stock")} className="flex items-center gap-1">
                      {t.productStock}
                      {sortConfig.key === "stock" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("creation_date")} className="flex items-center gap-1">
                      {t.creationDate}
                      {sortConfig.key === "creation_date" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("expiration_date")} className="flex items-center gap-1">
                      {t.expirationDate}
                      {sortConfig.key === "expiration_date" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-lg shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.price} {t.perKg}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock === t.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.creation_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.expiration_date || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(product.id);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                      {activeMenu === product.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProduct(product);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" /> {t.view}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> {t.edit}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
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
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
                {t.prevPage}
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
              >
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
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder={t.enterProductName}
                    className={`w-full px-3 py-2 border ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productPrice} *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder={t.enterPrice}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border ${
                      formErrors.price ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productDescription} *
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder={t.enterDescription}
                    rows={3}
                    className={`w-full px-3 py-2 border ${
                      formErrors.description ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.productCategory} *
                  </label>
                  <select
                    name="category_id"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.category_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  >
                    <option value="">{t.selectCategory}</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category_id && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.category_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.enterQuantity} *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    placeholder={t.enterQuantity}
                    min="0"
                    className={`w-full px-3 py-2 border ${
                      formErrors.quantity ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.quantity && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.creationDate} *
                  </label>
                  <input
                    type="date"
                    name="creation_date"
                    value={newProduct.creation_date}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.creation_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.creation_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.creation_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expirationDate} {newProduct.quantity == 0 ? "*" : ""}
                  </label>
                  <input
                    type="date"
                    name="expiration_date"
                    value={newProduct.expiration_date}
                    onChange={handleInputChange}
                    placeholder={t.enterExpirationDate}
                    className={`w-full px-3 py-2 border ${
                      formErrors.expiration_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required={newProduct.quantity == 0}
                  />
                  {formErrors.expiration_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.expiration_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.uploadImage}
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" /> Choose Image
                    </label>
                    {newProduct.image && (
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {formErrors.image && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
                  )}
                </div>
                <input type="hidden" name="crop_id" value={newProduct.crop_id || 1} />
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t.editProduct}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
              <form onSubmit={handleUpdateProduct} className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-4">
                        {t.uploadImage}
                      </label>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
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
                      {formErrors.image && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.productName} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editProduct.name}
                        onChange={handleEditInputChange}
                        placeholder={t.enterProductName}
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.name ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.productPrice} *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={editProduct.price}
                        onChange={handleEditInputChange}
                        placeholder={t.enterPrice}
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.price ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      />
                      {formErrors.price && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.productDescription} *
                      </label>
                      <textarea
                        name="description"
                        value={editProduct.description}
                        onChange={handleEditInputChange}
                        placeholder={t.enterDescription}
                        rows={6}
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.description ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none`}
                        required
                      />
                      {formErrors.description && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.productCategory} *
                      </label>
                      <select
                        name="category_id"
                        value={editProduct.category_id}
                        onChange={handleEditCategoryChange}
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.category_id ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      >
                        <option value="">{t.selectCategory}</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.category_id && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.category_id}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.enterQuantity} *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={editProduct.quantity}
                        onChange={handleEditInputChange}
                        placeholder={t.enterQuantity}
                        min="0"
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.quantity ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.quantity}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.creationDate} *
                      </label>
                      <input
                        type="date"
                        name="creation_date"
                        value={editProduct.creation_date}
                        onChange={handleEditInputChange}
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.creation_date ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      />
                      {formErrors.creation_date && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.creation_date}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        {t.expirationDate} {editProduct.quantity == 0 ? "*" : ""}
                      </label>
                      <input
                        type="date"
                        name="expiration_date"
                        value={editProduct.expiration_date}
                        onChange={handleEditInputChange}
                        placeholder={t.enterExpirationDate}
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.expiration_date ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required={editProduct.quantity == 0}
                      />
                      {formErrors.expiration_date && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.expiration_date}</p>
                      )}
                    </div>
                  </div>
                </div>
                <input type="hidden" name="crop_id" value={editProduct.crop_id || 1} />
                <div className="flex gap-4 pt-8 mt-8 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-6 py-3 text-lg border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t.update}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showViewModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-8 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{t.viewProduct}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-full h-96 object-cover rounded-lg border shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.productName}
                      </label>
                      <p className="text-2xl font-bold text-gray-900">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.productCategory}
                      </label>
                      <p className="text-xl text-gray-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.price}
                      </label>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedProduct.price}
                        <span className="text-lg text-gray-500 font-normal">{t.perKg}</span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.productStock}
                      </label>
                      <span
                        className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                          selectedProduct.stock === t.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedProduct.stock}
                      </span>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.creationDate}
                      </label>
                      <p className="text-xl text-gray-900">{selectedProduct.creation_date}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.expirationDate}
                      </label>
                      <p className="text-xl text-gray-900">{selectedProduct.expiration_date || "-"}</p>
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        {t.productDescription}
                      </label>
                      <p className="text-lg text-gray-900 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-8 mt-8 border-t">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="w-full px-6 py-3 text-lg bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
export default Product;
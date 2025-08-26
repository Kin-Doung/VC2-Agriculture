"use client";

import { Plus, Search, Filter, X, Upload, MoreVertical, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const Product = ({ language = "en" }) => {
  // State declarations (unchanged)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [crops, setCrops] = useState([]);
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
    crop_id: "",
    user_id: localStorage.getItem("user_id") || "1",
    creation_date: new Date().toISOString().split("T")[0],
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
    crop_id: "",
    user_id: localStorage.getItem("user_id") || "1",
    creation_date: new Date().toISOString().split("T")[0],
    expiration_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  // Translations (added outOfStockNotification)
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
      productCrop: "Crop",
      selectCategory: "Select a category",
      selectCrop: "Select a crop",
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
      selectCropRequired: "Select a crop",
      noProducts: "No products available. Add a new product to get started!",
      noFilteredProducts: "No products match your search or filters.",
      confirmDelete: "Are you sure you want to delete this product?",
      deleting: "Deleting...",
      deleteSuccess: "Product deleted successfully.",
      deleteError: "Failed to delete product: ",
      loading: "Loading products...",
      error: "Failed to load data. Please try again later.",
      addSuccess: "Product added successfully.",
      updateSuccess: "Product updated successfully.",
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
      invalidImage: "Please upload a valid image (JPEG, JPG, PNG, max 10MB)",
      outOfStockNotification: "Product out of stock, please set more",
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
      productCrop: "ដំណាំ",
      selectCategory: "ជ្រើសរើសប្រភេទ",
      selectCrop: "ជ្រើសរើសដំណាំ",
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
      selectCropRequired: "ជ្រើសរើសដំណាំ",
      noProducts: "មិនមានផលិតផល។ បន្ថែមផលិតផលថ្មីដើម្បីចាប់ផ្តើម!",
      noFilteredProducts: "រកមិនឃើញផលិតផលដែលត្រូវនឹងការស្វែងរក ឬតម្រងរបស់អ្នក។",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះមែនទេ?",
      deleting: "កំពុងលុប...",
      deleteSuccess: "ផលិតផលត្រូវបានលុបដោយជោគជ័យ។",
      deleteError: "បរាជ័យក្នុងការលុបផលិតផល៖ ",
      loading: "កំពុងផ្ទុកផលិតផល...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      addSuccess: "ផលិតផលត្រូវបានបន្ថែមដោយជោគជ័យ។",
      updateSuccess: "ផលិតផលត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
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
      invalidImage: "សូមផ្ទុករូបភាពត្រឹមត្រូវ (JPEG, JPG, PNG, អតិបរមា ១០ មេហ្គាបៃ)",
      outOfStockTaskTitle: "ផលិតផលអស់ស្តុក",
      outOfStockTaskDescription: "បំពេញស្តុកផលិតផល",
      outOfStockNotification: "ផលិតផលអស់ស្តុក សូមបន្ថែមបរិមាណ",
      taskAddError: "បរាជ័យក្នុងការបន្ថែមកិច្ចការអស់ស្តុក៖ ",
      taskFetchError: "បរាជ័យក្នុងការទាញយកកិច្ចការសម្រាប់ពិនិត្យស្ទួន៖ ",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products?only_mine=true";
  const PRODUCT_BASE_URL = "http://127.0.0.1:8000/api/products";
  const CATEGORIES_API_URL = "http://127.0.0.1:8000/api/categories";
  const CROPS_API_URL = "http://127.0.0.1:8000/api/crops";
  const AUTH_TOKEN = localStorage.getItem("token");

  // Fetch products, categories, and crops on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productResponse, categoryResponse, cropResponse] = await Promise.all([
          fetch(API_URL, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
          }),
          fetch(CATEGORIES_API_URL, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
          }),
          fetch(CROPS_API_URL, {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
          }),
        ]);

        if (!productResponse.ok) throw new Error(`${t.error}: ${await productResponse.text()}`);
        const productData = await productResponse.json();
        if (!Array.isArray(productData)) throw new Error("Products API response is not an array");

        if (!categoryResponse.ok) throw new Error(`${t.error}: ${await categoryResponse.text()}`);
        const categoryData = await categoryResponse.json();
        if (!Array.isArray(categoryData)) throw new Error("Categories API response is not an array");

        if (!cropResponse.ok) throw new Error(`${t.error}: ${await cropResponse.text()}`);
        const cropData = await cropResponse.json();
        if (!Array.isArray(cropData)) throw new Error("Crops API response is not an array");

        // Transform product data for frontend display
        const transformedProducts = productData.map((item) => {
          const today = new Date();
          const expirationDate = item.expiration_date ? new Date(item.expiration_date) : null;
          const isExpired = expirationDate && expirationDate < today;

          return {
            id: item.id,
            name: item.name || "Unnamed Product",
            price: `$${Number(item.price || 0).toFixed(2)}`,
            image: item.image_url || "/placeholder.svg",
            stock: isExpired || item.quantity === 0 ? t.outOfStock : t.inStock,
            description: item.description || "No description",
            category: item.category?.name || "Uncategorized",
            category_id: item.category_id || null,
            crop: item.crop?.name || "No Crop",
            crop_id: item.crop_id || null,
            quantity: item.quantity || 0,
            creation_date: item.creation_date ? item.creation_date.split("T")[0] : new Date().toISOString().split("T")[0],
            expiration_date: item.expiration_date ? new Date(item.expiration_date).toISOString().split("T")[0] : "",
          };
        });

        setProducts(transformedProducts);
        setCategories(categoryData.map((item) => ({ id: item.id, name: item.name || "Uncategorized" })));
        setCrops(cropData.map((item) => ({ id: item.id, name: item.name || "No Crop" })));
        // Check for out-of-stock products and add notifications
        transformedProducts.forEach((product) => {
          if (product.stock === t.outOfStock) {
            addOutOfStockNotification(product);
          }
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`${t.error}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error, t.inStock, t.outOfStock]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedCrop, stockStatus, minPrice, maxPrice]);

  // Filter products based on search and filter criteria
  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const searchMatch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryFilter = !selectedCategory || product.category_id === parseInt(selectedCategory);
    const cropFilter = !selectedCrop || product.crop_id === parseInt(selectedCrop);
    const stockFilter = !stockStatus || product.stock === stockStatus;
    const priceValue = parseFloat(product.price.replace("$", ""));
    const minPriceFilter = !minPrice || priceValue >= parseFloat(minPrice);
    const maxPriceFilter = !maxPrice || priceValue <= parseFloat(maxPrice);
    return searchMatch && categoryFilter && cropFilter && stockFilter && minPriceFilter && maxPriceFilter;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate sorted products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sorting handler
  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Toggle action menu
  const toggleMenu = (productId) => setActiveMenu(activeMenu === productId ? null : productId);

  // Close action menu on outside click
  const handleClickOutside = () => setActiveMenu(null);

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
      name: product.name,
      price: parseFloat(product.price.replace("$", "")).toString(),
      description: product.description,
      quantity: product.quantity,
      image: product.image,
      imageFile: null,
      category_id: product.category_id || "",
      crop_id: product.crop_id || "",
      user_id: localStorage.getItem("user_id") || "1",
      creation_date: product.creation_date,
      expiration_date: product.expiration_date || "",
    });
    setSelectedCategory(product.category_id || "");
    setSelectedCrop(product.crop_id || "");
    setShowEditModal(true);
    setActiveMenu(null);
  };

  // Delete product: Open confirmation modal
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    setActiveMenu(null);
  };

  // Confirm delete product
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${PRODUCT_BASE_URL}/${productToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      const responseText = await response.text();
      if (!response.ok) {
        let errorMessage = `${t.deleteError}Unexpected error`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = `${t.deleteError}${errorData.message || "Unknown error"}`;
        } catch (parseErr) {
          errorMessage = `${t.deleteError}${responseText.slice(0, 100)}...`;
        }
        throw new Error(errorMessage);
      }
      setProducts(products.filter((p) => p.id !== productToDelete.id));
      // Remove associated notifications from localStorage
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      const updatedNotifications = notifications.filter((n) => n.productId !== productToDelete.id);
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      setShowDeleteModal(false);
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
      setProductToDelete(null);
    }
  };

  // Handle input changes for new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle input changes for edit product form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle category selection for new product
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setNewProduct((prev) => ({ ...prev, category_id: categoryId }));
    setFormErrors((prev) => ({ ...prev, category_id: "" }));
  };

  // Handle category selection for edit product
  const handleEditCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setEditProduct((prev) => ({ ...prev, category_id: categoryId }));
    setFormErrors((prev) => ({ ...prev, category_id: "" }));
  };

  // Handle crop selection for new product
  const handleCropChange = (e) => {
    const cropId = e.target.value;
    setSelectedCrop(cropId);
    setNewProduct((prev) => ({ ...prev, crop_id: cropId }));
    setFormErrors((prev) => ({ ...prev, crop_id: "" }));
  };

  // Handle crop selection for edit product
  const handleEditCropChange = (e) => {
    const cropId = e.target.value;
    setSelectedCrop(cropId);
    setEditProduct((prev) => ({ ...prev, crop_id: cropId }));
    setFormErrors((prev) => ({ ...prev, crop_id: "" }));
  };

  // Handle image upload for new product
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: t.invalidImage }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, image: t.invalidImage }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) =>
        setNewProduct((prev) => ({ ...prev, image: e.target.result, imageFile: file }));
      reader.readAsDataURL(file);
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Handle image upload for edit product
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: t.invalidImage }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, image: t.invalidImage }));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) =>
        setEditProduct((prev) => ({ ...prev, image: e.target.result, imageFile: file }));
      reader.readAsDataURL(file);
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  // Validate form data
  const validateForm = (data) => {
    const errors = {};
    if (!data.name.trim()) errors.name = t.enterProductName;
    if (!data.price || parseFloat(data.price) <= 0) errors.price = t.enterPrice;
    if (!data.description.trim()) errors.description = t.enterDescription;
    if (!data.category_id) errors.category_id = t.selectCategoryRequired;
    if (!data.crop_id) errors.crop_id = t.selectCropRequired;
    if (data.quantity === "" || parseInt(data.quantity) < 0) errors.quantity = t.enterQuantity;
    if (!data.creation_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.creation_date))
      errors.creation_date = t.invalidDate;
    if (parseInt(data.quantity) === 0 && !data.expiration_date)
      errors.expiration_date = t.enterExpirationDate;
    if (data.expiration_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.expiration_date))
      errors.expiration_date = t.invalidDate;
    return errors;
  };

  // Function to add out-of-stock notification to localStorage
  const addOutOfStockNotification = (product) => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    const notificationId = `notification-${product.id}-${Date.now()}`;
    const newNotification = {
      id: notificationId,
      message: `${t.outOfStockNotification} ${product.name}`,
      status: "today",
      createdAt: new Date().toISOString(),
      productId: product.id,
    };
    // Check if similar notification exists
    if (!notifications.some((n) => n.productId === product.id && n.message === newNotification.message)) {
      notifications.push(newNotification);
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  };

  // Add new product
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
    formData.append("crop_id", newProduct.crop_id);
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

      const savedProduct = JSON.parse(responseText);
      const category = categories.find((c) => c.id === parseInt(newProduct.category_id));
      const crop = crops.find((c) => c.id === parseInt(newProduct.crop_id));
      const today = new Date();
      const expirationDate = savedProduct.expiration_date ? new Date(savedProduct.expiration_date) : null;
      const isExpired = expirationDate && expirationDate < today;

      const transformedProduct = {
        id: savedProduct.id,
        name: savedProduct.name,
        price: `$${Number(savedProduct.price).toFixed(2)}`,
        image: savedProduct.image_url || "/placeholder.svg",
        stock: isExpired || savedProduct.quantity === 0 ? t.outOfStock : t.inStock,
        description: savedProduct.description,
        category: category ? category.name : "Uncategorized",
        category_id: savedProduct.category_id,
        crop: crop ? crop.name : "No Crop",
        crop_id: savedProduct.crop_id,
        quantity: savedProduct.quantity,
        creation_date: savedProduct.creation_date ? savedProduct.creation_date.split("T")[0] : newProduct.creation_date,
        expiration_date: savedProduct.expiration_date ? new Date(savedProduct.expiration_date).toISOString().split("T")[0] : newProduct.expiration_date,
      };

      setProducts((prev) => [transformedProduct, ...prev]);
      if (transformedProduct.stock === t.outOfStock) {
        addOutOfStockNotification(transformedProduct);
      }
      setNewProduct({
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: "",
        imageFile: null,
        category_id: "",
        crop_id: "",
        user_id: localStorage.getItem("user_id") || "1",
        creation_date: new Date().toISOString().split("T")[0],
        expiration_date: "",
      });
      setFormErrors({});
      setShowAddModal(false);
      setSelectedCategory("");
      setSelectedCrop("");
      setCurrentPage(1);
      alert(t.addSuccess);
    } catch (err) {
      console.error("Add product error:", err);
      alert(err.message);
    }
  };

  // Update existing product
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
    formData.append("crop_id", editProduct.crop_id);
    formData.append("user_id", editProduct.user_id);
    formData.append("creation_date", editProduct.creation_date);
    if (editProduct.expiration_date) formData.append("expiration_date", editProduct.expiration_date);
    if (editProduct.imageFile) formData.append("image", editProduct.imageFile);
    formData.append("_method", "PUT");

    let responseText = null;

    try {
      const response = await fetch(`${PRODUCT_BASE_URL}/${editProduct.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        body: formData,
      });

      responseText = await response.text();
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

      const updatedProduct = JSON.parse(responseText);
      const category = categories.find((c) => c.id === parseInt(updatedProduct.category_id));
      const crop = crops.find((c) => c.id === parseInt(updatedProduct.crop_id));
      const today = new Date();
      const expirationDate = updatedProduct.expiration_date ? new Date(updatedProduct.expiration_date) : null;
      const isExpired = expirationDate && expirationDate < today;

      const transformedProduct = {
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: `$${Number(updatedProduct.price).toFixed(2)}`,
        image: updatedProduct.image_url || "/placeholder.svg",
        stock: isExpired || updatedProduct.quantity === 0 ? t.outOfStock : t.inStock,
        description: updatedProduct.description,
        category: category ? category.name : "Uncategorized",
        category_id: updatedProduct.category_id,
        crop: crop ? crop.name : "No Crop",
        crop_id: updatedProduct.crop_id,
        quantity: updatedProduct.quantity,
        creation_date: updatedProduct.creation_date ? updatedProduct.creation_date.split("T")[0] : editProduct.creation_date,
        expiration_date: updatedProduct.expiration_date ? new Date(updatedProduct.expiration_date).toISOString().split("T")[0] : editProduct.expiration_date,
      };

      setProducts(products.map((p) => (p.id === updatedProduct.id ? transformedProduct : p)));
      if (transformedProduct.stock === t.outOfStock) {
        addOutOfStockNotification(transformedProduct);
      } else {
        // Remove notification if restocked
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        const updatedNotifications = notifications.filter((n) => n.productId !== transformedProduct.id);
        localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
      }
      setEditProduct({
        id: null,
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: "",
        imageFile: null,
        category_id: "",
        crop_id: "",
        user_id: localStorage.getItem("user_id") || "1",
        creation_date: new Date().toISOString().split("T")[0],
        expiration_date: "",
      });
      setFormErrors({});
      setShowEditModal(false);
      setSelectedCategory("");
      setSelectedCrop("");
      alert(t.updateSuccess);
    } catch (err) {
      console.error("Update product error:", err, "Response:", responseText || "No response received");
      alert(err.message);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCrop("");
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
                    {t.productCrop}
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">{t.selectCrop}</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                    <button onClick={() => requestSort("crop")} className="flex items-center gap-1">
                      {t.productCrop}
                      {sortConfig.key === "crop" &&
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.crop}
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
                        disabled={isSubmitting}
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
                              handleDeleteProduct(product);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" /> {isSubmitting ? t.deleting : t.delete}
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
        {/* Delete Confirmation Modal */}
        {showDeleteModal && productToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.confirmDelete}</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600">
                  {t.confirmDelete} <strong>{productToDelete.name}</strong>?
                </p>
              </div>
              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.deleting : t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Product Modal */}
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
                    value={newProduct.category_id}
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
                    {t.productCrop} *
                  </label>
                  <select
                    name="crop_id"
                    value={newProduct.crop_id}
                    onChange={handleCropChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.crop_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  >
                    <option value="">{t.selectCrop}</option>
                    {crops.map((crop) => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.crop_id && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.crop_id}</p>
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
                    {t.expirationDate} {newProduct.quantity === "0" ? "*" : ""}
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
                    required={newProduct.quantity === "0"}
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
        {/* Edit Product Modal */}
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
                        {t.productCrop} *
                      </label>
                      <select
                        name="crop_id"
                        value={editProduct.crop_id}
                        onChange={handleEditCropChange}
                        className={`w-full px-4 py-3 text-lg border ${
                          formErrors.crop_id ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                        required
                      >
                        <option value="">{t.selectCrop}</option>
                        {crops.map((crop) => (
                          <option key={crop.id} value={crop.id}>
                            {crop.name}
                          </option>
                        ))}
                      </select>
                      {formErrors.crop_id && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.crop_id}</p>
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
                        {t.expirationDate} {editProduct.quantity === "0" ? "*" : ""}
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
                        required={editProduct.quantity === "0"}
                      />
                      {formErrors.expiration_date && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.expiration_date}</p>
                      )}
                    </div>
                  </div>
                </div>
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
        {/* View Product Modal */}
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
                        {t.productCrop}
                      </label>
                      <p className="text-xl text-gray-900">{selectedProduct.crop}</p>
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
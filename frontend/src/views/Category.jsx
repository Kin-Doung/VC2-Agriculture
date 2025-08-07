"use client";

import { Plus, Search, X, MoreVertical, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce"; // Requires: npm install lodash

const Category = ({ language = "en" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // For action loading states
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [editCategory, setEditCategory] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  const translations = {
    en: {
      title: "Categories",
      subtitle: "Manage your product categories",
      addCategory: "Add Category",
      search: "Search categories...",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      addNewCategory: "Add New Category",
      editCategory: "Edit Category",
      viewCategory: "Category Details",
      categoryName: "Category Name",
      categoryDescription: "Description",
      cancel: "Cancel",
      save: "Save Category",
      update: "Update Category",
      close: "Close",
      enterCategoryName: "Enter category name...",
      enterDescription: "Enter description...",
      noCategoriesAvailable: "No category available. Add a new category to get started.",
      noCategoriesFound: "No categories found matching your search.",
      confirmDelete: "Are you sure you want to delete this category?",
      loading: "Loading categories...",
      error: "Failed to load data. Please try again later.",
      updateError: "Failed to update category: ",
      deleteSuccess: "Category deleted successfully.",
      updateSuccess: "Category updated successfully.",
      addError: "Failed to add category: ",
      saving: "Saving...",
      updating: "Updating...",
      deleting: "Deleting...",
      prevPage: "Previous",
      nextPage: "Next",
    },
    km: {
      title: "ប្រភេទ",
      subtitle: "គ្រប់គ្រងប្រភេទផលិតផលរបស់អ្នក",
      addCategory: "បន្ថែមប្រភេទ",
      search: "ស្វែងរកប្រភេទ...",
      edit: "កែប្រែ",
      delete: "លុប",
      view: "មើល",
      addNewCategory: "បន្ថែមប្រភេទថ្មី",
      editCategory: "កែប្រែប្រភេទ",
      viewCategory: "ព័ត៌មានលម្អិតប្រភេទ",
      categoryName: "ឈ្មោះប្រភេទ",
      categoryDescription: "ការពិពណ៌នា",
      cancel: "បោះបង់",
      save: "រក្សាទុកប្រភេទ",
      update: "ធ្វើបច្ចុប្បន្នភាពប្រភេទ",
      close: "បិទ",
      enterCategoryName: "បញ្ចូលឈ្មោះប្រភេទ...",
      enterDescription: "បញ្ចូលការពិពណ៌នា...",
      noCategoriesAvailable: "មិនមានប្រភេទទេ។ បន្ថែមប្រភេទថ្មីដើម្បីចាប់ផ្តើម។",
      noCategoriesFound: "រកមិនឃើញប្រភេទដែលត្រូវនឹងការស្វែងរករបស់អ្នក។",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបប្រភេទនេះមែនទេ?",
      loading: "កំពុងផ្ទុកប្រភេទ...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      updateError: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពប្រភេទ៖ ",
      deleteSuccess: "ប្រភេទត្រូវបានលុបដោយជោគជ័យ។",
      updateSuccess: "ប្រភេទត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
      addError: "បរាជ័យក្នុងការបន្ថែមប្រភេទ៖ ",
      saving: "កំពុងរក្សាទុក...",
      updating: "កំពុងធ្វើបច្ចុប្បននភាព...",
      deleting: "កំពុងលុប...",
      prevPage: "មុន",
      nextPage: "បន្ទាប់",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/categories";
  const AUTH_TOKEN = localStorage.getItem("token");

  // Debounced search handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => debouncedSetSearchTerm(e.target.value);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, Accept: "application/json" },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Categories fetch failed: ${errorText}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Categories API response is not an array");
        const transformedCategories = data.map((item) => ({
          id: item.id || null,
          name: item.name || "Unnamed Category",
          description: item.description || "No description",
        }));
        setCategories(transformedCategories);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`${t.error}: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t.error]);

  // Filtering, Sorting, Pagination
  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleMenu = (categoryId) => setActiveMenu(activeMenu === categoryId ? null : categoryId);

  const handleClickOutside = () => setActiveMenu(null);

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
    setActiveMenu(null);
  };

  const handleEditCategory = (category) => {
    setEditCategory({ ...category });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId || !window.confirm(t.confirmDelete)) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete failed: ${errorText}`);
      }
      setCategories(categories.filter((c) => c.id !== categoryId));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`${t.error}: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveMenu(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCategory((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!newCategory.name.trim()) errors.name = t.enterCategoryName;
    return errors;
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", newCategory.name);
    if (newCategory.description) formData.append("description", newCategory.description);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: "application/json",
        },
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

      let savedCategory;
      try {
        savedCategory = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.addError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      if (!savedCategory.id) {
        throw new Error(`${t.addError}API response missing category ID`);
      }

      const transformedCategory = {
        id: savedCategory.id,
        name: savedCategory.name,
        description: savedCategory.description || "No description",
      };

      setCategories((prev) => [transformedCategory, ...prev]);
      setNewCategory({
        name: "",
        description: "",
      });
      setFormErrors({});
      setShowAddModal(false);
      alert(t.save);
    } catch (err) {
      console.error("Add category error:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!editCategory.name.trim()) errors.name = t.enterCategoryName;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", editCategory.name);
    if (editCategory.description) formData.append("description", editCategory.description);
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/${editCategory.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const responseText = await response.text();
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

      let updatedCategory;
      try {
        updatedCategory = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.updateError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      if (!updatedCategory.id) {
        throw new Error(`${t.updateError}Updated category response missing ID`);
      }

      const transformedCategory = {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description || "No description",
      };

      setCategories(categories.map((c) => (c.id === editCategory.id ? transformedCategory : c)));
      setEditCategory({
        id: null,
        name: "",
        description: "",
      });
      setFormErrors({});
      setShowEditModal(false);
      alert(t.updateSuccess);
    } catch (err) {
      console.error("Update category error:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
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
            <Plus className="h-4 w-4" /> {t.addCategory}
          </button>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
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
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">{t.noCategoriesAvailable}</div>
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="text-center py-12">{t.noCategoriesFound}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("name")} className="flex items-center gap-1">
                      {t.categoryName}{" "}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("description")} className="flex items-center gap-1">
                      {t.categoryDescription}{" "}
                      {sortConfig.key === "description" &&
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
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(category.id);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                        disabled={isSubmitting}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                      {activeMenu === category.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCategory(category);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" /> {t.view}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> {t.edit}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
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
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.addNewCategory}</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.categoryName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newCategory.name}
                    onChange={handleInputChange}
                    placeholder={t.enterCategoryName}
                    className={`w-full px-3 py-2 border ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.categoryDescription}
                  </label>
                  <textarea
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                    placeholder={t.enterDescription}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? t.saving : t.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.editCategory}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.categoryName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editCategory.name}
                    onChange={handleEditInputChange}
                    placeholder={t.enterCategoryName}
                    className={`w-full px-3 py-2 border ${
                      formErrors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.categoryDescription}
                  </label>
                  <textarea
                    name="description"
                    value={editCategory.description}
                    onChange={handleEditInputChange}
                    placeholder={t.enterDescription}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? t.updating : t.update}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showViewModal && selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.viewCategory}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.categoryName}
                  </label>
                  <p className="text-lg font-medium text-gray-900">{selectedCategory.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.categoryDescription}
                  </label>
                  <p className="text-sm text-gray-600">{selectedCategory.description}</p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;

"use client";

import { Plus, Search, X, MoreVertical, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

const CropManagement = ({ language = "en" }) => {
  // Localization texts
  const translations = {
    en: {
      title: "Crop Management",
      subtitle: "Manage your crops and planting details",
      addCrop: "Add Crop",
      search: "Search crops...",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      addNewCrop: "Add New Crop",
      editCrop: "Edit Crop",
      viewCrop: "Crop Details",
      farm: "Farm",
      name: "Crop Name",
      plantingDate: "Planting Date",
      growthStage: "Growth Stage",
      notes: "Notes",
      cancel: "Cancel",
      save: "Save Crop",
      update: "Update Crop",
      close: "Close",
      selectFarm: "Select a farm...",
      enterName: "Enter crop name...",
      noCropsFound: "No crops found matching your search.",
      noCropsAvailable: "No crops available. Add a new crop to get started.",
      confirmDelete: "Are you sure you want to delete this crop?",
      loading: "Loading data...",
      error: "Failed to load data",
      farmsError: "Failed to load farms",
      cropsError: "Failed to load crops",
      updateError: "Failed to update crop: ",
      deleteSuccess: "Crop deleted successfully.",
      deleteError: "Failed to delete crop: ",
      updateSuccess: "Crop updated successfully.",
      addError: "Failed to add crop: ",
      saving: "Saving...",
      updating: "Updating...",
      deleting: "Deleting...",
      prevPage: "Previous",
      nextPage: "Next",
      retry: "Retry",
    },
    km: {
      title: "គ្រប់គ្រងដំណាំ",
      subtitle: "គ្រប់គ្រងដំណាំ និងព័ត៌មានការបង្កាត់",
      addCrop: "បន្ថែមដំណាំ",
      search: "ស្វែងរកដំណាំ...",
      edit: "កែប្រែ",
      delete: "លុប",
      view: "មើល",
      addNewCrop: "បន្ថែមដំណាំថ្មី",
      editCrop: "កែប្រែដំណាំ",
      viewCrop: "ព័ត៌មានលម្អិតដំណាំ",
      farm: "កសិដ្ឋាន",
      name: "ឈ្មោះដំណាំ",
      plantingDate: "ថ្ងៃដាំដំណាំ",
      growthStage: "ដំណាក់កាលដំណាំ",
      notes: "កំណត់ចំណាំ",
      cancel: "បោះបង់",
      save: "រក្សាទុកដំណាំ",
      update: "ធ្វើបច្ចុប្បន្នភាពដំណាំ",
      close: "បិទ",
      selectFarm: "ជ្រើសរើសកសិដ្ឋាន...",
      enterName: "បញ្ចូលឈ្មោះដំណាំ...",
      noCropsFound: "រកមិនឃើញដំណាំណាមួយដែលត្រូវនឹងការស្វែងរករបស់អ្នក។",
      noCropsAvailable: "មិនមានដំណាំទេ។ បន្ថែមដំណាំថ្មីដើម្បីចាប់ផ្តើម។",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបដំណាំនេះមែនទេ?",
      loading: "កំពុងផ្ទុកទិន្នន័យ...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ",
      farmsError: "បរាជ័យក្នុងការផ្ទុកកសិដ្ឋាន",
      cropsError: "បរាជ័យក្នុងការផ្ទុកដំណាំ",
      updateError: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពដំណាំ៖ ",
      deleteSuccess: "ដំណាំត្រូវបានលុបដោយជោគជ័យ។",
      deleteError: "បរាជ័យក្នុងការលុបដំណាំ៖ ",
      updateSuccess: "ដំណាំត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
      addError: "បរាជ័យក្នុងការបន្ថែមដំណាំ៖ ",
      saving: "កំពុងរក្សាទុក...",
      updating: "កំពុងធ្វើបច្ចុប្បន្នភាព...",
      deleting: "កំពុងលុប...",
      prevPage: "មុន",
      nextPage: "បន្ទាប់",
      retry: "ព្យាយាមម្តងទៀត",
    },
  };

  const t = translations[language] || translations.en;

  // API URLs and Auth token
  const API_URL = "http://127.0.0.1:8000/api/crops";
  const API_FARMS_URL = "http://127.0.0.1:8000/api/farms";
  const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || "your-auth-token-here";

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: "",
    farm_id: "",
    planting_date: "",
    growth_stage: "",
    notes: "",
  });
  const [editCrop, setEditCrop] = useState({
    id: null,
    name: "",
    farm_id: "",
    planting_date: "",
    growth_stage: "",
    notes: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  // Debounced search handler
  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => debouncedSetSearchTerm(e.target.value);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [farmsResp, cropsResp] = await Promise.all([
        fetch(API_FARMS_URL, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        }),
        fetch(API_URL, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        }),
      ]);

      const errors = [];
      let farmsData, cropsData;

      if (!farmsResp.ok) {
        const errorText = await farmsResp.text();
        errors.push(`${t.farmsError}: ${errorText || farmsResp.statusText}`);
      } else {
        farmsData = await farmsResp.json();
      }

      if (!cropsResp.ok) {
        const errorText = await cropsResp.text();
        errors.push(`${t.cropsError}: ${errorText || cropsResp.statusText}`);
      } else {
        cropsData = await cropsResp.json();
      }

      if (errors.length) throw new Error(errors.join("; "));

      setFarms(farmsData);

      const transformed = cropsData.map((crop) => ({
        id: crop.id,
        name: crop.name,
        farm_id: crop.farm_id,
        farm_name: farmsData.find((f) => f.id === crop.farm_id)?.name || "Unknown farm",
        planting_date: crop.planting_date,
        growth_stage: crop.growth_stage || "No stage",
        notes: crop.notes || "No notes",
      }));

      setCrops(transformed);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`${t.error}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount or language change
  useEffect(() => {
    fetchData();
  }, [language]);

  // Filtering, Sorting, Pagination
  const filteredCrops = crops.filter(
    (crop) =>
      (crop.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (crop.farm_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (crop.growth_stage?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (crop.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    return sortConfig.direction === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedCrops.length / itemsPerPage);
  const paginatedCrops = sortedCrops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleMenu = (cropId) => setActiveMenu(activeMenu === cropId ? null : cropId);

  const handleClickOutside = () => setActiveMenu(null);

  const handleViewCrop = (crop) => {
    setSelectedCrop(crop);
    setShowViewModal(true);
    setActiveMenu(null);
  };

  const handleEditCrop = (crop) => {
    setEditCrop({
      id: crop.id,
      name: crop.name || "",
      farm_id: crop.farm_id,
      planting_date: crop.planting_date,
      growth_stage: crop.growth_stage || "",
      notes: crop.notes || "",
    });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleDeleteCrop = async (cropId) => {
    if (!cropId || !window.confirm(t.confirmDelete)) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${cropId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }
      setCrops(crops.filter((c) => c.id !== cropId));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`${t.deleteError}${err.message}`);
    } finally {
      setIsSubmitting(false);
      setActiveMenu(null);
    }
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCrop((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name) errors.name = t.enterName;
    if (!data.farm_id) errors.farm_id = t.selectFarm;
    if (!data.planting_date || !/^\d{4}-\d{2}-\d{2}$/.test(data.planting_date)) {
      errors.planting_date = `${t.plantingDate} must be in YYYY-MM-DD format`;
    }
    return errors;
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    const errors = validateForm(newCrop);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", newCrop.name);
    formData.append("farm_id", newCrop.farm_id);
    formData.append("planting_date", newCrop.planting_date);
    formData.append("growth_stage", newCrop.growth_stage || "");
    formData.append("notes", newCrop.notes || "");

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

      let savedCrop;
      try {
        savedCrop = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.addError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      const farmName = farms.find((f) => f.id === parseInt(newCrop.farm_id))?.name || "Unknown farm";

      const transformedCrop = {
        id: savedCrop.id,
        name: savedCrop.name,
        farm_id: parseInt(newCrop.farm_id),
        farm_name: farmName,
        planting_date: newCrop.planting_date,
        growth_stage: newCrop.growth_stage || "No stage",
        notes: newCrop.notes || "No notes",
      };

      setCrops((prev) => [transformedCrop, ...prev]);
      setNewCrop({
        name: "",
        farm_id: "",
        planting_date: "",
        growth_stage: "",
        notes: "",
      });
      setFormErrors({});
      setShowAddModal(false);
      alert(t.save);
    } catch (err) {
      console.error("Add crop error:", err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCrop = async (e) => {
    e.preventDefault();
    const errors = validateForm(editCrop);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      alert("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", editCrop.name);
    formData.append("farm_id", editCrop.farm_id);
    formData.append("planting_date", editCrop.planting_date);
    formData.append("growth_stage", editCrop.growth_stage || "");
    formData.append("notes", editCrop.notes || "");
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/${editCrop.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
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

      let updatedCrop;
      try {
        updatedCrop = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.updateError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      const farmName = farms.find((f) => f.id === updatedCrop.farm_id)?.name || "Unknown farm";

      const transformed = {
        id: updatedCrop.id,
        name: updatedCrop.name,
        farm_id: updatedCrop.farm_id,
        farm_name: farmName,
        planting_date: updatedCrop.planting_date,
        growth_stage: updatedCrop.growth_stage || "No stage",
        notes: updatedCrop.notes || "No notes",
      };

      setCrops(crops.map((c) => (c.id === transformed.id ? transformed : c)));
      setEditCrop({
        id: null,
        name: "",
        farm_id: "",
        planting_date: "",
        growth_stage: "",
        notes: "",
      });
      setFormErrors({});
      setShowEditModal(false);
      alert(t.updateSuccess);
    } catch (err) {
      console.error("Update crop error:", err);
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
            <Plus className="h-4 w-4" /> {t.addCrop}
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
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.retry}
            </button>
          </div>
        ) : paginatedCrops.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? t.noCropsFound : t.noCropsAvailable}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("name")} className="flex items-center gap-1">
                      {t.name}
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("farm_name")} className="flex items-center gap-1">
                      {t.farm}
                      {sortConfig.key === "farm_name" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => requestSort("planting_date")} className="flex items-center gap-1">
                      {t.plantingDate}
                      {sortConfig.key === "planting_date" &&
                        (sortConfig.direction === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        ))}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.growthStage}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.notes}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCrops.map((crop) => (
                  <tr key={crop.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {crop.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {crop.farm_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.planting_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.growth_stage}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.notes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button
                        onClick={() => toggleMenu(crop.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                        disabled={isSubmitting}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                      {activeMenu === crop.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                          <button
                            onClick={() => handleViewCrop(crop)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" /> {t.view}
                          </button>
                          <button
                            onClick={() => handleEditCrop(crop)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> {t.edit}
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(crop.id)}
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
                <h2 className="text-xl font-bold text-gray-800">{t.addNewCrop}</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAddCrop} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.name} *</label>
                  <input
                    type="text"
                    name="name"
                    value={newCrop.name}
                    onChange={handleNewInputChange}
                    placeholder={t.enterName}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.farm} *</label>
                  <select
                    name="farm_id"
                    value={newCrop.farm_id}
                    onChange={handleNewInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.farm_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">{t.selectFarm}</option>
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.farm_id && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.farm_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.plantingDate} *</label>
                  <input
                    type="date"
                    name="planting_date"
                    value={newCrop.planting_date}
                    onChange={handleNewInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.planting_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.planting_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.planting_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.growthStage}</label>
                  <input
                    type="text"
                    name="growth_stage"
                    value={newCrop.growth_stage}
                    onChange={handleNewInputChange}
                    placeholder="E.g., Seedling, Vegetative"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.notes}</label>
                  <textarea
                    name="notes"
                    value={newCrop.notes}
                    onChange={handleNewInputChange}
                    placeholder="Enter notes..."
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
                <h2 className="text-xl font-bold text-gray-800">{t.editCrop}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleUpdateCrop} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.name} *</label>
                  <input
                    type="text"
                    name="name"
                    value={editCrop.name}
                    onChange={handleEditInputChange}
                    placeholder={t.enterName}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.farm} *</label>
                  <select
                    name="farm_id"
                    value={editCrop.farm_id}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.farm_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">{t.selectFarm}</option>
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.farm_id && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.farm_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.plantingDate} *</label>
                  <input
                    type="date"
                    name="planting_date"
                    value={editCrop.planting_date}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.planting_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                    disabled={isSubmitting}
                  />
                  {formErrors.planting_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.planting_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.growthStage}</label>
                  <input
                    type="text"
                    name="growth_stage"
                    value={editCrop.growth_stage}
                    onChange={handleEditInputChange}
                    placeholder="E.g., Seedling, Vegetative"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.notes}</label>
                  <textarea
                    name="notes"
                    value={editCrop.notes}
                    onChange={handleEditInputChange}
                    placeholder="Enter notes..."
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
        {showViewModal && selectedCrop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">{t.viewCrop}</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.name}</label>
                  <p className="text-lg font-medium text-gray-900">{selectedCrop.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.farm}</label>
                  <p className="text-lg font-medium text-gray-900">{selectedCrop.farm_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.plantingDate}</label>
                  <p className="text-sm text-gray-600">{selectedCrop.planting_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.growthStage}</label>
                  <p className="text-sm text-gray-600">{selectedCrop.growth_stage}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.notes}</label>
                  <p className="text-sm text-gray-600">{selectedCrop.notes}</p>
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

export default CropManagement;

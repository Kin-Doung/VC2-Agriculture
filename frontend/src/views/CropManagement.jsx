"use client";

import { Plus, Search, X, MoreVertical, Eye, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const CropManagement = ({ language = "en" }) => {
  // Localization texts (English + Khmer)
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
      cropType: "Crop Type",
      plantingDate: "Planting Date",
      growthStage: "Growth Stage",
      notes: "Notes",
      cancel: "Cancel",
      save: "Save Crop",
      update: "Update Crop",
      close: "Close",
      selectFarm: "Select a farm...",
      selectCropType: "Select a crop type...",
      noCropsFound: "No crops found matching your search.",
      confirmDelete: "Are you sure you want to delete this crop?",
      loading: "Loading data...",
      error: "Failed to load data. Please try again later.",
      updateError: "Failed to update crop: ",
      deleteSuccess: "Crop deleted successfully.",
      updateSuccess: "Crop updated successfully.",
      addError: "Failed to add crop: ",
      prevPage: "Previous",
      nextPage: "Next",
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
      cropType: "ប្រភេទដំណាំ",
      plantingDate: "ថ្ងៃដាំដំណាំ",
      growthStage: "ដំណាក់កាលដំណាំ",
      notes: "កំណត់ចំណាំ",
      cancel: "បោះបង់",
      save: "រក្សាទុកដំណាំ",
      update: "ធ្វើបច្ចុប្បន្នភាពដំណាំ",
      close: "បិទ",
      selectFarm: "ជ្រើសរើសកសិដ្ឋាន...",
      selectCropType: "ជ្រើសរើសប្រភេទដំណាំ...",
      noCropsFound: "រកមិនឃើញដំណាំណាមួយដែលត្រូវនឹងការស្វែងរករបស់អ្នក។",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបដំណាំនេះមែនទេ?",
      loading: "កំពុងផ្ទុកទិន្នន័យ...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      updateError: "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពដំណាំ៖ ",
      deleteSuccess: "ដំណាំត្រូវបានលុបដោយជោគជ័យ។",
      updateSuccess: "ដំណាំត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
      addError: "បរាជ័យក្នុងការបន្ថែមដំណាំ៖ ",
      prevPage: "មុន",
      nextPage: "បន្ទាប់",
    },
  };

  const t = translations[language] || translations.en;

  // API URLs and Auth token
  const API_URL = "http://127.0.0.1:8000/api/crops";
  const API_FARMS_URL = "http://127.0.0.1:8000/api/farms";
  const API_CROPTYPES_URL = "http://127.0.0.1:8000/api/croptypes";
  const AUTH_TOKEN = "your-auth-token-here";

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [cropTypes, setCropTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [newCrop, setNewCrop] = useState({
    farm_id: "",
    crop_type_id: "",
    planting_date: "",
    growth_stage: "",
    notes: "",
  });
  const [editCrop, setEditCrop] = useState({
    id: null,
    farm_id: "",
    crop_type_id: "",
    planting_date: "",
    growth_stage: "",
    notes: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  // Fetch crops, farms, and crop types on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch farms
        const farmsResp = await fetch(API_FARMS_URL, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        });
        if (!farmsResp.ok) throw new Error("Failed to fetch farms");
        const farmsData = await farmsResp.json();
        setFarms(farmsData);

        // Fetch crop types
        const cropTypesResp = await fetch(API_CROPTYPES_URL, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        });
        if (!cropTypesResp.ok) throw new Error("Failed to fetch crop types");
        const cropTypesData = await cropTypesResp.json();
        setCropTypes(cropTypesData);

        // Fetch crops
        const cropsResp = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
        });
        if (!cropsResp.ok) throw new Error("Failed to fetch crops");
        const cropsData = await cropsResp.json();

        // Transform data
        const transformed = cropsData.map((c) => ({
          id: c.id,
          farm_id: c.farm_id,
          farm_name: farmsData.find((f) => f.id === c.farm_id)?.name || "Unknown farm",
          crop_type_id: c.crop_type_id,
          crop_type_name:
            cropTypesData.find((ct) => ct.id === c.crop_type_id)?.name || "Unknown crop type",
          planting_date: c.planting_date,
          growth_stage: c.growth_stage || "No stage",
          notes: c.notes || "No notes",
        }));

        setCrops(transformed);
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
  const filteredCrops = crops.filter(
    (crop) =>
      crop.farm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.crop_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.growth_stage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCrops = [...filteredCrops].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] ?? "";
    const bValue = b[sortConfig.key] ?? "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
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
    setEditCrop({ ...crop });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleDeleteCrop = async (cropId) => {
    if (!cropId || !window.confirm(t.confirmDelete)) return;
    try {
      const response = await fetch(`${API_URL}/${cropId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete failed: ${errorText}`);
      }
      setCrops(crops.filter((c) => c.id !== cropId));
      alert(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      alert(`${t.error}: ${err.message}`);
    }
    setActiveMenu(null);
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
    if (!data.farm_id) errors.farm_id = t.selectFarm;
    if (!data.crop_type_id) errors.crop_type_id = t.selectCropType;
    if (!data.planting_date) errors.planting_date = `${t.plantingDate} is required`;
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

    const formData = new FormData();
    formData.append("farm_id", newCrop.farm_id);
    formData.append("crop_type_id", newCrop.crop_type_id);
    formData.append("planting_date", newCrop.planting_date);
    formData.append("growth_stage", newCrop.growth_stage);
    formData.append("notes", newCrop.notes);

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

      let savedCrop;
      try {
        savedCrop = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.addError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      // Ensure farm_name and crop_type_name are included
      const farmName = farms.find((f) => f.id === parseInt(newCrop.farm_id))?.name || "Unknown farm";
      const cropTypeName =
        cropTypes.find((ct) => ct.id === parseInt(newCrop.crop_type_id))?.name || "Unknown crop type";

      const transformedCrop = {
        id: savedCrop.id,
        farm_id: parseInt(newCrop.farm_id),
        farm_name: farmName,
        crop_type_id: parseInt(newCrop.crop_type_id),
        crop_type_name: cropTypeName,
        planting_date: newCrop.planting_date,
        growth_stage: newCrop.growth_stage || "No stage",
        notes: newCrop.notes || "No notes",
      };

      setCrops((prev) => [transformedCrop, ...prev]);
      setNewCrop({
        farm_id: "",
        crop_type_id: "",
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

    const formData = new FormData();
    formData.append("farm_id", editCrop.farm_id);
    formData.append("crop_type_id", editCrop.crop_type_id);
    formData.append("planting_date", editCrop.planting_date);
    formData.append("growth_stage", editCrop.growth_stage);
    formData.append("notes", editCrop.notes);
    formData.append("_method", "PUT");

    try {
      const response = await fetch(`${API_URL}/${editCrop.id}`, {
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

      let updatedCrop;
      try {
        updatedCrop = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`${t.updateError}Invalid JSON response: ${responseText.slice(0, 100)}...`);
      }

      const farmName = farms.find((f) => f.id === updatedCrop.farm_id)?.name || "Unknown farm";
      const cropTypeName =
        cropTypes.find((ct) => ct.id === updatedCrop.crop_type_id)?.name || "Unknown crop type";

      const transformed = {
        ...updatedCrop,
        farm_name: farmName,
        crop_type_name: cropTypeName,
        growth_stage: updatedCrop.growth_stage || "No stage",
        notes: updatedCrop.notes || "No notes",
      };

      setCrops(crops.map((c) => (c.id === transformed.id ? transformed : c)));
      setEditCrop({
        id: null,
        farm_id: "",
        crop_type_id: "",
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">{t.loading}</div>
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
        ) : paginatedCrops.length === 0 ? (
          <div className="text-center py-12">{t.noCropsFound}</div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    <button onClick={() => requestSort("crop_type_name")} className="flex items-center gap-1">
                      {t.cropType}
                      {sortConfig.key === "crop_type_name" &&
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
                      {crop.farm_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.crop_type_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.planting_date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.growth_stage}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{crop.notes}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(crop.id);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-600" />
                      </button>
                      {activeMenu === crop.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCrop(crop);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" /> {t.view}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCrop(crop);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" /> {t.edit}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCrop(crop.id);
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.farm} *</label>
                  <select
                    name="farm_id"
                    value={newCrop.farm_id}
                    onChange={handleNewInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.farm_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cropType} *
                  </label>
                  <select
                    name="crop_type_id"
                    value={newCrop.crop_type_id}
                    onChange={handleNewInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.crop_type_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  >
                    <option value="">{t.selectCropType}</option>
                    {cropTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.crop_type_id && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.crop_type_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.plantingDate} *
                  </label>
                  <input
                    type="date"
                    name="planting_date"
                    value={newCrop.planting_date}
                    onChange={handleNewInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.planting_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.planting_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.planting_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.growthStage}
                  </label>
                  <input
                    type="text"
                    name="growth_stage"
                    value={newCrop.growth_stage}
                    onChange={handleNewInputChange}
                    placeholder="E.g., Seedling, Vegetative"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  />
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.farm} *</label>
                  <select
                    name="farm_id"
                    value={editCrop.farm_id}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.farm_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.cropType} *
                  </label>
                  <select
                    name="crop_type_id"
                    value={editCrop.crop_type_id}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.crop_type_id ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  >
                    <option value="">{t.selectCropType}</option>
                    {cropTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.crop_type_id && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.crop_type_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.plantingDate} *
                  </label>
                  <input
                    type="date"
                    name="planting_date"
                    value={editCrop.planting_date}
                    onChange={handleEditInputChange}
                    className={`w-full px-3 py-2 border ${
                      formErrors.planting_date ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    required
                  />
                  {formErrors.planting_date && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.planting_date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.growthStage}
                  </label>
                  <input
                    type="text"
                    name="growth_stage"
                    value={editCrop.growth_stage}
                    onChange={handleEditInputChange}
                    placeholder="E.g., Seedling, Vegetative"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {t.update}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.farm}</label>
                  <p className="text-lg font-medium text-gray-900">{selectedCrop.farm_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.cropType}</label>
                  <p className="text-sm text-gray-600">{selectedCrop.crop_type_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.plantingDate}
                  </label>
                  <p className="text-sm text-gray-600">{selectedCrop.planting_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.growthStage}
                  </label>
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
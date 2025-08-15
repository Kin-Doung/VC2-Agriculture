"use client";

import { useState, useEffect, useRef } from "react";

const CropTrackerView = ({ language }) => {
  const cropStages = {
    Corn: [
      { stage: "Germination", completed: false, date: "Pending" },
      { stage: "Vegetative Growth (V6-VT)", completed: false, date: "Pending" },
      { stage: "Rapid Growth (V6-VT)", completed: false, date: "Pending" },
      { stage: "Tasseling (VT)", completed: false, date: "Pending" },
      { stage: "Silking (R1)", completed: false, date: "Pending" },
      { stage: "Blister (R2)", completed: false, date: "Pending" },
      { stage: "Milk (R3)", completed: false, date: "Pending" },
      { stage: "Dough (R4)", completed: false, date: "Pending" },
      { stage: "Dent (R5)", completed: false, date: "Pending" },
      { stage: "Physiological Maturity (R6)", completed: false, date: "Pending" },
      { stage: "Harvest Ready", completed: false, date: "Pending" },
    ],
    Rice: [
      { stage: "Germination", completed: false, date: "Pending" },
      { stage: "Tillering", completed: false, date: "Pending" },
      { stage: "Stem Elongation", completed: false, date: "Pending" },
      { stage: "Panicle Initiation", completed: false, date: "Pending" },
      { stage: "Flowering", completed: false, date: "Pending" },
      { stage: "Grain Filling", completed: false, date: "Pending" },
    ],
    Wheat: [
      { stage: "Germination", completed: false, date: "Pending" },
      { stage: "Tillering", completed: false, date: "Pending" },
      { stage: "Stem Extension", completed: false, date: "Pending" },
      { stage: "Heading", completed: false, date: "Pending" },
      { stage: "Grain Filling", completed: false, date: "Pending" },
      { stage: "Harvest", completed: false, date: "Pending" },
    ],
  };

  const defaultDetails = {
    stages: cropStages["Corn"], // Default to Corn stages
    notes: "",
    photoUrl: "/placeholder-photo.jpg",
  };

  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [notes, setNotes] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cropToDelete, setCropToDelete] = useState(null);
  const [newCrop, setNewCrop] = useState({
    name: "",
    status: "Growing",
    planted: "",
    location: "",
    cropType: "Corn", // Default crop type
    progress: `0 / ${cropStages["Corn"].length} stages completed`,
    details: defaultDetails,
  });
  const [editCrop, setEditCrop] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const menuRef = useRef(null);

  const currentDateTime = "02:48 PM +07, Friday, August 15, 2025";
  const API_URL = "http://127.0.0.1:8000/api/croptrackers";
  const AUTH_TOKEN = localStorage.getItem("token");

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format ISO date to "Month Day, Year"
  const formatDate = (isoDate) => {
    if (!isoDate || isoDate === "Unknown") return "Unknown";
    try {
      const date = new Date(isoDate);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).replace(/(\d+)(st|nd|rd|th)/, "$1th");
    } catch {
      return isoDate;
    }
  };

  // Normalize crop data
  const normalizeCrop = (crop) => {
    const cropType = crop.crop_type || crop.crop?.crop_type || crop.cropType || "Corn";
    const stages = cropStages[cropType] || [];
    const normalized = {
      ...crop,
      id: crop.id || crop.crop_id || Date.now(),
      name: crop.name || crop.crop?.name || `Crop ${crop.id || crop.crop_id || "Unknown"}`,
      status: crop.status || crop.crop?.growth_stage || "Growing",
      planted: formatDate(crop.planted || crop.crop?.planting_date || "Unknown"),
      location: crop.location || "Unknown",
      progress: crop.progress || `0 / ${stages.length} stages completed`,
      crop_type: cropType,
      details: crop.details && typeof crop.details === "object" ? { ...defaultDetails, ...crop.details } : {
        ...defaultDetails,
        stages,
        notes: crop.crop?.notes || "",
        photoUrl: crop.image_path || "/placeholder-photo.jpg",
      },
    };
    if (!Array.isArray(normalized.details.stages)) {
      normalized.details.stages = stages;
      normalized.progress = `0 / ${stages.length} stages completed`;
    }
    return normalized;
  };

  // Fetch crops with retry mechanism
  const fetchCrops = async (retries = 3, delay = 1000) => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch crops: ${response.statusText} (Status: ${response.status})`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      if (!Array.isArray(data)) {
        throw new Error("API response is not an array");
      }
      setCrops(data.map(normalizeCrop));
      setLoading(false);
      setError(null);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchCrops(retries - 1, delay * 2), delay);
      } else {
        setError(err.message);
        setCrops([]);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (AUTH_TOKEN) {
      fetchCrops();
    } else {
      setError("Authentication token not found. Please log in.");
      setCrops([]);
      setLoading(false);
    }
  }, []);

  const openDetails = (crop) => {
    const normalizedCrop = normalizeCrop(crop);
    setSelectedCrop(normalizedCrop);
    setNotes(normalizedCrop.details.notes || "");
  };

  const closeDetails = () => {
    setSelectedCrop(null);
    setNotes("");
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewCrop({
      name: "",
      status: "Growing",
      planted: "",
      location: "",
      cropType: "Corn",
      progress: `0 / ${cropStages["Corn"].length} stages completed`,
      details: defaultDetails,
    });
  };

  const openEditModal = (crop) => {
    setMenuOpenId(null);
    setEditCrop({
      ...crop,
      planted: crop.planted === "Unknown" ? "" : crop.planted,
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCrop(null);
  };

  const openDeleteModal = (crop) => {
    setMenuOpenId(null);
    setCropToDelete(crop);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCropToDelete(null);
  };

  const openMenu = (cropId, e) => {
    e.stopPropagation(); // Prevent any parent click handlers
    setMenuOpenId(cropId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCrop((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCrop = async () => {
    try {
      const cropToCreate = {
        ...newCrop,
        crop_type: newCrop.cropType,
        details: {
          ...newCrop.details,
          stages: cropStages[newCrop.cropType] || [],
        },
        progress: `0 / ${cropStages[newCrop.cropType]?.length || 0} stages completed`,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
        },
        body: JSON.stringify(cropToCreate),
      });
      if (!response.ok) {
        throw new Error(`Failed to create crop: ${response.statusText}`);
      }
      const createdCrop = await response.json();
      console.log("Created Crop:", createdCrop);
      setCrops((prevCrops) => [...prevCrops, normalizeCrop(createdCrop)]);
      closeCreateModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCrop = async () => {
    try {
      const updatedCrop = {
        ...editCrop,
        crop_type: editCrop.crop_type || "Corn",
        details: {
          ...editCrop.details,
          stages: editCrop.details.stages || cropStages[editCrop.crop_type || "Corn"],
        },
        progress: editCrop.progress || `0 / ${cropStages[editCrop.crop_type || "Corn"].length} stages completed`,
      };
      const response = await fetch(`${API_URL}/${editCrop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
        },
        body: JSON.stringify({
          ...updatedCrop,
          crop_type: updatedCrop.crop_type,
          image_path: updatedCrop.details.photoUrl !== "/placeholder-photo.jpg" ? updatedCrop.details.photoUrl : null,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update crop: ${response.statusText}`);
      }
      const updatedCropData = await response.json();
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop.id === updatedCropData.id ? normalizeCrop(updatedCropData) : crop
        )
      );
      closeEditModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCrop = async () => {
    try {
      const response = await fetch(`${API_URL}/${cropToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete crop: ${response.statusText}`);
      }
      setCrops((prevCrops) => prevCrops.filter((crop) => crop.id !== cropToDelete.id));
      closeDeleteModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const markComplete = async (stageIndex) => {
    const updatedCrop = { ...selectedCrop };
    updatedCrop.details.stages[stageIndex].completed = true;
    updatedCrop.details.stages[stageIndex].date = currentDateTime;
    const completedCount = updatedCrop.details.stages.filter((s) => s.completed).length;
    updatedCrop.progress = `${completedCount} / ${updatedCrop.details.stages.length} stages completed`;

    try {
      const response = await fetch(`${API_URL}/${updatedCrop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
        },
        body: JSON.stringify({
          ...updatedCrop,
          crop_type: updatedCrop.crop_type,
          image_path: updatedCrop.details.photoUrl !== "/placeholder-photo.jpg" ? updatedCrop.details.photoUrl : null,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update crop: ${response.statusText}`);
      }
      setSelectedCrop(updatedCrop);
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop.id === updatedCrop.id ? updatedCrop : crop
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const saveNotes = async () => {
    const updatedCrop = { ...selectedCrop, details: { ...selectedCrop.details, notes } };

    try {
      const response = await fetch(`${API_URL}/${updatedCrop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
        },
        body: JSON.stringify({
          ...updatedCrop,
          crop_type: updatedCrop.crop_type,
          image_path: updatedCrop.details.photoUrl !== "/placeholder-photo.jpg" ? updatedCrop.details.photoUrl : null,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to save notes: ${response.statusText}`);
      }
      setSelectedCrop(updatedCrop);
      setCrops((prevCrops) =>
        prevCrops.map((crop) =>
          crop.id === updatedCrop.id ? updatedCrop : crop
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-4">
          {error}. Please check the backend server at {API_URL}.
        </p>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => fetchCrops()}
        >
          Retry API
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {!selectedCrop ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-green-800">
              {language === "en" ? "Crop Tracker" : "តាមដានដំណាំ"}
            </h1>
            <button
              className="bg-green-600 text-white py-2 px-4 rounded"
              onClick={openCreateModal}
            >
              {language === "en" ? "Create Crop Tracker" : "បង្កើតតាមដានដំណាំ"}
            </button>
          </div>
          <p className="text-green-600 mb-8">
            {language === "en"
              ? `Here you can see all your registered crops. Click 'View Details' to see growth progress or use the menu to edit or delete.`
              : `នៅទីនេះអ្នកអាចមើលដំណាំដែលបានចុះឈ្មោះទាំងអស់។ ចុច 'មើលលម្អិត' ដើម្បីមើលវឌ្ឍនភាពកំណើន ឬប្រើម៉ឺនុយដើម្បីកែសម្រួល ឬលុប។ (ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: ${currentDateTime})`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop.id} className="bg-white p-4 rounded-lg shadow relative">
                <h2 className="text-xl font-semibold mb-2">{crop.name}</h2>
                <p><strong>Status:</strong> {crop.status}</p>
                <p><span role="img" aria-label="calendar">📅</span> Planted: {crop.planted}</p>
                <p><span role="img" aria-label="location">📍</span> Location: {crop.location}</p>
                <p><span role="img" aria-label="progress">📊</span> Progress: {crop.progress}</p>
                <button
                  className="mt-4 w-full bg-black text-white py-2 rounded"
                  onClick={() => openDetails(crop)}
                >
                  {language === "en" ? "View Details" : "មើលលម្អិត"}
                </button>
                <div className="absolute top-4 right-4" ref={menuRef}>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={(e) => openMenu(crop.id, e)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                  {menuOpenId === crop.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                        onClick={() => openEditModal(crop)}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                        {language === "en" ? "Edit" : "កែសម្រួល"}
                      </button>
                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        onClick={() => openDeleteModal(crop)}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12"></path>
                        </svg>
                        {language === "en" ? "Delete" : "លុប"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="w-full">
          <button
            className="mb-4 bg-gray-200 text-gray-700 py-1 px-3 rounded"
            onClick={closeDetails}
          >
            {language === "en" ? "Back to Crops" : "ត្រឡប់ទៅដំណាំ"}
          </button>
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-semibold mb-2">{selectedCrop.name}</h1>
            <p className="text-gray-600 mb-4">Detailed view of {selectedCrop.name}'s growth progress.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="col-span-2">
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Growth Progress</p>
                  <p className="text-sm text-gray-500 mb-2">Track the current stage and mark completion.</p>
                  <p><span role="img" aria-label="calendar">📅</span> Planted: {selectedCrop.planted}</p>
                  <p><span role="img" aria-label="location">📍</span> Location: {selectedCrop.location}</p>
                  <div className="flex items-center mt-2">
                    <p>Overall Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                      <div
                        className="bg-black h-2.5 rounded-full"
                        style={{ width: `${(selectedCrop.details.stages.filter((s) => s.completed).length / selectedCrop.details.stages.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{selectedCrop.details.stages.filter((s) => s.completed).length} / {selectedCrop.details.stages.length} stages completed</span>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 mb-2">Growth Stages Timeline</p>
                  <ul className="list-disc pl-5">
                    {selectedCrop.details.stages.map((stage, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <span className={stage.completed ? "text-green-600" : "text-gray-500"}>
                          {stage.stage} {stage.completed ? `(Completed on ${stage.date})` : "Pending"}
                        </span>
                        {!stage.completed && (
                          <button
                            className="ml-2 bg-gray-200 text-gray-700 py-1 px-2 rounded"
                            onClick={() => markComplete(index)}
                          >
                            Mark Complete
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Notes</p>
                  <p className="text-sm text-gray-500 mb-2">Add observations and important details.</p>
                  <textarea
                    className="w-full p-2 border rounded mb-2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <button
                    className="w-full bg-black text-white py-2 rounded"
                    onClick={saveNotes}
                  >
                    Save Notes
                  </button>
                </div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Photos</p>
                  <p className="text-sm text-gray-500 mb-2">Keep a visual history of your crop's condition.</p>
                  <img src={selectedCrop.details.photoUrl} alt={`${selectedCrop.name} photo`} className="w-full h-32 object-cover rounded mb-2" />
                  <input type="text" className="w-full p-2 border rounded" placeholder="Upload Photo (Coming Soon)" disabled />
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Crop Growth History</p>
                  <p className="text-sm text-gray-500 mb-2">Download a full report of your crop's growth timeline.</p>
                  <button className="w-full bg-black text-white py-2 rounded">Download Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              {language === "en" ? "Create New Crop Tracker" : "បង្កើតតាមដានដំណាំថ្មី"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Crop Name</label>
              <input
                type="text"
                name="name"
                value={newCrop.name}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "Enter crop name" : "បញ្ចូលឈ្មោះដំណាំ"}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={newCrop.status}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="Growing">Growing</option>
                <option value="Harvested">Harvested</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Planted Date</label>
              <input
                type="text"
                name="planted"
                value={newCrop.planted}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "e.g., August 14th, 2025" : "ឧ. ថ្ងៃទី ១៤ សីហា ២៦៨២"}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={newCrop.location}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "Enter location" : "បញ្ចូលទីតាំង"}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={closeCreateModal}
              >
                {language === "en" ? "Cancel" : "បោះបង់"}
              </button>
              <button
                className="bg-green-600 text-white py-2 px-4 rounded"
                onClick={handleCreateCrop}
                disabled={!newCrop.name || !newCrop.planted || !newCrop.location}
              >
                {language === "en" ? "Create" : "បង្កើត"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && editCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              {language === "en" ? "Edit Crop Tracker" : "កែសម្រួលតាមដានដំណាំ"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Crop Name</label>
              <input
                type="text"
                name="name"
                value={editCrop.name}
                onChange={handleEditInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "Enter crop name" : "បញ្ចូលឈ្មោះដំណាំ"}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={editCrop.status}
                onChange={handleEditInputChange}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="Growing">Growing</option>
                <option value="Harvested">Harvested</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Planted Date</label>
              <input
                type="text"
                name="planted"
                value={editCrop.planted}
                onChange={handleEditInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "e.g., August 14th, 2025" : "ឧ. ថ្ងៃទី ១៤ សីហា ២៦៨២"}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={editCrop.location}
                onChange={handleEditInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "Enter location" : "បញ្ចូលទីតាំង"}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={closeEditModal}
              >
                {language === "en" ? "Cancel" : "បោះបង់"}
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded"
                onClick={handleUpdateCrop}
                disabled={!editCrop.name || !editCrop.planted || !editCrop.location}
              >
                {language === "en" ? "Update" : "កែសម្រួល"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && cropToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              {language === "en" ? "Delete Crop Tracker" : "លុបតាមដានដំណាំ"}
            </h2>
            <p className="text-gray-600 mb-4">
              {language === "en"
                ? `Are you sure you want to delete "${cropToDelete.name}"? This action cannot be undone.`
                : `តើអ្នកប្រាកដទេថាចង់លុប "${cropToDelete.name}"? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded"
                onClick={closeDeleteModal}
              >
                {language === "en" ? "Cancel" : "បោះបង់"}
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded"
                onClick={handleDeleteCrop}
              >
                {language === "en" ? "Delete" : "លុប"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropTrackerView;
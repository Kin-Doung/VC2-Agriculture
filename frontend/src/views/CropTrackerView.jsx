"use client";

import { useState, useEffect } from "react";

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
  const [newCrop, setNewCrop] = useState({
    name: "",
    status: "Growing",
    planted: "",
    location: "",
    cropType: "Corn", // Default crop type
    progress: `0 / ${cropStages["Corn"].length} stages completed`, // Initialize with Corn stages
    details: defaultDetails,
  });

  const currentDateTime = "01:33 PM +07, Friday, August 15, 2025";
  const API_URL = "http://127.0.0.1:8000/api/croptrackers";
  const AUTH_TOKEN = localStorage.getItem("token");

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
      cropType: "Corn", // Default crop type
      progress: `0 / ${cropStages["Corn"].length} stages completed`,
      details: defaultDetails,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCrop = async () => {
    try {
      const cropToCreate = {
        ...newCrop,
        crop_type: newCrop.cropType, // Use default cropType
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
              ? `Here you can see all your registered crops. Click on a crop to view its detailed growth progress.`
              : `នៅទីនេះអ្នកអាចមើលដំណាំដែលបានចុះឈ្មោះទាំងអស់។ ចុចលើដំណាំមួយដើម្បីមើលវឌ្ឍនភាពកំណើនលម្អិត។ (ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: ${currentDateTime})`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop.id} className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{crop.name}</h2>
                <p><strong>Status:</strong> {crop.status}</p>
                <p><span role="img" aria-label="calendar">📅</span> Planted: {crop.planted}</p>
                <p><span role="img" aria-label="location">📍</span> Location: {crop.location}</p>
                <p><span role="img" aria-label="progress">📊</span> Progress: {crop.progress}</p>
                <button
                  className="mt-4 w-full bg-black text-white py-2 rounded"
                  onClick={() => openDetails(crop)}
                >
                  View Details
                </button>
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
            Back to Crops
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
    </div>
  );
};

export default CropTrackerView;
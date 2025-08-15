"use client";

import { useState } from "react";

const CropTrackerView = ({ language }) => {
  const [crops, setCrops] = useState([
    {
      name: "Corn Field 1",
      status: "Growing",
      planted: "May 10th, 2024",
      location: "North Field",
      progress: "2 / 11 stages completed",
      details: {
        stages: [
          { stage: "Germination", completed: true, date: "May 15th, 2024" },
          { stage: "Vegetative Growth (V6-VT)", completed: true, date: "June 6th, 2024" },
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
        notes: "Initial growth looks strong. Some weed pressure observed.",
        photoUrl: "/placeholder-photo.jpg",
        reminders: "High nutrient demand. Ensure adequate water supply.",
      },
    },
    {
      name: "Rice Paddy 3",
      status: "Growing",
      planted: "April 20th, 2024",
      location: "South Paddy",
      progress: "3 / 11 stages completed",
      details: {
        stages: [
          { stage: "Germination", completed: true, date: "April 25th, 2024" },
          { stage: "Tillering", completed: true, date: "May 10th, 2024" },
          { stage: "Stem Elongation", completed: true, date: "June 5th, 2024" },
          { stage: "Panicle Initiation", completed: false, date: "Pending" },
          { stage: "Flowering", completed: false, date: "Pending" },
          { stage: "Grain Filling", completed: false, date: "Pending" },
        ],
        notes: "Maintain consistent water levels in the paddy.",
        photoUrl: "/placeholder-photo.jpg",
        reminders: "Check for weed growth and apply herbicide if needed.",
      },
    },
    {
      name: "Wheat Field A",
      status: "Harvested",
      planted: "October 15th, 2023",
      location: "West Hill",
      progress: "11 / 11 stages completed",
      details: {
        stages: [
          { stage: "Germination", completed: true, date: "October 20th, 2023" },
          { stage: "Tillering", completed: true, date: "November 10th, 2023" },
          { stage: "Stem Extension", completed: true, date: "March 1st, 2024" },
          { stage: "Heading", completed: true, date: "April 15th, 2024" },
          { stage: "Grain Filling", completed: true, date: "May 20th, 2024" },
          { stage: "Harvest", completed: true, date: "June 10th, 2024" },
        ],
        notes: "Harvest completed successfully.",
        photoUrl: "/placeholder-photo.jpg",
        reminders: "Prepare field for next planting season.",
      },
    },
  ]);

  const currentDateTime = "09:29 AM +07, Friday, August 15, 2025";
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [notes, setNotes] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: "",
    status: "Growing",
    planted: "",
    location: "",
    progress: "0 / 11 stages completed",
    details: { stages: [], notes: "", photoUrl: "/placeholder-photo.jpg", reminders: "" },
  });

  const openDetails = (crop) => {
    setSelectedCrop(crop);
    setNotes(crop.details.notes || "");
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
      progress: "0 / 11 stages completed",
      details: { stages: [], notes: "", photoUrl: "/placeholder-photo.jpg", reminders: "" },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCrop = () => {
    setCrops((prevCrops) => [...prevCrops, newCrop]);
    closeCreateModal();
  };

  const markComplete = (stageIndex) => {
    const updatedCrop = { ...selectedCrop };
    updatedCrop.details.stages[stageIndex].completed = true;
    updatedCrop.details.stages[stageIndex].date = currentDateTime;
    const completedCount = updatedCrop.details.stages.filter(s => s.completed).length;
    updatedCrop.progress = `${completedCount} / ${updatedCrop.details.stages.length} stages completed`;
    setSelectedCrop(updatedCrop);
    setCrops((prevCrops) =>
      prevCrops.map((crop) =>
        crop.name === updatedCrop.name ? updatedCrop : crop
      )
    );
  };

  const saveNotes = () => {
    const updatedCrop = { ...selectedCrop, details: { ...selectedCrop.details, notes } };
    setSelectedCrop(updatedCrop);
    setCrops((prevCrops) =>
      prevCrops.map((crop) =>
        crop.name === updatedCrop.name ? updatedCrop : crop
      )
    );
  };

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
              : `នៅទីនេះអ្នកអាចមើលដំណាំដែលបានចុះឈ្មោះទាំងអស់។ ចុចលើដំណាំមួយដើម្បីមើលវឌ្ឍនភាពកំណើនលម្អិត។`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {crops.map((crop, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
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
                        style={{ width: `${(selectedCrop.details.stages.filter(s => s.completed).length / selectedCrop.details.stages.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2">{selectedCrop.details.stages.filter(s => s.completed).length} / {selectedCrop.details.stages.length} stages completed</span>
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
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-2">Growth Reminders & Tips</p>
                  <p className="text-sm text-gray-500 mb-2">Automated alerts and care tips.</p>
                  <p><span role="img" aria-label="alert">⚠️</span> Current Stage: {selectedCrop.details.stages.find(s => !s.completed)?.stage || "N/A"}</p>
                  <p>{selectedCrop.details.reminders}</p>
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
                placeholder={language === "en" ? "e.g., May 10th, 2024" : "ឧ. ថ្ងៃទី ១០ ឧសភា ២០២៤"}
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Reminders</label>
              <input
                type="text"
                name="reminders"
                value={newCrop.details.reminders}
                onChange={(e) => setNewCrop((prev) => ({ ...prev, details: { ...prev.details, reminders: e.target.value } }))}
                className="mt-1 p-2 w-full border rounded"
                placeholder={language === "en" ? "Enter reminders" : "បញ្ចូលការរំលឹក"}
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
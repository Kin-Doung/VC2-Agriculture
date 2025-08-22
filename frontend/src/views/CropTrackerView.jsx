"use client";

import { Plus, Search, X, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Component to handle image loading with fallback
const ImageWithFallback = ({ src, alt, className, fallbackSrc, fallbackAlt }) => {
  const BASE_URL = "http://127.0.0.1:8000";
  let resolvedSrc = src;
  if (src && !src.startsWith("http")) {
    resolvedSrc = `${BASE_URL}${src.startsWith("/") ? src : `/${src}`}`;
  }
  console.log(`Resolved Image URL: ${resolvedSrc}`); // Debug log
  return (
    <img
      src={resolvedSrc || fallbackSrc}
      alt={resolvedSrc ? alt : fallbackAlt}
      className={className}
      loading="lazy"
      onError={(e) => {
        console.error(`Failed to load image: ${resolvedSrc}`);
        e.target.src = fallbackSrc;
        e.target.alt = fallbackAlt;
      }}
    />
  );
};

const CropTrackerView = ({ language = "en" }) => {
  const generalTimeline = [
    { stage: "Germination & Emergence", dapRange: "0 to 10 DAP", completed: false, date: "Pending" },
    { stage: "Vegetative Growth", dapRange: "10 to 40 DAP", completed: false, date: "Pending" },
    { stage: "Rapid Growth", dapRange: "40 to 60 DAP", completed: false, date: "Pending" },
    { stage: "Reproductive Stage", dapRange: "60 to 90 DAP", completed: false, date: "Pending" },
    { stage: "Early Grain/Pod/Head Filling", dapRange: "90 to 110 DAP", completed: false, date: "Pending" },
    { stage: "Grain/Seed Development", dapRange: "110 to 130 DAP", completed: false, date: "Pending" },
    { stage: "Maturity", dapRange: "130 to 150+ DAP", completed: false, date: "Pending" },
    { stage: "Harvest Ready", dapRange: "150 to 180+ DAP", completed: false, date: "Pending" },
  ];

  const defaultDetails = () => ({
    status: "Planned",
    stages: generalTimeline.map((stage) => ({ ...stage })),
    photoUrl: "/images/placeholder-photo.jpg",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name"); // Filter by field
  const [selectedCropName, setSelectedCropName] = useState("all"); // New state for specific crop name filter
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropToDelete, setCropToDelete] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCrop, setNewCrop] = useState({
    crop_id: "",
    planted: "",
    location: "",
    image: "",
    status: "Planned",
  });
  const [editCrop, setEditCrop] = useState(null);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [clientDetails, setClientDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const translations = {
    en: {
      title: "Crop Tracker View",
      subtitle: "Manage your crop trackers",
      addCrop: "Add Crop Tracker",
      search: "Search crops...",
      filterName: "Crop Name",
      filterStatus: "Status",
      filterLocation: "Location",
      filterAll: "All Fields",
      allCrops: "All Crops",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      addNewCrop: "Add New Crop Tracker",
      editCrop: "Edit Crop Tracker",
      viewCrop: "Crop Tracker Details",
      cropName: "Crop Name",
      status: "Status",
      selectStatus: "Select status...",
      planted: "Planted Date",
      location: "Location",
      progress: "Progress",
      cancel: "Cancel",
      save: "Save Crop Tracker",
      update: "Update Crop Tracker",
      close: "Close",
      enterCropName: "Select crop name...",
      enterPlanted: "Select a date...",
      enterLocation: "Enter location...",
      noCropsAvailable: "No crops available. Add a new crop to get started.",
      noCropsFound: "No crops found matching your search.",
      confirmDelete: "Are you sure you want to delete this crop tracker?",
      loading: "Loading crop trackers...",
      error: "Failed to load data. Please try again later.",
      deleteSuccess: "Crop deleted successfully.",
      deleteError: "Failed to delete crop tracker: ",
      updateSuccess: "Crop tracker updated successfully.",
      addError: "Failed to add crop tracker: ",
      saving: "Saving...",
      updating: "Updating...",
      photos: "Photos",
      uploadPhoto: "Upload Photo",
      cropGrowthHistory: "Crop Growth History",
      downloadReport: "Download Report",
      downloadCSV: "Download CSV",
      growthProgress: "Growth Progress",
      growthStagesTimeline: "Growth Stages Timeline",
      markComplete: "Mark Complete",
      overallProgress: "Overall Progress",
      generalTimeline: "General Crop Growth Timeline",
      daysSincePlanting: "Days Since Planting",
      expected: "Expected",
      previous: "Previous",
      next: "Next",
      page: "Page",
      reportError: "Failed to generate report. Please try again.",
    },
    km: {
      title: "តាមដានដំណាំ",
      subtitle: "គ្រប់គ្រងតាមដានដំណាំរបស់អ្នក",
      addCrop: "បន្ថែមតាមដានដំណាំ",
      search: "ស្វែងរកដំណាំ...",
      filterBy: "តម្រងតាម",
      filterName: "ឈ្មោះដំណាំ",
      filterStatus: "ស្ថានភាព",
      filterLocation: "ទីតាំង",
      filterAll: "គ្រប់វាល",
      filterCrop: "តម្រងដំណាំ",
      allCrops: "ដំណាំទាំងអស់",
      edit: "កែសម្រួល",
      delete: "លុប",
      view: "មើលលម្អិត",
      addNewCrop: "បន្ថែមតាមដានដំណាំថ្មី",
      editCrop: "កែសម្រួលតាមដានដំណាំ",
      viewCrop: "លម្អិតដំណាំ",
      cropName: "ឈ្មោះដំណាំ",
      status: "ស្ថានភាព",
      selectStatus: "ជ្រើសរើសស្ថានភាព...",
      planted: "ថ្ងៃដាំ",
      location: "ទីតាំង",
      progress: "វឌ្ឍនភាព",
      cancel: "បោះបង់",
      save: "រក្សាទុកដំណាំ",
      update: "ធ្វើបច្ចុប្បន្នភាពដំណាំ",
      close: "បិទ",
      enterCropName: "ជ្រើសរើសឈ្មោះដំណាំ...",
      enterPlanted: "ជ្រើសរើសកាលបរិច្ឆេទ...",
      enterLocation: "បញ្ចូលទីតាំង...",
      noCropsAvailable: "មិនមានដំណាំទេ។ បន្ថែមដំណាំថ្មីដើម្បីចាប់ផ្តើម។",
      noCropsFound: "រកមិនឃើញដំណាំដែលត្រូវនឹងការស្វែងរករបស់អ្នក។",
      confirmDelete: "តើអ្នកប្រាកដទេថាចង់លុបដំណាំនេះ?",
      loading: "កំពុងផ្ទុកដំណាំ...",
      error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
      deleteSuccess: "ដំណាំត្រូវបានលុបដោយជោគជ័យ។",
      deleteError: "បរាជ័យក្នុងការលុបដំណាំ៖ ",
      updateSuccess: "ដំណាំត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ។",
      addError: "បរាជ័យក្នុងការបន្ថែមដំណាំ៖ ",
      saving: "កំពុងរក្សាទុក...",
      updating: "កំពុងធ្វើបច្ចុប្បន្នភាព...",
      photos: "រូបថត",
      uploadPhoto: "ផ្ទុកឡើងរូបថត",
      cropGrowthHistory: "ប្រវត្តិកំណើនដំណាំ",
      downloadReport: "ទាញយករបាយការណ៍",
      downloadCSV: "ទាញយក CSV",
      growthProgress: "វឌ្ឍនភាពកំណើន",
      growthStagesTimeline: "ពេលវេលាដំណាក់កាលកំណើន",
      markComplete: "សម្គាល់បញ្ចប់",
      overallProgress: "វឌ្ឍនភាពទាំងមូល",
      generalTimeline: "ពេលវេលាកំណើនដំណាំទូទៅ",
      daysSincePlanting: "ថ្ងៃចាប់តាំងពីដាំ",
      expected: "រំពឹងទុក",
      previous: "មុន",
      next: "បន្ទាប់",
      page: "ទំព័រ",
      reportError: "Failed to generate report. Please try again.",
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/croptrackers";
  const CROPS_API_URL = "http://127.0.0.1:8000/api/crops";
  const AUTH_TOKEN = localStorage.getItem("token");

  const calculateDAP = (plantedDate) => {
    if (!plantedDate || plantedDate === "Unknown") return null;
    try {
      const planted = new Date(plantedDate);
      const current = new Date();
      const diffTime = current - planted;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 ? diffDays : 0;
    } catch {
      return null;
    }
  };

  const getCurrentStage = useCallback((dap) => {
    if (dap === null) return "Unknown";
    for (let stage of generalTimeline) {
      const [start, end] = stage.dapRange.match(/\d+/g).map(Number);
      if (dap >= start && (end === undefined || dap <= end)) {
        return stage.stage;
      }
    }
    return "Beyond Harvest";
  }, []);

  const getStatusFromStage = useCallback((stage, dap) => {
    if (dap === null || stage === "Unknown") return "Planned";
    if (stage === "Beyond Harvest") return "Harvested";
    return "Growing";
  }, []);

  const calculateExpectedDate = useCallback((plantedDate, dapRange, isCompleted = false) => {
    if (!plantedDate || plantedDate === "Unknown") return "Unknown";
    try {
      const planted = new Date(plantedDate);
      const [start] = dapRange.match(/\d+/g).map(Number);
      const targetDate = new Date(planted);
      targetDate.setDate(planted.getDate() + start);
      return targetDate.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Bangkok",
      }) + ", " + targetDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    } catch {
      return "Unknown";
    }
  }, []);

  const normalizeCrop = useCallback(
    (crop) => {
      const clientData = clientDetails[crop.id] || defaultDetails();
      const dap = calculateDAP(crop.planted);
      const currentStage = getCurrentStage(dap);
      const status = crop.status || getStatusFromStage(currentStage, dap);

      const stages = (clientData.stages || generalTimeline.map((stage) => ({ ...stage }))).map((stage) => {
        const [start, end] = stage.dapRange.match(/\d+/g).map(Number);
        const isCompleted = dap !== null && dap >= start;
        return {
          ...stage,
          completed: isCompleted,
          date: isCompleted ? calculateExpectedDate(crop.planted, stage.dapRange, true) : calculateExpectedDate(crop.planted, stage.dapRange),
        };
      });

      return {
        ...crop,
        id: crop.id,
        name: crop.crop?.name || `Crop ${crop.id || "Unknown"}`,
        status: status,
        planted: formatDate(crop.planted || "Unknown"),
        location: crop.location || "Unknown",
        image_path: crop.image_path || null,
        details: {
          ...clientData,
          stages,
          photoUrl: crop.image_path || clientData.photoUrl,
        },
        progress: `${stages.filter((s) => s.completed).length} / ${stages.length} stages completed`,
      };
    },
    [clientDetails, calculateExpectedDate, getCurrentStage, getStatusFromStage]
  );

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => debouncedSetSearchTerm(e.target.value);

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        return await response.json();
      } catch (err) {
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
          continue;
        }
        throw err;
      }
    }
  };

  useEffect(() => {
    const fetchAvailableCrops = async () => {
      try {
        const data = await fetchWithRetry(CROPS_API_URL, {
          headers: {
            "Content-Type": "application/json",
            ...(AUTH_TOKEN && { Authorization: `Bearer ${AUTH_TOKEN}` }),
          },
        });
        setAvailableCrops(data);
      } catch (err) {
        console.error("Failed to fetch crops:", err);
      }
    };
    fetchAvailableCrops();
  }, []);

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

  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithRetry(API_URL, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      console.log("API Response:", JSON.stringify(data, null, 2)); // Debug log
      if (!Array.isArray(data)) throw new Error("API response is not an array");
      const newClientDetails = {};
      data.forEach((crop) => {
        newClientDetails[crop.id] = clientDetails[crop.id] || defaultDetails();
      });
      setClientDetails(newClientDetails);
      setCrops(data.map(normalizeCrop));
    } catch (err) {
      setError(`${t.error}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (AUTH_TOKEN) fetchCrops();
    else setError("Authentication token not found. Please log in.");
  }, []);

  const filteredCrops = crops.filter((crop) => {
    const searchLower = searchTerm.toLowerCase();
    let matchesText = false;
    switch (filterBy) {
      case "name":
        matchesText = crop.name?.toLowerCase().includes(searchLower);
        break;
      case "status":
        matchesText = crop.status?.toLowerCase().includes(searchLower);
        break;
      case "location":
        matchesText = crop.location?.toLowerCase().includes(searchLower);
        break;
      case "all":
        matchesText =
          crop.name?.toLowerCase().includes(searchLower) ||
          crop.status?.toLowerCase().includes(searchLower) ||
          crop.location?.toLowerCase().includes(searchLower);
        break;
      default:
        matchesText = true;
    }
    const matchesCropName = selectedCropName === "all" || crop.name === selectedCropName;
    return matchesText && matchesCropName;
  });

  const totalPages = Math.ceil(filteredCrops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCrops = filteredCrops.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0) {
      setCurrentPage(1);
    }
  }, [filteredCrops, currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewCrop = (crop) => {
    const normalized = normalizeCrop(crop);
    setSelectedCrop(normalized);
    setShowViewModal(true);
    setActiveMenu(null);
  };

  const handleEditCrop = (crop) => {
    const dap = calculateDAP(crop.planted);
    const currentStage = getCurrentStage(dap);
    setEditCrop({
      ...crop,
      crop_id: crop.crop?.id || "",
      status: crop.status || getStatusFromStage(currentStage, dap),
      planted: crop.planted === "Unknown" ? "" : new Date(crop.planted).toISOString().split("T")[0],
      image: "",
    });
    setShowEditModal(true);
    setActiveMenu(null);
  };

  const handleDeleteCrop = (crop) => {
    setCropToDelete(crop);
    setShowDeleteModal(true);
    setActiveMenu(null);
  };

  const confirmDeleteCrop = async () => {
    if (!cropToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/${cropToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${AUTH_TOKEN}`, Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`${t.deleteError}${response.statusText}`);
      setCrops(crops.filter((c) => c.id !== cropToDelete.id));
      setClientDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[cropToDelete.id];
        return newDetails;
      });
      setShowDeleteModal(false);
      alert(t.deleteSuccess);
    } catch (err) {
      alert(`${t.deleteError}${err.message}`);
    } finally {
      setIsSubmitting(false);
      setCropToDelete(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCrop((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCrop((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEdit) {
        setEditCrop((prev) => ({ ...prev, image: file }));
      } else {
        setNewCrop((prev) => ({ ...prev, image: file }));
      }
    }
  };

  const validateForm = (crop) => {
    const errors = {};
    if (!crop.crop_id) errors.crop_id = t.enterCropName;
    if (!crop.status) errors.status = t.selectStatus;
    if (!crop.planted) errors.planted = t.enterPlanted;
    if (!crop.location.trim()) errors.location = t.enterLocation;
    return errors;
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    const errors = validateForm(newCrop);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("crop_id", newCrop.crop_id);
    formData.append("planted", newCrop.planted);
    formData.append("location", newCrop.location);
    formData.append("status", newCrop.status);
    if (newCrop.image) formData.append("image", newCrop.image);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: "application/json",
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${t.addError}${errorData.message || response.statusText}`);
      }
      const savedCrop = await response.json();
      console.log("Saved Crop:", JSON.stringify(savedCrop, null, 2)); // Debug log
      const newDetails = { ...defaultDetails(), status: newCrop.status };
      setClientDetails((prev) => ({
        ...prev,
        [savedCrop.id]: newDetails,
      }));
      setCrops((prev) => [normalizeCrop(savedCrop), ...prev]);
      setNewCrop({
        crop_id: "",
        status: "Planned",
        planted: "",
        location: "",
        image: "",
      });
      setFormErrors({});
      setShowAddModal(false);
      setCurrentPage(1);
      alert("Crop tracker added successfully.");
    } catch (err) {
      console.error("Add Crop Error:", err);
      alert(`${t.addError}${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCrop = async (e) => {
    e.preventDefault();
    const errors = validateForm(editCrop);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("crop_id", editCrop.crop_id);
    formData.append("planted", editCrop.planted);
    formData.append("location", editCrop.location);
    formData.append("status", editCrop.status);
    if (editCrop.image) formData.append("image", editCrop.image);
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
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`${t.updateError}${errorData.message || response.statusText}`);
      }
      const updatedCropData = await response.json();
      console.log("Updated Crop:", JSON.stringify(updatedCropData, null, 2)); // Debug log
      setClientDetails((prev) => ({
        ...prev,
        [updatedCropData.id]: {
          ...defaultDetails(),
          ...prev[updatedCropData.id],
          status: editCrop.status,
        },
      }));
      setCrops(crops.map((c) => (c.id === updatedCropData.id ? normalizeCrop(updatedCropData) : c)));
      setShowEditModal(false);
      alert(t.updateSuccess);
    } catch (err) {
      console.error("Update Crop Error:", err);
      alert(`${t.updateError}${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = async (crop) => {
    try {
      const doc = new jsPDF();
      const margin = 10;
      let yPosition = 20;

      doc.setFontSize(18);
      doc.text(`${t.viewCrop}: ${crop.name}`, margin, yPosition);
      yPosition += 10;

      doc.setFontSize(12);
      doc.text(`${t.status}: ${crop.status}`, margin, yPosition);
      yPosition += 8;
      doc.text(`${t.planted}: ${crop.planted}`, margin, yPosition);
      yPosition += 8;
      doc.text(`${t.location}: ${crop.location}`, margin, yPosition);
      yPosition += 8;
      doc.text(`${t.daysSincePlanting}: ${calculateDAP(crop.planted) ?? "Unknown"} DAP`, margin, yPosition);
      yPosition += 8;
      doc.text(`${t.generalTimeline}: ${getCurrentStage(calculateDAP(crop.planted))}`, margin, yPosition);
      yPosition += 8;
      doc.text(`${t.overallProgress}: ${crop.progress}`, margin, yPosition);
      yPosition += 12;

      doc.setFontSize(14);
      doc.text(t.growthStagesTimeline, margin, yPosition);
      yPosition += 8;
      doc.setFontSize(10);
      crop.details.stages.forEach((stage) => {
        const statusText = stage.completed
          ? `(Completed on ${stage.date})`
          : `(${t.expected}: ${stage.date})`;
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${stage.stage} (${stage.dapRange}) ${statusText}`, margin + 5, yPosition);
        yPosition += 8;
      });

      if (crop.image_path) {
        try {
          const imgElement = document.createElement("img");
          const resolvedImageSrc = crop.image_path.startsWith("http") ? crop.image_path : `http://127.0.0.1:8000${crop.image_path.startsWith("/") ? crop.image_path : `/${crop.image_path}`}`;
          console.log(`PDF Image URL: ${resolvedImageSrc}`); // Debug log
          imgElement.src = resolvedImageSrc;
          imgElement.crossOrigin = "anonymous";
          document.body.appendChild(imgElement);
          await new Promise((resolve, reject) => {
            imgElement.onload = resolve;
            imgElement.onerror = () => reject(new Error(`Failed to load image: ${resolvedImageSrc}`));
          });
          const canvas = await html2canvas(imgElement, { scale: 1, useCORS: true });
          const imgData = canvas.toDataURL("image/jpeg");
          document.body.removeChild(imgElement);
          if (yPosition > 230) {
            doc.addPage();
            yPosition = 20;
          }
          doc.addImage(imgData, "JPEG", margin, yPosition, 80, 60);
          yPosition += 65;
        } catch (imgError) {
          console.error(`PDF Image Error: ${imgError.message}`);
          doc.setFontSize(12);
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`${t.photos}: ${crop.image_path} (Image not available)`, margin, yPosition);
          yPosition += 8;
        }
      } else {
        doc.setFontSize(12);
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${t.photos}: No image available`, margin, yPosition);
        yPosition += 8;
      }

      doc.save(`${crop.name}_Report.pdf`);
    } catch (err) {
      console.error(`Report Generation Error: ${err.message}`);
      alert(`${t.reportError}: ${err.message}`);
    }
  };

  const handleDownloadCSV = (crop) => {
    try {
      const rows = [
        ["Field", "Value"],
        [t.cropName, crop.name],
        [t.status, crop.status],
        [t.planted, crop.planted],
        [t.location, crop.location],
        [t.daysSincePlanting, `${calculateDAP(crop.planted) ?? "Unknown"} DAP`],
        [t.generalTimeline, getCurrentStage(calculateDAP(crop.planted))],
        [t.overallProgress, crop.progress],
        [],
        [t.growthStagesTimeline, ""],
        ...crop.details.stages.map((stage) => [
          stage.stage,
          `${stage.dapRange} ${stage.completed ? `(Completed on ${stage.date})` : `(${t.expected}: ${stage.date})`}`,
        ]),
        [],
        [t.photos, crop.image_path || "No image"],
      ];
      const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${crop.name}_Report.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(`CSV Generation Error: ${err.message}`);
      alert(`${t.reportError}: ${err.message}`);
    }
  };

  const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
      const errorHandler = (error) => {
        console.error(error);
        setHasError(true);
      };
      window.addEventListener("error", errorHandler);
      return () => window.removeEventListener("error", errorHandler);
    }, []);
    if (hasError) {
      return <div className="text-red-500 text-center py-12">{t.error}</div>;
    }
    return children;
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6" onClick={() => setActiveMenu(null)}>
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
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <select
                  value={selectedCropName}
                  onChange={(e) => setSelectedCropName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">{t.allCrops}</option>
                  {availableCrops.map((crop) => (
                    <option key={crop.id} value={crop.name}>
                      {crop.name}
                    </option>
                  ))}
                </select>
              </div>
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
                onClick={fetchCrops}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : crops.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-600 text-lg">{t.noCropsAvailable}</div>
            </div>
          ) : filteredCrops.length === 0 ? (
            <div className="text-center py-12">{t.noCropsFound}</div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-6 bg-white rounded-lg shadow-md p-6">
                {paginatedCrops.map((crop) => (
                  <div key={crop.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 w-full">
                        <h3 className="text-lg font-medium text-gray-900">{crop.name}</h3>
                        <div className="bg-gray-50 p-2 rounded-lg space-y-1">
                          <p><span role="img" aria-label="status">📊</span> <strong>{t.status}:</strong> {crop.status}</p>
                          <p><span role="img" aria-label="calendar">📅</span> <strong>{t.planted}:</strong> {crop.planted}</p>
                          <p><span role="img" aria-label="location">📍</span> <strong>{t.location}:</strong> {crop.location}</p>
                          <p><span role="img" aria-label="progress">📈</span> <strong>{t.progress}:</strong> {crop.progress}</p>
                        </div>
                        <button
                          onClick={() => handleViewCrop(crop)}
                          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg w-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex justify-center items-center"
                          disabled={isSubmitting}
                          aria-label={`View details for ${crop.name}`}
                          tabIndex="0"
                          title={`View details for ${crop.name}`}
                        >
                          <span className="text-sm">{t.view}</span>
                        </button>
                      </div>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenu(activeMenu === crop.id ? null : crop.id);
                          }}
                          className="p-2 bg-green-50 rounded-full shadow-md hover:bg-green-100 transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          disabled={isSubmitting}
                          aria-label="More options"
                          tabIndex="0"
                          title="More options"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                        {activeMenu === crop.id && (
                          <div className="absolute right-0 mt-2 w-30 bg-white rounded-lg shadow-sm border border-gray-200 py-2 z-30 transition-opacity duration-200">
                            <button
                              onClick={() => handleEditCrop(crop)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              aria-label={`Edit ${crop.name}`}
                              tabIndex="0"
                              title={`Edit ${crop.name}`}
                            >
                              <Edit className="h-4 w-4" /> {t.edit}
                            </button>
                            <button
                              onClick={() => handleDeleteCrop(crop)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              disabled={isSubmitting}
                              aria-label={`Delete ${crop.name}`}
                              tabIndex="0"
                              title={`Delete ${crop.name}`}
                            >
                              <Trash2 className="h-4 w-4" /> {isSubmitting ? t.deleting : t.delete}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                  >
                    {t.previous}
                  </button>
                  <span>
                    {t.page} {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"}`}
                  >
                    {t.next}
                  </button>
                </div>
              )}
            </>
          )}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">{t.addNewCrop}</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleAddCrop} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.cropName} *
                    </label>
                    <select
                      name="crop_id"
                      value={newCrop.crop_id}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.crop_id ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>{t.enterCropName}</option>
                      {availableCrops.map((crop) => (
                        <option key={crop.id} value={crop.id}>
                          {crop.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.crop_id && <p className="text-red-500 text-sm mt-1">{formErrors.crop_id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.status} *</label>
                    <select
                      name="status"
                      value={newCrop.status}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.status ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none`}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>{t.selectStatus}</option>
                      <option value="Planned">{language === "en" ? "Planned" : "គ្រោង"}</option>
                      <option value="Growing">{language === "en" ? "Growing" : "កំពុងដុះ"}</option>
                      <option value="Harvested">{language === "en" ? "Harvested" : "ប្រមូលផល"}</option>
                    </select>
                    {formErrors.status && <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.planted} *
                    </label>
                    <input
                      type="date"
                      name="planted"
                      value={newCrop.planted}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full px-3 py-2 border ${formErrors.planted ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      disabled={isSubmitting}
                      lang={language}
                      placeholder={t.enterPlanted}
                    />
                    {formErrors.planted && <p className="text-red-500 text-sm mt-1">{formErrors.planted}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.location} *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newCrop.location}
                      onChange={handleInputChange}
                      placeholder={t.enterLocation}
                      className={`w-full px-3 py-2 border ${formErrors.location ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.photos}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={isSubmitting}
                    />
                    {newCrop.image && (
                      <img
                        src={URL.createObjectURL(newCrop.image)}
                        alt="Image preview"
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
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
                      className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? t.saving : t.save}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showEditModal && editCrop && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">{t.editCrop}</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdateCrop} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.cropName} *
                    </label>
                    <select
                      name="crop_id"
                      value={editCrop.crop_id}
                      onChange={handleEditInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.crop_id ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>{t.enterCropName}</option>
                      {availableCrops.map((crop) => (
                        <option key={crop.id} value={crop.id}>
                          {crop.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.crop_id && <p className="text-red-500 text-sm mt-1">{formErrors.crop_id}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.status} *</label>
                    <select
                      name="status"
                      value={editCrop.status}
                      onChange={handleEditInputChange}
                      className={`w-full px-3 py-2 border ${formErrors.status ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white appearance-none`}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>{t.selectStatus}</option>
                      <option value="Planned">{language === "en" ? "Planned" : "គ្រោង"}</option>
                      <option value="Growing">{language === "en" ? "Growing" : "កំពុងដុះ"}</option>
                      <option value="Harvested">{language === "en" ? "Harvested" : "ប្រមូលផល"}</option>
                    </select>
                    {formErrors.status && <p className="text-red-500 text-sm mt-1">{formErrors.status}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.planted} *
                    </label>
                    <input
                      type="date"
                      name="planted"
                      value={editCrop.planted}
                      onChange={handleEditInputChange}
                      max={new Date().toISOString().split("T")[0]}
                      className={`w-full px-3 py-2 border ${formErrors.planted ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.planted && <p className="text-red-500 text-sm mt-1">{formErrors.planted}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.location} *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={editCrop.location}
                      onChange={handleEditInputChange}
                      placeholder={t.enterLocation}
                      className={`w-full px-3 py-2 border ${formErrors.location ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      required
                      disabled={isSubmitting}
                    />
                    {formErrors.location && <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.photos}</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, true)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={isSubmitting}
                    />
                    <ImageWithFallback
                      src={editCrop.image ? URL.createObjectURL(editCrop.image) : editCrop.image_path}
                      alt={`${editCrop.name} photo`}
                      className="mt-2 w-full h-32 object-cover rounded"
                      fallbackSrc="/images/placeholder-photo.jpg"
                      fallbackAlt="Placeholder image"
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
                      className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">{t.viewCrop}: {selectedCrop.name}</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">{t.growthProgress}</p>
                      <p><span role="img" aria-label="status">📊</span> {t.status}: {selectedCrop.status}</p>
                      <p><span role="img" aria-label="calendar">📅</span> {t.planted}: {selectedCrop.planted}</p>
                      <p><span role="img" aria-label="location">📍</span> {t.location}: {selectedCrop.location}</p>
                      <p><span role="img" aria-label="calendar">📅</span> {t.daysSincePlanting}: {calculateDAP(selectedCrop.planted) ?? "Unknown"} DAP</p>
                      <p><span role="img" aria-label="stage">🌱</span> {t.generalTimeline}: {getCurrentStage(calculateDAP(selectedCrop.planted))}</p>
                      <div className="flex items-center mt-2">
                        <p>{t.overallProgress}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                          <div
                            className="bg-black h-2.5 rounded-full"
                            style={{ width: `${(selectedCrop.details.stages.filter((s) => s.completed).length / selectedCrop.details.stages.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{selectedCrop.progress}</span>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-gray-600 mb-2">{t.growthStagesTimeline}</p>
                      <ul className="list-disc pl-5">
                        {selectedCrop.details.stages.map((stage, index) => (
                          <li key={index} className="flex items-center mb-2">
                            <span className={stage.completed ? "text-green-600" : "text-gray-500"}>
                              {stage.stage} ({stage.dapRange}) {stage.completed ? `(Completed on ${stage.date})` : `(${t.expected}: ${stage.date})`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-2">{t.photos}</p>
                      <ImageWithFallback
                        src={selectedCrop.image_path}
                        alt={`${selectedCrop.name} photo`}
                        className="w-full h-32 object-cover rounded mb-2"
                        fallbackSrc="/images/placeholder-photo.jpg"
                        fallbackAlt="Placeholder image"
                      />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600 mb-2">{t.cropGrowthHistory}</p>
                      <button
                        onClick={() => handleDownloadReport(selectedCrop)}
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                      >
                        {t.downloadReport}
                      </button>
                      <button
                        onClick={() => handleDownloadCSV(selectedCrop)}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors mt-2"
                      >
                        {t.downloadCSV}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showDeleteModal && cropToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-800">{t.confirmDelete}</h2>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">
                    {t.confirmDelete} <strong>{cropToDelete.name}</strong>?
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={isSubmitting}
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={confirmDeleteCrop}
                      disabled={isSubmitting}
                      className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? t.deleting : t.delete}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CropTrackerView;
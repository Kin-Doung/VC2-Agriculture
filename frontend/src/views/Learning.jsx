
import { useState } from "react";
import { Search } from "lucide-react";
import RiceCard from "../components/RiceCard";
import riceData from "../services/riceData";

const Learning = ({ language }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fields, setFields] = useState([
    { name: "Rice Field A", area: "6.2 ha", status: "Growing", progress: 65, id: 1 },
    { name: "Corn Field B", area: "4.8 ha", status: "Ready to Harvest", progress: 100, id: 2 },
    { name: "Tomato Garden", area: "2.1 ha", status: "Flowering", progress: 45, id: 3 },
    { name: "Onion Patch", area: "2.4 ha", status: "Planted", progress: 25, id: 4 },
  ]);
  const [newField, setNewField] = useState({ name: "", area: "", status: "", progress: 0, id: null });
  const [editField, setEditField] = useState(null);
  const [formError, setFormError] = useState("");

  // CRUD Operations
  const handleSubmit = (e) => {
    e.preventDefault();
    const field = editField || newField;
    if (!field.name || !field.area || !field.status) {
      setFormError(language === "en" ? "All fields are required." : "តម្រូវឱ្យបំពេញគ្រប់វាល។");
      return;
    }
    if (field.progress < 0 || field.progress > 100) {
      setFormError(language === "en" ? "Progress must be between 0 and 100." : "វឌ្ឍនភាពត្រូវតែនៅចន្លោះ 0 និង 100។");
      return;
    }
    setFormError("");
    if (editField) {
      setFields(fields.map((f) => (f.id === editField.id ? field : f)));
      setEditField(null);
    } else {
      const id = Date.now();
      setFields([...fields, { ...field, id }]);
      setNewField({ name: "", area: "", status: "", progress: 0, id: null });
    }
  };

  const handleDelete = (id) => {
    setFields(fields.filter((field) => field.id !== id));
    if (editField && editField.id === id) setEditField(null);
  };

  const startEdit = (field) => {
    setEditField(field);
    setFormError("");
  };

  // Filter rice varieties
  const filteredVarieties = riceData.varieties.filter((variety) =>
    variety.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold text-green-800 mb-2 text-center">
        {language === "en" ? "Rice Varieties Information" : "ព័ត៌មានអំពីពូជស្រូវ"}
      </h1>
      <p className="text-green-600 mb-8 text-lg text-center">
        {language === "en"
          ? "Explore different rice varieties and their characteristics"
          : "ស្វែងយល់ពីពូជស្រូវផ្សេងៗ និងលក្ខណៈរបស់ពួកវា"}
      </p>

      {/* Rice Varieties */}
      <div className="bg-white rounded-xl p-3 mx-auto mp-6">
        <div className="flex gap-8">
             {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-green-800 mb-6 text-center sm:text-left">
          {language === "en" ? "Rice Varieties" : "ពូជស្រូវ"}
        </h2>

        {/* Search */}
        <div className="relative mb-8 max-w-[400px] mx-auto sm:mx-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={
              language === "en"
                ? "Search rice varieties..."
                : "ស្វែងរកពូជស្រូវ..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 p-3 pl-10 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
        </div>
        {/* Rice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVarieties.length > 0 ? (
            filteredVarieties.map((variety) => (
              <RiceCard
                key={variety.name}
                variety={variety}
                fullRiceData={riceData}
                language={language}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              {language === "en"
                ? "No rice varieties found."
                : "រកមិនឃើញពូជស្រូវទេ។"}
            </p>
          )}
        </div>
      </div>

    </div>

  );
};

export default Learning;

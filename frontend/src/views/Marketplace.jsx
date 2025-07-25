"use client"

import { ShoppingCart, Plus, Search, Filter, Star, X } from "lucide-react"
import { useEffect, useState } from "react"
import axios from "axios"

const Marketplace = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    user_id: "",
    category_id: "",
    crop_id: "",
    image: null,
  })

  const translations = {
    en: {
      title: "Marketplace",
      subtitle: "Sell your products and discover what other farmers offer",
      addProduct: "Add Product",
      search: "Search products...",
      filter: "Filter",
      myProducts: "My Products",
      allProducts: "All Products",
      price: "Price",
      perKg: "/kg",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      edit: "Edit",
      delete: "Delete",
      contact: "Contact Seller",
      rating: "Rating",
      submit: "Submit",
      cancel: "Cancel",
    },
    km: {
      title: "ទីផ្សារ",
      subtitle: "លក់ផលិតផលរបស់អ្នក និងស្វែងរកអ្វីដែលកសិករដទៃផ្តល់ជូន",
      addProduct: "បន្ថែមផលិតផល",
      search: "ស្វែងរកផលិតផល...",
      filter: "តម្រង",
      myProducts: "ផលិតផលរបស់ខ្ញុំ",
      allProducts: "ផលិតផលទាំងអស់",
      price: "តម្លៃ",
      perKg: "/គ.ក",
      inStock: "មានស្តុក",
      outOfStock: "អស់ស្តុក",
      edit: "កែប្រែ",
      delete: "លុប",
      contact: "ទាក់ទងអ្នកលក់",
      rating: "ការវាយតម្លៃ",
      submit: "បញ្ជូន",
      cancel: "បោះបង់",
    },
  }

  const t = translations[language] || translations.en

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        setProducts(res.data)
      })
      .catch((err) => {
        console.error("Error fetching products:", err)
      })
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value)
    })

    try {
      await axios.post("http://127.0.0.1:8000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      alert("✅ Product created successfully!")
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      console.error("Create error:", err)
      alert("❌ Failed to create product.")
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t.addProduct}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t.filter}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={`http://127.0.0.1:8000/storage/${product.image_path}`}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.quantity > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.quantity > 0 ? t.inStock : t.outOfStock}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{product.description}</p>

              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">
                  {product.rating ? product.rating.toFixed(1) : "4.5"}
                </span>
              </div>

              <div className="text-lg font-bold text-green-600">
                ${product.price} <span className="text-sm text-gray-500">{t.perKg}</span>
              </div>
              <div className="text-xs text-gray-500">{product.user?.name || "Unknown Seller"}</div>

              <button className="w-full mt-3 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {t.contact}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
              onClick={() => setShowForm(false)}
            >
              <X />
            </button>
            <h2 className="text-xl font-bold text-gray-800">{t.addProduct}</h2>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              <input type="number" name="price" placeholder="Price" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              <input type="number" name="user_id" placeholder="User ID" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              <input type="number" name="category_id" placeholder="Category ID" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              <input type="number" name="crop_id" placeholder="Crop ID" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-300 rounded">
                  {t.cancel}
                </button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Marketplace

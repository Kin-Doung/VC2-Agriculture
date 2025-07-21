"use client"

import { ShoppingCart, Plus, Search, Filter, Star } from "lucide-react"
import { useState } from "react"

const Marketplace = ({ language }) => {
  const [searchTerm, setSearchTerm] = useState("")

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
    },
  }

  const t = translations[language]

  const products = [
    {
      id: 1,
      name: "Organic Rice",
      price: "$0.85",
      image: "/placeholder.svg?height=200&width=200",
      seller: "John Farmer",
      rating: 4.8,
      stock: "In Stock",
      description: "Premium organic rice from our farm",
    },
    {
      id: 2,
      name: "Fresh Tomatoes",
      price: "$2.30",
      image: "/placeholder.svg?height=200&width=200",
      seller: "Mary's Garden",
      rating: 4.6,
      stock: "In Stock",
      description: "Freshly harvested tomatoes",
    },
    {
      id: 3,
      name: "Sweet Corn",
      price: "$1.20",
      image: "/placeholder.svg?height=200&width=200",
      seller: "Green Valley Farm",
      rating: 4.9,
      stock: "Out of Stock",
      description: "Sweet and tender corn",
    },
    {
      id: 4,
      name: "Red Onions",
      price: "$1.80",
      image: "/placeholder.svg?height=200&width=200",
      seller: "Sunny Acres",
      rating: 4.5,
      stock: "In Stock",
      description: "Fresh red onions",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    product.stock === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock === "In Stock" ? t.inStock : t.outOfStock}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-2">{product.description}</p>

              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {product.price}
                    <span className="text-sm text-gray-500">{t.perKg}</span>
                  </div>
                  <div className="text-xs text-gray-500">{product.seller}</div>
                </div>
              </div>

              <button className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                {t.contact}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace

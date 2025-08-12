"use client";

import { Smartphone, Cloud, BarChart3, Users, Shield, Zap, ArrowRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PublicProducts = ({ language = "en" }) => {
  // State management
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Translations
  const translations = {
    en: {
      hero: {
        title: "Our Products & Services",
        subtitle: "Comprehensive farming solutions designed to help you succeed",
      },
      products: {
        title: "Products for Sale",
        subtitle: "Discover fresh, locally-sourced agricultural products directly from Cambodian farmers.",
      },
      features: {
        title: "Key Features",
        items: [
          {
            icon: Smartphone,
            title: "Mobile-First Design",
            description: "Optimized for smartphones and tablets, work from anywhere in your fields.",
          },
          {
            icon: Cloud,
            title: "Cloud Synchronization",
            description: "Your data is automatically backed up and synchronized across all devices.",
          },
          {
            icon: Shield,
            title: "Data Security",
            description: "Enterprise-grade security to protect your sensitive farming data.",
          },
          {
            icon: Users,
            title: "Community Support",
            description: "Connect with other farmers and agricultural experts for advice and support.",
          },
          {
            icon: BarChart3,
            title: "Advanced Analytics",
            description: "Get insights from your data to make better farming decisions.",
          },
          {
            icon: Zap,
            title: "Real-time Updates",
            description: "Receive instant notifications about weather, market prices, and tasks.",
          },
        ],
      },
      cta: {
        title: "Ready to Get Started?",
        subtitle: "Choose the plan that works best for your farm",
        button: "Start Free Trial",
      },
      modal: {
        title: "Product Details",
        close: "Close",
        category: "Category",
        stock: "Stock",
        inStock: "In Stock",
        outOfStock: "Out of Stock",
        viewDetails: "View Details",
        price: "Price",
        perKg: "/kg",
        seller: "Seller",
        sellerPhone: "Seller Phone",
        description: "Description",
        expirationDate: "Expiration Date",
        order: "Order Product",
        error: "Failed to load data. Please try again later.",
        page: "Page",
        of: "of",
      },
    },
    km: {
      hero: {
        title: "ផលិតផល និងសេវាកម្មរបស់យើង",
        subtitle: "ដំណោះស្រាយកសិកម្មគ្រប់គ្រាន់ដែលរចនាឡើងដើម្បីជួយអ្នកឱ្យជោគជ័យ",
      },
      products: {
        title: "ផលិតផលដែលលក់",
        subtitle: "រកផលិតផលកសិកម្មដែលមានភាពស្រស់ និងបានប្រមូលផ្តុំក្នុងស្រុកផ្ទាល់ពីអ្នកប្រមូលផលកម្ពុជា។",
      },
      features: {
        title: "លក្ខណៈពិសេសសំខាន់",
        items: [
          {
            icon: Smartphone,
            title: "ការរចនាទូរស័ព្ទជាមុន",
            description: "បានបង្កើនប្រសិទ្ធភាពសម្រាប់ស្មាតហ្វូន និងថេប្លេត ធ្វើការពីគ្រប់ទីកន្លែងនៅក្នុងស្រែរបស់អ្នក។",
          },
          {
            icon: Cloud,
            title: "ការធ្វើសមកាលកម្មពពក",
            description: "ទិន្នន័យរបស់អ្នកត្រូវបានបម្រុងទុក និងធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិនៅលើឧបករណ៍ទាំងអស់។",
          },
          {
            icon: Shield,
            title: "សុវត្ថិភាពទិន្នន័យ",
            description: "សុវត្ថិភាពកម្រិតសហគ្រាសដើម្បីការពារទិន្នន័យកសិកម្មរបស់អ្នកដែលមានភាពរសើប។",
          },
          {
            icon: Users,
            title: "ការគាំទ្រសហគមន៍",
            description: "ភ្ជាប់ជាមួយកសិករ និងអ្នកជំនាញកសិកម្មដទៃសម្រាប់ការណែនាំ និងការគាំទ្រ។",
          },
          {
            icon: BarChart3,
            title: "ការវិភាគកម្រិតខ្ពស់",
            description: "ទទួលបានការយល់ដឹងពីទិន្នន័យរបស់អ្នកដើម្បីធ្វើការសម្រេចចិត្តកសិកម្មប្រសើរជាងមុន។",
          },
          {
            icon: Zap,
            title: "ការធ្វើបច្ចុប្បន្នភាពពេលវេលាជាក់ស្តែង",
            description: "ទទួលបានការជូនដំណឹងភ្លាមៗអំពីអាកាសធាតុ តម្លៃទីផ្សារ និងកិច្ចការ។",
          },
        ],
      },
      cta: {
        title: "ត្រៀមរួចហើយដើម្បីចាប់ផ្តើម?",
        subtitle: "ជ្រើសរើសគម្រោងដែលដំណើរការល្អបំផុតសម្រាប់កសិដ្ឋានរបស់អ្នក",
        button: "ចាប់ផ្តើមការសាកល្បងឥតគិតថ្លៃ",
      },
      modal: {
        title: "លម្អិតផលិតផល",
        close: "បិទ",
        category: "ប្រភេទ",
        stock: "ស្តុក",
        inStock: "មានស្តុក",
        outOfStock: "អស់ស្តុក",
        viewDetails: "មើលលម្អិត",
        price: "តម្លៃ",
        perKg: "/គ.ក",
        seller: "អ្នកលក់",
        sellerPhone: "លេខទូរស័ព្ទអ្នកលក់",
        description: "ការពិពណ៌នា",
        expirationDate: "កាលបរិច្ឆេទផុតកំណត់",
        order: "បញ្ជាទិញផលិតផល",
        error: "បរាជ័យក្នុងការផ្ទុកទិន្នន័យ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
        page: "ទំព័រ",
        of: "នៃ",
      },
    },
  };

  const t = translations[language] || translations.en;
  const API_URL = "http://127.0.0.1:8000/api/products";

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include bearer token
          },
        });
        const productData = response.data;
        if (!Array.isArray(productData)) {
          throw new Error("Products API response is not an array");
        }
        const transformedProducts = productData.map((item) => {
          const today = new Date();
          const expirationDate = item.expiration_date ? new Date(item.expiration_date) : null;
          const isExpired = expirationDate && expirationDate < today;

          return {
            id: item.id,
            name: item[`name_${language}`] || item.name || "Unnamed Product",
            price: item.price ? `${Number(item.price).toFixed(2)} KHR` : "0.00 KHR",
            image: item.image_path
              ? `http://127.0.0.1:8000/storage/${item.image_path}`
              : "/placeholder.svg?height=400&width=400&text=Product+Image",
            seller: item.user?.name || "",
            sellerPhone: item.user?.phone || "N/A",
            stock: isExpired || item.quantity === 0 ? t.modal.outOfStock : t.modal.inStock,
            description: item[`description_${language}`] || item.description || "No description available",
            category: item.category?.[`name_${language}`] || item.category?.name || "",
            expiration_date: item.expiration_date ? new Date(item.expiration_date).toISOString().split("T")[0] : "",
          };
        });
        setProducts(transformedProducts);
      } catch (err) {
        console.error("Fetch data error:", err);
        setError(`${t.modal.error}: ${err.message}`);
      }
    };
    fetchData();
  }, [language, t.modal.error, t.modal.inStock, t.modal.outOfStock]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Modal handlers
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl opacity-90">{t.hero.subtitle}</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            {t.products.title}
          </h2>
          <p className="text-center text-gray-600 mb-12">{t.products.subtitle}</p>

          {error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-lg">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden relative group hover:shadow-xl transition-all duration-300 h-96 cursor-pointer"
                    role="article"
                    aria-labelledby={`product-title-${product.id}`}
                  >
                    {/* Stock Status Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                          product.stock === t.modal.inStock ? "bg-green-100/90 text-green-800" : "bg-red-100/90 text-red-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </div>
                    {/* Image Container */}
                    <div className="relative w-full h-full">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => (e.target.src = "/placeholder.svg?height=400&width=400&text=Product+Image")}
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      {/* Product Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3
                          id={`product-title-${product.id}`}
                          className="font-bold text-lg mb-1"
                          style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="text-sm text-gray-200 mb-2 overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 1,
                          }}
                        >
                          {product.description}
                        </p>
                        {product.category && (
                          <p className="text-xs text-gray-300 mb-2">
                            {t.modal.category}: {product.category}
                          </p>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          {product.seller && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-300">{product.seller}</span>
                            </div>
                          )}
                          <div className="text-xl font-bold text-green-400">
                            {product.price}
                            <span className="text-xs text-gray-300">{t.modal.perKg}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(product)}
                            className="flex-1 px-3 py-2 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            aria-label={`${t.modal.viewDetails} for ${product.name}`}
                          >
                            {t.modal.viewDetails}
                          </button>
                          <Link
                            to="/register"
                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              product.stock === t.modal.inStock
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                            aria-label={`${t.modal.order} ${product.name}`}
                            onClick={(e) => {
                              if (product.stock === t.modal.outOfStock) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {t.modal.order}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    {t.modal.page} {currentPage} {t.modal.of} {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">
              {language === "km" ? "គ្មានផលិតផលទេ។" : "No products available."}
            </p>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-8 border-b">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                {t.modal.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                aria-label={t.modal.close}
              >
                <X className="h-8 w-8" />
              </button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image */}
                <div className="space-y-6">
                  <div className="text-center">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-96 object-cover rounded-lg border shadow-lg"
                      loading="lazy"
                      onError={(e) => (e.target.src = "/placeholder.svg?height=400&width=400&text=Product+Image")}
                    />
                  </div>
                </div>
                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      {t.modal.productName || t.modal.title}
                    </label>
                    <p className="text-2xl font-bold text-gray-900">{selectedProduct.name}</p>
                  </div>
                  {selectedProduct.category && (
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.category}</label>
                      <p className="text-xl text-gray-900">{selectedProduct.category}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.price}</label>
                    <p className="text-3xl font-bold text-green-600">
                      {selectedProduct.price}
                      <span className="text-lg text-gray-500 font-normal">{t.modal.perKg}</span>
                    </p>
                  </div>
                  {selectedProduct.seller && (
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.seller}</label>
                      <p className="text-xl text-gray-900">{selectedProduct.seller}</p>
                    </div>
                  )}
                  {selectedProduct.sellerPhone && selectedProduct.sellerPhone !== "N/A" && (
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.sellerPhone}</label>
                      <p className="text-xl text-gray-900">{selectedProduct.sellerPhone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.stock}</label>
                    <span
                      className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                        selectedProduct.stock === t.modal.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedProduct.stock}
                    </span>
                  </div>
                  {selectedProduct.expiration_date && (
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.expirationDate}</label>
                      <p className="text-xl text-gray-900">{selectedProduct.expiration_date || "-"}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">{t.modal.description}</label>
                    <p className="text-lg text-gray-900 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
              </div>
              <div className="pt-8 mt-8 border-t">
                <button
                  onClick={closeModal}
                  className="w-full px-6 py-3 text-lg bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t.modal.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            {t.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg"
                role="region"
                aria-labelledby={`feature-title-${index}`}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <h3
                  id={`feature-title-${index}`}
                  className="text-xl font-semibold text-gray-800 mb-4"
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.cta.title}</h2>
          <p className="text-xl mb-8 opacity-90">{t.cta.subtitle}</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            aria-label={t.cta.button}
          >
            {t.cta.button}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PublicProducts;
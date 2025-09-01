
import { Smartphone, Cloud, BarChart3, Users, Shield, Zap, ArrowRight, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const PublicProducts = ({ language = "en" }) => {
  // State management
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 8;
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Mock products
  const mockProducts = [
    {
      id: 1,
      name: "Rice",
      name_km: "អង្ករ",
      price: 2.00,
      image: "/images/rice.jpg",
      seller: "Farmer John",
      sellerPhone: "0985736289",
      quantity: 100,
      description: "High-quality rice",
      description_km: "អង្ករគុណភាពខ្ពស់",
      category: "Grains",
      category_km: "គ្រាប់ធញ្ញជាតិ",
      expiration_date: "2025-12-31",
    },
    {
      id: 2,
      name: "Orange",
      name_km: "ក្រូច",
      price: 4.00,
      image: "/images/orange.jpg",
      seller: "Farmer Sophea",
      sellerPhone: "0883629395",
      quantity: 0,
      description: "Fresh oranges from the orchard",
      description_km: "ក្រូចស្រស់ពីសួន",
      category: "Fruits",
      category_km: "ផ្លែឈើ",
      expiration_date: "2025-09-15",
    },
    {
      id: 3,
      name: "Potato",
      name_km: "ដំឡូង",
      price: 1.00,
      image: "/images/potato.jpg",
      seller: "Farmer Srey",
      sellerPhone: "0129484596",
      quantity: 50,
      description: "Fresh potatoes for cooking",
      description_km: "ដំឡូងស្រស់សម្រាប់ចម្អិនអាហារ",
      category: "Vegetables",
      category_km: "បន្លែ",
      expiration_date: "2025-09-10",
    },
    {
      id: 4,
      name: "Bean",
      name_km: "សណ្តែក",
      price: 3.00,
      image: "/images/bean.jpg",
      seller: "Farmer Rith",
      sellerPhone: "0979356397",
      quantity: 20,
      description: "High-quality beans",
      description_km: "សណ្តែកគុណភាពខ្ពស់",
      category: "Nuts",
      category_km: "គ្រាប់",
      expiration_date: "2026-03-01",
    },
  ];

  // Translations
  const translations = {
    en: {
      hero: {
        title: "Our Products & Services",
        subtitle: "Comprehensive farming solutions designed to help you succeed",
      },
      products: {
        title: "Products for Sale",
        subtitle: "Discover fresh, locally-sourced agricultural products directly from farmers.",
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
        expired: "Expired",
        viewDetails: "View Details",
        price: "Price",
        perKg: "/kg",
        seller: "Seller",
        sellerPhone: "Seller Phone",
        description: "Description",
        expirationDate: "Expiration Date",
        order: "Order Product",
        noProducts: "No products available.",
        page: "Page",
        of: "of",
        error: "Failed to load products. Showing default products.",
        unauthorized: "Please log in to view additional products.",
        login: "Log In",
        previous: "Previous",
        next: "Next",
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
        expired: "ផុតកំណត់",
        viewDetails: "មើលលម្អិត",
        price: "តម្លៃ",
        perKg: "/គ.ក",
        seller: "អ្នកលក់",
        sellerPhone: "លេខទូរស័ព្ទអ្នកលក់",
        description: "ការពិពណ៌នា",
        expirationDate: "កាលបរិច្ឆេទផុតកំណត់",
        order: "បញ្ជាទិញផលិតផល",
        noProducts: "គ្មានផលិតផលទេ។",
        page: "ទំព័រ",
        of: "នៃ",
        error: "បរាជ័យក្នុងការផ្ទុកផលិតផល។ បង្ហាញផលិតផលលំនាំដើម។",
        unauthorized: "សូមចូលប្រព័ន្ធដើម្បីមើលផលិតផលបន្ថែម។",
        login: "ចូលប្រព័ន្ធ",
        previous: "មុន",
        next: "បន្ទាប់",
      },
    },
  };

  // Language validation
  const supportedLanguages = ["en", "km"];
  const API_URL = "http://127.0.0.1:8000/api/products";
  const effectiveLanguage = supportedLanguages.includes(language) ? language : "en";
  if (language !== effectiveLanguage) {
    console.warn(`Unsupported language "${language}". Falling back to English.`); // Fixed: Added semicolon
  }
  const t = translations[effectiveLanguage];

  // Placeholder image based on category or product name
  const getPlaceholderImage = (category, productName) => {
    const imageMap = {
      Rice: "/images/rice.jpg",
      Orange: "/images/orange.jpg",
      Potato: "/images/potato.jpg",
      Bean: "/images/bean.jpg",
      Apple: "/images/apple.jpg",
    };
    const placeholders = {
      Grains: "/placeholder.svg?height=400&width=400&text=Grains",
      Fruits: "/placeholder.svg?height=400&width=400&text=Fruits",
      Vegetables: "/placeholder.svg?height=400&width=400&text=Vegetables",
      Nuts: "/placeholder.svg?height=400&width=400&text=Nuts",
    };
    return imageMap[productName] || placeholders[category] || "/placeholder.svg?height=400&width=400&text=Product+Image";
  };

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch products based on login status
  useEffect(() => {
    const today = new Date();

    // Transform products with stock status and language fields
    const transformProducts = (products) => {
      return products.map((item) => {
        const expirationDate = item.expiration_date ? new Date(item.expiration_date) : null;
        const isExpired = expirationDate && expirationDate < today;
        return {
          id: item.id,
          name: language === "km" ? item.name_km || item.name : item.name,
          price: item.price ? `${Number(item.price).toFixed(2)} $` : "0.00 $",
          image: item.image_path
            ? `http://127.0.0.1:8000/storage/${item.image_path}`
            : item.image || getPlaceholderImage(item.category, item.name),
          seller: item.user?.name || item.seller || "",
          sellerPhone: item.user?.phone || item.sellerPhone || "N/A",
          quantity: item.quantity || 0,
          description: language === "km" ? item.description_km || item.description : item.description || "No description available",
          category: language === "km" ? item.category?.name_km || item.category?.name : item.category?.name || item.category || "",
          expiration_date: item.expiration_date ? new Date(item.expiration_date).toISOString().split("T")[0] : "",
          stock: isExpired ? t.modal.expired : item.quantity === 0 ? t.modal.outOfStock : t.modal.inStock,
        };
      });
    };

    const fetchData = async () => {
      setError(null);
      try {
        if (!isLoggedIn) {
          // Not logged in: use mockProducts only
          const transformedMockProducts = transformProducts(mockProducts);
          setProducts(transformedMockProducts);
          return;
        }

        // Logged in: fetch API products and combine with mockProducts
        const token = localStorage.getItem("token");
        if (!token) {
          setError(t.modal.unauthorized);
          setIsLoggedIn(false);
          const transformedMockProducts = transformProducts(mockProducts);
          setProducts(transformedMockProducts);
          return;
        }

        const response = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const productData = response.data;
        if (!Array.isArray(productData)) {
          throw new Error("Products API response is not an array");
        }

        // Combine mockProducts and API products
        const combinedProducts = [...mockProducts, ...productData];
        // Remove duplicates by ID
        const uniqueProducts = Array.from(
          new Map(combinedProducts.map((p) => [p.id, p])).values()
        );
        const transformedProducts = transformProducts(uniqueProducts);
        setProducts(transformedProducts);
      } catch (err) {
        console.error("Fetch data error:", err);
        if (err.response?.status === 401) {
          setError(t.modal.unauthorized);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          setError(`${t.modal.error}: ${err.message}`);
        }
        // Fallback to mockProducts
        const transformedMockProducts = transformProducts(mockProducts);
        setProducts(transformedMockProducts);
      }
    };

    fetchData();
  }, [isLoggedIn, language, t.modal.inStock, t.modal.outOfStock, t.modal.expired, t.modal.error, t.modal.unauthorized]);

  // Modal handlers
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Modal accessibility
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        if (e.key === "Escape") {
          closeModal();
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      if (firstElement) {
        firstElement.focus();
      } else {
        modalRef.current.focus();
      }

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isModalOpen]);

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal handlers
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate("/login");
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
          {error && (
            <div className="text-center text-red-500 mb-6">
              <p>{error}</p>
              {error === t.modal.unauthorized && (
                <button
                  onClick={handleLoginRedirect}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {t.modal.login}
                </button>
              )}
            </div>
          )}
          {paginatedProducts.length > 0 ? (
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
                          product.stock === t.modal.inStock
                            ? "bg-green-100/90 text-green-800"
                            : product.stock === t.modal.expired
                            ? "bg-orange-100/90 text-orange-800"
                            : "bg-red-100/90 text-red-800"
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
                        onError={(e) => (e.target.src = getPlaceholderImage(product.category, product.name))}
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
                              if (product.stock !== t.modal.inStock) {
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
                    aria-label={t.modal.previous}
                    aria-disabled={currentPage === 1}
                  >
                    {t.modal.previous}
                  </button>
                  <span className="text-sm text-gray-600">
                    {t.modal.page} {currentPage} {t.modal.of} {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    aria-label={t.modal.next}
                    aria-disabled={currentPage === totalPages}
                  >
                    {t.modal.next}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 text-lg font-medium py-12">
              {t.modal.noProducts}
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
            ref={modalRef}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            tabIndex="-1"
          >
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
                {t.modal.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
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
                      className="w-full h-96 object-cover rounded-lg border border-gray-300 shadow-md"
                      loading="lazy"
                      onError={(e) => (e.target.src = getPlaceholderImage(selectedProduct.category, selectedProduct.name))}
                    />
                  </div>
                </div>
                {/* Product Details */}
                <div className="space-y-2">
                  <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                    <label className="text-lg font-medium text-gray-700">{t.modal.title}</label>
                    <span className="text-gray-700">:</span>
                    <p className="text-xl font-bold text-gray-900">{selectedProduct.name}</p>
                  </div>
                  {selectedProduct.category && (
                    <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                      <label className="text-lg font-medium text-gray-700">{t.modal.category}</label>
                      <span className="text-gray-700">:</span>
                      <p className="text-xl text-gray-900">{selectedProduct.category}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                    <label className="text-lg font-medium text-gray-700">{t.modal.price}</label>
                    <span className="text-gray-700">:</span>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedProduct.price}
                      <span className="text-base text-gray-500 font-normal ml-2">{t.modal.perKg}</span>
                    </p>
                  </div>
                  {selectedProduct.seller && (
                    <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                      <label className="text-lg font-medium text-gray-700">{t.modal.seller}</label>
                      <span className="text-gray-700">:</span>
                      <p className="text-xl text-gray-900">{selectedProduct.seller}</p>
                    </div>
                  )}
                  {selectedProduct.sellerPhone && selectedProduct.sellerPhone !== "N/A" && (
                    <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                      <label className="text-lg font-medium text-gray-700">{t.modal.sellerPhone}</label>
                      <span className="text-gray-700">:</span>
                      <p className="text-xl text-gray-900">{selectedProduct.sellerPhone}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                    <label className="text-lg font-medium text-gray-700">{t.modal.stock}</label>
                    <span className="text-gray-700">:</span>
                    <span
                      className={`inline-block px-4 py-1.5 text-sm font-medium rounded-full ${
                        selectedProduct.stock === t.modal.inStock
                          ? "bg-green-100 text-green-800"
                          : selectedProduct.stock === t.modal.expired
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedProduct.stock}
                    </span>
                  </div>
                  {selectedProduct.expiration_date && (
                    <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                      <label className="text-lg font-medium text-gray-700">{t.modal.expirationDate}</label>
                      <span className="text-gray-700">:</span>
                      <p className="text-xl text-gray-900">{selectedProduct.expiration_date}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-[150px_20px_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[200px_20px_1fr]">
                    <label className="text-lg font-medium text-gray-700">{t.modal.description}</label>
                    <span className="text-gray-700">:</span>
                    <p className="text-lg text-gray-900 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                </div>
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

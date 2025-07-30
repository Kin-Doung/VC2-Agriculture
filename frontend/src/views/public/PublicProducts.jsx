"use client"

import { Smartphone, Cloud, BarChart3, Users, Shield, Zap, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

const PublicProducts = ({ language }) => {
  const [products, setProducts] = useState([])

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
    },
  }

  const t = translations[language] || translations.en

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err))
  }, [])

  return (
    <div className="min-h-screen">
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

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={`http://127.0.0.1:8000/storage/${product.image_path}`}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-bold text-green-600">{product.price} KHR</p>
                    <Link
                      to={`/product-details/${product.id}`}
                      className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No products available.</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
            {t.features.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
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
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
          >
            {t.cta.button}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default PublicProducts

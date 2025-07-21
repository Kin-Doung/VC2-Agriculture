"use client"

import { Smartphone, Cloud, BarChart3, Users, Shield, Zap, Check, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const PublicProducts = ({ language }) => {
  const translations = {
    en: {
      hero: {
        title: "Our Products & Services",
        subtitle: "Comprehensive farming solutions designed to help you succeed",
      },
      products: {
        title: "What We Offer",
        items: [
          {
            icon: Smartphone,
            title: "Mobile App",
            description: "Complete farm management on your smartphone",
            features: [
              "Crop tracking and monitoring",
              "Weather alerts and forecasts",
              "Task management and reminders",
              "Market price updates",
              "Offline functionality",
            ],
            price: "Free",
            popular: false,
          },
          {
            icon: Cloud,
            title: "Cloud Platform",
            description: "Advanced analytics and data management",
            features: [
              "Data backup and sync",
              "Advanced reporting",
              "Multi-device access",
              "API integrations",
              "Priority support",
            ],
            price: "$9.99/month",
            popular: true,
          },
          {
            icon: BarChart3,
            title: "Analytics Pro",
            description: "Professional insights and recommendations",
            features: [
              "AI-powered recommendations",
              "Yield prediction models",
              "Cost optimization analysis",
              "Custom reports",
              "Expert consultations",
            ],
            price: "$29.99/month",
            popular: false,
          },
        ],
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
        title: "អ្វីដែលយើងផ្តល់ជូន",
        items: [
          {
            icon: Smartphone,
            title: "កម្មវិធីទូរស័ព្ទ",
            description: "ការគ្រប់គ្រងកសិដ្ឋានពេញលេញនៅលើស្មាតហ្វូនរបស់អ្នក",
            features: [
              "ការតាមដាន និងត្រួតពិនិត្យដំណាំ",
              "ការជូនដំណឹងអាកាសធាតុ និងការព្យាករណ៍",
              "ការគ្រប់គ្រងកិច្ចការ និងការរំលឹក",
              "ការធ្វើបច្ចុប្បន្នភាពតម្លៃទីផ្សារ",
              "មុខងារក្រៅបណ្តាញ",
            ],
            price: "ឥតគិតថ្លៃ",
            popular: false,
          },
          {
            icon: Cloud,
            title: "វេទិកាពពក",
            description: "ការវិភាគកម្រិតខ្ពស់ និងការគ្រប់គ្រងទិន្នន័យ",
            features: [
              "ការបម្រុងទុក និងធ្វើសមកាលកម្មទិន្នន័យ",
              "របាយការណ៍កម្រិតខ្ពស់",
              "ការចូលប្រើពហុឧបករណ៍",
              "ការរួមបញ្ចូល API",
              "ការគាំទ្រអាទិភាព",
            ],
            price: "$9.99/ខែ",
            popular: true,
          },
          {
            icon: BarChart3,
            title: "Analytics Pro",
            description: "ការយល់ដឹង និងការណែនាំជំនាញ",
            features: [
              "ការណែនាំដែលដំណើរការដោយ AI",
              "ម៉ូដែលព្យាករណ៍ទិន្នផល",
              "ការវិភាគបង្កើនប្រសិទ្ធភាពការចំណាយ",
              "របាយការណ៍ផ្ទាល់ខ្លួន",
              "ការពិគ្រោះយោបល់អ្នកជំនាញ",
            ],
            price: "$29.99/ខែ",
            popular: false,
          },
        ],
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

  const t = translations[language]

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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.products.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.products.items.map((product, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${product.popular ? "ring-2 ring-green-500 scale-105" : ""}`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {language === "en" ? "Most Popular" : "ពេញនិយមបំផុត"}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <product.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="text-3xl font-bold text-green-600">{product.price}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    product.popular
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {language === "en" ? "Get Started" : "ចាប់ផ្តើម"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.features.title}</h2>

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

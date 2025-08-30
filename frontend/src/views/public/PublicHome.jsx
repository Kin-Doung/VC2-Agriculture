"use client"

import { Link } from "react-router-dom"
import { Leaf, TrendingUp, Users, Shield, Smartphone, Globe, ArrowRight, Star, Play } from "lucide-react"

const PublicHome = ({ language }) => {
  const translations = {
    en: {
      hero: {
        title: "Smart Farming for Modern Agriculture",
        subtitle:
          "Manage your farm efficiently with our comprehensive digital platform. Track crops, monitor weather, manage tasks, and connect with markets.",
        cta: "Get Started Today",
        watchDemo: "Watch Demo",
      },
      features: {
        title: "Why Choose Farm Manager?",
        subtitle: "Everything you need to run a successful farm",
        items: [
          {
            icon: Leaf,
            title: "Crop Management",
            description: "Track growth stages, monitor health, and optimize harvest timing for maximum yield.",
          },
          {
            icon: TrendingUp,
            title: "Market Insights",
            description: "Real-time market prices and trends to help you make informed selling decisions.",
          },
          {
            icon: Users,
            title: "Community Network",
            description: "Connect with other farmers, share knowledge, and learn from experts.",
          },
          {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Your farm data is protected with enterprise-grade security measures.",
          },
          {
            icon: Smartphone,
            title: "Mobile First",
            description: "Access your farm management tools anywhere, anytime from your mobile device.",
          },
          {
            icon: Globe,
            title: "Multi-Language",
            description: "Available in English and Khmer to serve local farming communities.",
          },
        ],
      },
      stats: {
        title: "Trusted by Farmers Worldwide",
        items: [
          { number: "10,000+", label: "Active Farmers" },
          { number: "50,000+", label: "Hectares Managed" },
          { number: "95%", label: "Satisfaction Rate" },
          { number: "24/7", label: "Support Available" },
        ],
      },
      testimonials: {
        title: "What Farmers Say",
        items: [
          {
            name: "Sok Dara",
            location: "Siem Reap",
            text: "Farm Manager helped me increase my rice yield by 30%. The weather alerts and task reminders are incredibly useful.",
            rating: 5,
          },
          {
            name: "Chea Sophea",
            location: "Battambang",
            text: "The market price feature helps me sell my crops at the best time. I've increased my profits significantly.",
            rating: 5,
          },
          {
            name: "Lim Pisach",
            location: "Kampong Cham",
            text: "Easy to use and very helpful for managing multiple fields. The bilingual support is perfect for our community.",
            rating: 5,
          },
        ],
      },
      cta: {
        title: "Ready to Transform Your Farm?",
        subtitle:
          "Join thousands of farmers who are already using Farm Manager to improve their productivity and profits.",
        button: "Start Free Trial",
      },
    },
    km: {
      hero: {
        title: "កសិកម្មឆ្លាតវៃសម្រាប់កសិកម្មសម័យទំនើប",
        subtitle:
          "គ្រប់គ្រងកសិដ្ឋានរបស់អ្នកប្រកបដោយប្រសិទ្ធភាពជាមួយនឹងវេទិកាឌីជីថលរបស់យើង។ តាមដានដំណាំ ត្រួតពិនិត្យអាកាសធាតុ គ្រប់គ្រងកិច្ចការ និងភ្ជាប់ទៅទីផ្សារ។",
        cta: "ចាប់ផ្តើមថ្ងៃនេះ",
        watchDemo: "មើលការបង្ហាញ",
      },
      features: {
        title: "ហេតុអ្វីត្រូវជ្រើសរើស Farm Manager?",
        subtitle: "អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីដំណើរការកសិដ្ឋានជោគជ័យ",
        items: [
          {
            icon: Leaf,
            title: "ការគ្រប់គ្រងដំណាំ",
            description: "តាមដានដំណាក់កាលលូតលាស់ ត្រួតពិនិត្យសុខភាព និងបង្កើនប្រសិទ្ធភាពពេលវេលាច្រូតសម្រាប់ទទួលបានទិន្នផលអតិបរមា។",
          },
          {
            icon: TrendingUp,
            title: "ការយល់ដឹងអំពីទីផ្សារ",
            description: "តម្លៃទីផ្សារ និងនិន្នាការពេលវេលាជាក់ស្តែងដើម្បីជួយអ្នកធ្វើការសម្រេចចិត្តលក់ប្រកបដោយព័ត៌មាន។",
          },
          {
            icon: Users,
            title: "បណ្តាញសហគមន៍",
            description: "ភ្ជាប់ជាមួយកសិករដទៃ ចែករំលែកចំណេះដឹង និងរៀនពីអ្នកជំនាញ។",
          },
          {
            icon: Shield,
            title: "សុវត្ថិភាព និងអាចទុកចិត្តបាន",
            description: "ទិន្នន័យកសិដ្ឋានរបស់អ្នកត្រូវបានការពារដោយវិធានការសុវត្ថិភាពកម្រិតសហគ្រាស។",
          },
          {
            icon: Smartphone,
            title: "ទូរស័ព្ទជាមុន",
            description: "ចូលប្រើឧបករណ៍គ្រប់គ្រងកសិដ្ឋានរបស់អ្នកគ្រប់ទីកន្លែង គ្រប់ពេលវេលាពីឧបករណ៍ទូរស័ព្ទរបស់អ្នក។",
          },
          {
            icon: Globe,
            title: "ពហុភាសា",
            description: "មានជាភាសាអង់គ្លេស និងខ្មែរដើម្បីបម្រើសហគមន៍កសិកម្មក្នុងស្រុក។",
          },
        ],
      },
      stats: {
        title: "ទទួលបានការទុកចិត្តពីកសិករទូទាំងពិភពលោក",
        items: [
          { number: "១០,០០០+", label: "កសិករសកម្ម" },
          { number: "៥០,០០០+", label: "ហិកតាដែលបានគ្រប់គ្រង" },
          { number: "៩៥%", label: "អត្រាពេញចិត្ត" },
          { number: "២៤/៧", label: "ការគាំទ្រអាច" },
        ],
      },
      testimonials: {
        title: "អ្វីដែលកសិករនិយាយ",
        items: [
          {
            name: "សុខ ដារា",
            location: "សៀមរាប",
            text: "Farm Manager បានជួយខ្ញុំបង្កើនទិន្នផលស្រូវ ៣០%។ ការជូនដំណឹងអាកាសធាតុ និងការរំលឹកកិច្ចការមានប្រយោជន៍ណាស់។",
            rating: 5,
          },
          {
            name: "ជា សុភា",
            location: "បាត់ដំបង",
            text: "មុខងារតម្លៃទីផ្សារជួយខ្ញុំលក់ដំណាំនៅពេលវេលាល្អបំផុត។ ខ្ញុំបានបង្កើនប្រាក់ចំណេញយ៉ាងច្រើន។",
            rating: 5,
          },
          {
            name: "លឹម ពិសាច",
            location: "កំពង់ចាម",
            text: "ងាយស្រួលប្រើ និងមានប្រយោជន៍ណាស់សម្រាប់គ្រប់គ្រងស្រែច្រើន។ ការគាំទ្រពីរភាសាល្អឥតខ្ចោះសម្រាប់សហគមន៍យើង។",
            rating: 5,
          },
        ],
      },
      cta: {
        title: "ត្រៀមរួចហើយដើម្បីផ្លាស់ប្តូរកសិដ្ឋានរបស់អ្នក?",
        subtitle: "ចូលរួមជាមួយកសិកររាប់ពាន់នាក់ដែលកំពុងប្រើ Farm Manager ដើម្បីកែលម្អផលិតភាព និងប្រាក់ចំណេញរបស់ពួកគេ។",
        button: "ចាប់ផ្តើមការសាកល្បងឥតគិតថ្លៃ",
      },
    },
  }

  const t = translations[language]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t.hero.cta}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t.stats.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.items.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t.features.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.testimonials.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.location}</div>
                </div>
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

export default PublicHome

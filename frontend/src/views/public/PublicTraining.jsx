"use client"

import { Play, Clock, Users, Award, BookOpen, Video, Download, Star } from "lucide-react"
import { Link } from "react-router-dom"

const PublicTraining = ({ language }) => {
  const translations = {
    en: {
      hero: {
        title: "Video Training & Resources",
        subtitle: "Learn modern farming techniques from agricultural experts",
      },
      categories: {
        title: "Training Categories",
        items: [
          {
            icon: BookOpen,
            title: "Crop Management",
            description: "Learn best practices for planting, growing, and harvesting",
            videoCount: 25,
          },
          {
            icon: Video,
            title: "Technology Usage",
            description: "Master the Farm Manager app and digital farming tools",
            videoCount: 15,
          },
          {
            icon: Award,
            title: "Sustainable Farming",
            description: "Eco-friendly practices for long-term farm success",
            videoCount: 20,
          },
          {
            icon: Users,
            title: "Market & Business",
            description: "Selling strategies and farm business management",
            videoCount: 18,
          },
        ],
      },
      featured: {
        title: "Featured Training Videos",
        videos: [
          {
            id: 1,
            title: "Getting Started with Farm Manager",
            description: "Complete guide to setting up and using the Farm Manager app",
            duration: "12:30",
            views: "5.2K",
            rating: 4.8,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "Technology",
          },
          {
            id: 2,
            title: "Rice Farming Best Practices",
            description: "Traditional and modern techniques for successful rice cultivation",
            duration: "18:45",
            views: "8.1K",
            rating: 4.9,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "Crop Management",
          },
          {
            id: 3,
            title: "Sustainable Pest Management",
            description: "Eco-friendly methods to protect your crops from pests",
            duration: "15:20",
            views: "3.7K",
            rating: 4.7,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "Sustainable Farming",
          },
          {
            id: 4,
            title: "Market Price Analysis",
            description: "Understanding market trends to maximize your profits",
            duration: "22:15",
            views: "6.3K",
            rating: 4.6,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "Market & Business",
          },
        ],
      },
      benefits: {
        title: "Why Choose Our Training?",
        items: [
          {
            icon: Users,
            title: "Expert Instructors",
            description: "Learn from experienced farmers and agricultural scientists",
          },
          {
            icon: Video,
            title: "High-Quality Videos",
            description: "Professional video production with clear explanations",
          },
          {
            icon: Download,
            title: "Offline Access",
            description: "Download videos to watch without internet connection",
          },
          {
            icon: Award,
            title: "Certificates",
            description: "Earn certificates upon completion of training modules",
          },
        ],
      },
      cta: {
        title: "Start Learning Today",
        subtitle: "Access our complete library of training videos and resources",
        button: "Join Now",
      },
    },
    km: {
      hero: {
        title: "ការបណ្តុះបណ្តាលវីដេអូ និងធនធាន",
        subtitle: "រៀ��បច្ចេកទេសកសិកម្មសម័យទំនើបពីអ្នកជំនាញកសិកម្ម",
      },
      categories: {
        title: "ប្រភេទការបណ្តុះបណ្តាល",
        items: [
          {
            icon: BookOpen,
            title: "ការគ្រប់គ្រងដំណាំ",
            description: "រៀនការអនុវត្តល្អបំផុតសម្រាប់ការដាំ ការដាំដុះ និងការច្រូត",
            videoCount: 25,
          },
          {
            icon: Video,
            title: "ការប្រើប្រាស់បច្ចេកវិទ្យា",
            description: "ស្វាគមន៍កម្មវិធី Farm Manager និងឧបករណ៍កសិកម្មឌីជីថល",
            videoCount: 15,
          },
          {
            icon: Award,
            title: "កសិកម្មប្រកបដោយចីរភាព",
            description: "ការអនុវត្តមិត្តបរិស្ថានសម្រាប់ជោគជ័យកសិដ្ឋានរយៈពេលវែង",
            videoCount: 20,
          },
          {
            icon: Users,
            title: "ទីផ្សារ និងអាជីវកម្ម",
            description: "យុទ្ធសាស្ត្រលក់ និងការគ្រប់គ្រងអាជីវកម្មកសិដ្ឋាន",
            videoCount: 18,
          },
        ],
      },
      featured: {
        title: "វីដេអូបណ្តុះបណ្តាលពិសេស",
        videos: [
          {
            id: 1,
            title: "ការចាប់ផ្តើមជាមួយ Farm Manager",
            description: "មគ្គុទ្దេសក៍ពេញលេញសម្រាប់ការរៀបចំ និងការប្រើប្រាស់កម្មវិធី Farm Manager",
            duration: "១២:៣០",
            views: "៥.២K",
            rating: 4.8,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "បច្ចេកវិទ្យា",
          },
          {
            id: 2,
            title: "ការអនុវត្តល្អបំផុតនៃការដាំស្រូវ",
            description: "បច្ចេកទេសប្រពៃណី និងសម័យទំនើបសម្រាប់ការដាំស្រូវជោគជ័យ",
            duration: "១៨:៤៥",
            views: "៨.១K",
            rating: 4.9,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "ការគ្រប់គ្រងដំណាំ",
          },
          {
            id: 3,
            title: "ការគ្រប់គ្រងសត្វល្អិតប្រកបដោយចីរភាព",
            description: "វិធីសាស្ត្រមិត្តបរិស្ថានដើម្បីការពារដំណាំរបស់អ្នកពីសត្វល្អិត",
            duration: "១៥:២០",
            views: "៣.៧K",
            rating: 4.7,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "កសិកម្មប្រកបដោយចីរភាព",
          },
          {
            id: 4,
            title: "ការវិភាគតម្លៃទីផ្សារ",
            description: "ការយល់ដឹងអំពីនិន្នាការទីផ្សារដើម្បីបង្កើនប្រាក់ចំណេញរបស់អ្នកឱ្យអតិបរមា",
            duration: "២២:១៥",
            views: "៦.៣K",
            rating: 4.6,
            thumbnail: "/placeholder.svg?height=200&width=300",
            category: "ទីផ្សារ និងអាជីវកម្ម",
          },
        ],
      },
      benefits: {
        title: "ហេតុអ្វីត្រូវជ្រើសរើសការបណ្តុះបណ្តាលរបស់យើង?",
        items: [
          {
            icon: Users,
            title: "គ្រូបង្រៀនជំនាញ",
            description: "រៀនពីកសិករមានបទពិសោធន៍ និងអ្នកវិទ្យាសាស្ត្រកសិកម្ម",
          },
          {
            icon: Video,
            title: "វីដេអូគុណភាពខ្ពស់",
            description: "ការផលិតវីដេអូជំនាញជាមួយនឹងការពន្យល់ច្បាស់លាស់",
          },
          {
            icon: Download,
            title: "ការចូលប្រើក្រៅបណ្តាញ",
            description: "ទាញយកវីដេអូដើម្បីមើលដោយគ្មានការតភ្ជាប់អ៊ីនធឺណិត",
          },
          {
            icon: Award,
            title: "វិញ្ញាបនបត្រ",
            description: "ទទួលបានវិញ្ញាបនបត្របន្ទាប់ពីបញ្ចប់ម៉ូឌុលបណ្តុះបណ្តាល",
          },
        ],
      },
      cta: {
        title: "ចាប់ផ្តើមរៀនថ្ងៃនេះ",
        subtitle: "ចូលប្រើបណ្ណាល័យពេញលេញនៃវីដេអូបណ្តុះបណ្តាល និងធនធានរបស់យើង",
        button: "ចូលរួមឥឡូវនេះ",
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

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.categories.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.categories.items.map((category, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <category.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-sm text-green-600 font-medium">
                  {category.videoCount} {language === "en" ? "videos" : "វីដេអូ"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.featured.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {t.featured.videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-green-600 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{video.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{video.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {video.views} {language === "en" ? "views" : "ការមើល"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.benefits.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.benefits.items.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
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
            <Play className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default PublicTraining

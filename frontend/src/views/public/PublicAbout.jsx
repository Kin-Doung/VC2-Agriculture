"use client"

import { Users, Target, Award, Leaf, Globe, TrendingUp, Shield } from "lucide-react"

const PublicAbout = ({ language }) => {
  const translations = {
    en: {
      hero: {
        title: "About Farm Manager",
        subtitle: "Empowering farmers with technology to build a sustainable future for agriculture",
      },
      mission: {
        title: "Our Mission",
        description:
          "To democratize access to modern farming technology and help farmers worldwide increase their productivity, profitability, and sustainability through innovative digital solutions.",
      },
      vision: {
        title: "Our Vision",
        description:
          "A world where every farmer, regardless of size or location, has access to the tools and knowledge needed to thrive in modern agriculture.",
      },
      values: {
        title: "Our Values",
        items: [
          {
            icon: Users,
            title: "Farmer-Centric",
            description:
              "Everything we do is designed with farmers' needs at the center, ensuring practical and accessible solutions.",
          },
          {
            icon: Globe,
            title: "Accessibility",
            description:
              "We believe technology should be available to all farmers, regardless of their technical background or resources.",
          },
          {
            icon: Leaf,
            title: "Sustainability",
            description:
              "We promote farming practices that protect the environment while maintaining economic viability.",
          },
          {
            icon: Shield,
            title: "Trust & Security",
            description:
              "We protect farmer data with the highest security standards and maintain complete transparency.",
          },
        ],
      },
      story: {
        title: "Our Story",
        content:
          "Farm Manager was born from a simple observation: while technology was transforming industries worldwide, farmers were often left behind. Founded in 2020 by a team of agricultural experts and technology enthusiasts, we set out to bridge this gap.\n\nOur founders, having grown up in farming communities, understood the daily challenges farmers face - from unpredictable weather to fluctuating market prices. They envisioned a platform that would put powerful tools directly into farmers' hands, making modern agriculture accessible to everyone.\n\nToday, Farm Manager serves thousands of farmers across multiple countries, helping them increase yields, reduce costs, and build more sustainable farming operations.",
      },
      team: {
        title: "Leadership Team",
        members: [
          {
            name: "Dr. Sarah Chen",
            role: "CEO & Co-Founder",
            bio: "Agricultural scientist with 15+ years experience in sustainable farming practices.",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            name: "Michael Rodriguez",
            role: "CTO & Co-Founder",
            bio: "Former Google engineer passionate about applying technology to solve real-world problems.",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            name: "Dr. Priya Patel",
            role: "Head of Research",
            bio: "Plant pathologist specializing in crop disease prevention and management.",
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
      },
      impact: {
        title: "Our Impact",
        stats: [
          { number: "10,000+", label: "Farmers Served", icon: Users },
          { number: "50,000+", label: "Hectares Managed", icon: Leaf },
          { number: "30%", label: "Average Yield Increase", icon: TrendingUp },
          { number: "25%", label: "Cost Reduction", icon: Target },
        ],
      },
    },
    km: {
      hero: {
        title: "អំពី Farm Manager",
        subtitle: "ផ្តល់អំណាចដល់កសិករដោយបច្ចេកវិទ្យាដើម្បីកសាងអនាគតប្រកបដោយចីរភាពសម្រាប់កសិកម្ម",
      },
      mission: {
        title: "បេសកកម្មរបស់យើង",
        description:
          "ធ្វើប្រជាធិបតេយ្យការចូលប្រើបច្ចេកវិទ្យាកសិកម្មសម័យទំនើប និងជួយកសិករទូទាំងពិភពលោកបង្កើនផលិតភាព ប្រាក់ចំណេញ និងចីរភាពតាមរយៈដំណោះស្រាយឌីជីថលច្នៃប្រឌិត។",
      },
      vision: {
        title: "ចក្ខុវិស័យរបស់យើង",
        description:
          "ពិភពលោកមួយដែលកសិករគ្រប់រូប មិនថាទំហំ ឬទីតាំងណាក៏ដោយ មានការចូលប្រើឧបករណ៍ និងចំណេះដឹងដែលត្រូវការដើម្បីរីកចម្រើននៅក្នុងកសិកម្មសម័យទំនើប។",
      },
      values: {
        title: "តម្លៃរបស់យើង",
        items: [
          {
            icon: Users,
            title: "ផ្តោតលើកសិករ",
            description:
              "អ្វីគ្រប់យ៉ាងដែលយើងធ្វើត្រូវបានរចនាដោយដាក់តម្រូវការរបស់កសិករនៅកណ្តាល ធានាបាននូវដំណោះស្រាយជាក់ស្តែង និងអាចចូលប្រើបាន។",
          },
          {
            icon: Globe,
            title: "ភាពអាចចូលប្រើបាន",
            description: "យើងជឿថាបច្ចេកវិទ្យាគួរតែមានសម្រាប់កសិករទាំងអស់ មិនថាពួកគេមានប្រវត្តិបច្ចេកទេស ឬធនធានអ្វីក៏ដោយ។",
          },
          {
            icon: Leaf,
            title: "ចីរភាព",
            description: "យើងលើកកម្ពស់ការអនុវត្តកសិកម្មដែលការពារបរិស្ថាន ខណៈពេលដែលរក្សាភាពអាចទទួលយកបានខាងសេដ្ឋកិច្ច។",
          },
          {
            icon: Shield,
            title: "ការទុកចិត្ត និងសុវត្ថិភាព",
            description: "យើងការពារទិន្នន័យកសិករដោយស្តង់ដារសុវត្ថិភាពខ្ពស់បំផុត និងរក្សាតម្លាភាពពេញលេញ។",
          },
        ],
      },
      story: {
        title: "រឿងរ៉ាវរបស់យើង",
        content:
          "Farm Manager កើតចេញពីការសង្កេតមួយសាមញ្ញ៖ ខណៈពេលដែលបច្ចេកវិទ្យាកំពុងផ្លាស់ប្តូរឧស្សាហកម្មទូទាំងពិភពលោក កសិករច្រើនតែត្រូវបានបោះបង់ចោល។ ត្រូវបានបង្កើតឡើងក្នុងឆ្នាំ ២០២០ ដោយក្រុមអ្នកជំនាញកសិកម្ម និងអ្នកចូលចិត្តបច្ចេកវិទ្យា យើងបានចាប់ផ្តើមដើម្បីបំពេញគម្លាតនេះ។\n\nស្ថាបនិករបស់យើង ដែលបានធំធាត់នៅក្នុងសហគមន៍កសិកម្ម យល់ពីបញ្ហាប្រឈមប្រចាំថ្ងៃដែលកសិករប្រឈមមុខ - ពីអាកាសធាតុមិនអាចទាយទុកជាមុនបាន រហូតដល់តម្លៃទីផ្សារប្រែប្រួល។ ពួកគេបានស្រមៃមើលវេទិកាមួយដែលនឹងដាក់ឧបករណ៍មានអំណាចដោយផ្ទាល់ទៅក្នុងដៃកសិករ ធ្វើឱ្យកសិកម្មសម័យទំនើបអាចចូលប្រើបានសម្រាប់គ្រប់គ្នា។\n\nសព្វថ្ងៃនេះ Farm Manager បម្រើកសិកររាប់ពាន់នាក់នៅទូទាំងប្រទេសជាច្រើន ជួយពួកគេបង្កើនទិន្នផល កាត់បន្ថយការចំណាយ និងកសាងប្រតិបត្តិការកសិកម្មប្រកបដោយចីរភាពជាងមុន។",
      },
      team: {
        title: "ក្រុមភាពជាអ្នកដឹកនាំ",
        members: [
          {
            name: "វេជ្ជបណ្ឌិត Sarah Chen",
            role: "នាយកប្រតិបត្តិ និងសហស្ថាបនិក",
            bio: "អ្នកវិទ្យាសាស្ត្រកសិកម្មដែលមានបទពិសោធន៍ ១៥+ ឆ្នាំក្នុងការអនុវត្តកសិកម្មប្រកបដោយចីរភាព។",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            name: "Michael Rodriguez",
            role: "នាយកបច្ចេកវិទ្យា និងសហស្ថាបនិក",
            bio: "អតីតវិស្វករ Google ដែលមានចំណង់ចំណូលចិត្តក្នុងការអនុវត្តបច្ចេកវិទ្យាដើម្បីដោះស្រាយបញ្ហាពិតប្រាកដ។",
            image: "/placeholder.svg?height=200&width=200",
          },
          {
            name: "វេជ្ជបណ្ឌិត Priya Patel",
            role: "ប្រធានផ្នែកស្រាវជ្រាវ",
            bio: "អ្នកជំនាញខាងរោគរុក្ខជាតិ ឯកទេសក្នុងការការពារ និងគ្រប់គ្រងជំងឺដំណាំ។",
            image: "/placeholder.svg?height=200&width=200",
          },
        ],
      },
      impact: {
        title: "ផលប៉ះពាល់របស់យើង",
        stats: [
          { number: "១០,០០០+", label: "កសិករដែលបានបម្រើ", icon: Users },
          { number: "៥០,០០០+", label: "ហិកតាដែលបានគ្រប់គ្រង", icon: Leaf },
          { number: "៣០%", label: "ការបង្កើនទិន្នផលជាមធ្យម", icon: TrendingUp },
          { number: "២៥%", label: "ការកាត់បន្ថយការចំណាយ", icon: Target },
        ],
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

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.mission.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t.mission.description}</p>
            </div>

            <div className="text-center lg:text-left">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.vision.title}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t.vision.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.values.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.values.items.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">{t.story.title}</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            {t.story.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-6 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">{t.team.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.team.members.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Impact */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{t.impact.title}</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.impact.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PublicAbout

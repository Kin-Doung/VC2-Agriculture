"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Globe, Leaf, Users, ShoppingBag, Video, LogIn, UserPlus } from "lucide-react"

const PublicLayout = ({ children, language, setLanguage }) => {
  const [showMenu, setShowMenu] = useState(false)
  const location = useLocation()

  const translations = {
    en: {
      title: "Farm Manager",
      tagline: "Smart Farming Solutions",
      home: "Home",
      about: "About",
      products: "Products",
      // training: "Traini",
      login: "Login",
      register: "Register",
      menu: "Menu",
    },
    km: {
      title: "កម្មវិធីគ្រប់គ្រងកសិកម្ម",
      tagline: "ដំណោះស្រាយកសិកម្មឆ្លាតវៃ",
      home: "ទំព័រដើម",
      about: "អំពីយើង",
      products: "ផលិតផល",
      training: "ការបណ្តុះបណ្តាល",
      login: "ចូលប្រើ",
      register: "ចុះឈ្មោះ",
      menu: "ម៉ឺនុយ",
    },
  }

  const t = translations[language]

  const navItems = [
    { path: "/", label: t.home, icon: Leaf },
    { path: "/about", label: t.about, icon: Users },
    { path: "/products", label: t.products, icon: ShoppingBag },
    // { path: "/training", label: t.training, icon: Video },
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t.title}</h1>
                <p className="text-xs text-green-600">{t.tagline}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === "en" ? "km" : "en")}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Globe className="h-5 w-5" />
              </button>

              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                {t.login}
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                {t.register}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMenu(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActiveRoute(item.path)
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}

              <hr className="my-2" />

              <button
                onClick={() => {
                  setLanguage(language === "en" ? "km" : "en")
                  setShowMenu(false)
                }}
                className="flex items-center gap-3 px-3 py-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors w-full"
              >
                <Globe className="h-5 w-5" />
                {language === "en" ? "ភាសាខ្មែរ" : "English"}
              </button>

              <Link
                to="/login"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-3 py-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                <LogIn className="h-5 w-5" />
                {t.login}
              </Link>

              <Link
                to="/register"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-3 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mx-3 mb-3"
              >
                <UserPlus className="h-5 w-5" />
                {t.register}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{t.title}</h3>
              </div>
              <p className="text-gray-400 text-sm">
                {language === "en"
                  ? "Empowering farmers with smart technology solutions for better crop management and increased productivity."
                  : "ផ្តល់អំណាចដល់កសិករដោយដំណោះស្រាយបច្ចេកវិទ្យាឆ្លាតវៃសម្រាប់ការគ្រប់គ្រងដំណាំប្រសើរ និងបង្កើនផលិតភាព។"}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{language === "en" ? "Quick Links" : "តំណភ្ជាប់រហ័ស"}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{language === "en" ? "Support" : "ការគាំទ្រ"}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {language === "en" ? "Help Center" : "មជ្ឈមណ្ឌលជំនួយ"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {language === "en" ? "Contact Us" : "ទាក់ទងយើង"}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {language === "en" ? "FAQ" : "សំណួរញឹកញាប់"}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{language === "en" ? "Contact" : "ទំនាក់ទំនង"}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Email: info@farmmanager.com</p>
                <p>Phone: +855 12 345 678</p>
                <p>{language === "en" ? "Address: Phnom Penh, Cambodia" : "អាសយដ្ឋាន៖ ភ្នំពេញ កម្ពុជា"}</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-700 my-8" />

          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              © 2024 Farm Manager. {language === "en" ? "All rights reserved." : "រក្សាសិទ្ធិគ្រប់យ៉ាង។"}
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {language === "en" ? "Privacy Policy" : "គោលការណ៍ភាពឯកជន"}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                {language === "en" ? "Terms of Service" : "លក្ខខណ្ឌសេវាកម្ម"}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout

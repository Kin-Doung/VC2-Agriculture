import { Link, useLocation } from "react-router-dom"
import {
  MapPin,
  Sprout,
  Calendar,
  DollarSign,
  TrendingUp,
  Camera,
  MessageCircle,
  Video,
  HelpCircle,
  Settings,
  User,
  Home,
  Package,
  List,
  Leaf
} from "lucide-react"

const Navigation = ({ isOpen, language }) => {
  const location = useLocation()

  const translations = {
    en: {
      dashboard: "Dashboard",
      myFarm: "My Farm",
      landMeasure: "Measure Land",
      cropTracker: "Crop Tracker",
      tasks: "Tasks & Reminders",
      cropManagement: "Crop Management",
      category: "Category",
      product: "Product",
      marketplace: "Marketplace",
      prices: "Market Prices",
      scanner: "Seed Scanner",
      chat: "Messages",
      videos: "Learning Videos",
      finances: "Income & Expenses",
      support: "Help & Support",
      profile: "Profile",
      settings: "Settings",
    },
    km: {
      dashboard: "ផ្ទាំងគ្រប់គ្រង",
      myFarm: "កសិដ្ឋានរបស់ខ្ញុំ",
      landMeasure: "វាស់ដី",
      cropTracker: "តាមដានដំណាំ",
      tasks: "កិច្ចការ និងការរំលឹក",
      cropManagement: "ការគ្រប់គ្រងគ្រាប់ពូជ",
      category: "ប្រភេទ",
      product: "ផលិត​ផល",
      marketplace: "ទីផ្សារ",
      prices: "តម្លៃទីផ្សារ",
      scanner: "ស្កេនគ្រាប់ពូជ",
      chat: "សារ",
      videos: "វីដេអូសិក្សា",
      finances: "ចំណូល និងចំណាយ",
      support: "ជំនួយ",
      profile: "ប្រវត្តិរូប",
      settings: "ការកំណត់",
    },
  }

  const t = translations[language]

  const menuItems = [
    { icon: Home, label: t.dashboard, path: "/" },
    { icon: MapPin, label: t.myFarm, path: "/farm" },
    { icon: MapPin, label: t.landMeasure, path: "/measure" },
    { icon: Sprout, label: t.cropTracker, path: "/crops" },
    { icon: Calendar, label: t.tasks, path: "/tasks" },
    { icon: Leaf, label: t.cropManagement, path: "/cropmanagement" },
    { icon: List, label: t.category, path: "/category" },
    { icon: Package, label: t.product, path: "/product" },
    { icon: DollarSign, label: t.marketplace, path: "/marketplace" },
    { icon: TrendingUp, label: t.prices, path: "/prices" },
    { icon: Camera, label: t.scanner, path: "/scanner" },
    { icon: MessageCircle, label: t.chat, path: "/messages" },
    { icon: Video, label: t.videos, path: "/videos" },
    { icon: DollarSign, label: t.finances, path: "/finances" },
    { icon: HelpCircle, label: t.support, path: "/support" },
  ]

  const isActiveRoute = (path) => {
    return location.pathname === path
  }

  return (
    <aside className={`bg-white shadow-lg transition-all duration-300 ${isOpen ? "w-64" : "w-0"} overflow-hidden`}>
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-green-100 rounded-lg transition-colors ${
              isActiveRoute(item.path) ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}

        <hr className="my-4" />

        <Link
          to="/profile"
          className={`w-full flex items-center gap-3 p-3 text-left hover:bg-green-100 rounded-lg transition-colors ${
            isActiveRoute("/profile") ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
          }`}
        >
          <User className="h-5 w-5" />
          {t.profile}
        </Link>

        <Link
          to="/settings"
          className={`w-full flex items-center gap-3 p-3 text-left hover:bg-green-100 rounded-lg transition-colors ${
            isActiveRoute("/settings") ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
          }`}
        >
          <Settings className="h-5 w-5" />
          {t.settings}
        </Link>
      </nav>
    </aside>
  )
}

export default Navigation

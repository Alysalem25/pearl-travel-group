'use client'

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ArrowRight,
  Filter,
  Sparkles,
  Ticket
} from "lucide-react"
import Link from "next/link"
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'
import { api } from "@/lib/api"

interface Event {
  _id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  eventDate: string
  price: number
  originalPrice?: number
  locationEn: string
  locationAr: string
  images: string[]
  status: string
  isFeatured: boolean
  category: { _id: string; nameEn: string; nameAr: string }
  totalCapacity: number
  bookedSeats: number
  eventType: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}

export default function EventsPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setMounted(true)
    const langParam = searchParams.get('lang')
    setLang(langParam === 'ar' ? 'ar' : 'en')
  }, [searchParams])

  useEffect(() => {
    fetchEvents()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, selectedCategory, selectedType])

  const fetchEvents = async () => {
    try {
      const res = await api.events.getAll({ upcoming: true })
      if (Array.isArray(res.data)) {
        setEvents(res.data)
      }
    } catch (err) {
      console.error("Error fetching events:", err)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await api.categories.getAll()
      if (Array.isArray(res.data)) {
        setCategories(res.data)
      }
    } catch (err) {
      console.error("Error fetching categories:", err)
    }
  }

  const filterEvents = () => {
    let filtered = events
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category?._id === selectedCategory)
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(e => e.eventType === selectedType)
    }
    
    setFilteredEvents(filtered)
  }

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      concert: '🎵',
      festival: '🎉',
      cultural: '🏛️',
      sports: '⚽',
      food: '🍽️',
      art: '🎨',
      other: '✨'
    }
    return icons[type] || '✨'
  }

  const formatDate = (dateString: string, language: 'en' | 'ar') => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', options)
  }

  const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}


  if (!mounted) return null

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="mb-6"
          >
            <Sparkles className="w-20 h-20 text-yellow-300" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl font-bold text-center mb-4"
          >
            {lang === 'ar' ? 'الفعاليات والأحداث' : 'Events & Experiences'}
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-center text-white/80 max-w-2xl"
          >
            {lang === 'ar' 
              ? 'اكتشف أهم الفعاليات والتجارب الفريدة في وجهتك المفضلة'
              : 'Discover amazing events and unique experiences at your favorite destinations'}
          </motion.p>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          🎭
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute bottom-20 right-10 text-6xl opacity-20"
        >
          🎪
        </motion.div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-5 h-5" />
            <span className="font-medium">{lang === 'ar' ? 'تصفية:' : 'Filter:'}</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع الفئات' : 'All Categories'}</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {lang === 'ar' ? cat.nameAr : cat.nameEn}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">{lang === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
            <option value="concert">{lang === 'ar' ? 'حفلات موسيقية' : 'Concerts'}</option>
            <option value="festival">{lang === 'ar' ? 'مهرجانات' : 'Festivals'}</option>
            <option value="cultural">{lang === 'ar' ? 'ثقافي' : 'Cultural'}</option>
            <option value="sports">{lang === 'ar' ? 'رياضي' : 'Sports'}</option>
            <option value="food">{lang === 'ar' ? 'طعام' : 'Food & Drink'}</option>
            <option value="art">{lang === 'ar' ? 'فنون' : 'Art'}</option>
          </select>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-6"
          }
        >
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                variants={itemVariants}
                layout
                whileHover={{ y: -10 }}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'md:w-1/3 h-64 md:h-auto' : 'h-64'}`}>
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={event.images?.[0] ? (event.images[0].startsWith('http') ? event.images[0] : `${event.images[0]}`) : '/placeholder-event.jpg'}
                    alt={lang === 'ar' ? event.titleAr : event.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold">
                      {getEventTypeIcon(event.eventType)} {event.eventType}
                    </span>
                    {event.isFeatured && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" />
                        {lang === 'ar' ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl">
                    {event.originalPrice && event.originalPrice > event.price && (
                      <span className="text-gray-400 line-through text-sm block">
                        ${event.originalPrice}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-purple-600">${event.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {lang === 'ar' ? event.titleAr : event.titleEn}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {lang === 'ar' ? event.descriptionAr : event.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      {formatDate(event.eventDate, lang)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      {lang === 'ar' ? event.locationAr : event.locationEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      {event.bookedSeats}/{event.totalCapacity} {lang === 'ar' ? 'مقعد' : 'seats'}
                    </span>
                  </div>

                  {/* Progress Bar for Capacity */}
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.bookedSeats / event.totalCapacity) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {event.totalCapacity - event.bookedSeats} {lang === 'ar' ? 'مقاعد متبقية' : 'seats remaining'}
                    </p>
                  </div>

                  <Link href={`/${id}/events/${event._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg transition-all"
                    >
                      <Ticket className="w-5 h-5" />
                      {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
                      <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              {lang === 'ar' ? 'لا توجد فعاليات' : 'No Events Found'}
            </h3>
            <p className="text-gray-400">
              {lang === 'ar' ? 'جرب تغيير الفلاتر' : 'Try adjusting your filters'}
            </p>
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
  )
}
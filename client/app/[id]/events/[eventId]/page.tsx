'use client'

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Share2,
  Heart,
  ChevronLeft,
  Ticket,
  Sparkles,
  Music,
  Utensils,
  Palette,
  Trophy,
  Building2
} from "lucide-react"
import Link from "next/link"
import Navbar from '@/components/Navbar'
import Footer from '@/components/footer'
import { api } from "@/lib/api"
import { motion, AnimatePresence, Variants } from "framer-motion"

interface Event {
  _id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  eventDate: string
  endDate?: string
  price: number
  originalPrice?: number
  locationEn: string
  locationAr: string
  venueEn?: string
  venueAr?: string
  images: string[]
  status: string
  isFeatured: boolean
  category: { _id: string; nameEn: string; nameAr: string }
  totalCapacity: number
  bookedSeats: number
  eventType: string
  duration?: string
  ageRestriction?: string
  organizerEn?: string
  organizerAr?: string
  organizerContact?: string  // ← Add this line
  tagsEn?: string[]
  tagsAr?: string[]
}
export default function EventDetailPage() {
  const { id, eventId } = useParams<{ id: string; eventId: string }>()
  const searchParams = useSearchParams()
  const [lang, setLang] = useState<'en' | 'ar'>('en')
  const [mounted, setMounted] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    setMounted(true)
    const langParam = searchParams.get('lang')
    setLang(langParam === 'ar' ? 'ar' : 'en')
  }, [searchParams])

  useEffect(() => {
    if (eventId) fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const res = await api.events.getOne(eventId)
      setEvent(res.data)
    } catch (err) {
      console.error("Error fetching event:", err)
    }
  }

  const getEventTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      concert: Music,
      festival: Sparkles,
      cultural: Building2,
      sports: Trophy,
      food: Utensils,
      art: Palette,
      other: Star
    }
    const Icon = icons[type] || Star
    return <Icon className="w-6 h-6" />
  }

  const formatDate = (dateString: string, language: 'en' | 'ar') => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  if (!mounted || !event) return null

  const discount = event.originalPrice && event.originalPrice > event.price
    ? Math.round(((event.originalPrice - event.price) / event.originalPrice) * 100)
    : 0

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Gallery */}
      <div className="relative h-[70vh] bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            src={event.images?.[selectedImage] ? (event.images[selectedImage].startsWith('http') ? event.images[selectedImage] : `${event.images[selectedImage]}`) : '/placeholder-event.jpg'}
            alt={lang === 'ar' ? event.titleAr : event.titleEn}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <Link href={`/${id}/events`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              {lang === 'ar' ? 'العودة' : 'Back'}
            </motion.button>
          </Link>
          
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {event.images?.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === idx ? 'border-white scale-110' : 'border-white/30 opacity-70'
              }`}
            >
              <img
                src={img.startsWith('http') ? img : `${img}`}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-32 left-6 right-6 text-white z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="bg-purple-600 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              {getEventTypeIcon(event.eventType)}
              {event.eventType}
            </span>
            {event.isFeatured && (
              <span className="bg-yellow-500 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Star className="w-4 h-4 fill-white" />
                {lang === 'ar' ? 'فعالية مميزة' : 'Featured'}
              </span>
            )}
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            {lang === 'ar' ? event.titleAr : event.titleEn}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm text-gray-500">{lang === 'ar' ? 'التاريخ' : 'Date'}</span>
                <span className="font-semibold text-sm">
                  {new Date(event.eventDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <Clock className="w-8 h-8 text-pink-600 mb-2" />
                <span className="text-sm text-gray-500">{lang === 'ar' ? 'الوقت' : 'Time'}</span>
                <span className="font-semibold text-sm">
                  {new Date(event.eventDate).toLocaleTimeString(lang === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <MapPin className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm text-gray-500">{lang === 'ar' ? 'الموقع' : 'Location'}</span>
                <span className="font-semibold text-sm line-clamp-1">
                  {lang === 'ar' ? event.locationAr : event.locationEn}
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center text-center">
                <Users className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm text-gray-500">{lang === 'ar' ? 'السعة' : 'Capacity'}</span>
                <span className="font-semibold text-sm">
                  {event.totalCapacity - event.bookedSeats} {lang === 'ar' ? 'متاح' : 'left'}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4">
                {lang === 'ar' ? 'عن الفعالية' : 'About This Event'}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {lang === 'ar' ? event.descriptionAr : event.descriptionEn}
              </p>
              
              {event.venueEn && (
                <div className="mt-6 p-4 bg-purple-50 rounded-2xl">
                  <h3 className="font-bold text-purple-900 mb-1">
                    {lang === 'ar' ? 'المكان' : 'Venue'}
                  </h3>
                  <p className="text-purple-700">
                    {lang === 'ar' ? event.venueAr : event.venueEn}
                  </p>
                </div>
              )}

              {/* Tags */}
              {(event.tagsEn || event.tagsAr) && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {(lang === 'ar' ? event.tagsAr : event.tagsEn)?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Organizer */}
            {(event.organizerEn || event.organizerAr) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white"
              >
                <h3 className="text-xl font-bold mb-2">
                  {lang === 'ar' ? 'المنظم' : 'Organizer'}
                </h3>
                <p className="text-white/90 text-lg">
                  {lang === 'ar' ? event.organizerAr : event.organizerEn}
                </p>
                {event.organizerContact && (
                  <p className="mt-2 text-white/70">{event.organizerContact}</p>
                )}
              </motion.div>
            )}
          </div>

          {/* Booking Card */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              {discount > 0 && (
                <div className="bg-red-500 text-white text-center py-2 rounded-full mb-4 font-bold">
                  {discount}% {lang === 'ar' ? 'خصم' : 'OFF'}
                </div>
              )}
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-purple-600">${event.price * quantity}</span>
                {event.originalPrice && event.originalPrice > event.price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${event.originalPrice * quantity}
                  </span>
                )}
                <span className="text-gray-500">/ {quantity} {lang === 'ar' ? 'تذاكر' : 'tickets'}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
                <span className="font-medium">{lang === 'ar' ? 'العدد' : 'Quantity'}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="font-bold text-xl w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.totalCapacity - event.bookedSeats, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Capacity Warning */}
              {event.totalCapacity - event.bookedSeats < 10 && (
                <div className="bg-orange-100 border border-orange-300 text-orange-800 px-4 py-3 rounded-xl mb-4 text-sm">
                  {lang === 'ar' 
                    ? `تبقى فقط ${event.totalCapacity - event.bookedSeats} تذاكر!`
                    : `Only ${event.totalCapacity - event.bookedSeats} tickets left!`}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                <Ticket className="w-6 h-6" />
                {lang === 'ar' ? 'احجز الآن' : 'Book Now'}
              </motion.button>

              <div className="mt-6 text-center text-sm text-gray-500">
                {lang === 'ar' ? 'لا رسوم إخفاء • تأكيد فوري' : 'No hidden fees • Instant confirmation'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
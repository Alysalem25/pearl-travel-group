'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Tag, 
  Star,
  Clock,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react'

interface Event {
  _id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  eventDate: string
  endDate?: string
  locationEn: string
  locationAr: string
  venueEn?: string
  venueAr?: string
  price: number
  originalPrice?: number
  totalCapacity: number
  bookedSeats: number
  category: { _id: string; nameEn: string; nameAr: string }
  country: 'Egypt' | 'Albania'
  eventType: string
  images: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  isFeatured: boolean
  duration?: string
  ageRestriction?: string
  tagsEn?: string[]
  tagsAr?: string[]
}

const eventTypes = [
  { value: 'concert', labelEn: 'Concert', labelAr: 'حفلة موسيقية' },
  { value: 'festival', labelEn: 'Festival', labelAr: 'مهرجان' },
  { value: 'cultural', labelEn: 'Cultural', labelAr: 'ثقافي' },
  { value: 'sports', labelEn: 'Sports', labelAr: 'رياضي' },
  { value: 'food', labelEn: 'Food & Drink', labelAr: 'طعام وشراب' },
  { value: 'art', labelEn: 'Art Exhibition', labelAr: 'معرض فني' },
  { value: 'other', labelEn: 'Other', labelAr: 'أخرى' }
]

export default function EventsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <EventsPageContent />
    </ProtectedRoute>
  )
}

function EventsPageContent() {
  const queryClient = useQueryClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'pricing'>('details')

  // Form states
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<{ url: string; name?: string; isNew: boolean }[]>([])
  const [tagsEn, setTagsEn] = useState<string[]>([])
  const [tagsAr, setTagsAr] = useState<string[]>([])
  const [tagInputEn, setTagInputEn] = useState('')
  const [tagInputAr, setTagInputAr] = useState('')
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    eventDate: '',
    endDate: '',
    locationEn: '',
    locationAr: '',
    venueEn: '',
    venueAr: '',
    price: 0,
    originalPrice: 0,
    totalCapacity: 100,
    category: '',
    country: 'Egypt' as 'Egypt' | 'Albania',
    eventType: 'other',
    status: 'upcoming' as const,
    isFeatured: false,
    duration: '',
    ageRestriction: '',
    dressCode: '',
    organizerEn: '',
    organizerAr: '',
    organizerContact: ''
  })

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.categories.getAll()).data,
  })

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: async () => (await api.events.getAll()).data,
  })

  // Mutations
  const eventMutation = useMutation({
    mutationFn: (payload: FormData) =>
      editingEvent
        ? api.events.update(editingEvent._id, payload)
        : api.events.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      resetForm()
      setShowForm(false)
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Something went wrong')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.events.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })

  const deleteImageMutation = useMutation({
    mutationFn: ({ eventId, imageName }: { eventId: string; imageName: string }) =>
      api.events.deleteImage(eventId, imageName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  })

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const fd = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fd.append(key, String(value))
      }
    })

    fd.append('tagsEn', JSON.stringify(tagsEn))
    fd.append('tagsAr', JSON.stringify(tagsAr))

    images.forEach((img) => fd.append('images', img))

    eventMutation.mutate(fd)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    setImages(prev => [...prev, ...files])
    setPreviewImages(prev => [
      ...prev,
      ...files.map(file => ({ url: URL.createObjectURL(file), isNew: true }))
    ])
  }

  const removePreviewImage = (index: number) => {
    const image = previewImages[index]
    if (image.isNew) {
      const newIndex = previewImages.slice(0, index).filter(img => img.isNew).length
      setImages(prev => prev.filter((_, i) => i !== newIndex))
      setPreviewImages(prev => prev.filter((_, i) => i !== index))
    } else {
      if (!editingEvent || !image.name) return
      if (confirm('Delete this image permanently?')) {
        deleteImageMutation.mutate({
          eventId: editingEvent._id,
          imageName: image.name
        })
      }
    }
  }

  const addTag = (lang: 'en' | 'ar') => {
    if (lang === 'en' && tagInputEn.trim()) {
      setTagsEn([...tagsEn, tagInputEn.trim()])
      setTagInputEn('')
    } else if (lang === 'ar' && tagInputAr.trim()) {
      setTagsAr([...tagsAr, tagInputAr.trim()])
      setTagInputAr('')
    }
  }

  const removeTag = (lang: 'en' | 'ar', index: number) => {
    if (lang === 'en') {
      setTagsEn(tagsEn.filter((_, i) => i !== index))
    } else {
      setTagsAr(tagsAr.filter((_, i) => i !== index))
    }
  }

  const startEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      titleEn: event.titleEn,
      titleAr: event.titleAr,
      descriptionEn: event.descriptionEn,
      descriptionAr: event.descriptionAr,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      locationEn: event.locationEn,
      locationAr: event.locationAr,
      venueEn: event.venueEn || '',
      venueAr: event.venueAr || '',
      price: event.price,
      originalPrice: event.originalPrice || 0,
      totalCapacity: event.totalCapacity,
      category: typeof event.category === 'object' ? event.category._id : '',
      country: event.country,
      eventType: event.eventType,
      status: event.status,
      isFeatured: event.isFeatured,
      duration: event.duration || '',
      ageRestriction: event.ageRestriction || '',
      dressCode: '',
      organizerEn: event.organizerEn || '',
      organizerAr: event.organizerAr || '',
      organizerContact: event.organizerContact || ''
    })

    setTagsEn(event.tagsEn || [])
    setTagsAr(event.tagsAr || [])

    const serverImages = event.images?.map((img) => ({
      url: img.startsWith('http') ? img : `${img}`,
      name: img.split('/').pop(),
      isNew: false
    })) || []
    setPreviewImages(serverImages)
    setImages([])
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      eventDate: '',
      endDate: '',
      locationEn: '',
      locationAr: '',
      venueEn: '',
      venueAr: '',
      price: 0,
      originalPrice: 0,
      totalCapacity: 100,
      category: '',
      country: 'Egypt',
      eventType: 'other',
      status: 'upcoming',
      isFeatured: false,
      duration: '',
      ageRestriction: '',
      dressCode: '',
      organizerEn: '',
      organizerAr: '',
      organizerContact: ''
    })
    setImages([])
    setPreviewImages([])
    setTagsEn([])
    setTagsAr([])
    setEditingEvent(null)
    setError('')
    setActiveTab('details')
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-gradient-to-r from-blue-500 to-cyan-400',
      ongoing: 'bg-gradient-to-r from-green-500 to-emerald-400',
      completed: 'bg-gradient-to-r from-gray-500 to-gray-400',
      cancelled: 'bg-gradient-to-r from-red-500 to-pink-400'
    }
    return colors[status as keyof typeof colors] || colors.upcoming
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="events" />

      <div className="flex-1 overflow-hidden">
        {/* Animated Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-md border-b border-white/20 p-6 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              Events Management
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => showForm ? resetForm() : setShowForm(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                showForm 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Cancel' : 'Add Event'}
            </motion.button>
          </div>
        </motion.header>

        {/* Event Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-black/30 backdrop-blur-sm">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {(['details', 'media', 'pricing'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-full capitalize transition-all ${
                        activeTab === tab
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {/* Titles */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Title (English)</label>
                        <input
                          type="text"
                          value={formData.titleEn}
                          onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="Event Title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Title (Arabic)</label>
                        <input
                          type="text"
                          value={formData.titleAr}
                          onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-right"
                          placeholder="عنوان الفعالية"
                          required
                        />
                      </div>

                      {/* Category & Type */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                          required
                        >
                          <option value="" className="bg-slate-800">Select Category</option>
                          {categories.map((c: any) => (
                            <option key={c._id} value={c._id} className="bg-slate-800">{c.nameEn}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Event Type</label>
                        <select
                          value={formData.eventType}
                          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        >
                          {eventTypes.map((type) => (
                            <option key={type.value} value={type.value} className="bg-slate-800">
                              {type.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Start Date
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.eventDate}
                          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> End Date (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Location (English)
                        </label>
                        <input
                          type="text"
                          value={formData.locationEn}
                          onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="City, Country"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Location (Arabic)
                        </label>
                        <input
                          type="text"
                          value={formData.locationAr}
                          onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-right"
                          placeholder="المدينة، البلد"
                          required
                        />
                      </div>

                      {/* Descriptions */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-gray-300">Description (English)</label>
                        <textarea
                          value={formData.descriptionEn}
                          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-24"
                          placeholder="Event description..."
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-gray-300">Description (Arabic)</label>
                        <textarea
                          value={formData.descriptionAr}
                          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 h-24 text-right"
                          placeholder="وصف الفعالية..."
                          required
                        />
                      </div>

                      {/* Tags */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <Tag className="w-4 h-4" /> Tags (English)
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {tagsEn.map((tag, i) => (
                            <span key={i} className="bg-purple-600/50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeTag('en', i)} className="hover:text-red-400">×</button>
                            </span>
                          ))}
                          <input
                            type="text"
                            value={tagInputEn}
                            onChange={(e) => setTagInputEn(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('en'))}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500"
                            placeholder="Add tag..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <Tag className="w-4 h-4" /> Tags (Arabic)
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {tagsAr.map((tag, i) => (
                            <span key={i} className="bg-pink-600/50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeTag('ar', i)} className="hover:text-red-400">×</button>
                            </span>
                          ))}
                          <input
                            type="text"
                            value={tagInputAr}
                            onChange={(e) => setTagInputAr(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('ar'))}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-purple-500 text-right"
                            placeholder="أضف وسماً..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Media Tab */}
                  {activeTab === 'media' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-purple-500 transition-colors">
                        <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="event-images"
                        />
                        <label
                          htmlFor="event-images"
                          className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full inline-block transition-colors"
                        >
                          Upload Images
                        </label>
                        <p className="text-gray-400 mt-2 text-sm">Up to 10 images, max 10MB each</p>
                      </div>

                      {previewImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {previewImages.map((img, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="relative group aspect-square"
                            >
                              <img
                                src={img.url}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-full object-cover rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => removePreviewImage(i)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              {!img.isNew && (
                                <span className="absolute bottom-2 left-2 bg-blue-600 text-xs px-2 py-1 rounded-full">
                                  Saved
                                </span>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Pricing Tab */}
                  {activeTab === 'pricing' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" /> Price
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Original Price (for discounts)</label>
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Total Capacity
                        </label>
                        <input
                          type="number"
                          value={formData.totalCapacity}
                          onChange={(e) => setFormData({ ...formData, totalCapacity: Number(e.target.value) })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Duration
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="e.g., 3 hours, 2 days"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300">Age Restriction</label>
                        <input
                          type="text"
                          value={formData.ageRestriction}
                          onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                          placeholder="e.g., 18+, All ages"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Featured Event
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={eventMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 transition-all"
                    >
                      {eventMutation.isPending ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: Event, index: number) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={event.images?.[0] ? (event.images[0].startsWith('http') ? event.images[0] : `${event.images[0]}`) : '/placeholder-event.jpg'}
                    alt={event.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(event.status)}`}>
                    {event.status}
                  </div>
                  
                  {/* Featured Badge */}
                  {event.isFeatured && (
                    <div className="absolute top-4 right-4 bg-yellow-500/90 p-2 rounded-full">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}

                  {/* Date Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-2xl font-bold">
                      {new Date(event.eventDate).getDate()}
                    </div>
                    <div className="text-sm uppercase">
                      {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.titleEn}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.descriptionEn}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.locationEn}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.bookedSeats}/{event.totalCapacity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {event.originalPrice > event.price && (
                        <span className="text-gray-500 line-through text-sm mr-2">
                          ${event.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-purple-400">
                        ${event.price}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEdit(event)}
                        className="p-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/40 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => confirm('Delete this event?') && deleteMutation.mutate(event._id)}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

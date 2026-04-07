'use client'

import React, { useState, useMemo } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery } from '@tanstack/react-query'
import apiClient, { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PERMISSIONS } from '@/lib/permissionConstants'
import {
    Search,
    ChevronDown,
    ChevronUp,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    CheckCircle2,
    Plane,
    Ship,
    Car,
    Building2,
    FileText,
    Briefcase,
    Flag,
    Luggage,
    Users,
    X,
    Filter,
    Hash
} from 'lucide-react'

// Types for all booking types
interface BaseBooking {
    _id: string
    userId?: string
    userEmail: string
    userName: string
    userNumber?: string
    status: 'pending' | 'reviewed' | 'under_review' | 'approved' | 'rejected' | 'needs_info'
    createdAt: string
    updatedAt?: string
    reviewedBy?: { _id: string; name: string } | string
    reviewedAt?: string
}

interface BookedProgram extends BaseBooking {
    type: 'program'
    program?: {
        _id: string
        titleEn?: string
        titleAr?: string
        category?: string
        country?: string
    }
    message?: string
}

interface BookedCruise extends BaseBooking {
    type: 'cruise'
    cruisies?: {
        _id: string
        titleEn?: string
        titleAr?: string
        category?: string
    }
    message?: string
}

interface FlightBooking extends BaseBooking {
    type: 'flight'
    tripType: 'round' | 'oneway' | 'multi'
    from?: string
    to?: string
    date?: string
    returnDate?: string
    multiCities?: Array<{ from: string; to: string; date: string }>
    numOfAdults: number
    numOfChildren?: number
    cabinClass?: 'economy' | 'business' | 'first'
}

interface CarTrip extends BaseBooking {
    type: 'car'
    from: string
    to: string
    date: string
    isReturn: boolean
    returnDate?: string
    numOfAdults: number
    numOfLuggage: number
    carType: 'Normal' | 'Premium'
}

interface HotelBooking extends BaseBooking {
    type: 'hotel'
    country: string
    city: string
    hotelName: string
    fromDate: string
    toDate: string
    adults: number
    children?: number
    userPhone?: string
    remarks?: string
}

interface VisaApplication extends BaseBooking {
    type: 'visa'
    fullName: string
    email: string
    phone: string
    destination: string
    otherCountries?: string
    hasTraveledAbroad?: boolean
    visitedCountries?: string
    adminNotes?: string
}

type AllBookings = BookedProgram | BookedCruise | FlightBooking | CarTrip | HotelBooking | VisaApplication

interface SectionState {
    programs: boolean
    cruises: boolean
    flights: boolean
    cars: boolean
    hotels: boolean
    visas: boolean
}

export default function UnifiedSearchPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_PROGRAMS}>
            <UnifiedSearchPageContent />
        </ProtectedRoute>
    )
}

const UnifiedSearchPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedSections, setExpandedSections] = useState<SectionState>({
        programs: true,
        cruises: true,
        flights: true,
        cars: true,
        hotels: true,
        visas: true
    })

    // Fetch all data - Updated to match your actual API endpoints
    const { data: programs = [], isLoading: loadingPrograms } = useQuery({
        queryKey: ['bookedPrograms'],
        queryFn: async () => {
            const res = await api.bookings.getAll()
            return (res.data || []).map((item: any) => ({ ...item, type: 'program' as const }))
        }
    })

    const { data: cruises = [], isLoading: loadingCruises } = useQuery({
        queryKey: ['bookedCruisies'],
        queryFn: async () => {
            const res = await api.cruisies.getAllBooked()
            return (res.data || []).map((item: any) => ({ ...item, type: 'cruise' as const }))
        }
    })

    const { data: flights = [], isLoading: loadingFlights } = useQuery({
        queryKey: ['flights'],
        queryFn: async () => {
            const res = await api.flights.getAll()
            return (res.data || []).map((item: any) => ({ ...item, type: 'flight' as const }))
        }
    })

    const { data: cars = [], isLoading: loadingCars } = useQuery({
        queryKey: ['carTrips'],
        queryFn: async () => {
            const res = await api.carTrips.getAll()
            return (res.data || []).map((item: any) => ({ ...item, type: 'car' as const }))
        }
    })

    // Note: Your api.ts has hotelBooking not hotels
    const { data: hotels = [], isLoading: loadingHotels } = useQuery({
        queryKey: ['hotelBookings'],
        queryFn: async () => {
            const res = await api.hotelBooking.getAll()
            return (res.data || []).map((item: any) => ({ ...item, type: 'hotel' as const }))
        }
    })

    // Note: Your api.ts doesn't have visa endpoint yet - you need to add it
    // For now, this will return empty array
    // Visa query - Fixed to handle nested response structure
    const { data: visas = [], isLoading: loadingVisas } = useQuery({
        queryKey: ['visaApplications'],
        queryFn: async () => {
            const res = await apiClient.get('/visa')
            // console.log("Visa API response:", res.data)
            // Handle nested response: { data: [...], total: number }
            const visaData = res.data?.data || res.data || []
            return visaData.map((item: any) => ({ ...item, type: 'visa' as const }))
        }
    })

    // Combine all bookings
    const allBookings: AllBookings[] = useMemo(() => {
        return [
            ...programs,
            ...cruises,
            ...flights,
            ...cars,
            ...hotels,
            ...visas
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [programs, cruises, flights, cars, hotels, visas])

    // Search function
    const searchInBooking = (booking: AllBookings, query: string): boolean => {
        const q = query.toLowerCase().trim()
        if (!q) return true

        // Common fields
        const commonMatch =
            booking.userName?.toLowerCase().includes(q) ||
            booking.userEmail?.toLowerCase().includes(q) ||
            booking.userNumber?.toLowerCase().includes(q) ||
            booking.status?.toLowerCase().includes(q)

        // Type-specific fields
        let specificMatch = false

        switch (booking.type) {
            case 'program':
                specificMatch = Boolean(
                    (booking as BookedProgram).program?.titleEn?.toLowerCase().includes(q) ||
                    (booking as BookedProgram).program?.titleAr?.toLowerCase().includes(q) ||
                    (booking as BookedProgram).program?.category?.toLowerCase().includes(q) ||
                    (booking as BookedProgram).program?.country?.toLowerCase().includes(q) ||
                    (booking as BookedProgram).message?.toLowerCase().includes(q)

                );

                break
            case 'cruise':
                specificMatch = Boolean(
                    (booking as BookedCruise).cruisies?.titleEn?.toLowerCase().includes(q) ||
                    (booking as BookedCruise).cruisies?.titleAr?.toLowerCase().includes(q) ||
                    (booking as BookedCruise).message?.toLowerCase().includes(q)
                )
                break
            case 'flight':
                const flight = booking as FlightBooking
                specificMatch = Boolean(
                    flight.from?.toLowerCase().includes(q) ||
                    flight.to?.toLowerCase().includes(q) ||
                    flight.cabinClass?.toLowerCase().includes(q) ||
                    flight.tripType?.toLowerCase().includes(q) ||
                    flight.multiCities?.some(c =>
                        c.from.toLowerCase().includes(q) || c.to.toLowerCase().includes(q)
                    )
                )
                break
            case 'car':
                const car = booking as CarTrip
                specificMatch = Boolean(
                    car.from?.toLowerCase().includes(q) ||
                    car.to?.toLowerCase().includes(q) ||
                    car.carType?.toLowerCase().includes(q)
                )
                break
            case 'hotel':
                const hotel = booking as HotelBooking
                specificMatch = Boolean(
                    hotel.country?.toLowerCase().includes(q) ||
                    hotel.city?.toLowerCase().includes(q) ||
                    hotel.hotelName?.toLowerCase().includes(q)
                )
                break
            case 'visa':
                const visa = booking as VisaApplication
                specificMatch = Boolean(
                    visa.fullName?.toLowerCase().includes(q) ||
                    visa.email?.toLowerCase().includes(q) ||
                    visa.phone?.toLowerCase().includes(q) ||
                    visa.destination?.toLowerCase().includes(q) ||
                    visa.otherCountries?.toLowerCase().includes(q) ||
                    visa.visitedCountries?.toLowerCase().includes(q) ||
                    visa.adminNotes?.toLowerCase().includes(q)
                )
                break
        }

        return commonMatch || specificMatch
    }

    // Filter bookings by type and search
    const filteredPrograms: BookedProgram[] = programs.filter((p: BookedProgram) => searchInBooking(p, searchQuery))
    const filteredCruises: BookedCruise[] = cruises.filter((c: BookedCruise) => searchInBooking(c, searchQuery))
    const filteredFlights: FlightBooking[] = flights.filter((f: FlightBooking) => searchInBooking(f, searchQuery))
    const filteredCars: CarTrip[] = cars.filter((c: CarTrip) => searchInBooking(c, searchQuery))
    const filteredHotels: HotelBooking[] = hotels.filter((h: HotelBooking) => searchInBooking(h, searchQuery))
    const filteredVisas: VisaApplication[] = visas.filter((v: VisaApplication) => searchInBooking(v, searchQuery))

    const totalResults = filteredPrograms.length + filteredCruises.length + filteredFlights.length +
        filteredCars.length + filteredHotels.length + filteredVisas.length

    const toggleSection = (section: keyof SectionState) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200'
            case 'under_review': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'needs_info': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'reviewed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'program': return <Briefcase className="w-4 h-4" />
            case 'cruise': return <Ship className="w-4 h-4" />
            case 'flight': return <Plane className="w-4 h-4" />
            case 'car': return <Car className="w-4 h-4" />
            case 'hotel': return <Building2 className="w-4 h-4" />
            case 'visa': return <FileText className="w-4 h-4" />
            default: return <Calendar className="w-4 h-4" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'program': return 'bg-violet-100 text-violet-700 border-violet-200'
            case 'cruise': return 'bg-cyan-100 text-cyan-700 border-cyan-200'
            case 'flight': return 'bg-sky-100 text-sky-700 border-sky-200'
            case 'car': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'hotel': return 'bg-pink-100 text-pink-700 border-pink-200'
            case 'visa': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            default: return 'bg-slate-100 text-slate-700 border-slate-200'
        }
    }

    const formatDate = (date: string) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const renderProgramCard = (booking: BookedProgram) => (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getTypeColor('program')}`}>
                        <Briefcase className="w-3 h-3" /> Program
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(booking.createdAt)}</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{booking.program?.titleEn}</h4>
            {booking.program?.titleAr && <p className="text-sm text-slate-500 mb-2" dir="rtl">{booking.program.titleAr}</p>}
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {booking.userName}</span>
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {booking.userEmail}</span>
            </div>
            {booking.program?.category && (
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg mr-2">
                    {booking.program.category}
                </span>
            )}
            {booking.program?.country && (
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                    <Flag className="w-3 h-3 inline mr-1" />{booking.program.country}
                </span>
            )}
        </div>
    )

    const renderCruiseCard = (booking: BookedCruise) => (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getTypeColor('cruise')}`}>
                        <Ship className="w-3 h-3" /> Cruise
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(booking.createdAt)}</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{booking.cruisies?.titleEn}</h4>
            {booking.cruisies?.titleAr && <p className="text-sm text-slate-500 mb-2" dir="rtl">{booking.cruisies.titleAr}</p>}
            <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {booking.userName}</span>
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {booking.userEmail}</span>
            </div>
        </div>
    )

    const renderFlightCard = (booking: FlightBooking) => (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getTypeColor('flight')}`}>
                        <Plane className="w-3 h-3" /> Flight
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(booking.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
                {booking.tripType === 'multi' ? (
                    <div className="flex flex-col gap-1">
                        {booking.multiCities?.map((city, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-slate-700">{city.from}</span>
                                <Plane className="w-3 h-3 text-slate-400" />
                                <span className="font-semibold text-slate-700">{city.to}</span>
                                <span className="text-xs text-slate-500">({formatDate(city.date)})</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{booking.from}</span>
                        <Plane className="w-4 h-4 text-sky-500" />
                        <span className="font-bold text-slate-900">{booking.to}</span>
                        {booking.tripType === 'round' && (
                            <>
                                <Plane className="w-4 h-4 text-sky-500 rotate-180" />
                                <span className="text-xs text-slate-500">Return: {booking.returnDate ? formatDate(booking.returnDate) : 'N/A'}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {booking.userName}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {booking.numOfAdults} Adults</span>
                {booking.numOfChildren && booking.numOfChildren > 0 && <span>{booking.numOfChildren} Children</span>}
                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs uppercase">{booking.cabinClass}</span>
            </div>
        </div>
    )

    const renderCarCard = (booking: CarTrip) => (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getTypeColor('car')}`}>
                        <Car className="w-3 h-3" /> Car
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(booking.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-slate-900">{booking.from}</span>
                <Car className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-slate-900">{booking.to}</span>
                {booking.isReturn && (
                    <>
                        <Car className="w-4 h-4 text-amber-500 rotate-180" />
                        <span className="text-xs text-slate-500">Return: {booking.returnDate ? formatDate(booking.returnDate) : 'N/A'}</span>
                    </>
                )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {booking.userName}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">{booking.carType}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg flex items-center gap-1">
                    <Luggage className="w-3 h-3" /> {booking.numOfLuggage} bags
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg flex items-center gap-1">
                    <Users className="w-3 h-3" /> {booking.numOfAdults} pax
                </span>
            </div>
        </div>
    )

    const renderHotelCard = (booking: HotelBooking) => (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getTypeColor('hotel')}`}>
                        <Building2 className="w-3 h-3" /> Hotel
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(booking.createdAt)}</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{booking.hotelName}</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <MapPin className="w-4 h-4 text-pink-500" />
                <span>{booking.city}, {booking.country}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {booking.userName}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {booking.userPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(booking.fromDate)}</span>
                <span>→</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(booking.toDate)}</span>
                <span className="ml-auto flex items-center gap-1"><Users className="w-3 h-3" /> {booking.adults} adults</span>
                {booking.children && booking.children > 0 && <span>{booking.children} children</span>}
            </div>
        </div>
    )

    const renderVisaCard = (booking: VisaApplication) => (
        <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${getTypeColor('visa')}`}>
                        <FileText className="w-3 h-3" /> Visa
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                    </span>
                </div>
                <span className="text-xs text-slate-400">{formatDate(booking.createdAt)}</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-1">{booking.fullName}</h4>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {booking.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {booking.phone}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-slate-700">Destination: {booking.destination}</span>
            </div>
            {booking.otherCountries && (
                <p className="text-xs text-slate-500 mb-1">Other: {booking.otherCountries}</p>
            )}
            {booking.visitedCountries && (
                <p className="text-xs text-slate-500 mb-1">Previously visited: {booking.visitedCountries}</p>
            )}
            {booking.adminNotes && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <strong>Admin Notes:</strong> {booking.adminNotes}
                </div>
            )}
        </div>
    )

    const SectionHeader = ({
        title,
        count,
        icon: Icon,
        color,
        sectionKey
    }: {
        title: string;
        count: number;
        icon: any;
        color: string;
        sectionKey: keyof SectionState
    }) => (
        <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200 mb-3"
        >
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500">{count} results found</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${color.replace('bg-', 'bg-opacity-10 bg-').replace('text-white', 'text-slate-700')}`}>
                    {count}
                </span>
                {expandedSections[sectionKey] ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </div>
        </button>
    )

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="unified-search" />

            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-white/80 border-b border-slate-200 shadow-sm backdrop-blur-xl">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                    <Search className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Universal Search</h1>
                                    <p className="text-xs text-slate-500 font-medium">Search across all bookings</p>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-3xl">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, email, country, destination, hotel, program..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400 text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                            <span className="font-semibold text-slate-700">
                                <span className="text-indigo-600 font-bold">{totalResults}</span> total results
                            </span>
                            <div className="h-4 w-px bg-slate-300" />
                            <span className="text-slate-500">Programs: <strong className="text-violet-600">{filteredPrograms.length}</strong></span>
                            <span className="text-slate-500">Cruises: <strong className="text-cyan-600">{filteredCruises.length}</strong></span>
                            <span className="text-slate-500">Flights: <strong className="text-sky-600">{filteredFlights.length}</strong></span>
                            <span className="text-slate-500">Cars: <strong className="text-amber-600">{filteredCars.length}</strong></span>
                            <span className="text-slate-500">Hotels: <strong className="text-pink-600">{filteredHotels.length}</strong></span>
                            <span className="text-slate-500">Visas: <strong className="text-emerald-600">{filteredVisas.length}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Programs Section */}
                    {filteredPrograms.length > 0 && (
                        <div>
                            <SectionHeader
                                title="Booked Programs"
                                count={filteredPrograms.length}
                                icon={Briefcase}
                                color="bg-violet-500"
                                sectionKey="programs"
                            />
                            {expandedSections.programs && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    {filteredPrograms.map(renderProgramCard)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cruises Section */}
                    {filteredCruises.length > 0 && (
                        <div>
                            <SectionHeader
                                title="Booked Cruises"
                                count={filteredCruises.length}
                                icon={Ship}
                                color="bg-cyan-500"
                                sectionKey="cruises"
                            />
                            {expandedSections.cruises && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    {filteredCruises.map(renderCruiseCard)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Flights Section */}
                    {filteredFlights.length > 0 && (
                        <div>
                            <SectionHeader
                                title="Booked Flights"
                                count={filteredFlights.length}
                                icon={Plane}
                                color="bg-sky-500"
                                sectionKey="flights"
                            />
                            {expandedSections.flights && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    {filteredFlights.map(renderFlightCard)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cars Section */}
                    {filteredCars.length > 0 && (
                        <div>
                            <SectionHeader
                                title="Booked Car Trips"
                                count={filteredCars.length}
                                icon={Car}
                                color="bg-amber-500"
                                sectionKey="cars"
                            />
                            {expandedSections.cars && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    {filteredCars.map(renderCarCard)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hotels Section */}
                    {filteredHotels.length > 0 && (
                        <div>
                            <SectionHeader
                                title="Booked Hotels"
                                count={filteredHotels.length}
                                icon={Building2}
                                color="bg-pink-500"
                                sectionKey="hotels"
                            />
                            {expandedSections.hotels && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    {filteredHotels.map(renderHotelCard)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Visas Section */}
                    {filteredVisas.length > 0 && (
                        <div>
                            <SectionHeader
                                title="Visa Applications"
                                count={filteredVisas.length}
                                icon={FileText}
                                color="bg-emerald-500"
                                sectionKey="visas"
                            />
                            {expandedSections.visas && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                                    {filteredVisas.map(renderVisaCard)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {totalResults === 0 && searchQuery && (
                        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-lg font-medium">No results found</p>
                            <p className="text-slate-400 mt-1">Try adjusting your search query</p>
                        </div>
                    )}

                    {/* Initial State */}
                    {!searchQuery && totalResults === 0 && !loadingPrograms && !loadingCruises && !loadingFlights && !loadingCars && !loadingHotels && !loadingVisas && (
                        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-lg font-medium">Start searching</p>
                            <p className="text-slate-400 mt-1">Enter a search term to find bookings across all categories</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
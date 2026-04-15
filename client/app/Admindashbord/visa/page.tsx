// 'use client'

// import React, { useState, useEffect } from 'react'
// import AdminSidebar from '@/components/adminSidebar'
// import { ProtectedRoute } from '@/components/ProtectedRoute'
// import { PERMISSIONS } from '@/lib/permissionConstants'
// import { useAuth } from '@/context/AuthContext'
// import apiClient from '@/lib/api'
// import { Search, Filter, Eye, Edit2, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react'

// interface VisaApplication {
//     _id: string
//     fullName: string
//     email: string
//     phone: string
//     destination: string
//     otherCountries: string
//     hasTraveledAbroad: boolean
//     visitedCountries: string
//     status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_info'
//     adminNotes: string
//     submittedAt: string
//     reviewedAt: string | null
// }

// interface VisaStats {
//     total: number
//     pending: number
//     under_review: number
//     approved: number
//     rejected: number
//     needs_info: number
// }

// export default function VisaPage() {
//     return (
//         <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_VISA}>
//             <VisaPageContent />
//         </ProtectedRoute>
//     )
// }

// const VisaPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [visas, setVisas] = useState<VisaApplication[]>([])
//     const [stats, setStats] = useState<VisaStats>({
//         total: 0,
//         pending: 0,
//         under_review: 0,
//         approved: 0,
//         rejected: 0,
//         needs_info: 0
//     })
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)
//     const [searchEmail, setSearchEmail] = useState('')
//     const [filterStatus, setFilterStatus] = useState('all')
//     const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
//     const [showDetails, setShowDetails] = useState(false)
//     const [showStatusForm, setShowStatusForm] = useState(false)
//     const [newStatus, setNewStatus] = useState<VisaApplication['status']>('pending')
//     const [adminNotes, setAdminNotes] = useState('')
//     const [updating, setUpdating] = useState(false)

//     // Fetch visas
//     const fetchVisas = async () => {
//         try {
//             setLoading(true)
//             setError(null)
//             const response = await apiClient.get('/visa')
//             setVisas(response.data.data || [])
//             calculateStats(response.data.data || [])
//             console.log('Fetched visas:', response.data.data)
//         } catch (err: any) {
//             setError(err.response?.data?.error || 'Failed to fetch visa applications')
//             console.error(err)
//         } finally {
//             setLoading(false)
//         }
//     }


//     const calculateStats = (applications: VisaApplication[]) => {
//         const newStats: VisaStats = {
//             total: applications.length,
//             pending: 0,
//             under_review: 0,
//             approved: 0,
//             rejected: 0,
//             needs_info: 0
//         }

//         applications.forEach(app => {
//             newStats[app.status as keyof Omit<VisaStats, 'total'>]++
//         })

//         setStats(newStats)
//     }

//     useEffect(() => {
//         fetchVisas()
//     }, [])

//     const handleViewDetails = (visa: VisaApplication) => {
//         setSelectedVisa(visa)
//         setNewStatus(visa.status)
//         setAdminNotes(visa.adminNotes)
//         setShowDetails(true)
//     }

//     const handleUpdateStatus = async () => {
//         if (!selectedVisa) return

//         try {
//             setUpdating(true)
//             await apiClient.put(`/visa/${selectedVisa._id}`, { status: newStatus, adminNotes })
            
//             // Refresh list
//             fetchVisas()
//             setShowDetails(false)
//             setShowStatusForm(false)
//         } catch (err: any) {
//             console.error('Update error:', err)
//             alert(err.response?.data?.error || 'Failed to update application')
//         } finally {
//             setUpdating(false)
//         }
//     }

//     const handleDelete = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this application?')) return

//         try {
//             await apiClient.delete(`/visa/${id}`)
//             fetchVisas()
//         } catch (err: any) {
//             console.error('Delete error:', err)
//             alert(err.response?.data?.error || 'Failed to delete application')
//         }
//     }

//     // Filter visas
//     const filteredVisas = visas.filter(visa => {
//         const emailMatch = visa.email.toLowerCase().includes(searchEmail.toLowerCase())
//         const statusMatch = filterStatus === 'all' || visa.status === filterStatus
//         return emailMatch && statusMatch
//     })

//     const getStatusColor = (status: VisaApplication['status']) => {
//         switch (status) {
//             case 'approved':
//                 return 'bg-green-100 text-green-800 border-green-300'
//             case 'rejected':
//                 return 'bg-red-100 text-red-800 border-red-300'
//             case 'under_review':
//                 return 'bg-blue-100 text-blue-800 border-blue-300'
//             case 'needs_info':
//                 return 'bg-yellow-100 text-yellow-800 border-yellow-300'
//             default:
//                 return 'bg-gray-100 text-gray-800 border-gray-300'
//         }
//     }

//     const getStatusIcon = (status: VisaApplication['status']) => {
//         switch (status) {
//             case 'approved':
//                 return <CheckCircle className="w-5 h-5 text-green-600" />
//             case 'rejected':
//                 return <AlertCircle className="w-5 h-5 text-red-600" />
//             case 'under_review':
//             case 'needs_info':
//                 return <Clock className="w-5 h-5 text-yellow-600" />
//             default:
//                 return <Clock className="w-5 h-5 text-gray-600" />
//         }
//     }

//     const formatDate = (date: string | null) => {
//         if (!date) return 'N/A'
//         return new Date(date).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         })
//     }

//     return (
//         <div className="flex h-screen bg-gray-100">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="visa" />

//             <div className="flex-1 overflow-auto">
//                 {/* Header */}
//                 <div className="sticky top-0 z-40 bg-white shadow">
//                     <div className="p-4 sm:p-6 flex items-center justify-between">
//                         <button
//                             onClick={() => setSidebarOpen(!sidebarOpen)}
//                             className="md:hidden p-2 hover:bg-gray-100 rounded"
//                         >
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                             </svg>
//                         </button>
//                         <h1 className="text-2xl font-bold text-gray-900">Visa Applications</h1>
//                         <div className="w-8" />
//                     </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                     <StatCard label="Total" value={stats.total} color="bg-gray-500" />
//                     <StatCard label="Pending" value={stats.pending} color="bg-gray-400" />
//                     <StatCard label="Under Review" value={stats.under_review} color="bg-blue-500" />
//                     <StatCard label="Approved" value={stats.approved} color="bg-green-500" />
//                     <StatCard label="Rejected" value={stats.rejected} color="bg-red-500" />
//                     <StatCard label="Needs Info" value={stats.needs_info} color="bg-yellow-500" />
//                 </div>

//                 {/* Filters */}
//                 <div className="p-4 sm:p-6 bg-white mx-4 sm:mx-6 rounded-lg shadow mb-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="relative">
//                             <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder="Search by email..."
//                                 value={searchEmail}
//                                 onChange={(e) => setSearchEmail(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             />
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <Filter className="w-5 h-5 text-gray-400" />
//                             <select
//                                 value={filterStatus}
//                                 onChange={(e) => setFilterStatus(e.target.value)}
//                                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             >
//                                 <option value="all">All Status</option>
//                                 <option value="pending">Pending</option>
//                                 <option value="under_review">Under Review</option>
//                                 <option value="needs_info">Needs Info</option>
//                                 <option value="approved">Approved</option>
//                                 <option value="rejected">Rejected</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-4 sm:p-6">
//                     {error && (
//                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//                             {error}
//                         </div>
//                     )}

//                     {loading ? (
//                         <div className="flex justify-center items-center h-64">
//                             <div className="text-gray-500">Loading applications...</div>
//                         </div>
//                     ) : filteredVisas.length === 0 ? (
//                         <div className="bg-white rounded-lg shadow p-8 text-center">
//                             <p className="text-gray-500 text-lg">No visa applications found</p>
//                         </div>
//                     ) : (
//                         <div className="bg-white rounded-lg shadow overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="bg-gray-50 border-b border-gray-200">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Submitted</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-gray-200">
//                                         {filteredVisas.map((visa) => (
//                                             <tr key={visa._id} className="hover:bg-gray-50 transition">
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                     {visa.fullName}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                                     {visa.email}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                                     {visa.phone}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap">
//                                                     <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(visa.status)}`}>
//                                                         {getStatusIcon(visa.status)}
//                                                         {visa.status.replace('_', ' ')}
//                                                     </span>
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                                     {formatDate(visa.submittedAt)}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm gap-2 flex">
//                                                     <button
//                                                         onClick={() => handleViewDetails(visa)}
//                                                         className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
//                                                         title="View Details"
//                                                     >
//                                                         <Eye className="w-5 h-5" />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => {
//                                                             handleViewDetails(visa)
//                                                             setShowStatusForm(true)
//                                                         }}
//                                                         className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded"
//                                                         title="Update Status"
//                                                     >
//                                                         <Edit2 className="w-5 h-5" />
//                                                     </button>
//                                                     <button
//                                                         onClick={() => handleDelete(visa._id)}
//                                                         className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
//                                                         title="Delete"
//                                                     >
//                                                         <Trash2 className="w-5 h-5" />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Details Modal */}
//             {showDetails && selectedVisa && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                         <div className="sticky top-0 bg-linear-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
//                             <h2 className="text-xl font-bold text-white">Application Details</h2>
//                             <button
//                                 onClick={() => {
//                                     setShowDetails(false)
//                                     setShowStatusForm(false)
//                                 }}
//                                 className="text-white hover:bg-white/20 p-2 rounded"
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div className="p-6 space-y-6">
//                             {/* Personal Info */}
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                                         <p className="mt-1 text-gray-900">{selectedVisa.fullName}</p>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Email</label>
//                                         <p className="mt-1 text-gray-900">{selectedVisa.email}</p>
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">Phone</label>
//                                         <p className="mt-1 text-gray-900">{selectedVisa.phone}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Destinations */}
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Destinations</h3>
//                                 <div className="flex flex-wrap gap-2">
//                                     {selectedVisa.destination && (
//                                         <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
//                                             {selectedVisa.destination}
//                                         </span>
//                                     )}
//                                 </div>
//                                 {selectedVisa.otherCountries && (
//                                     <div className="mt-3">
//                                         <label className="block text-sm font-medium text-gray-700">Other Countries</label>
//                                         <p className="mt-1 text-gray-900">{selectedVisa.otherCountries}</p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Travel History */}
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel History</h3>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700">Traveled Abroad</label>
//                                     <p className="mt-1 text-gray-900">{selectedVisa.hasTraveledAbroad ? 'Yes' : 'No'}</p>
//                                 </div>
//                                 {selectedVisa.visitedCountries && (
//                                     <div className="mt-3">
//                                         <label className="block text-sm font-medium text-gray-700">Visited Countries</label>
//                                         <p className="mt-1 text-gray-900">{selectedVisa.visitedCountries}</p>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Status Section */}
//                             {showStatusForm ? (
//                                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
//                                     <div className="space-y-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Status</label>
//                                             <select
//                                                 value={newStatus}
//                                                 onChange={(e) => setNewStatus(e.target.value as VisaApplication['status'])}
//                                                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500"
//                                             >
//                                                 <option value="pending">Pending</option>
//                                                 <option value="under_review">Under Review</option>
//                                                 <option value="needs_info">Needs Info</option>
//                                                 <option value="approved">Approved</option>
//                                                 <option value="rejected">Rejected</option>
//                                             </select>
//                                         </div>
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
//                                             <textarea
//                                                 value={adminNotes}
//                                                 onChange={(e) => setAdminNotes(e.target.value)}
//                                                 className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500"
//                                                 rows={3}
//                                                 placeholder="Add notes for this application..."
//                                             />
//                                         </div>
//                                         <div className="flex gap-2 justify-end pt-4 border-t">
//                                             <button
//                                                 onClick={() => setShowStatusForm(false)}
//                                                 className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                                             >
//                                                 Cancel
//                                             </button>
//                                             <button
//                                                 onClick={handleUpdateStatus}
//                                                 disabled={updating}
//                                                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//                                             >
//                                                 {updating ? 'Updating...' : 'Update Status'}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Status</h3>
//                                     <div className="flex items-center gap-2 mb-4">
//                                         {getStatusIcon(selectedVisa.status)}
//                                         <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedVisa.status)}`}>
//                                             {selectedVisa.status.replace('_', ' ')}
//                                         </span>
//                                     </div>
//                                     {selectedVisa.adminNotes && (
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
//                                             <p className="mt-1 text-gray-900">{selectedVisa.adminNotes}</p>
//                                         </div>
//                                     )}
//                                     <div className="pt-4 border-t mt-4">
//                                         <button
//                                             onClick={() => setShowStatusForm(true)}
//                                             className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                         >
//                                             Edit Status
//                                         </button>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Timestamps */}
//                             <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Timestamps</h3>
//                                 <div className="space-y-2">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Submitted</label>
//                                         <p className="text-sm text-gray-600">{formatDate(selectedVisa.submittedAt)}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700">Last Updated</label>
//                                         <p className="text-sm text-gray-600">{formatDate(selectedVisa.reviewedAt)}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// // Stat Card Component
// function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
//     return (
//         <div className="bg-white rounded-lg shadow p-4">
//             <p className="text-gray-600 text-sm font-medium">{label}</p>
//             <p className={`text-3xl font-bold ${color} text-transparent bg-clip-text`} style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
//                 <span className={`${color} bg-clip-text text-transparent`}>{value}</span>
//             </p>
//             <div className={`mt-2 h-1 ${color} rounded-full`} style={{ width: '100%' }} />
//         </div>
//     )
// }



'use client'

import React, { useState, useEffect } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PERMISSIONS } from '@/lib/permissionConstants'
import { useAuth } from '@/context/AuthContext'
import apiClient from '@/lib/api'
import { Search, Filter, Eye, Edit2, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface VisaApplication {
    _id: string
    fullName: string
    email: string
    phone: string
    destination: string
    otherCountries: string
    hasTraveledAbroad: boolean
    visitedCountries: string
    status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'needs_info'
    adminNotes: string
    submittedAt: string
    reviewedAt: string | null
}

interface VisaStats {
    total: number
    pending: number
    under_review: number
    approved: number
    rejected: number
    needs_info: number
}

export default function VisaPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_VISA}>
            <VisaPageContent />
        </ProtectedRoute>
    )
}

const VisaPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [visas, setVisas] = useState<VisaApplication[]>([])
    const [stats, setStats] = useState<VisaStats>({
        total: 0,
        pending: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        needs_info: 0
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchEmail, setSearchEmail] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedVisa, setSelectedVisa] = useState<VisaApplication | null>(null)
    const [showDetails, setShowDetails] = useState(false)
    const [showStatusForm, setShowStatusForm] = useState(false)
    const [newStatus, setNewStatus] = useState<VisaApplication['status']>('pending')
    const [adminNotes, setAdminNotes] = useState('')
    const [updating, setUpdating] = useState(false)

    // Fetch visas
    const fetchVisas = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await apiClient.get('/visa')
            setVisas(response.data.data || [])
            calculateStats(response.data.data || [])
            console.log('Fetched visas:', response.data.data)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch visa applications')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }


    const calculateStats = (applications: VisaApplication[]) => {
        const newStats: VisaStats = {
            total: applications.length,
            pending: 0,
            under_review: 0,
            approved: 0,
            rejected: 0,
            needs_info: 0
        }

        applications.forEach(app => {
            newStats[app.status as keyof Omit<VisaStats, 'total'>]++
        })

        setStats(newStats)
    }

    useEffect(() => {
        fetchVisas()
    }, [])

    const handleViewDetails = (visa: VisaApplication) => {
        setSelectedVisa(visa)
        setNewStatus(visa.status)
        setAdminNotes(visa.adminNotes)
        setShowDetails(true)
    }

    const handleUpdateStatus = async () => {
        if (!selectedVisa) return

        try {
            setUpdating(true)
            await apiClient.put(`/visa/${selectedVisa._id}`, { status: newStatus, adminNotes })
            
            // Refresh list
            fetchVisas()
            setShowDetails(false)
            setShowStatusForm(false)
        } catch (err: any) {
            console.error('Update error:', err)
            alert(err.response?.data?.error || 'Failed to update application')
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application?')) return

        try {
            await apiClient.delete(`/visa/${id}`)
            fetchVisas()
        } catch (err: any) {
            console.error('Delete error:', err)
            alert(err.response?.data?.error || 'Failed to delete application')
        }
    }

    // Filter visas
    const filteredVisas = visas.filter(visa => {
        const emailMatch = visa.email.toLowerCase().includes(searchEmail.toLowerCase())
        const statusMatch = filterStatus === 'all' || visa.status === filterStatus
        return emailMatch && statusMatch
    })

    const getStatusColor = (status: VisaApplication['status']) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100'
            case 'rejected':
                return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-100'
            case 'under_review':
                return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100'
            case 'needs_info':
                return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100'
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100'
        }
    }

    const getStatusIcon = (status: VisaApplication['status']) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4" />
            case 'rejected':
                return <AlertCircle className="w-4 h-4" />
            case 'under_review':
            case 'needs_info':
                return <Clock className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const formatDate = (date: string | null) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="visa" />

            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-xl bg-white/80">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                        >
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Visa Applications</h1>
                                <p className="text-xs text-slate-500 font-medium">Manage and review visa requests</p>
                            </div>
                        </div>
                        <div className="w-8" />
                    </div>
                </div>

                {/* Stats */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard label="Total" value={stats.total} color="from-slate-500 to-slate-600" icon="total" />
                    <StatCard label="Pending" value={stats.pending} color="from-slate-400 to-slate-500" icon="pending" />
                    <StatCard label="Under Review" value={stats.under_review} color="from-blue-500 to-blue-600" icon="review" />
                    <StatCard label="Approved" value={stats.approved} color="from-emerald-500 to-emerald-600" icon="approved" />
                    <StatCard label="Rejected" value={stats.rejected} color="from-rose-500 to-rose-600" icon="rejected" />
                    <StatCard label="Needs Info" value={stats.needs_info} color="from-amber-500 to-amber-600" icon="info" />
                </div>

                {/* Filters */}
                <div className="px-6 pb-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <div className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-500">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by email address..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="relative flex items-center gap-3">
                                <div className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none">
                                    <Filter className="w-5 h-5" />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="flex-1 pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="needs_info">Needs Info</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="absolute right-3.5 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    {error && (
                        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 px-5 py-4 rounded-xl flex items-center gap-3 shadow-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                            <p className="text-slate-500 font-medium">Loading applications...</p>
                        </div>
                    ) : filteredVisas.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 text-lg font-medium">No visa applications found</p>
                            <p className="text-slate-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/80 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Applicant</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Submitted</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredVisas.map((visa) => (
                                            <tr key={visa._id} className="hover:bg-slate-50/60 transition-colors duration-150 group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-semibold text-sm border border-blue-200">
                                                            {visa.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-900">{visa.fullName}</p>
                                                            <p className="text-xs text-slate-500">{visa.destination}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-700 font-medium">{visa.email}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{visa.phone}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ring-1 ring-inset ${getStatusColor(visa.status)}`}>
                                                        {getStatusIcon(visa.status)}
                                                        {visa.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-slate-600 font-medium">{formatDate(visa.submittedAt).split(',')[0]}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(visa.submittedAt).split(',')[1]}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => handleViewDetails(visa)}
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                handleViewDetails(visa)
                                                                setShowStatusForm(true)
                                                            }}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200"
                                                            title="Update Status"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(visa._id)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && selectedVisa && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Application Details</h2>
                                    <p className="text-blue-100 text-xs">ID: {selectedVisa._id.slice(-8).toUpperCase()}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDetails(false)
                                    setShowStatusForm(false)
                                }}
                                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Personal Info */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                                        <p className="text-sm font-semibold text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200">{selectedVisa.fullName}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                                        <p className="text-sm font-medium text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">{selectedVisa.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
                                        <p className="text-sm font-medium text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">{selectedVisa.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</label>
                                        <p className="text-sm font-medium text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">{selectedVisa.destination}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Destinations */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Travel Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Primary Destination</label>
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold border border-blue-200">
                                            {selectedVisa.destination}
                                        </span>
                                    </div>
                                    {selectedVisa.otherCountries && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Other Countries</label>
                                            <p className="text-sm text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">{selectedVisa.otherCountries}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Travel History */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Travel History
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedVisa.hasTraveledAbroad ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                            {selectedVisa.hasTraveledAbroad ? 'YES' : 'NO'}
                                        </span>
                                        <span className="text-sm text-slate-600">Has traveled abroad before</span>
                                    </div>
                                    {selectedVisa.visitedCountries && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Previously Visited</label>
                                            <p className="text-sm text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200">{selectedVisa.visitedCountries}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status Section */}
                            {showStatusForm ? (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-inner">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                        Update Status
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</label>
                                            <div className="relative">
                                                <select
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value as VisaApplication['status'])}
                                                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="under_review">🔍 Under Review</option>
                                                    <option value="needs_info">⚠️ Needs Info</option>
                                                    <option value="approved">✅ Approved</option>
                                                    <option value="rejected">❌ Rejected</option>
                                                </select>
                                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Admin Notes</label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-700 resize-none"
                                                rows={3}
                                                placeholder="Add notes for this application..."
                                            />
                                        </div>
                                        <div className="flex gap-3 justify-end pt-4 border-t border-blue-200/50">
                                            <button
                                                onClick={() => setShowStatusForm(false)}
                                                className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-white hover:border-slate-400 transition-all duration-200"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateStatus}
                                                disabled={updating}
                                                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                                            >
                                                {updating ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="w-4 h-4" />
                                                        Update Status
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                        Current Status
                                    </h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(selectedVisa.status)}`}>
                                            {getStatusIcon(selectedVisa.status)}
                                            {selectedVisa.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {selectedVisa.adminNotes && (
                                        <div className="space-y-1 mb-4">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin Notes</label>
                                            <p className="text-sm text-slate-700 bg-white px-4 py-3 rounded-xl border border-slate-200 italic">{selectedVisa.adminNotes}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setShowStatusForm(true)}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Status
                                    </button>
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                    Timeline
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</span>
                                        <span className="text-sm font-medium text-slate-700">{formatDate(selectedVisa.submittedAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</span>
                                        <span className="text-sm font-medium text-slate-700">{formatDate(selectedVisa.reviewedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Enhanced Stat Card Component
function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
    const icons: Record<string, React.ReactNode> = {
        total: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
        pending: <Clock className="w-4 h-4" />,
        review: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
        approved: <CheckCircle className="w-4 h-4" />,
        rejected: <AlertCircle className="w-4 h-4" />,
        info: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-105 transition-transform duration-200`}>
                    {icons[icon]}
                </div>
                <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
            </div>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <div className={`mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden`}>
                <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`} style={{ width: value > 0 ? '100%' : '0%' }} />
            </div>
        </div>
    )
}
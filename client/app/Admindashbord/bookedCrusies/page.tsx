// 'use client'

// import React, { useState } from 'react'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { PERMISSIONS } from '@/lib/permissionConstants';

// interface BookedCruisies{
//     _id: string
//     userEmail: string
//     userName?: string
//     userNumber?: number
//     status: 'pending' | 'reviewed'
//     createdAt?: string
//     cruisies: string
// }

// export default function BookedCruisiesPage() {
//     return (
//         <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_CRUISES}>
//             <BookedCruisiesPageContent />
//         </ProtectedRoute>
//     );
// }

// const BookedCruisiesPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const queryClient = useQueryClient()

//     const { data: booked = [], isLoading } = useQuery({
//         queryKey: ['bookedCruisies'],
//         queryFn: async () => (await api.cruisies.getAllBooked()).data
//     })


//     const deleteMutation = useMutation({
//         mutationFn: (id: string) => api.cruisies.deleteBooked(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookedCruisies'] })
//     })

//     const changeStatusMutation = useMutation({
//         mutationFn: ({ id, status }: { id: string; status: string }) => api.cruisies.changeStatusBooked(id, status),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookedCruisies'] })
//     })

//     return (
//         <div className="min-h-screen flex bg-white text-black">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Booked Programs" />

//             <div className="flex-1">
//                 <header className="bg-white p-4 flex justify-between">
//                     <h1 className="text-2xl font-bold">Booked Crusies</h1>
//                     <button
//                         onClick={() => setSidebarOpen(true)}
//                         className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
//                     >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                 </header>

//                 <hr className="border-gray-300" />

//                 <div className="m-6 p-6">
//                     <h2 className="text-xl font-bold mb-4">Submitted Booked Crusies ({booked.length})</h2>

//                     {isLoading ? (
//                         <div>Loading...</div>
//                     ) : (
//                         <div className="space-y-4">
//                             {booked.map((f: any) => (
//                                 <div key={f._id} className={`p-4 border rounded flex justify-between items-center ${f.status === 'reviewed' ? 'bg-green-500' : 'bg-yellow-50'}`}>
//                                     <div>
//                                         <div className="font-semibold">{f.userName || f.userEmail}</div>
//                                         <div className="text-sm text-gray-600">{f.userEmail} • {f.userNumber}</div>
//                                         <div className="text-sm text-gray-700 mt-2">Crusie - {f.cruisies?.titleEn} • {f.cruisies?.titleAr}</div>
//                                         <div className="text-sm text-gray-700 mt-2">Massage - {f.message}</div>
//                                         <div className="text-xs text-gray-500">{f.createdAt ? new Date(f.createdAt).toLocaleString() : ''}</div>
//                                         <div className="text-xs text-gray-500">{f.reviewedAt ? new Date(f.reviewedAt).toLocaleString() : ''}</div>
//                                         <div className="text-xs text-gray-500">Reviewed By - {f.reviewedBy?.name}</div>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <button onClick={() => changeStatusMutation.mutate({ id: f._id, status: f.status === 'pending' ? 'reviewed' : 'pending' })} 
//                                         className={` text-white px-3 py-1 rounded ${f.status === 'reviewed' ? 'bg-red-600' : 'bg-green-600'}`}>{f.status === 'pending' ? 'Review' : 'Pending'}</button>
//                                         <button onClick={() => deleteMutation.mutate(f._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
//                                     </div>
//                                 </div>
//                             ))}

//                             {booked.length === 0 && (
//                                 <div className="text-gray-500">No booked programs submitted yet.</div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }


'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/lib/permissionConstants';

import { 
    Ship, 
    User, 
    Mail, 
    Phone, 
    MessageSquare, 
    Clock, 
    CheckCircle2, 
    Trash2, 
    Menu,
    Search,
    Filter
} from 'lucide-react';

// Fixed interface - cruisies can be string (ID) or populated object
interface BookedCruisies{
    _id: string
    userEmail: string
    userName?: string
    userNumber?: number
    status: 'pending' | 'reviewed'
    createdAt?: string
    // cruisies can be either the ObjectId string OR the populated cruise object
    cruisies: string | {
        _id: string
        titleEn?: string
        titleAr?: string
    }
    message?: string
    reviewedAt?: string
    reviewedBy?: {
        _id: string
        name: string
    } | string
}

export default function BookedCruisiesPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_CRUISES}>
            <BookedCruisiesPageContent />
        </ProtectedRoute>
    );
}

const BookedCruisiesPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed'>('all')
    const queryClient = useQueryClient()

    const { data: booked = [], isLoading } = useQuery({
        queryKey: ['bookedCruisies'],
        queryFn: async () => (await api.cruisies.getAllBooked()).data
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.cruisies.deleteBooked(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookedCruisies'] })
    })

    const changeStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => api.cruisies.changeStatusBooked(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookedCruisies'] })
    })

    // Helper to get cruise title safely
    const getCruiseTitle = (cruisies: BookedCruisies['cruisies']): string => {
        if (typeof cruisies === 'string') return '';
        return cruisies?.titleEn || '';
    };

    // Helper to get reviewer name safely
    const getReviewerName = (reviewedBy: BookedCruisies['reviewedBy']): string => {
        if (!reviewedBy) return '';
        if (typeof reviewedBy === 'string') return reviewedBy;
        if (typeof reviewedBy === 'object' && reviewedBy.name) return reviewedBy.name;
        return '';
    };

    // Filter bookings
    const filteredBooked = booked.filter((f: BookedCruisies) => {
        const searchMatch = 
            (f.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (f.userEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (getCruiseTitle(f.cruisies).toLowerCase()).includes(searchTerm.toLowerCase())
        const statusMatch = filterStatus === 'all' || f.status === filterStatus
        return searchMatch && statusMatch
    })

    const stats = {
        total: booked.length,
        pending: booked.filter((b: BookedCruisies) => b.status === 'pending').length,
        reviewed: booked.filter((b: BookedCruisies) => b.status === 'reviewed').length
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Booked Programs" />

            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-xl bg-white/80">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 active:scale-95"
                        >
                            <Menu className="w-5 h-5 text-slate-600" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                                <Ship className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Booked Cruises</h1>
                                <p className="text-xs text-slate-500 font-medium">Manage cruise reservations</p>
                            </div>
                        </div>

                        <div className="w-8" />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard 
                            label="Total Bookings" 
                            value={stats.total} 
                            color="from-slate-500 to-slate-600" 
                            icon={<Ship className="w-4 h-4" />}
                        />
                        <StatCard 
                            label="Pending Review" 
                            value={stats.pending} 
                            color="from-amber-500 to-orange-500" 
                            icon={<Clock className="w-4 h-4" />}
                        />
                        <StatCard 
                            label="Reviewed" 
                            value={stats.reviewed} 
                            color="from-emerald-500 to-teal-600" 
                            icon={<CheckCircle2 className="w-4 h-4" />}
                        />
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <div className="absolute left-3.5 top-3.5 text-slate-400 transition-colors group-focus-within:text-cyan-500">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or cruise..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="relative flex items-center gap-3">
                                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                                    <Filter className="w-5 h-5" />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'reviewed')}
                                    className="flex-1 pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending Review</option>
                                    <option value="reviewed">Reviewed</option>
                                </select>
                                <div className="absolute right-3.5 pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Ship className="w-5 h-5 text-cyan-600" />
                                Submitted Bookings
                                <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                                    {filteredBooked.length}
                                </span>
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <div className="w-8 h-8 border-3 border-slate-200 border-t-cyan-500 rounded-full animate-spin" />
                                <p className="text-slate-500 font-medium">Loading bookings...</p>
                            </div>
                        ) : filteredBooked.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Ship className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600 text-lg font-medium">No bookings found</p>
                                <p className="text-slate-400 mt-1">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredBooked.map((f: BookedCruisies) => (
                                    <div 
                                        key={f._id} 
                                        className={`p-6 hover:bg-slate-50/60 transition-all duration-200 ${
                                            f.status === 'reviewed' ? 'bg-emerald-50/30' : 'bg-amber-50/20'
                                        }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            {/* Left: User Info */}
                                            <div className="flex-1 space-y-4">
                                                {/* User Header */}
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border-2 ${
                                                        f.status === 'reviewed' 
                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                                    }`}>
                                                        {(f.userName || f.userEmail || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-bold text-slate-900">
                                                                {f.userName || 'Unnamed User'}
                                                            </h3>
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                                f.status === 'reviewed'
                                                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                                                            }`}>
                                                                {f.status === 'reviewed' ? (
                                                                    <><CheckCircle2 className="w-3 h-3" /> Reviewed</>
                                                                ) : (
                                                                    <><Clock className="w-3 h-3" /> Pending</>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 flex-wrap">
                                                            <span className="flex items-center gap-1.5">
                                                                <Mail className="w-4 h-4" />
                                                                {f.userEmail}
                                                            </span>
                                                            {f.userNumber && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <Phone className="w-4 h-4" />
                                                                    {f.userNumber}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Cruise Info */}
                                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Ship className="w-4 h-4 text-cyan-600" />
                                                        <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Cruise Details</span>
                                                    </div>
                                                    <p className="font-semibold text-slate-900">
                                                        {typeof f.cruisies === 'object' ? f.cruisies?.titleEn : 'Loading...'}
                                                        {typeof f.cruisies === 'object' && f.cruisies?.titleAr && (
                                                            <span className="text-slate-500 font-normal"> • {f.cruisies.titleAr}</span>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Message */}
                                                {f.message && (
                                                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MessageSquare className="w-4 h-4 text-slate-500" />
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</span>
                                                        </div>
                                                        <p className="text-sm text-slate-700 italic">"{f.message}"</p>
                                                    </div>
                                                )}

                                                {/* Timestamps & Reviewer */}
                                                <div className="flex flex-col gap-2 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="w-4 h-4" />
                                                        Submitted: {f.createdAt ? new Date(f.createdAt).toLocaleString() : 'N/A'}
                                                    </span>
                                                    {f.reviewedAt && (
                                                        <span className="flex items-center gap-1.5 text-emerald-600">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Reviewed: {new Date(f.reviewedAt).toLocaleString()}
                                                            {getReviewerName(f.reviewedBy) && (
                                                                <span className="text-slate-500 ml-1">
                                                                    by {getReviewerName(f.reviewedBy)}
                                                                </span>
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                                                <button 
                                                    onClick={() => changeStatusMutation.mutate({ id: f._id, status: f.status === 'pending' ? 'reviewed' : 'pending' })} 
                                                    disabled={changeStatusMutation.isPending}
                                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                                                        f.status === 'reviewed'
                                                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                                                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {changeStatusMutation.isPending ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : f.status === 'pending' ? (
                                                        <><CheckCircle2 className="w-4 h-4" /> Mark Reviewed</>
                                                    ) : (
                                                        <><Clock className="w-4 h-4" /> Mark Pending</>
                                                    )}
                                                </button>
                                                
                                                <button 
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this booking?')) {
                                                            deleteMutation.mutate(f._id)
                                                        }
                                                    }}
                                                    disabled={deleteMutation.isPending}
                                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deleteMutation.isPending ? (
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <><Trash2 className="w-4 h-4" /> Delete</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Stat Card Component
function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg transform group-hover:scale-105 transition-transform duration-200`}>
                    {icon}
                </div>
                <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
            </div>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500`} style={{ width: value > 0 ? '100%' : '0%' }} />
            </div>
        </div>
    )
}
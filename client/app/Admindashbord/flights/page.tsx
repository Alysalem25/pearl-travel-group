// 'use client'

// import React, { useState } from 'react'
// import Link from 'next/link'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { PERMISSIONS } from '@/lib/permissionConstants';

// type Reviewer = {
//     _id: string
//     name: string
// }

// interface Flight {
//     _id: string
//     userEmail: string
//     userName?: string
//     userNumber?: number
//     from?: string
//     to?: string
//     status: 'pending' | 'reviewed'
//     createdAt?: string
//     reviewedBy?: Reviewer | string | null
// }

// export default function FlightsPage() {
//     return (
//         <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_FLIGHTS}>
//             <FlightsPageContent />
//         </ProtectedRoute>
//     );
// }

// const FlightsPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [reviewedBy, setReviewedBy] = useState<Record<string, string>>({});
//     const queryClient = useQueryClient()

//     const { data: flights = [], isLoading } = useQuery({
//         queryKey: ['flights'],
//         queryFn: async () => (await api.flights.getAll()).data
//     })

//     const deleteMutation = useMutation({
//         mutationFn: (id: string) => api.flights.delete(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] })
//     })

//     const changeStatusMutation = useMutation({
//         mutationFn: ({ id, status }: { id: string; status: string}) => api.flights.changeStatus(id, status),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] })
//     })

//     return (
//         <div className="min-h-screen flex bg-white text-black">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Flights" />

//             <div className="flex-1">
//                 <header className="bg-white p-4 flex justify-between">
//                     <h1 className="text-2xl font-bold">Flights</h1>
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
//                     <h2 className="text-xl font-bold mb-4">Submitted Flights ({flights.length})</h2>

//                     {isLoading ? (
//                         <div>Loading...</div>
//                     ) : (
//                         <div className="space-y-4">
//                             {flights.map((f: Flight) => (
//                                 <div key={f._id} className={`p-4 border rounded flex justify-between items-center ${f.status === 'reviewed' ? 'bg-green-500' : 'bg-yellow-50'}`}>
//                                     <div>
//                                         <div className="font-semibold">{f.userName || f.userEmail}</div>
//                                         <div className="text-sm text-gray-600">{f.userEmail} • {f.userNumber}</div>
//                                         <div className="text-sm text-gray-700 mt-2">From: <span className="font-medium">{f.from || '—'}</span> — To: <span className="font-medium">{f.to || '—'}</span></div>
//                                         <div className="text-xs text-gray-500">{f.createdAt ? new Date(f.createdAt).toLocaleString() : ''}</div>
//                                         {f.status === "reviewed" && (
//                                             <div className="text-xs text-green-600">
//                                                 {f.reviewedBy && typeof f.reviewedBy === 'object' && '_id' in f.reviewedBy ? (
//                                                     <Link href={`/Admindashbord/users/${(f.reviewedBy as Reviewer)._id}`}>
//                                                         Reviewed by: {(f.reviewedBy as Reviewer).name}
//                                                     </Link>
//                                                 ) : (
//                                                     <>Reviewed by: {typeof f.reviewedBy === 'string' ? f.reviewedBy : 'Unknown'}</>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="flex gap-2">
                              
                                        
//                                             <button type='submit' onClick={() => changeStatusMutation.mutate({
//                                                 id: f._id,
//                                                 status: f.status === "pending" ? "reviewed" : "pending",
//                                             })}
//                                                 className={` text-white px-3 py-1 rounded ${f.status === 'reviewed' ? 'bg-red-600' : 'bg-green-600'}`}>{f.status === 'reviewed' ? 'Pending' : 'Review'}</button>

//                                         <button onClick={() => deleteMutation.mutate(f._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
//                                     </div>
//                                 </div>
//                             ))}

//                             {flights.length === 0 && (
//                                 <div className="text-gray-500">No flights submitted yet.</div>
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
import Link from 'next/link'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/lib/permissionConstants';

type Reviewer = {
    _id: string
    name: string
}

interface Flight {
    _id: string
    userEmail: string
    userName?: string
    userNumber?: number
    from?: string
    to?: string
    status: 'pending' | 'reviewed'
    createdAt?: string
    reviewedBy?: Reviewer | string | null
}

export default function FlightsPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_FLIGHTS}>
            <FlightsPageContent />
        </ProtectedRoute>
    );
}

const FlightsPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [reviewedBy, setReviewedBy] = useState<Record<string, string>>({});
    const queryClient = useQueryClient()

    const { data: flights = [], isLoading } = useQuery({
        queryKey: ['flights'],
        queryFn: async () => (await api.flights.getAll()).data
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.flights.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] })
    })

    const changeStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string}) => api.flights.changeStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['flights'] })
    })

    // Status badge colors
    const getStatusColor = (status: string) => {
        return status === 'reviewed' 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-amber-100 text-amber-800 border-amber-200'
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Flights" />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Modern Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Flight Bookings</h1>
                            <p className="text-sm text-gray-500">Manage and review submitted flight requests</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                            Total: <span className="font-semibold text-gray-900">{flights.length}</span>
                        </span>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-900">{flights.length}</p>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pending Review</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {flights.filter((f: Flight) => f.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Reviewed</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {flights.filter((f: Flight) => f.status === 'reviewed').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Flights List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Submitted Flights
                                    <span className="bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
                                        {flights.length}
                                    </span>
                                </h2>
                            </div>

                            {isLoading ? (
                                <div className="p-12 flex items-center justify-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading flights...
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {flights.length === 0 ? (
                                        <div className="p-12 text-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 font-medium">No flights submitted yet</p>
                                            <p className="text-sm text-gray-400 mt-1">Flight bookings will appear here when customers submit requests</p>
                                        </div>
                                    ) : (
                                        flights.map((f: Flight) => (
                                            <div key={f._id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                    {/* Left: Flight Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">
                                                                {f.userName || f.userEmail}
                                                            </h3>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(f.status)}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${f.status === 'reviewed' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                                {f.status === 'reviewed' ? 'Reviewed' : 'Pending'}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                                {f.userEmail}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                                {f.userNumber || '—'}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                {f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-US', { 
                                                                    year: 'numeric', 
                                                                    month: 'short', 
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                }) : '—'}
                                                            </span>
                                                        </div>

                                                        {/* Route Info */}
                                                        <div className="flex items-center gap-3 text-sm mb-2">
                                                            <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                                                                {f.from || '—'}
                                                            </span>
                                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                            </svg>
                                                            <span className="font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                                                                {f.to || '—'}
                                                            </span>
                                                        </div>

                                                        {/* Reviewed By */}
                                                        {f.status === "reviewed" && f.reviewedBy && (
                                                            <div className="text-sm">
                                                                <span className="text-gray-500">Reviewed by: </span>
                                                                {typeof f.reviewedBy === 'object' && '_id' in f.reviewedBy ? (
                                                                    <Link 
                                                                        href={`/Admindashbord/users/${(f.reviewedBy as Reviewer)._id}`}
                                                                        className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                                                                    >
                                                                        {(f.reviewedBy as Reviewer).name}
                                                                    </Link>
                                                                ) : (
                                                                    <span className="text-gray-700 font-medium">
                                                                        {typeof f.reviewedBy === 'string' ? f.reviewedBy : 'Unknown'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => changeStatusMutation.mutate({
                                                                id: f._id,
                                                                status: f.status === "pending" ? "reviewed" : "pending",
                                                            })}
                                                            disabled={changeStatusMutation.isPending}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                                                f.status === 'reviewed' 
                                                                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                        >
                                                            {changeStatusMutation.isPending ? (
                                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.status === 'reviewed' ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"} />
                                                                </svg>
                                                            )}
                                                            {f.status === 'reviewed' ? 'Mark Pending' : 'Mark Reviewed'}
                                                        </button>

                                                        <button 
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this flight booking?')) {
                                                                    deleteMutation.mutate(f._id)
                                                                }
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
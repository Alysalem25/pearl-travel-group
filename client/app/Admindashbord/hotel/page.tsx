'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/lib/permissionConstants';

interface Hotel {
    _id: string
    userEmail: string
    userName?: string
    userPhone?: string
    remarks?: string
    country?: string
    city?: string
    hotelName?: string
    fromDate?: string
    toDate?: string
    adults?: number
    children?: number
    childrenAges?: number[]
    infants?: number
    status: 'pending' | 'reviewed'
    createdAt?: string
    reviewedBy?: { _id: string; name: string }
}

export default function HotelsPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_HOTELS}>
            <HotelsPageContent />
        </ProtectedRoute>
    );
}

const HotelsPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    // const [reviewedBy, setReviewedBy] = useState<Record<string, string>>({});
    const queryClient = useQueryClient()

    const { data: hotels = [], isLoading } = useQuery({
        queryKey: ['hotels'],
        queryFn: async () => (await api.hotelBooking.getAll()).data
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.hotelBooking.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hotels'] })
    })

    const changeStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => api.hotelBooking.changeStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['hotels'] })
    })

    return (
        <div className="min-h-screen flex bg-white text-black">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Hotels" />

            <div className="flex-1">
                <header className="bg-white p-4 flex justify-between">
                    <h1 className="text-2xl font-bold">Hotels</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </header>

                <hr className="border-gray-300" />

                <div className="m-6 p-6">
                    <h2 className="text-xl font-bold mb-4">Submitted Hotels ({hotels.length})</h2>

                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {hotels.map((h: Hotel) => (
                                <div key={h._id} className={`p-4 border rounded ${h.status === 'reviewed' ? 'bg-green-100' : 'bg-yellow-50'}`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="font-semibold text-lg">{h.userName || h.userEmail}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                <span>Email: {h.userEmail}</span>
                                                {h.userPhone && <span> • Phone: {h.userPhone}</span>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 text-right">
                                            {h.createdAt ? new Date(h.createdAt).toLocaleString() : ''}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                                        <div>
                                            <span className="text-gray-600 font-medium">Hotel Location:</span>
                                            <div className="text-gray-800">
                                                {h.hotelName && <div>{h.hotelName}</div>}
                                                {(h.city || h.country) && (
                                                    <div className="text-gray-700">
                                                        {h.city}{h.city && h.country ? ', ' : ''}{h.country}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Dates:</span>
                                            <div className="text-gray-800">
                                                {h.fromDate && h.toDate ? (
                                                    <>
                                                        <div>{new Date(h.fromDate).toLocaleDateString()} to {new Date(h.toDate).toLocaleDateString()}</div>
                                                    </>
                                                ) : '—'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-3 text-sm border-t pt-2">
                                        <div>
                                            <span className="text-gray-600 font-medium">Adults:</span>
                                            <div className="text-gray-800">{h.adults || 0}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Children:</span>
                                            <div className="text-gray-800">{h.children || 0}</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600 font-medium">Infants:</span>
                                            <div className="text-gray-800">{h.infants || 0}</div>
                                        </div>
                                    </div>

                                    {h.remarks && (
                                        <div className="mb-3 text-sm border-t pt-2">
                                            <span className="text-gray-600 font-medium">Remarks:</span>
                                            <div className="text-gray-800">{h.remarks}</div>
                                        </div>
                                    )}

                                    {h.status === "reviewed" && (
                                        <div className="text-xs text-green-700 mb-2 border-t pt-2">
                                            <span className="font-medium">Reviewed by:</span> {h.reviewedBy?.name}
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-2 border-t pt-3">
                                        <button onClick={() => {
                                            changeStatusMutation.mutate({
                                                id: h._id,
                                                status: h.status === "pending" ? "reviewed" : "pending",
                                            });
                                            alert("Status changed successfully");
                                        }}
                                            className={`text-white px-3 py-1 rounded ${h.status === 'reviewed' ? 'bg-red-600' : 'bg-green-600'}`}>
                                            {h.status === 'reviewed' ? 'Mark Pending' : 'Mark Reviewed'}
                                        </button>

                                        <button onClick={() => deleteMutation.mutate(h._id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                                    </div>
                                </div>
                            ))}

                            {hotels.length === 0 && (
                                <div className="text-gray-500">No hotels submitted yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
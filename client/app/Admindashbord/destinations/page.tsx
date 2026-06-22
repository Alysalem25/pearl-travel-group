'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PERMISSIONS } from '@/lib/permissionConstants'

interface Destination {
    _id: string
    contry: string
    city: string
    hotelName: string
    note?: string
    createdAt?: string
}

interface DestinationForm {
    contry: string
    city: string
    hotelName: string
    note: string
}

const emptyForm: DestinationForm = { contry: '', city: '', hotelName: '', note: '' }

export default function DestinationsPage() {
    return (
        <ProtectedRoute requiredPermission={""}>
            <DestinationsPageContent />
        </ProtectedRoute>
    )
}

const DestinationsPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [form, setForm] = useState<DestinationForm>(emptyForm)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const queryClient = useQueryClient()

    const { data: destinations = [], isLoading } = useQuery({
        queryKey: ['destinations'],
        queryFn: async () => (await api.destination.getAll()).data,
    })

    const createMutation = useMutation({
        mutationFn: (data: DestinationForm) => api.destination.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['destinations'] })
            resetForm()
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: DestinationForm }) =>
            api.destination.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['destinations'] })
            resetForm()
        },
    })

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (d: Destination) => {
        setForm({ contry: d.contry, city: d.city, hotelName: d.hotelName, note: d.note || '' })
        setEditingId(d._id)
        setShowForm(true)
    }

    const handleSubmit = () => {
        if (!form.contry || !form.city || !form.hotelName) {
            alert('Country, city, and hotel name are required.')
            return
        }
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: form })
        } else {
            createMutation.mutate(form)
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <div className="min-h-screen flex bg-white text-black">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Destinations" />

            <div className="flex-1">
                <header className="bg-white p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Destinations</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { resetForm(); setShowForm(true) }}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium"
                        >
                            + Add Destination
                        </button>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </header>

                <hr className="border-gray-300" />

                <div className="m-6 p-6">

                    {/* ── Add / Edit Form ── */}
                    {showForm && (
                        <div className="mb-6 p-5 border rounded bg-gray-50">
                            <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Destination' : 'Add New Destination'}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                    <input
                                        type="text"
                                        value={form.contry}
                                        onChange={e => setForm(f => ({ ...f, contry: e.target.value }))}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Egypt"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                    <input
                                        type="text"
                                        value={form.city}
                                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Cairo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                                    <input
                                        type="text"
                                        value={form.hotelName}
                                        onChange={e => setForm(f => ({ ...f, hotelName: e.target.value }))}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Marriott Cairo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                                    <input
                                        type="text"
                                        value={form.note}
                                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Optional note"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isPending}
                                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
                                >
                                    {isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                </button>
                                <button
                                    onClick={resetForm}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── List ── */}
                    <h2 className="text-xl font-bold mb-4">All Destinations ({destinations.length})</h2>

                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="space-y-4">
                            {destinations.map((d: Destination) => (
                                <div key={d._id} className="p-4 border rounded bg-blue-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-semibold text-lg">{d.hotelName}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {d.city}, {d.contry}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 text-right">
                                            {d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}
                                        </div>
                                    </div>

                                    {d.note && (
                                        <div className="text-sm text-gray-700 border-t pt-2 mt-2">
                                            <span className="font-medium text-gray-600">Note:</span> {d.note}
                                        </div>
                                    )}

                                    <div className="flex gap-2 border-t pt-3 mt-3">
                                        <button
                                            onClick={() => handleEdit(d)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {destinations.length === 0 && (
                                <div className="text-gray-500">No destinations added yet.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

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

// Fixed interface - mices can be string (ID) or populated object
interface Mice {
    _id: string
    firstName: string
    lastName: string
    email: string
    number?: string
    organization: string
    jobFunction: string
    nationality: string
    numOfGuests: number
    dateFrom: string
    dateTo: string
    destination: string
    remarks?: string
    status: 'pending' | 'reviewed'
    createdAt?: string
    reviewedAt?: string
    reviewedBy?: {
        _id: string
        name: string
    } | string
}

export default function BookedMicesPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_BOOKED_MICE}>
            <MicePageContent />
        </ProtectedRoute>
    );
}

const MicePageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed'>('all')
    const queryClient = useQueryClient()

    const { data: mices = [], isLoading } = useQuery({
        queryKey: ['mices'],
        queryFn: async () => (await api.mice.getAll()).data,
    })


   
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.mice.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mices'] })
    })

    const changeStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => api.mice.changeStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mices'] })
    })



    // Helper to get reviewer name safely
    const getReviewerName = (reviewedBy: Mice['reviewedBy']): string => {
        if (!reviewedBy) return '';
        if (typeof reviewedBy === 'string') return reviewedBy;
        if (typeof reviewedBy === 'object' && reviewedBy.name) return reviewedBy.name;
        return '';
    };

    // Filter bookings
    const filteredMices = mices.filter((f: Mice) => {
        const searchMatch =
            (f.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (f.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (f.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        const statusMatch = filterStatus === 'all' || f.status === filterStatus
        return searchMatch && statusMatch
    })

    const stats = {
        total: mices.length,
        pending: mices.filter((m: Mice) => m.status === 'pending').length,
        reviewed: mices.filter((m: Mice) => m.status === 'reviewed').length
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Booked Mice" />

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
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight"> Mices</h1>
                                <p className="text-xs text-slate-500 font-medium">Manage mouse reservations</p>
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
                                    placeholder="Search by name, email, or destination..."
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
                                    {filteredMices.length}
                                </span>
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <div className="w-8 h-8 border-3 border-slate-200 border-t-cyan-500 rounded-full animate-spin" />
                                <p className="text-slate-500 font-medium">Loading bookings...</p>
                            </div>
                        ) : filteredMices.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Ship className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600 text-lg font-medium">No bookings found</p>
                                <p className="text-slate-400 mt-1">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {filteredMices.map((f: Mice) => (
                                    <div
                                        key={f._id}
                                        className={`p-6 hover:bg-slate-50/60 transition-all duration-200 ${f.status === 'reviewed' ? 'bg-emerald-50/30' : 'bg-amber-50/20'
                                            }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            {/* Left: User Info */}
                                            <div className="flex-1 space-y-4">
                                                {/* User Header */}
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border-2 ${f.status === 'reviewed'
                                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                                        }`}>
                                                        {(f.firstName || f.email || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-lg font-bold text-slate-900">
                                                                {f.firstName || 'Unnamed User'}
                                                            </h3>
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${f.status === 'reviewed'
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
                                                                {f.email}
                                                            </span>
                                                            {f.number && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <Phone className="w-4 h-4" />
                                                                    {f.number}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* mice Info */}
                                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Ship className="w-4 h-4 text-cyan-600" />
                                                        <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Mice Details</span>
                                                    </div>
                                                    <p className="font-semibold text-slate-900">
                                                            <span className="text-slate-500 font-normal">{f.jobFunction} • {f.nationality}</span>
                                                    </p>
                                                </div>

                                                {/* Message */}
                                                {f.remarks && (
                                                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <MessageSquare className="w-4 h-4 text-slate-500" />
                                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</span>
                                                        </div>
                                                        <p className="text-sm text-slate-700 italic">"{f.remarks}"</p>
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
                                                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${f.status === 'reviewed'
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
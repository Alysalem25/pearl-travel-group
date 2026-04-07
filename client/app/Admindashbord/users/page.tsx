'use client'

import React, { useState } from 'react'
import axios from 'axios'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient, { api } from '@/lib/api'
import { User, ChevronRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { img, s } from 'framer-motion/client'
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/lib/permissionConstants';
import Link from 'next/link'


interface User {
    _id: string
    name: string
    email: string
    password: string
    number?: string
    role: string
    images: string[]
    inTeam: boolean
    roleInTeam: string
    workStatus?: string
}

export default function UsersPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
            <UsersPageContent />
        </ProtectedRoute>
    )
}

const UsersPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')
    const [workStatusFilter, setWorkStatusFilter] = React.useState<string>('') // New filter
    const [showForm, setShowForm] = React.useState(false)
    const [editingUser, setEditingUser] = React.useState<User | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        number: '',
        role: '',
        images: '',
        inTeam: false,
        roleInTeam: '',
        workStatus: 'active', // New field
    })
    const [clientInfo, setClientInfo] = React.useState({
        nationalId: '',
        passportNumber: '',
        address: '',
        note: ''
    })
    const [permissions, setPermissions] = React.useState<string[]>([])

    const { register, isAuthenticated } = useAuth();

    const queryClient = useQueryClient()

    // Fetch Data
    const { data: drivers = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await apiClient.get('/auth/users')
            // console.log('Fetched users:', response.data)
            return response.data.users || response.data
        }
    })

    // Mutations
    const addUserMutation = useMutation({
        mutationFn: async (newUser: FormData) => {
            return api.auth.register(newUser)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            resetForm()
            alert('User added successfully!')
        },
        onError: (err: any) => {
            console.error(err)
            alert(err.response?.data?.error || 'Error adding user.')
        }
    })


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const newUser = new FormData()
            newUser.append('name', formData.name)
            newUser.append('email', formData.email)
            newUser.append('password', formData.password)
            newUser.append('number', formData.number)
            newUser.append('role', formData.role)
            newUser.append('inTeam', String(formData.inTeam))
            newUser.append('roleInTeam', formData.roleInTeam)
            newUser.append('workStatus', formData.workStatus) // Add workStatus
            newUser.append('clientInfo', JSON.stringify(clientInfo))
            newUser.append('permissions', JSON.stringify(permissions))
            if (images.length > 0) newUser.append('images', images[0]);
            await addUserMutation.mutateAsync(newUser)

            // await api.auth.register(newUser)

        } catch (err: any) { // Error is handled in onError callback 
            console.error(err)
            alert(err.response?.data?.message || 'Error adding user.')
        }
    }


    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            number: '',
            role: '',
            inTeam: false,
            images: '',
            roleInTeam: '',
            workStatus: 'active',
        })
        setClientInfo({ nationalId: '', passportNumber: '', address: '', note: '' })
        setPermissions([])
        setPreviewImages([])
        setEditingUser(null)
        setShowForm(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const file = e.target.files[0]
        if (!file) return

        setImages([file])
        setPreviewImages([URL.createObjectURL(file)])
    }

    const removePreviewImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    }


    // Filter users based on search term and workStatus
    const filteredUsers = drivers.filter((User: User) =>
        (searchTerm === '' ||
            User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            User.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (User.number || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
        (workStatusFilter === '' || User.workStatus === workStatusFilter)
    )


    const deleteUser = async (user_id: string) => {
        try {
            await apiClient.delete(`/auth/deleteUser/${user_id}`);
            queryClient.invalidateQueries({ queryKey: ['users'] as const });
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    return (
        <div className="min-h-screen flex bg-white text-black">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="users" />

            <div className="flex-1 overflow-y-auto bg-white">
                {/* Header */}
                <header className="bg-white  shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">users Management</h1>
                        </div>


                        <div className="flex items-center gap-4">

                            <button
                                onClick={() => { setShowForm(!showForm) }}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                {showForm ? 'Cancel' : 'Add User'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Search Bar and Filters */}
                <div className="p-4 m-6 dark:bg-gray-200 text-black ">
                    <div className="mb-3 flex gap-3 flex-wrap">
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="border p-2 rounded bg-white text-black flex-1 min-w-48"
                        />
                        <select
                            value={workStatusFilter}
                            onChange={e => setWorkStatusFilter(e.target.value)}
                            className="border p-2 rounded bg-white text-black"
                        >
                            <option value="">All Work Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                    <span className="">
                        {filteredUsers.length} of {drivers.length} users
                    </span>
                </div>

                {showForm && (
                    <div className="bg-gray-200 m-6 p-6 rounded-lg mb-6">
                        <h2 className="text-xl font-semibold mb-3 text-black">Add User</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    required
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="border p-2 rounded bg-white text-black"
                                />
                                <input
                                    type="email"
                                    required
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="border p-2 rounded bg-white text-black"
                                />
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="border p-2 rounded bg-white text-black"
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Phone Number"
                                    value={formData.number}
                                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                                    className="border p-2 rounded bg-white text-black"
                                />
                                {/* role option */}
                                <select
                                    required
                                    value={formData.role}
                                    onChange={e => {
                                        setFormData({ ...formData, role: e.target.value }),
                                        setPermissions(['add_program', 'edit_program', 'delete_program',
                                            'add_country', 'edit_country', 'delete_country',
                                            'add_category', 'edit_category', 'delete_category',
                                            'add_cruise', 'edit_cruise', 'delete_cruise',
                                            'manage_users', 'manage_visa',
                                            'manage_booked_flights',
                                            'manage_booked_programs',
                                            'manage_booked_transportation',
                                            'manage_booked_hotels',
                                            'manage_booked_cruises'])
                                    }}
                                    className="border p-2 rounded bg-white text-black"
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="head">Head</option>
                                    <option value="user">User</option>
                                </select>

                                {/* workStatus option */}
                                <select
                                    value={formData.workStatus}
                                    onChange={e => setFormData({ ...formData, workStatus: e.target.value })}
                                    className="border p-2 rounded bg-white text-black"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="pending">Pending</option>
                                    <option value="suspended">Suspended</option>
                                </select>

                                {/* dynamic fields */}
                                {formData.role === 'user' && (
                                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded border border-gray-300">
                                        <input type="text" placeholder="National ID" value={clientInfo.nationalId} onChange={e => setClientInfo({ ...clientInfo, nationalId: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black" />
                                        <input type="text" placeholder="Passport Number" value={clientInfo.passportNumber} onChange={e => setClientInfo({ ...clientInfo, passportNumber: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black" />
                                        <input type="text" placeholder="Address" value={clientInfo.address} onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black" />
                                        {/* <input type="textarr" placeholder="Add details" value={clientInfo.note} onChange={e => setClientInfo({ ...clientInfo, note: e.target.value })}
                                         className="border border-gray-400 p-2 rounded bg-white text-black" /> */}
                                        <textarea placeholder="Add details" value={clientInfo.note} onChange={e => setClientInfo({ ...clientInfo, note: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black">


                                        </textarea>
                                    </div>
                                )}

                                {formData.role === 'head' && (
                                    <div className="col-span-1 md:col-span-2 p-4 bg-gray-100 rounded border border-gray-300">
                                        <h3 className="font-semibold mb-3 text-black">Permissions:</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {[
                                                { label: 'Add Program', value: 'add_program' },
                                                { label: 'Edit Program', value: 'edit_program' },
                                                { label: 'Delete Program', value: 'delete_program' },
                                                { label: 'Add Country', value: 'add_country' },
                                                { label: 'Edit Country', value: 'edit_country' },
                                                { label: 'Delete Country', value: 'delete_country' },
                                                { label: 'Add Category', value: 'add_category' },
                                                { label: 'Edit Category', value: 'edit_category' },
                                                { label: 'Delete Category', value: 'delete_category' },
                                                { label: 'Add Crouises', value: 'add_cruise' },
                                                { label: 'Edit Crouises', value: 'edit_cruise' },
                                                { label: 'Delete Crouises', value: 'delete_cruise' },
                                                { label: 'Manage Users', value: 'manage_users' },
                                                { label: 'Manage Visa', value: 'manage_visa' },
                                                { label: 'Manage Booked Flights', value: 'manage_booked_flights' },
                                                { label: 'Manage Booked Programs', value: 'manage_booked_programs' },
                                                { label: 'Manage Booked Transportation', value: 'manage_booked_transportation' },
                                                { label: 'Manage Booked Hotels', value: 'manage_booked_hotels' },
                                                { label: 'Manage Booked Cruises', value: 'manage_booked_cruises' }
                                            ].map(perm => (
                                                <label key={perm.value} className="flex items-center gap-2 text-black cursor-pointer hover:bg-gray-200 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-4 w-4 text-blue-600"
                                                        checked={permissions.includes(perm.value)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setPermissions([...permissions, perm.value])
                                                            else setPermissions(permissions.filter(p => p !== perm.value))
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium">{perm.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* inTeam  */}
                                <label className="flex items-center gap-2 text-black">
                                    <input
                                        type="checkbox"
                                        checked={formData.inTeam}
                                        onChange={e => setFormData({ ...formData, inTeam: e.target.checked })}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    In Team
                                </label>

                                {/* roleInTeam  */}
                                {formData.inTeam && <label className="flex items-center gap-2 text-black">
                                    <input
                                        type="text"
                                        value={formData.roleInTeam}
                                        onChange={e => setFormData({ ...formData, roleInTeam: e.target.value })}
                                        className="border p-2 rounded bg-white text-black"
                                    />
                                    Role In Team
                                </label>}

                                {/* image upload */}
                                <div className="mt-2">
                                    <label className="block text-gray-400 mb-1">Profile Image</label>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />


                                    {previewImages && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {previewImages.map((src, i) => (
                                                <div key={i} className="relative">
                                                    <img src={src} className="rounded h-32 object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePreviewImage(i)}
                                                        className="absolute top-1 right-1 bg-red-600 px-2 text-xs rounded"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 border border-gray-600 text-black  rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                                    disabled={addUserMutation.isPending}
                                >
                                    {addUserMutation.isPending ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Drivers List */}
                <div className="bg-gray-200 p-4 m-6 rounded text-black">
                    <h2 className="text-lg font-semibold mb-3 ">All Users</h2>

                    <div className="space-y-4">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <p>{searchTerm ? 'No users found matching your search.' : 'No users found.'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredUsers.map((user: User) => (
                                    <div key={user._id} className="border border-gray-700 p-4 rounded bg-white hover:bg-gray-300 transition">
                                        <div className="flex items-start justify-between">
                                            <img
                                                src={user.images
                                                    ? `${user.images[0]}`
                                                    : '/default-profile.png'}

                                                alt={user.name}
                                                className="h-16 w-16 rounded-full object-cover mr-4"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-black">{user.name}</h3>
                                                <div className="mt-2 space-y-1">
                                                    <p className="text-black text-sm">
                                                        <span className="font-semibold">Email:</span> {user.email}
                                                    </p>
                                                    {user.number && (
                                                        <p className="text-black text-sm">
                                                            <span className="font-semibold">Number:</span> {user.number}
                                                        </p>
                                                    )}
                                                    {/* Work Status Badge */}
                                                    <div className="mt-2">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.workStatus === 'active' ? 'bg-green-200 text-green-800' :
                                                                user.workStatus === 'inactive' ? 'bg-gray-200 text-gray-800' :
                                                                    user.workStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                                                                        user.workStatus === 'suspended' ? 'bg-red-200 text-red-800' :
                                                                            'bg-gray-200 text-gray-800'
                                                            }`}>
                                                            {user.workStatus || 'active'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex gap-2">
                                                    {/* <Link href={`/Admindashbord/users/${user._id}`}>
                                                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-2">
                                                            View Details
                                                            <ChevronRight size={16} />
                                                        </button>
                                                    </Link> */}
                                                    <button onClick={() => deleteUser(user._id)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >Delete</button>
                                                </div>
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

// export default UsersPage
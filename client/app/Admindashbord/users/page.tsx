// 'use client'

// import React, { useState } from 'react'
// import axios from 'axios'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import apiClient, { api } from '@/lib/api'
// import { UserIcon, ChevronRight } from 'lucide-react'
// import { useAuth } from '@/context/AuthContext'
// import { img, s } from 'framer-motion/client'
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { PERMISSIONS } from '@/lib/permissionConstants';
// import Link from 'next/link'


// interface User {
//     _id: string
//     name: string
//     email: string
//     password: string
//     number?: string
//     role: string
//     images: string[]
//     inTeam: boolean
//     roleInTeam: string
//     workStatus?: string
// }

// export default function UsersPage() {
//     return (
//         <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
//             <UsersPageContent />
//         </ProtectedRoute>
//     )
// }

// const UsersPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = React.useState(false)
//     const [searchTerm, setSearchTerm] = React.useState('')
//     const [workStatusFilter, setWorkStatusFilter] = React.useState<string>('') // New filter
//     const [showForm, setShowForm] = React.useState(false)
//     const [editingUser, setEditingUser] = React.useState<User | null>(null)
//     const [images, setImages] = useState<File[]>([])
//     const [previewImages, setPreviewImages] = useState<string[]>([])
//     const [formData, setFormData] = React.useState({
//         name: '',
//         email: '',
//         password: '',
//         number: '',
//         role: '',
//         images: '',
//         inTeam: false,
//         roleInTeam: '',
//         workStatus: 'active', // New field
//     })
//     const [clientInfo, setClientInfo] = React.useState({
//         nationalId: '',
//         passportNumber: '',
//         address: '',
//         note: ''
//     })
//     const [permissions, setPermissions] = React.useState<string[]>([])

//     const { register, isAuthenticated } = useAuth();

//     const queryClient = useQueryClient()

//     // Fetch Data
//     const { data: drivers = [], isLoading } = useQuery({
//         queryKey: ['users'],
//         queryFn: async () => {
//             const response = await apiClient.get('/auth/users')
//             console.log('Fetched users:', response.data)
//             return response.data.users || response.data
//         }
//     })

//     // Mutations
//     const addUserMutation = useMutation({
//         mutationFn: async (newUser: FormData) => {
//             return api.auth.register(newUser)
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['users'] })
//             resetForm()
//             alert('User added successfully!')
//         },
//         onError: (err: any) => {
//             console.error(err)
//             alert(err.response?.data?.error || 'Error adding user.')
//         }
//     })


//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         try {
//             const newUser = new FormData()
//             newUser.append('name', formData.name)
//             newUser.append('email', formData.email)
//             newUser.append('password', formData.password)
//             newUser.append('number', formData.number)
//             newUser.append('role', formData.role)
//             newUser.append('inTeam', String(formData.inTeam))
//             newUser.append('roleInTeam', formData.roleInTeam)
//             newUser.append('workStatus', formData.workStatus) // Add workStatus
//             newUser.append('clientInfo', JSON.stringify(clientInfo))
//             newUser.append('permissions', JSON.stringify(permissions))
//             if (images.length > 0) newUser.append('images', images[0]);
//             await addUserMutation.mutateAsync(newUser)

//             // await api.auth.register(newUser)

//         } catch (err: any) { // Error is handled in onError callback 
//             console.error(err)
//             alert(err.response?.data?.message || 'Error adding user.')
//         }
//     }


//     const resetForm = () => {
//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             number: '',
//             role: '',
//             inTeam: false,
//             images: '',
//             roleInTeam: '',
//             workStatus: 'active',
//         })
//         setClientInfo({ nationalId: '', passportNumber: '', address: '', note: '' })
//         setPermissions([])
//         setPreviewImages([])
//         setEditingUser(null)
//         setShowForm(false)
//     }

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return

//         const file = e.target.files[0]
//         if (!file) return

//         setImages([file])
//         setPreviewImages([URL.createObjectURL(file)])
//     }

//     const removePreviewImage = (index: number) => {
//         setImages((prev) => prev.filter((_, i) => i !== index))
//         setPreviewImages((prev) => prev.filter((_, i) => i !== index))
//     }


//     // Filter users based on search term and workStatus
//     const filteredUsers = drivers.filter((User: User) =>
//         (searchTerm === '' ||
//             User.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             User.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             (User.number || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
//         (workStatusFilter === '' || User.workStatus === workStatusFilter)
//     )


//     const deleteUser = async (user_id: string) => {
//         try {
//             await apiClient.delete(`/auth/deleteUser/${user_id}`);
//             queryClient.invalidateQueries({ queryKey: ['users'] as const });
//             alert('User deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             alert('Failed to delete user.');
//         }
//     };

//     return (
//         <div className="min-h-screen flex bg-white text-black">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="users" />

//             <div className="flex-1 overflow-y-auto bg-white">
//                 {/* Header */}
//                 <header className="bg-white  shadow-sm border-b border-gray-200 dark:border-gray-700">
//                     <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
//                         <div className="flex items-center">
//                             <button
//                                 onClick={() => setSidebarOpen(true)}
//                                 className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
//                             >
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                                 </svg>
//                             </button>
//                             <h1 className="text-2xl font-bold text-gray-900">users Management</h1>
//                         </div>


//                         <div className="flex items-center gap-4">

//                             <button
//                                 onClick={() => { setShowForm(!showForm) }}
//                                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                             >
//                                 {showForm ? 'Cancel' : 'Add User'}
//                             </button>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Search Bar and Filters */}
//                 <div className="p-4 m-6 dark:bg-gray-200 text-black ">
//                     <div className="mb-3 flex gap-3 flex-wrap">
//                         <input
//                             type="text"
//                             placeholder="Search by name, email, or phone..."
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                             className="border p-2 rounded bg-white text-black flex-1 min-w-48"
//                         />
//                         <select
//                             value={workStatusFilter}
//                             onChange={e => setWorkStatusFilter(e.target.value)}
//                             className="border p-2 rounded bg-white text-black"
//                         >
//                             <option value="">All Work Status</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                             <option value="pending">Pending</option>
//                             <option value="suspended">Suspended</option>
//                         </select>
//                     </div>
//                     <span className="">
//                         {filteredUsers.length} of {drivers.length} users
//                     </span>
//                 </div>

//                 {showForm && (
//                     <div className="bg-gray-200 m-6 p-6 rounded-lg mb-6">
//                         <h2 className="text-xl font-semibold mb-3 text-black">Add User</h2>

//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <input
//                                     type="text"
//                                     required
//                                     placeholder="Name"
//                                     value={formData.name}
//                                     onChange={e => setFormData({ ...formData, name: e.target.value })}
//                                     className="border p-2 rounded bg-white text-black"
//                                 />
//                                 <input
//                                     type="email"
//                                     required
//                                     placeholder="Email"
//                                     value={formData.email}
//                                     onChange={e => setFormData({ ...formData, email: e.target.value })}
//                                     className="border p-2 rounded bg-white text-black"
//                                 />
//                                 <input
//                                     type="password"
//                                     required
//                                     placeholder="Password"
//                                     value={formData.password}
//                                     onChange={e => setFormData({ ...formData, password: e.target.value })}
//                                     className="border p-2 rounded bg-white text-black"
//                                 />
//                                 <input
//                                     type="text"
//                                     required
//                                     placeholder="Phone Number"
//                                     value={formData.number}
//                                     onChange={e => setFormData({ ...formData, number: e.target.value })}
//                                     className="border p-2 rounded bg-white text-black"
//                                 />
//                                 {/* role option */}
//                                 <select
//                                     required
//                                     value={formData.role}
//                                     onChange={e => {
//                                         setFormData({ ...formData, role: e.target.value }),
//                                         setPermissions(['add_program', 'edit_program', 'delete_program',
//                                             'add_country', 'edit_country', 'delete_country',
//                                             'add_category', 'edit_category', 'delete_category',
//                                             'add_cruise', 'edit_cruise', 'delete_cruise',
//                                             'manage_users', 'manage_clients', 'manage_visa',
//                                             'manage_booked_flights',
//                                             'manage_booked_programs',
//                                             'manage_booked_transportation',
//                                             'manage_booked_hotels',
//                                             'manage_booked_cruises'])
//                                     }}
//                                     className="border p-2 rounded bg-white text-black"
//                                 >
//                                     <option value="" disabled>Select Role</option>
//                                     <option value="admin">Admin</option>
//                                     <option value="head">Head</option>
//                                     <option value="user">User</option>
//                                 </select>

//                                 {/* workStatus option */}
//                                 <select
//                                     value={formData.workStatus}
//                                     onChange={e => setFormData({ ...formData, workStatus: e.target.value })}
//                                     className="border p-2 rounded bg-white text-black"
//                                 >
//                                     <option value="active">Active</option>
//                                     <option value="inactive">Inactive</option>
//                                     <option value="pending">Pending</option>
//                                     <option value="suspended">Suspended</option>
//                                 </select>

//                                 {/* dynamic fields */}
//                                 {formData.role === 'user' && (
//                                     <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 rounded border border-gray-300">
//                                         <input type="text" placeholder="National ID" value={clientInfo.nationalId} onChange={e => setClientInfo({ ...clientInfo, nationalId: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black" />
//                                         <input type="text" placeholder="Passport Number" value={clientInfo.passportNumber} onChange={e => setClientInfo({ ...clientInfo, passportNumber: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black" />
//                                         <input type="text" placeholder="Address" value={clientInfo.address} onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black" />
//                                         {/* <input type="textarr" placeholder="Add details" value={clientInfo.note} onChange={e => setClientInfo({ ...clientInfo, note: e.target.value })}
//                                          className="border border-gray-400 p-2 rounded bg-white text-black" /> */}
//                                         <textarea placeholder="Add details" value={clientInfo.note} onChange={e => setClientInfo({ ...clientInfo, note: e.target.value })} className="border border-gray-400 p-2 rounded bg-white text-black">


//                                         </textarea>
//                                     </div>
//                                 )}

//                                 {formData.role === 'head' && (
//                                     <div className="col-span-1 md:col-span-2 p-4 bg-gray-100 rounded border border-gray-300">
//                                         <h3 className="font-semibold mb-3 text-black">Permissions:</h3>
//                                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                                             {[
//                                                 { label: 'Add Program', value: 'add_program' },
//                                                 { label: 'Edit Program', value: 'edit_program' },
//                                                 { label: 'Delete Program', value: 'delete_program' },
//                                                 { label: 'Add Country', value: 'add_country' },
//                                                 { label: 'Edit Country', value: 'edit_country' },
//                                                 { label: 'Delete Country', value: 'delete_country' },
//                                                 { label: 'Add Category', value: 'add_category' },
//                                                 { label: 'Edit Category', value: 'edit_category' },
//                                                 { label: 'Delete Category', value: 'delete_category' },
//                                                 { label: 'Add Crouises', value: 'add_cruise' },
//                                                 { label: 'Edit Crouises', value: 'edit_cruise' },
//                                                 { label: 'Delete Crouises', value: 'delete_cruise' },
//                                                 { label: 'Manage Users', value: 'manage_users' },
//                                                 { label: 'Manage Clients', value: 'manage_clients' },
//                                                 { label: 'Manage Visa', value: 'manage_visa' },
//                                                 { label: 'Manage Booked Flights', value: 'manage_booked_flights' },
//                                                 { label: 'Manage Booked Programs', value: 'manage_booked_programs' },
//                                                 { label: 'Manage Booked Transportation', value: 'manage_booked_transportation' },
//                                                 { label: 'Manage Booked Hotels', value: 'manage_booked_hotels' },
//                                                 { label: 'Manage Booked Cruises', value: 'manage_booked_cruises' }
//                                             ].map(perm => (
//                                                 <label key={perm.value} className="flex items-center gap-2 text-black cursor-pointer hover:bg-gray-200 p-1 rounded">
//                                                     <input
//                                                         type="checkbox"
//                                                         className="form-checkbox h-4 w-4 text-blue-600"
//                                                         checked={permissions.includes(perm.value)}
//                                                         onChange={(e) => {
//                                                             if (e.target.checked) setPermissions([...permissions, perm.value])
//                                                             else setPermissions(permissions.filter(p => p !== perm.value))
//                                                         }}
//                                                     />
//                                                     <span className="text-sm font-medium">{perm.label}</span>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* inTeam  */}
//                                 <label className="flex items-center gap-2 text-black">
//                                     <input
//                                         type="checkbox"
//                                         checked={formData.inTeam}
//                                         onChange={e => setFormData({ ...formData, inTeam: e.target.checked })}
//                                         className="form-checkbox h-5 w-5 text-blue-600"
//                                     />
//                                     In Team
//                                 </label>

//                                 {/* roleInTeam  */}
//                                 {formData.inTeam && <label className="flex items-center gap-2 text-black">
//                                     <input
//                                         type="text"
//                                         value={formData.roleInTeam}
//                                         onChange={e => setFormData({ ...formData, roleInTeam: e.target.value })}
//                                         className="border p-2 rounded bg-white text-black"
//                                     />
//                                     Role In Team
//                                 </label>}

//                                 {/* image upload */}
//                                 <div className="mt-2">
//                                     <label className="block text-gray-400 mb-1">Profile Image</label>
//                                     <input type="file" accept="image/*" onChange={handleImageChange} />


//                                     {previewImages && (
//                                         <div className="grid grid-cols-3 gap-3">
//                                             {previewImages.map((src, i) => (
//                                                 <div key={i} className="relative">
//                                                     <img src={src} className="rounded h-32 object-cover" />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removePreviewImage(i)}
//                                                         className="absolute top-1 right-1 bg-red-600 px-2 text-xs rounded"
//                                                     >
//                                                         ✕
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="flex gap-4">
//                                 <button
//                                     type="button"
//                                     onClick={resetForm}
//                                     className="px-6 py-2 border border-gray-600 text-black  rounded hover:bg-gray-700"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//                                     disabled={addUserMutation.isPending}
//                                 >
//                                     {addUserMutation.isPending ? 'Adding...' : 'Add User'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 )}

//                 {/* Drivers List */}
//                 <div className="bg-gray-200 p-4 m-6 rounded text-black">
//                     <h2 className="text-lg font-semibold mb-3 ">All Users</h2>

//                     <div className="space-y-4">
//                         {filteredUsers.length === 0 ? (
//                             <div className="text-center py-12 text-gray-400">
//                                 <p>{searchTerm ? 'No users found matching your search.' : 'No users found.'}</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {filteredUsers.map((user: User) => (
//                                     <div key={user._id} className="border border-gray-700 p-4 rounded bg-white hover:bg-gray-300 transition">
//                                         <div className="flex items-start justify-between">
//                                             <img
//                                                 src={user.images
//                                                     ? `${user.images[0]}`
//                                                     : '/default-profile.png'}

//                                                 alt={user.name}
//                                                 className="h-16 w-16 rounded-full object-cover mr-4"
//                                             />
//                                             <div className="flex-1">
//                                                 <h3 className="text-xl font-semibold text-black">{user.name}</h3>
//                                                 <div className="mt-2 space-y-1">
//                                                     <p className="text-black text-sm">
//                                                         <span className="font-semibold">Email:</span> {user.email}
//                                                     </p>
//                                                     {user.number && (
//                                                         <p className="text-black text-sm">
//                                                             <span className="font-semibold">Number:</span> {user.number}
//                                                         </p>
//                                                     )}
//                                                     {/* Work Status Badge */}
//                                                     <div className="mt-2">
//                                                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.workStatus === 'active' ? 'bg-green-200 text-green-800' :
//                                                                 user.workStatus === 'inactive' ? 'bg-gray-200 text-gray-800' :
//                                                                     user.workStatus === 'pending' ? 'bg-yellow-200 text-yellow-800' :
//                                                                         user.workStatus === 'suspended' ? 'bg-red-200 text-red-800' :
//                                                                             'bg-gray-200 text-gray-800'
//                                                             }`}>
//                                                             {user.workStatus || 'active'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                                     <div className="mt-4 flex gap-2">
//                                                         <button onClick={() => deleteUser(user._id)}
//                                                             className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                                                         >
//                                                             Delete
//                                                         </button>
//                                                     </div>
                                              
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// // export default UsersPage


// 'use client'

// import React, { useState, useMemo } from 'react'
// import axios from 'axios'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import apiClient, { api } from '@/lib/api'
// import { User, ChevronRight, Search, Filter, X, Phone, Mail, MapPin, CreditCard, FileText, Shield, UserCheck, Eye, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
// import { useAuth } from '@/context/AuthContext'
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { PERMISSIONS } from '@/lib/permissionConstants';
// import Link from 'next/link'

// interface UserData {
//     _id: string
//     name: string
//     email: string
//     password: string
//     number?: string
//     role: string
//     images: string[]
//     inTeam: boolean
//     roleInTeam: string
//     workStatus?: string
//     clientInfo?: {
//         nationalId?: string
//         passportNumber?: string
//         address?: string
//         note?: string
//     }
// }

// export default function UsersPage() {
//     return (
//         <ProtectedRoute requiredPermission={PERMISSIONS.MANAGE_USERS}>
//             <UsersPageContent />
//         </ProtectedRoute>
//     )
// }

// const UsersPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = React.useState(false)
//     const [searchTerm, setSearchTerm] = React.useState('')
//     const [showFilters, setShowFilters] = useState(false)
//     const [showForm, setShowForm] = React.useState(false)
//     const [editingUser, setEditingUser] = React.useState<UserData | null>(null)
//     const [images, setImages] = useState<File[]>([])
//     const [previewImages, setPreviewImages] = useState<string[]>([])
//     const [expandedUser, setExpandedUser] = useState<string | null>(null)

//     // Advanced Filter States
//     const [filters, setFilters] = useState({
//         name: '',
//         email: '',
//         number: '',
//         role: '',
//         workStatus: '',
//         inTeam: '',
//         roleInTeam: '',
//         nationalId: '',
//         passportNumber: '',
//         address: '',
//         note: '',
//     })

//     const [formData, setFormData] = React.useState({
//         name: '',
//         email: '',
//         password: '',
//         number: '',
//         role: '',
//         images: '',
//         inTeam: false,
//         roleInTeam: '',
//         workStatus: 'active',
//     })

//     const [clientInfo, setClientInfo] = React.useState({
//         nationalId: '',
//         passportNumber: '',
//         address: '',
//         note: ''
//     })
//     const [permissions, setPermissions] = React.useState<string[]>([])

//     const { register, isAuthenticated } = useAuth();
//     const queryClient = useQueryClient()

//     // Fetch Data
//     const { data: users = [], isLoading } = useQuery({
//         queryKey: ['users'],
//         queryFn: async () => {
//             const response = await apiClient.get('/auth/users')
//             console.log('Fetched users:', response.data)
//             return response.data.users || response.data
//         }
//     })

//     // Mutations
//     const addUserMutation = useMutation({
//         mutationFn: async (newUser: FormData) => {
//             return api.auth.register(newUser)
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['users'] })
//             resetForm()
//             alert('User added successfully!')
//         },
//         onError: (err: any) => {
//             console.error(err)
//             alert(err.response?.data?.error || 'Error adding user.')
//         }
//     })

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         try {
//             const newUser = new FormData()
//             newUser.append('name', formData.name)
//             newUser.append('email', formData.email)
//             newUser.append('password', formData.password)
//             newUser.append('number', formData.number)
//             newUser.append('role', formData.role)
//             newUser.append('inTeam', String(formData.inTeam))
//             newUser.append('roleInTeam', formData.roleInTeam)
//             newUser.append('workStatus', formData.workStatus)
//             newUser.append('clientInfo', JSON.stringify(clientInfo))
//             newUser.append('permissions', JSON.stringify(permissions))
//             if (images.length > 0) newUser.append('images', images[0]);
//             await addUserMutation.mutateAsync(newUser)
//         } catch (err: any) {
//             console.error(err)
//             alert(err.response?.data?.message || 'Error adding user.')
//         }
//     }

//     const resetForm = () => {
//         setFormData({
//             name: '',
//             email: '',
//             password: '',
//             number: '',
//             role: '',
//             inTeam: false,
//             images: '',
//             roleInTeam: '',
//             workStatus: 'active',
//         })
//         setClientInfo({ nationalId: '', passportNumber: '', address: '', note: '' })
//         setPermissions([])
//         setPreviewImages([])
//         setEditingUser(null)
//         setShowForm(false)
//     }

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return
//         const file = e.target.files[0]
//         if (!file) return
//         setImages([file])
//         setPreviewImages([URL.createObjectURL(file)])
//     }

//     const removePreviewImage = (index: number) => {
//         setImages((prev) => prev.filter((_, i) => i !== index))
//         setPreviewImages((prev) => prev.filter((_, i) => i !== index))
//     }

//     // Advanced Filtering Logic - filters by EVERY field in user data
//     const filteredUsers = useMemo(() => {
//         return users.filter((user: UserData) => {
//             // Filter to show only admins and heads in "Our Team"
//             const roleFilter = user.role === 'admin' || user.role === 'head'
            
//             // Quick search (searches all fields)
//             const quickMatch = searchTerm === '' || 
//                 user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.workStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.roleInTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.clientInfo?.nationalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.clientInfo?.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.clientInfo?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 user.clientInfo?.note?.toLowerCase().includes(searchTerm.toLowerCase())

//             // Individual field filters
//             const nameMatch = !filters.name || user.name?.toLowerCase().includes(filters.name.toLowerCase())
//             const emailMatch = !filters.email || user.email?.toLowerCase().includes(filters.email.toLowerCase())
//             const numberMatch = !filters.number || user.number?.toLowerCase().includes(filters.number.toLowerCase())
//             const roleMatch = !filters.role || user.role === filters.role
//             const workStatusMatch = !filters.workStatus || user.workStatus === filters.workStatus
//             const inTeamMatch = filters.inTeam === '' || String(user.inTeam) === filters.inTeam
//             const roleInTeamMatch = !filters.roleInTeam || user.roleInTeam?.toLowerCase().includes(filters.roleInTeam.toLowerCase())
//             const nationalIdMatch = !filters.nationalId || user.clientInfo?.nationalId?.toLowerCase().includes(filters.nationalId.toLowerCase())
//             const passportMatch = !filters.passportNumber || user.clientInfo?.passportNumber?.toLowerCase().includes(filters.passportNumber.toLowerCase())
//             const addressMatch = !filters.address || user.clientInfo?.address?.toLowerCase().includes(filters.address.toLowerCase())
//             const noteMatch = !filters.note || user.clientInfo?.note?.toLowerCase().includes(filters.note.toLowerCase())

//             return roleFilter && quickMatch && nameMatch && emailMatch && numberMatch && roleMatch && 
//                    workStatusMatch && inTeamMatch && roleInTeamMatch && nationalIdMatch && 
//                    passportMatch && addressMatch && noteMatch
//         })
//     }, [users, searchTerm, filters])

//     const clearFilters = () => {
//         setFilters({
//             name: '',
//             email: '',
//             number: '',
//             role: '',
//             workStatus: '',
//             inTeam: '',
//             roleInTeam: '',
//             nationalId: '',
//             passportNumber: '',
//             address: '',
//             note: '',
//         })
//         setSearchTerm('')
//     }

//     const activeFilterCount = Object.values(filters).filter(v => v !== '').length

//     const deleteUser = async (user_id: string) => {
//         try {
//             await apiClient.delete(`/auth/deleteUser/${user_id}`);
//             queryClient.invalidateQueries({ queryKey: ['users'] as const });
//             alert('User deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting user:', error);
//             alert('Failed to delete user.');
//         }
//     };

//     const getStatusColor = (status?: string) => {
//         switch (status) {
//             case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
//             case 'inactive': return 'bg-slate-100 text-slate-600 border-slate-200'
//             case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
//             case 'suspended': return 'bg-red-100 text-red-700 border-red-200'
//             default: return 'bg-emerald-100 text-emerald-700 border-emerald-200'
//         }
//     }

//     const getStatusDot = (status?: string) => {
//         switch (status) {
//             case 'active': return 'bg-emerald-500'
//             case 'inactive': return 'bg-slate-400'
//             case 'pending': return 'bg-amber-500'
//             case 'suspended': return 'bg-red-500'
//             default: return 'bg-emerald-500'
//         }
//     }

//     return (
//         <div className="h-screen flex bg-slate-50 text-slate-900 font-sans">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="users" />

//             <div className="flex-1 overflow-y-auto overflow-auto bg-slate-50">
//                 {/* Header */}
//                 <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
//                     <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => setSidebarOpen(true)}
//                                 className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors"
//                             >
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                                 </svg>
//                             </button>
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
//                                     <User className="w-5 h-5 text-white" />
//                                 </div>
//                                 <div>
//                                     <h1 className="text-xl font-bold text-slate-900">Users Management</h1>
//                                     <p className="text-xs text-slate-500">Manage clients and team members</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <button
//                                 onClick={() => { setShowForm(!showForm); if(showForm) resetForm() }}
//                                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm ${
//                                     showForm 
//                                         ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
//                                         : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
//                                 }`}
//                             >
//                                 {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
//                                 {showForm ? 'Cancel' : 'Add User'}
//                             </button>
//                         </div>
//                     </div>
//                 </header>

//                 {/* Search & Filter Bar */}
//                 <div className="px-6 lg:px-8 py-5">
//                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
//                         {/* Quick Search */}
//                         <div className="flex gap-3 mb-4">
//                             <div className="relative flex-1">
//                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Quick search across all fields..."
//                                     value={searchTerm}
//                                     onChange={e => setSearchTerm(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                 />
//                             </div>
//                             <button
//                                 onClick={() => setShowFilters(!showFilters)}
//                                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
//                                     showFilters || activeFilterCount > 0
//                                         ? 'bg-blue-50 border-blue-200 text-blue-700'
//                                         : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
//                                 }`}
//                             >
//                                 <Filter className="w-4 h-4" />
//                                 Filters
//                                 {activeFilterCount > 0 && (
//                                     <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
//                                         {activeFilterCount}
//                                     </span>
//                                 )}
//                                 {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                             </button>
//                             {(activeFilterCount > 0 || searchTerm) && (
//                                 <button
//                                     onClick={clearFilters}
//                                     className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
//                                 >
//                                     Clear All
//                                 </button>
//                             )}
//                         </div>

//                         {/* Advanced Filters Panel */}
//                         {showFilters && (
//                             <div className="border-t border-slate-100 pt-4 animate-in slide-in-from-top-2 duration-200">
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
//                                     <div className="relative">
//                                         <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Name"
//                                             value={filters.name}
//                                             onChange={e => setFilters({...filters, name: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Email"
//                                             value={filters.email}
//                                             onChange={e => setFilters({...filters, email: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Phone"
//                                             value={filters.number}
//                                             onChange={e => setFilters({...filters, number: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <select
//                                         value={filters.role}
//                                         onChange={e => setFilters({...filters, role: e.target.value})}
//                                         className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
//                                     >
//                                         <option value="">All Roles</option>
//                                         <option value="admin">Admin</option>
//                                         <option value="head">Head</option>
//                                         <option value="user">User</option>
//                                     </select>
//                                     <select
//                                         value={filters.workStatus}
//                                         onChange={e => setFilters({...filters, workStatus: e.target.value})}
//                                         className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
//                                     >
//                                         <option value="">All Statuses</option>
//                                         <option value="active">Active</option>
//                                         <option value="inactive">Inactive</option>
//                                         <option value="pending">Pending</option>
//                                         <option value="suspended">Suspended</option>
//                                     </select>
//                                     <select
//                                         value={filters.inTeam}
//                                         onChange={e => setFilters({...filters, inTeam: e.target.value})}
//                                         className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
//                                     >
//                                         <option value="">Team Status</option>
//                                         <option value="true">In Team</option>
//                                         <option value="false">Not In Team</option>
//                                     </select>
//                                     <div className="relative">
//                                         <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Role in Team"
//                                             value={filters.roleInTeam}
//                                             onChange={e => setFilters({...filters, roleInTeam: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by National ID"
//                                             value={filters.nationalId}
//                                             onChange={e => setFilters({...filters, nationalId: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Passport #"
//                                             value={filters.passportNumber}
//                                             onChange={e => setFilters({...filters, passportNumber: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Address"
//                                             value={filters.address}
//                                             onChange={e => setFilters({...filters, address: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                     <div className="relative">
//                                         <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
//                                         <input
//                                             type="text"
//                                             placeholder="Filter by Notes"
//                                             value={filters.note}
//                                             onChange={e => setFilters({...filters, note: e.target.value})}
//                                             className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Results Count */}
//                         <div className="mt-4 flex items-center justify-between">
//                             <span className="text-sm text-slate-500">
//                                 Showing <span className="font-semibold text-slate-900">{filteredUsers.length}</span> of <span className="font-semibold text-slate-900">{users.length}</span> users
//                             </span>
//                             {isLoading && (
//                                 <span className="text-sm text-blue-600 animate-pulse">Loading...</span>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Add User Form */}
//                 {showForm && (
//                     <div className="px-6 lg:px-8 pb-6 animate-in slide-in-from-top-2 duration-300">
//                         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                     <Plus className="w-4 h-4 text-blue-600" />
//                                 </div>
//                                 <h2 className="text-lg font-bold text-slate-900">Add New User</h2>
//                             </div>

//                             <form onSubmit={handleSubmit} className="space-y-5">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                     <div className="space-y-1.5">
//                                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name *</label>
//                                         <input
//                                             type="text"
//                                             required
//                                             placeholder="John Doe"
//                                             value={formData.name}
//                                             onChange={e => setFormData({ ...formData, name: e.target.value })}
//                                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                         />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label>
//                                         <input
//                                             type="email"
//                                             required
//                                             placeholder="john@example.com"
//                                             value={formData.email}
//                                             onChange={e => setFormData({ ...formData, email: e.target.value })}
//                                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                         />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password *</label>
//                                         <input
//                                             type="password"
//                                             required
//                                             placeholder="••••••••"
//                                             value={formData.password}
//                                             onChange={e => setFormData({ ...formData, password: e.target.value })}
//                                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                         />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number *</label>
//                                         <input
//                                             type="text"
//                                             required
//                                             placeholder="+1 234 567 890"
//                                             value={formData.number}
//                                             onChange={e => setFormData({ ...formData, number: e.target.value })}
//                                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                         />
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role *</label>
//                                         <select
//                                             required
//                                             value={formData.role}
//                                             onChange={e => {
//                                                 setFormData({ ...formData, role: e.target.value })
//                                                 setPermissions(['add_program', 'edit_program', 'delete_program',
//                                                     'add_country', 'edit_country', 'delete_country',
//                                                     'add_category', 'edit_category', 'delete_category',
//                                                     'add_cruise', 'edit_cruise', 'delete_cruise',
//                                                     'manage_users', 'manage_clients', 'manage_visa',
//                                                     'manage_booked_flights',
//                                                     'manage_booked_mice',
//                                                     'manage_booked_programs',
//                                                     'manage_booked_transportation',
//                                                     'manage_booked_hotels',
//                                                     'manage_booked_cruises'])
//                                             }}
//                                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                         >
//                                             <option value="" disabled>Select Role</option>
//                                             <option value="admin">Admin</option>
//                                             <option value="head">Head</option>
//                                             <option value="user">User</option>
//                                         </select>
//                                     </div>
//                                     <div className="space-y-1.5">
//                                         <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Status</label>
//                                         <select
//                                             value={formData.workStatus}
//                                             onChange={e => setFormData({ ...formData, workStatus: e.target.value })}
//                                             className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                         >
//                                             <option value="active">Active</option>
//                                             <option value="inactive">Inactive</option>
//                                             <option value="pending">Pending</option>
//                                             <option value="suspended">Suspended</option>
//                                         </select>
//                                     </div>
//                                 </div>

//                                 {/* Client Info - only for user role */}
//                                 {formData.role === 'user' && (
//                                     <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                                         <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
//                                             <UserCheck className="w-4 h-4" />
//                                             Client Information
//                                         </h3>
//                                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                             <div className="space-y-1.5">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">National ID</label>
//                                                 <input 
//                                                     type="text" 
//                                                     placeholder="Enter National ID" 
//                                                     value={clientInfo.nationalId} 
//                                                     onChange={e => setClientInfo({ ...clientInfo, nationalId: e.target.value })} 
//                                                     className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
//                                                 />
//                                             </div>
//                                             <div className="space-y-1.5">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Passport Number</label>
//                                                 <input 
//                                                     type="text" 
//                                                     placeholder="Enter Passport Number" 
//                                                     value={clientInfo.passportNumber} 
//                                                     onChange={e => setClientInfo({ ...clientInfo, passportNumber: e.target.value })} 
//                                                     className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
//                                                 />
//                                             </div>
//                                             <div className="space-y-1.5">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</label>
//                                                 <input 
//                                                     type="text" 
//                                                     placeholder="Enter Address" 
//                                                     value={clientInfo.address} 
//                                                     onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })} 
//                                                     className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
//                                                 />
//                                             </div>
//                                             <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
//                                                 <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
//                                                 <textarea 
//                                                     placeholder="Additional notes..." 
//                                                     rows={3}
//                                                     value={clientInfo.note} 
//                                                     onChange={e => setClientInfo({ ...clientInfo, note: e.target.value })} 
//                                                     className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Permissions - only for head role */}
//                                 {formData.role === 'head' && (
//                                     <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
//                                         <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
//                                             <Shield className="w-4 h-4" />
//                                             Permissions
//                                         </h3>
//                                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                                             {[
//                                                 { label: 'Add Program', value: 'add_program' },
//                                                 { label: 'Edit Program', value: 'edit_program' },
//                                                 { label: 'Delete Program', value: 'delete_program' },
//                                                 { label: 'Add Country', value: 'add_country' },
//                                                 { label: 'Edit Country', value: 'edit_country' },
//                                                 { label: 'Delete Country', value: 'delete_country' },
//                                                 { label: 'Add Category', value: 'add_category' },
//                                                 { label: 'Edit Category', value: 'edit_category' },
//                                                 { label: 'Delete Category', value: 'delete_category' },
//                                                 { label: 'Add Cruises', value: 'add_cruise' },
//                                                 { label: 'Edit Cruises', value: 'edit_cruise' },
//                                                 { label: 'Delete Cruises', value: 'delete_cruise' },
//                                                 { label: 'Manage Users', value: 'manage_users' },
//                                                 { label: 'Manage Clients', value: 'manage_clients' },
//                                                 { label: 'Manage Visa', value: 'manage_visa' },
//                                                 { label: 'Manage Booked Flights', value: 'manage_booked_flights' },
//                                                 { label: 'Manage Booked Programs', value: 'manage_booked_programs' },
//                                                 { label: 'Manage Booked Mice', value: 'manage_booked_mice' },
//                                                 { label: 'Manage Booked Transportation', value: 'manage_booked_transportation' },
//                                                 { label: 'Manage Booked Hotels', value: 'manage_booked_hotels' },
//                                                 { label: 'Manage Booked Cruises', value: 'manage_booked_cruises' }
//                                             ].map(perm => (
//                                                 <label key={perm.value} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
//                                                     <input
//                                                         type="checkbox"
//                                                         className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
//                                                         checked={permissions.includes(perm.value)}
//                                                         onChange={(e) => {
//                                                             if (e.target.checked) setPermissions([...permissions, perm.value])
//                                                             else setPermissions(permissions.filter(p => p !== perm.value))
//                                                         }}
//                                                     />
//                                                     <span className="text-sm text-slate-700">{perm.label}</span>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Team Section */}
//                                 <div className="flex flex-wrap items-center gap-6">
//                                     <label className="flex items-center gap-3 cursor-pointer">
//                                         <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.inTeam ? 'bg-blue-600' : 'bg-slate-200'}`}>
//                                             <input
//                                                 type="checkbox"
//                                                 checked={formData.inTeam}
//                                                 onChange={e => setFormData({ ...formData, inTeam: e.target.checked })}
//                                                 className="sr-only"
//                                             />
//                                             <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.inTeam ? 'translate-x-5' : 'translate-x-0'}`} />
//                                         </div>
//                                         <span className="text-sm font-medium text-slate-700">In Team</span>
//                                     </label>

//                                     {formData.inTeam && (
//                                         <div className="flex-1 min-w-[200px] max-w-xs">
//                                             <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Role in Team</label>
//                                             <input
//                                                 type="text"
//                                                 placeholder="e.g. Manager, Lead..."
//                                                 value={formData.roleInTeam}
//                                                 onChange={e => setFormData({ ...formData, roleInTeam: e.target.value })}
//                                                 className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
//                                             />
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Image Upload */}
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Image</label>
//                                     <div className="flex items-center gap-4">
//                                         <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer transition-colors text-sm font-medium text-slate-700">
//                                             <Plus className="w-4 h-4" />
//                                             Choose Image
//                                             <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                                         </label>
//                                         {previewImages.length > 0 && (
//                                             <span className="text-sm text-slate-500">{previewImages.length} image selected</span>
//                                         )}
//                                     </div>
//                                     {previewImages.length > 0 && (
//                                         <div className="flex gap-3 mt-3">
//                                             {previewImages.map((src, i) => (
//                                                 <div key={i} className="relative group">
//                                                     <img src={src} className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200" alt="Preview" />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removePreviewImage(i)}
//                                                         className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors"
//                                                     >
//                                                         <X className="w-3 h-3" />
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="flex gap-3 pt-2">
//                                     <button
//                                         type="button"
//                                         onClick={resetForm}
//                                         className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                                         disabled={addUserMutation.isPending}
//                                     >
//                                         {addUserMutation.isPending ? (
//                                             <span className="flex items-center gap-2">
//                                                 <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
//                                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                                                 </svg>
//                                                 Adding...
//                                             </span>
//                                         ) : 'Add User'}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}

//                 {/* Users Grid - 3 Cards Per Row */}
//                 <div className="px-6 lg:px-8 pb-8">
//                     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//                         <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
//                             <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
//                                 <User className="w-4 h-4 text-blue-600" />
//                                 All Users
//                             </h2>
//                             <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
//                                 {filteredUsers.length} results
//                             </span>
//                         </div>

//                         {filteredUsers.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center py-16 text-center">
//                                 <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
//                                     <Search className="w-7 h-7 text-slate-400" />
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-slate-700 mb-1">No users found</h3>
//                                 <p className="text-sm text-slate-500 max-w-xs">
//                                     {searchTerm || activeFilterCount > 0 
//                                         ? 'Try adjusting your search or filter criteria to find what you\'re looking for.' 
//                                         : 'No users have been added yet. Click "Add User" to get started.'}
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="p-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                                     {filteredUsers.map((user: UserData) => (
//                                         <div key={user._id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
//                                             {/* Card Header */}
//                                             <div className="flex items-start gap-4 mb-4">
//                                                 <div className="relative flex-shrink-0">
//                                                     <img
//                                                         src={user.images && user.images.length > 0 ? user.images[0] : '/default-profile.png'}
//                                                         alt={user.name}
//                                                         className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
//                                                         onError={(e) => {
//                                                             (e.target as HTMLImageElement).src = '/default-profile.png'
//                                                         }}
//                                                     />
//                                                     <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(user.workStatus)}`} />
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
//                                                     <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
//                                                     <div className="mt-2">
//                                                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(user.workStatus)}`}>
//                                                             <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(user.workStatus)}`} />
//                                                             {user.workStatus || 'active'}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Card Body */}
//                                             <div className="space-y-2.5 mb-4">
//                                                 {user.number && (
//                                                     <div className="flex items-center gap-2 text-sm text-slate-600">
//                                                         <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
//                                                         <span className="truncate">{user.number}</span>
//                                                     </div>
//                                                 )}
//                                                 <div className="flex items-center gap-2 text-sm text-slate-600">
//                                                     <Shield className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
//                                                     <span className="capitalize">{user.role || 'No role'}</span>
//                                                 </div>
//                                                 {user.inTeam && (
//                                                     <div className="flex items-center gap-2 text-sm text-slate-600">
//                                                         <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
//                                                         <span className="truncate">{user.roleInTeam || 'Team Member'}</span>
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Tags */}
//                                             <div className="flex flex-wrap gap-1.5 mb-4">
//                                                 <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-md border border-blue-100">
//                                                     {user.role}
//                                                 </span>
//                                                 {user.inTeam && (
//                                                     <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-md border border-purple-100">
//                                                         Team
//                                                     </span>
//                                                 )}
//                                                 {user.clientInfo?.nationalId && (
//                                                     <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-md border border-amber-100">
//                                                         ID
//                                                     </span>
//                                                 )}
//                                                 {user.clientInfo?.passportNumber && (
//                                                     <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-semibold rounded-md border border-cyan-100">
//                                                         Passport
//                                                     </span>
//                                                 )}
//                                             </div>

//                                             {/* Expandable Client Info */}
//                                             {user.clientInfo && (user.clientInfo.nationalId || user.clientInfo.passportNumber || user.clientInfo.address || user.clientInfo.note) && (
//                                                 <div className="border-t border-slate-100 pt-3">
//                                                     <button
//                                                         onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
//                                                         className="flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
//                                                     >
//                                                         <span>Client Details</span>
//                                                         {expandedUser === user._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
//                                                     </button>

//                                                     {expandedUser === user._id && (
//                                                         <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
//                                                             {user.clientInfo.nationalId && (
//                                                                 <div className="flex items-start gap-2 text-xs">
//                                                                     <CreditCard className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
//                                                                     <div>
//                                                                         <span className="text-slate-500 font-medium">National ID:</span>
//                                                                         <span className="text-slate-700 ml-1">{user.clientInfo.nationalId}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                             {user.clientInfo.passportNumber && (
//                                                                 <div className="flex items-start gap-2 text-xs">
//                                                                     <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
//                                                                     <div>
//                                                                         <span className="text-slate-500 font-medium">Passport:</span>
//                                                                         <span className="text-slate-700 ml-1">{user.clientInfo.passportNumber}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                             {user.clientInfo.address && (
//                                                                 <div className="flex items-start gap-2 text-xs">
//                                                                     <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
//                                                                     <div>
//                                                                         <span className="text-slate-500 font-medium">Address:</span>
//                                                                         <span className="text-slate-700 ml-1">{user.clientInfo.address}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                             {user.clientInfo.note && (
//                                                                 <div className="flex items-start gap-2 text-xs">
//                                                                     <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
//                                                                     <div>
//                                                                         <span className="text-slate-500 font-medium">Notes:</span>
//                                                                         <span className="text-slate-700 ml-1">{user.clientInfo.note}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             )}

//                                             {/* Card Actions */}
//                                             <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
//                                                 <button
//                                                     onClick={() => deleteUser(user._id)}
//                                                     className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors"
//                                                 >
//                                                     <Trash2 className="w-3.5 h-3.5" />
//                                                     Delete
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }


// =======================================================================================================

'use client'

import React, { useState, useMemo } from 'react'
import axios from 'axios'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient, { api } from '@/lib/api'
import { User, ChevronRight, Search, Filter, X, Phone, Mail, MapPin, CreditCard, FileText, Shield, UserCheck, Eye, Trash2, Plus, ChevronDown, ChevronUp, Edit3, Save, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PERMISSIONS } from '@/lib/permissionConstants';
import Link from 'next/link'

interface UserData {
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
    permissions?: string[]
    clientInfo?: {
        nationalId?: string
        passportNumber?: string
        address?: string
        note?: string
    }
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
    const [showFilters, setShowFilters] = useState(false)
    const [showForm, setShowForm] = React.useState(false)
    const [editingUser, setEditingUser] = React.useState<UserData | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [expandedUser, setExpandedUser] = useState<string | null>(null)

    // Advanced Filter States
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        number: '',
        role: '',
        workStatus: '',
        inTeam: '',
        roleInTeam: '',
        nationalId: '',
        passportNumber: '',
        address: '',
        note: '',
    })

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        number: '',
        role: '',
        images: '',
        inTeam: false,
        roleInTeam: '',
        workStatus: 'active',
    })

    const [clientInfo, setClientInfo] = React.useState({
        nationalId: '',
        passportNumber: '',
        address: '',
        note: ''
    })
    const [permissions, setPermissions] = React.useState<string[]>([])

    const { register, isAuthenticated, user: currentUser } = useAuth();
    const queryClient = useQueryClient()

    // Check if current user is admin
    const isAdmin = currentUser?.role === 'admin'

    // Fetch Data
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await apiClient.get('/auth/users')
            console.log('Fetched users:', response.data)
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

    // Admin Update Mutation
    const updateUserMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<UserData> }) => {
            return api.users.adminUpdate(id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            setEditingUser(null)
            resetForm()
            alert('User updated successfully!')
        },
        onError: (err: any) => {
            console.error(err)
            alert(err.response?.data?.error || 'Error updating user.')
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // If editing existing user
        if (editingUser) {
            const updateData: Partial<UserData> = {
                name: formData.name,
                email: formData.email,
                number: formData.number,
                role: formData.role,
                workStatus: formData.workStatus,
                inTeam: formData.inTeam,
                roleInTeam: formData.roleInTeam,
                clientInfo: clientInfo,
            }
            
            // Only include permissions for head role
            if (formData.role === 'head') {
                updateData.permissions = permissions
            }
            
            // Only include password if provided
            if (formData.password) {
                // Handle password change separately or include if your API supports it
            }
            
            await updateUserMutation.mutateAsync({ id: editingUser._id, data: updateData })
            return
        }
        
        // Adding new user
        try {
            const newUser = new FormData()
            newUser.append('name', formData.name)
            newUser.append('email', formData.email)
            newUser.append('password', formData.password)
            newUser.append('number', formData.number)
            newUser.append('role', formData.role)
            newUser.append('inTeam', String(formData.inTeam))
            newUser.append('roleInTeam', formData.roleInTeam)
            newUser.append('workStatus', formData.workStatus)
            newUser.append('clientInfo', JSON.stringify(clientInfo))
            newUser.append('permissions', JSON.stringify(permissions))
            if (images.length > 0) newUser.append('images', images[0]);
            await addUserMutation.mutateAsync(newUser)
        } catch (err: any) {
            console.error(err)
            alert(err.response?.data?.message || 'Error adding user.')
        }
    }

    // Start editing a user
    const startEdit = (user: UserData) => {
        setEditingUser(user)
        setFormData({
            name: user.name || '',
            email: user.email || '',
            password: '', // Don't show password
            number: user.number || '',
            role: user.role || '',
            images: '',
            inTeam: user.inTeam || false,
            roleInTeam: user.roleInTeam || '',
            workStatus: user.workStatus || 'active',
        })
        setClientInfo({
            nationalId: user.clientInfo?.nationalId || '',
            passportNumber: user.clientInfo?.passportNumber || '',
            address: user.clientInfo?.address || '',
            note: user.clientInfo?.note || ''
        })
        setPermissions(user.permissions || [])
        setPreviewImages(user.images || [])
        setShowForm(true)
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

    // Advanced Filtering Logic
    const filteredUsers = useMemo(() => {
        return users.filter((user: UserData) => {
            const roleFilter = user.role === 'admin' || user.role === 'head'
            
            const quickMatch = searchTerm === '' || 
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.workStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.roleInTeam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.clientInfo?.nationalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.clientInfo?.passportNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.clientInfo?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.clientInfo?.note?.toLowerCase().includes(searchTerm.toLowerCase())

            const nameMatch = !filters.name || user.name?.toLowerCase().includes(filters.name.toLowerCase())
            const emailMatch = !filters.email || user.email?.toLowerCase().includes(filters.email.toLowerCase())
            const numberMatch = !filters.number || user.number?.toLowerCase().includes(filters.number.toLowerCase())
            const roleMatch = !filters.role || user.role === filters.role
            const workStatusMatch = !filters.workStatus || user.workStatus === filters.workStatus
            const inTeamMatch = filters.inTeam === '' || String(user.inTeam) === filters.inTeam
            const roleInTeamMatch = !filters.roleInTeam || user.roleInTeam?.toLowerCase().includes(filters.roleInTeam.toLowerCase())
            const nationalIdMatch = !filters.nationalId || user.clientInfo?.nationalId?.toLowerCase().includes(filters.nationalId.toLowerCase())
            const passportMatch = !filters.passportNumber || user.clientInfo?.passportNumber?.toLowerCase().includes(filters.passportNumber.toLowerCase())
            const addressMatch = !filters.address || user.clientInfo?.address?.toLowerCase().includes(filters.address.toLowerCase())
            const noteMatch = !filters.note || user.clientInfo?.note?.toLowerCase().includes(filters.note.toLowerCase())

            return roleFilter && quickMatch && nameMatch && emailMatch && numberMatch && roleMatch && 
                   workStatusMatch && inTeamMatch && roleInTeamMatch && nationalIdMatch && 
                   passportMatch && addressMatch && noteMatch
        })
    }, [users, searchTerm, filters])

    const clearFilters = () => {
        setFilters({
            name: '',
            email: '',
            number: '',
            role: '',
            workStatus: '',
            inTeam: '',
            roleInTeam: '',
            nationalId: '',
            passportNumber: '',
            address: '',
            note: '',
        })
        setSearchTerm('')
    }

    const activeFilterCount = Object.values(filters).filter(v => v !== '').length

    const deleteUser = async (user_id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return
        try {
            await apiClient.delete(`/auth/deleteUser/${user_id}`);
            queryClient.invalidateQueries({ queryKey: ['users'] as const });
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user.');
        }
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
            case 'inactive': return 'bg-slate-100 text-slate-600 border-slate-200'
            case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
            case 'suspended': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-emerald-100 text-emerald-700 border-emerald-200'
        }
    }

    const getStatusDot = (status?: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500'
            case 'inactive': return 'bg-slate-400'
            case 'pending': return 'bg-amber-500'
            case 'suspended': return 'bg-red-500'
            default: return 'bg-emerald-500'
        }
    }

    return (
        <div className="h-screen flex bg-slate-50 text-slate-900 font-sans">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="users" />

            <div className="flex-1 overflow-y-auto overflow-auto bg-slate-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                    <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">Users Management</h1>
                                    <p className="text-xs text-slate-500">Manage clients and team members</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => { 
                                    if (showForm && editingUser) {
                                        resetForm()
                                    } else {
                                        setShowForm(!showForm); 
                                        if(showForm) resetForm() 
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm ${
                                    showForm 
                                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                                }`}
                            >
                                {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                {showForm ? 'Cancel' : 'Add User'}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Search & Filter Bar */}
                <div className="px-6 lg:px-8 py-5">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                        {/* Quick Search */}
                        <div className="flex gap-3 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Quick search across all fields..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                                    showFilters || activeFilterCount > 0
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {(activeFilterCount > 0 || searchTerm) && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Advanced Filters Panel */}
                        {showFilters && (
                            <div className="border-t border-slate-100 pt-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Name"
                                            value={filters.name}
                                            onChange={e => setFilters({...filters, name: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Email"
                                            value={filters.email}
                                            onChange={e => setFilters({...filters, email: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Phone"
                                            value={filters.number}
                                            onChange={e => setFilters({...filters, number: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <select
                                        value={filters.role}
                                        onChange={e => setFilters({...filters, role: e.target.value})}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="admin">Admin</option>
                                        <option value="head">Head</option>
                                        <option value="user">User</option>
                                    </select>
                                    <select
                                        value={filters.workStatus}
                                        onChange={e => setFilters({...filters, workStatus: e.target.value})}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="pending">Pending</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                    <select
                                        value={filters.inTeam}
                                        onChange={e => setFilters({...filters, inTeam: e.target.value})}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-600"
                                    >
                                        <option value="">Team Status</option>
                                        <option value="true">In Team</option>
                                        <option value="false">Not In Team</option>
                                    </select>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Role in Team"
                                            value={filters.roleInTeam}
                                            onChange={e => setFilters({...filters, roleInTeam: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by National ID"
                                            value={filters.nationalId}
                                            onChange={e => setFilters({...filters, nationalId: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Passport #"
                                            value={filters.passportNumber}
                                            onChange={e => setFilters({...filters, passportNumber: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Address"
                                            value={filters.address}
                                            onChange={e => setFilters({...filters, address: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Filter by Notes"
                                            value={filters.note}
                                            onChange={e => setFilters({...filters, note: e.target.value})}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                                Showing <span className="font-semibold text-slate-900">{filteredUsers.length}</span> of <span className="font-semibold text-slate-900">{users.length}</span> users
                            </span>
                            {isLoading && (
                                <span className="text-sm text-blue-600 animate-pulse">Loading...</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Add/Edit User Form */}
                {showForm && (
                    <div className="px-6 lg:px-8 pb-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    {editingUser ? <Edit3 className="w-4 h-4 text-blue-600" /> : <Plus className="w-4 h-4 text-blue-600" />}
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    {editingUser ? `Edit User: ${editingUser.name}` : 'Add New User'}
                                </h2>
                                {editingUser && (
                                    <span className="ml-auto text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                        ID: {editingUser._id}
                                    </span>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                                        </label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            placeholder={editingUser ? "•••••••• (unchanged)" : "••••••••"}
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="+1 234 567 890"
                                            value={formData.number}
                                            onChange={e => setFormData({ ...formData, number: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    
                                    {/* Role - Admin can change everything */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role *</label>
                                        <select
                                            required
                                            value={formData.role}
                                            onChange={e => {
                                                setFormData({ ...formData, role: e.target.value })
                                                if (e.target.value === 'head') {
                                                    setPermissions(['add_program', 'edit_program', 'delete_program',
                                                        'add_country', 'edit_country', 'delete_country',
                                                        'add_category', 'edit_category', 'delete_category',
                                                        'add_cruise', 'edit_cruise', 'delete_cruise',
                                                        'manage_users', 'manage_clients', 'manage_visa',
                                                        'manage_booked_flights',
                                                        'manage_booked_mice',
                                                        'manage_booked_programs',
                                                        'manage_booked_transportation',
                                                        'manage_booked_hotels',
                                                        'manage_booked_cruises'])
                                                } else {
                                                    setPermissions([])
                                                }
                                            }}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="" disabled>Select Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="head">Head</option>
                                        </select>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Status</label>
                                        <select
                                            value={formData.workStatus}
                                            onChange={e => setFormData({ ...formData, workStatus: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                            <option value="suspended">Suspended</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Client Info - for user role */}
                                {(formData.role === 'user' || editingUser?.role === 'user') && (
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            Client Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">National ID</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter National ID" 
                                                    value={clientInfo.nationalId} 
                                                    onChange={e => setClientInfo({ ...clientInfo, nationalId: e.target.value })} 
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Passport Number</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Passport Number" 
                                                    value={clientInfo.passportNumber} 
                                                    onChange={e => setClientInfo({ ...clientInfo, passportNumber: e.target.value })} 
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Address</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter Address" 
                                                    value={clientInfo.address} 
                                                    onChange={e => setClientInfo({ ...clientInfo, address: e.target.value })} 
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</label>
                                                <textarea 
                                                    placeholder="Additional notes..." 
                                                    rows={3}
                                                    value={clientInfo.note} 
                                                    onChange={e => setClientInfo({ ...clientInfo, note: e.target.value })} 
                                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Permissions - for head role */}
                                {(formData.role === 'head' || editingUser?.role === 'head') && (
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Permissions
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                                                { label: 'Add Cruises', value: 'add_cruise' },
                                                { label: 'Edit Cruises', value: 'edit_cruise' },
                                                { label: 'Delete Cruises', value: 'delete_cruise' },
                                                { label: 'Manage Users', value: 'manage_users' },
                                                { label: 'Manage Clients', value: 'manage_clients' },
                                                { label: 'Manage Visa', value: 'manage_visa' },
                                                { label: 'Manage Booked Flights', value: 'manage_booked_flights' },
                                                { label: 'Manage Booked Programs', value: 'manage_booked_programs' },
                                                { label: 'Manage Booked Mice', value: 'manage_booked_mice' },
                                                { label: 'Manage Booked Transportation', value: 'manage_booked_transportation' },
                                                { label: 'Manage Booked Hotels', value: 'manage_booked_hotels' },
                                                { label: 'Manage Booked Cruises', value: 'manage_booked_cruises' }
                                            ].map(perm => (
                                                <label key={perm.value} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                        checked={permissions.includes(perm.value)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) setPermissions([...permissions, perm.value])
                                                            else setPermissions(permissions.filter(p => p !== perm.value))
                                                        }}
                                                    />
                                                    <span className="text-sm text-slate-700">{perm.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Team Section */}
                                <div className="flex flex-wrap items-center gap-6">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.inTeam ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                            <input
                                                type="checkbox"
                                                checked={formData.inTeam}
                                                onChange={e => setFormData({ ...formData, inTeam: e.target.checked })}
                                                className="sr-only"
                                            />
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.inTeam ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700">In Team</span>
                                    </label>

                                    {formData.inTeam && (
                                        <div className="flex-1 min-w-[200px] max-w-xs">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Role in Team</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Manager, Lead..."
                                                value={formData.roleInTeam}
                                                onChange={e => setFormData({ ...formData, roleInTeam: e.target.value })}
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile Image</label>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl cursor-pointer transition-colors text-sm font-medium text-slate-700">
                                            <Plus className="w-4 h-4" />
                                            Choose Image
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                        </label>
                                        {previewImages.length > 0 && (
                                            <span className="text-sm text-slate-500">{previewImages.length} image selected</span>
                                        )}
                                    </div>
                                    {previewImages.length > 0 && (
                                        <div className="flex gap-3 mt-3">
                                            {previewImages.map((src, i) => (
                                                <div key={i} className="relative group">
                                                    <img src={src} className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200" alt="Preview" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePreviewImage(i)}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-lg transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium text-sm transition-colors shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        disabled={addUserMutation.isPending || updateUserMutation.isPending}
                                    >
                                        {(addUserMutation.isPending || updateUserMutation.isPending) ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                {editingUser ? 'Updating...' : 'Adding...'}
                                            </>
                                        ) : (
                                            <>
                                                {editingUser ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                {editingUser ? 'Update User' : 'Add User'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Users Grid */}
                <div className="px-6 lg:px-8 pb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-600" />
                                All Users
                            </h2>
                            <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                                {filteredUsers.length} results
                            </span>
                        </div>

                        {filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-7 h-7 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700 mb-1">No users found</h3>
                                <p className="text-sm text-slate-500 max-w-xs">
                                    {searchTerm || activeFilterCount > 0 
                                        ? 'Try adjusting your search or filter criteria to find what you\'re looking for.' 
                                        : 'No users have been added yet. Click "Add User" to get started.'}
                                </p>
                            </div>
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredUsers.map((user: UserData) => (
                                        <div key={user._id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                                            {/* Card Header */}
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="relative flex-shrink-0">
                                                    <img
                                                        src={user.images && user.images.length > 0 ? user.images[0] : '/default-profile.png'}
                                                        alt={user.name}
                                                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/default-profile.png'
                                                        }}
                                                    />
                                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDot(user.workStatus)}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
                                                    <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                                                    <div className="mt-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(user.workStatus)}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(user.workStatus)}`} />
                                                            {user.workStatus || 'active'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="space-y-2.5 mb-4">
                                                {user.number && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                        <span className="truncate">{user.number}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Shield className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                    <span className="capitalize">{user.role || 'No role'}</span>
                                                </div>
                                                {user.inTeam && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                        <span className="truncate">{user.roleInTeam || 'Team Member'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded-md border border-blue-100">
                                                    {user.role}
                                                </span>
                                                {user.inTeam && (
                                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-semibold rounded-md border border-purple-100">
                                                        Team
                                                    </span>
                                                )}
                                                {user.clientInfo?.nationalId && (
                                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-md border border-amber-100">
                                                        ID
                                                    </span>
                                                )}
                                                {user.clientInfo?.passportNumber && (
                                                    <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-semibold rounded-md border border-cyan-100">
                                                        Passport
                                                    </span>
                                                )}
                                            </div>

                                            {/* Expandable Client Info */}
                                            {user.clientInfo && (user.clientInfo.nationalId || user.clientInfo.passportNumber || user.clientInfo.address || user.clientInfo.note) && (
                                                <div className="border-t border-slate-100 pt-3">
                                                    <button
                                                        onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                                                        className="flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                                                    >
                                                        <span>Client Details</span>
                                                        {expandedUser === user._id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </button>

                                                    {expandedUser === user._id && (
                                                        <div className="mt-3 space-y-2 animate-in slide-in-from-top-1 duration-200">
                                                            {user.clientInfo.nationalId && (
                                                                <div className="flex items-start gap-2 text-xs">
                                                                    <CreditCard className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <span className="text-slate-500 font-medium">National ID:</span>
                                                                        <span className="text-slate-700 ml-1">{user.clientInfo.nationalId}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {user.clientInfo.passportNumber && (
                                                                <div className="flex items-start gap-2 text-xs">
                                                                    <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <span className="text-slate-500 font-medium">Passport:</span>
                                                                        <span className="text-slate-700 ml-1">{user.clientInfo.passportNumber}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {user.clientInfo.address && (
                                                                <div className="flex items-start gap-2 text-xs">
                                                                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <span className="text-slate-500 font-medium">Address:</span>
                                                                        <span className="text-slate-700 ml-1">{user.clientInfo.address}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {user.clientInfo.note && (
                                                                <div className="flex items-start gap-2 text-xs">
                                                                    <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <span className="text-slate-500 font-medium">Notes:</span>
                                                                        <span className="text-slate-700 ml-1">{user.clientInfo.note}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Card Actions */}
                                            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                                                {/* Edit Button - Only for admin */}
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                        Edit
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteUser(user._id)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
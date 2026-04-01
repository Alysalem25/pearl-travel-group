
// // 'use client'

// // import React, { useState } from 'react'
// // import axios from 'axios'
// // import Link from 'next/link'
// // import AdminSidebar from '@/components/adminSidebar'
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// // interface Program {
// //     _id: string
// //     titleEn: string
// //     titleAr: string
// //     descriptionEn: string
// //     descriptionAr: string
// //     category: { _id: string, nameEn: string } // Populated from DB
// //     country: 'Egypt' | 'Albania'
// //     durationDays: number
// //     durationNights: number
// //     price: number
// //     status: 'active' | 'inactive'
// //     itineraryEn: string
// //     images?: string[]
// //     itineraryAr: string
// // }

// // const ProgramsPage = () => {
// //     const [sidebarOpen, setSidebarOpen] = React.useState(false)
// //     const [showForm, setShowForm] = React.useState(false)
// //     const [editingProgram, setEditingProgram] = React.useState<Program | null>(null)
// //     const [previewImages, setPreviewImages] = useState<string[]>([])
// //     const [images, setImages] = React.useState<File[]>([])
// //     // Aligned with ProgramsSchema
// //     const [formData, setFormData] = React.useState({
// //         titleEn: '',
// //         titleAr: '',
// //         category: '',
// //         country: 'Egypt',
// //         durationDays: 0,
// //         durationNights: 0,
// //         price: 0,
// //         descriptionEn: '',
// //         descriptionAr: '',
// //         itineraryEn: '',
// //         itineraryAr: '',
// //         status: 'active'
// //     })

// //     const queryClient = useQueryClient()

// //     // ————————— DATA FETCHING —————————
// //     const { data: categories = [] } = useQuery({
// //         queryKey: ['categories'],
// //         queryFn: async () => (await axios.get('${process.env.NEXT_PUBLIC_API_URL || '/api'}/categories')).data
// //     })

// //     const { data: programs = [] } = useQuery({
// //         queryKey: ['programs'],
// //         queryFn: async () => (await axios.get('${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs')).data
// //     })

// //     // ————————— MUTATIONS —————————
// //     const programMutation = useMutation({
// //         mutationFn: (payload: any) =>
// //             editingProgram
// //                 ? axios.put(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs/${editingProgram._id}`, payload)
// //                 : axios.post('${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs', payload),
// //         onSuccess: () => {
// //             queryClient.invalidateQueries({ queryKey: ['programs'] });
// //             alert(editingProgram ? "Program updated!" : "Program added!");
// //             resetForm();
// //         },
// //         onError: (error: any) => alert(error.response?.data?.message || "Error saving program")
// //     })

// //     const deleteMutation = useMutation({
// //         mutationFn: (id: string) => axios.delete(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs/${id}`),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
// //     })

// //     // ————————— HANDLERS —————————
// //     const handleSubmit = (e: React.FormEvent) => {
// //         e.preventDefault();

// //         const data = new FormData();

// //         Object.entries(formData).forEach(([key, value]) => {
// //             data.append(key, String(value));
// //         });

// //         images.forEach(img => data.append("images", img));

// //         programMutation.mutate(data);
// //     };


// //     const resetForm = () => {
// //         setFormData({
// //             titleEn: '', titleAr: '', category: '', country: 'Egypt',
// //             durationDays: 0, durationNights: 0, price: 0,
// //             descriptionEn: '', descriptionAr: '', itineraryEn: '', itineraryAr: '',
// //             status: 'active'
// //         })
// //         setEditingProgram(null)
// //         setShowForm(false)
// //     }

// //     const startEdit = (p: Program) => {
// //         setEditingProgram(p)
// //         setFormData({
// //             titleEn: p.titleEn,
// //             titleAr: p.titleAr,
// //             category: typeof p.category === 'object' ? p.category._id : p.category,
// //             country: p.country,
// //             durationDays: p.durationDays,
// //             durationNights: p.durationNights,
// //             price: p.price,
// //             descriptionEn: p.descriptionEn || '',
// //             descriptionAr: p.descriptionAr || '',
// //             itineraryEn: p.itineraryEn || '',
// //             itineraryAr: p.itineraryAr || '',
// //             status: (p.status as 'active' | 'inactive') || 'active'
// //         })
// //         setShowForm(true)
// //     }

// //     return (
// //         <div className="min-h-screen flex bg-gray-900 text-white">
// //             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="programs" />

// //             <div className="flex-1">
// //                 <header className="bg-gray-800 shadow-sm border-b border-gray-700 p-4 flex justify-between items-center">
// //                     <h1 className="text-2xl font-bold">Program Management</h1>
// //                     <button
// //                         onClick={() => { editingProgram ? resetForm() : setShowForm(!showForm) }}
// //                         className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
// //                     >
// //                         {showForm ? "Cancel" : "Add New Program"}
// //                     </button>
// //                 </header>

// //                 {showForm && (
// //                     <div className="bg-gray-800 m-6 p-6 rounded-lg shadow-xl border border-gray-700">
// //                         <form onSubmit={handleSubmit} className="space-y-4">
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                 <input placeholder="Title (EN)" className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} required />
// //                                 <input placeholder="Title (AR)" className="bg-gray-700 p-2 rounded border border-gray-600 text-right" value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} required />

// //                                 <select className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
// //                                     <option value="">Select Category</option>
// //                                     {categories.map((c: any) => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
// //                                 </select>

// //                                 <select className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value as any })}>
// //                                     <option value="Egypt">Egypt</option>
// //                                     <option value="Albania">Albania</option>
// //                                 </select>

// //                                 <div className="flex gap-2">
// //                                     <input type="number" placeholder="Days" className="bg-gray-700 p-2 rounded border border-gray-600 w-full" value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) })} required />
// //                                     <input type="number" placeholder="Nights" className="bg-gray-700 p-2 rounded border border-gray-600 w-full" value={formData.durationNights} onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) })} required />
// //                                 </div>

// //                                 <input type="number" placeholder="Price" className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} required />
// //                             </div>

// //                             <textarea placeholder="Description (EN)" className="bg-gray-700 p-2 rounded border border-gray-600 w-full h-20" value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} />
// //                             <textarea placeholder="Itinerary (EN)" className="bg-gray-700 p-2 rounded border border-gray-600 w-full h-32" value={formData.itineraryEn} onChange={e => setFormData({ ...formData, itineraryEn: e.target.value })} />

// //                             <div className="flex items-center gap-4">
// //                                 <label className="flex items-center gap-2">
// //                                     <input type="radio" checked={formData.status === 'active'} onChange={() => setFormData({ ...formData, status: 'active' })} /> Active
// //                                 </label>
// //                                 <label className="flex items-center gap-2">
// //                                     <input type="radio" checked={formData.status === 'inactive'} onChange={() => setFormData({ ...formData, status: 'inactive' })} /> Inactive
// //                                 </label>
// //                             </div>
// //                             <input
// //                                 type="file"
// //                                 multiple
// //                                 accept="image/*"
// //                                 onChange={(e) => {
// //                                     if (!e.target.files) return;
// //                                     setImages(Array.from(e.target.files));
// //                                 }}
// //                             />


// //                             <button type="submit" className="w-full bg-green-600 py-3 rounded font-bold hover:bg-green-700 transition">
// //                                 {editingProgram ? "Update Program" : "Save Program"}
// //                             </button>
// //                         </form>
// //                     </div>
// //                 )}

// //                 <div className="m-6">
// //                     <h2 className="text-xl font-bold mb-4">Available Programs ({programs.length})</h2>
// //                     <div className="grid grid-cols-1 gap-4">
// //                         {programs.map((p: Program) => (
// //                             <div key={p._id} className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:border-blue-500 transition">
// //                                 <div>
// //                                     <h3 className="text-lg font-bold">{p.titleEn} / {p.titleAr}</h3>
// //                                     <p className="text-sm text-gray-400">{p.durationDays} Days - {p.country} - ${p.price}</p>
// //                                     <span className={`text-xs px-2 py-1 rounded ${p.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
// //                                         {p.status}
// //                                     </span>
// //                                 </div>
// //                                 <div className="flex gap-2">
// //                                     <button onClick={() => startEdit(p)} className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700">Edit</button>
// //                                     <button onClick={() => { if (confirm("Delete this program?")) deleteMutation.mutate(p._id) }} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     )
// // }

// // export default ProgramsPage


// // =================================================================================================
// // 'use client'

// // import React, { useState } from 'react'
// // import axios from 'axios'
// // import AdminSidebar from '@/components/adminSidebar'
// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// // interface Program {
// //     _id: string
// //     titleEn: string
// //     titleAr: string
// //     descriptionEn: string
// //     descriptionAr: string
// //     category: { _id: string, nameEn: string }
// //     country: 'Egypt' | 'Albania'
// //     durationDays: number
// //     durationNights: number
// //     price: number
// //     status: 'active' | 'inactive'
// //     itineraryEn: string
// //     itineraryAr: string
// //     images?: string[]
// // }

// // const ProgramsPage = () => {
// //     const [sidebarOpen, setSidebarOpen] = useState(false)
// //     const [showForm, setShowForm] = useState(false)
// //     const [editingProgram, setEditingProgram] = useState<Program | null>(null)

// //     const [images, setImages] = useState<File[]>([])
// //     const [previewImages, setPreviewImages] = useState<string[]>([])

// //     const [formData, setFormData] = useState({
// //         titleEn: '',
// //         titleAr: '',
// //         category: '',
// //         country: 'Egypt',
// //         durationDays: 0,
// //         durationNights: 0,
// //         price: 0,
// //         descriptionEn: '',
// //         descriptionAr: '',
// //         itineraryEn: '',
// //         itineraryAr: '',
// //         status: 'active'
// //     })

// //     const queryClient = useQueryClient()

// //     // ================= FETCH =================
// //     const { data: categories = [] } = useQuery({
// //         queryKey: ['categories'],
// //         queryFn: async () => (await axios.get('${process.env.NEXT_PUBLIC_API_URL || '/api'}/categories')).data
// //     })

// //     const { data: programs = [] } = useQuery({
// //         queryKey: ['programs'],
// //         queryFn: async () => (await axios.get('${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs')).data
// //     })

// //     // ================= MUTATION =================
// //     const programMutation = useMutation({
// //         mutationFn: (payload: FormData) =>
// //             editingProgram
// //                 ? axios.put(
// //                     `${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs/${editingProgram._id}`,
// //                     payload,
// //                     { headers: { "Content-Type": "multipart/form-data" } }
// //                 )
// //                 : axios.post(
// //                     '${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs',
// //                     payload,
// //                     { headers: { "Content-Type": "multipart/form-data" } }
// //                 ),
// //         onSuccess: () => {
// //             queryClient.invalidateQueries({ queryKey: ['programs'] })
// //             alert(editingProgram ? 'Program updated!' : 'Program added!')
// //             resetForm()
// //         },
// //         onError: (error: any) =>
// //             alert(error.response?.data?.message || 'Error')
// //     })

// //         const deleteMutation = useMutation({
// //         mutationFn: (id: string) => axios.delete(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/programs/${id}`),
// //         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
// //     })


// //     // ================= HANDLERS =================
// //     const handleSubmit = (e: React.FormEvent) => {
// //         e.preventDefault()

// //         const data = new FormData()

// //         Object.entries(formData).forEach(([key, value]) => {
// //             data.append(key, String(value))
// //         })

// //         images.forEach(img => data.append('images', img))

// //         programMutation.mutate(data)
// //     }

// //     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         if (!e.target.files) return

// //         const files = Array.from(e.target.files)
// //         setImages(prev => [...prev, ...files])

// //         const previews = files.map(file => URL.createObjectURL(file))
// //         setPreviewImages(prev => [...prev, ...previews])
// //     }

// //     const removePreviewImage = (index: number) => {
// //         setImages(prev => prev.filter((_, i) => i !== index))
// //         setPreviewImages(prev => prev.filter((_, i) => i !== index))
// //     }

// //     const resetForm = () => {
// //         setFormData({
// //             titleEn: '',
// //             titleAr: '',
// //             category: '',
// //             country: 'Egypt',
// //             durationDays: 0,
// //             durationNights: 0,
// //             price: 0,
// //             descriptionEn: '',
// //             descriptionAr: '',
// //             itineraryEn: '',
// //             itineraryAr: '',
// //             status: 'active'
// //         })
// //         setImages([])
// //         setPreviewImages([])
// //         setEditingProgram(null)
// //         setShowForm(false)
// //     }

// //     const startEdit = (p: Program) => {
// //         setEditingProgram(p)
// //         setFormData({
// //             titleEn: p.titleEn,
// //             titleAr: p.titleAr,
// //             category: p.category._id,
// //             country: p.country,
// //             durationDays: p.durationDays,
// //             durationNights: p.durationNights,
// //             price: p.price,
// //             descriptionEn: p.descriptionEn || '',
// //             descriptionAr: p.descriptionAr || '',
// //             itineraryEn: p.itineraryEn || '',
// //             itineraryAr: p.itineraryAr || '',
// //             status: p.status
// //         })
// //         setImages(p.images)
// //         setPreviewImages(p.images.map(img => `${process.env.NEXT_PUBLIC_API_URL || '/api'}/uploads/programs/${img}`))
// //         setShowForm(true)
// //     }

// //     // ================= UI =================
// //     return (
// //         <div className="min-h-screen flex bg-gray-900 text-white">
// //             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="programs" />

// //             <div className="flex-1">
// //                 <header className="bg-gray-800 p-4 flex justify-between">
// //                     <h1 className="text-2xl font-bold">Program Management</h1>
// //                     <button
// //                         onClick={() => setSidebarOpen(true)}
// //                         className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
// //                     >
// //                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //                         </svg>
// //                     </button>
// //                     <button
// //                         onClick={() => showForm ? resetForm() : setShowForm(true)}
// //                         className="bg-blue-600 px-4 py-2 mx-4 rounded"
// //                     >
// //                         {showForm ? 'Cancel' : 'Add Program'}
// //                     </button>
// //                 </header>

// //                 {showForm && (
// //                     <div className="bg-gray-800 m-6 p-6 rounded-lg">
// //                         <form onSubmit={handleSubmit} className="space-y-4">

// //                             {/* TEXT INPUTS (UNCHANGED) */}
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                 <input
// //                                     placeholder="Title (EN)"
// //                                     className="bg-gray-700 p-2 rounded border border-gray-600"
// //                                     value={formData.titleEn}
// //                                     onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
// //                                     required
// //                                 />

// //                                 <input
// //                                     placeholder="Title (AR)"
// //                                     className="bg-gray-700 p-2 rounded border border-gray-600 text-right"
// //                                     value={formData.titleAr}
// //                                     onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
// //                                     required
// //                                 />


// //                                 <select className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
// //                                     <option value="">Select Category</option>
// //                                     {categories.map((c: any) => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
// //                                 </select>

// //                                 <select className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value as any })}>
// //                                     <option value="Egypt">Egypt</option>
// //                                     <option value="Albania">Albania</option>
// //                                 </select>

// //                                 <div className="flex gap-2">
// //                                     <input type="number" placeholder="Days" className="bg-gray-700 p-2 rounded border border-gray-600 w-full" value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) })} required />
// //                                     <input type="number" placeholder="Nights" className="bg-gray-700 p-2 rounded border border-gray-600 w-full" value={formData.durationNights} onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) })} required />
// //                                 </div>

// //                                 <input type="number" placeholder="Price" className="bg-gray-700 p-2 rounded border border-gray-600" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} required />
// //                             </div>

// //                             <textarea placeholder="Description (EN)"
// //                                 className="bg-gray-700 p-2 rounded border border-gray-600 w-full h-20"
// //                                 value={formData.descriptionEn}
// //                                 onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} />
// //                             <textarea placeholder="Description (AR)"
// //                                 className="bg-gray-700 p-2 rounded border border-gray-600 w-full h-20 text-right"
// //                                 value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} />
// //                             <textarea placeholder="Itinerary (EN)" className="bg-gray-700 p-2 rounded border border-gray-600 w-full h-32" value={formData.itineraryEn} onChange={e => setFormData({ ...formData, itineraryEn: e.target.value })} />
// //                             <textarea placeholder="Itinerary (AR)"
// //                                 className="bg-gray-700 p-2 rounded border border-gray-600 w-full h-32" value={formData.itineraryAr}
// //                                 onChange={e => setFormData({ ...formData, itineraryAr: e.target.value })} />

// //                             <div className="flex items-center gap-4">
// //                                 <label className="flex items-center gap-2">
// //                                     <input type="radio" checked={formData.status === 'active'} onChange={() => setFormData({ ...formData, status: 'active' })} /> Active
// //                                 </label>
// //                                 <label className="flex items-center gap-2">
// //                                     <input type="radio" checked={formData.status === 'inactive'} onChange={() => setFormData({ ...formData, status: 'inactive' })} /> Inactive
// //                                 </label>
// //                             </div>

// //                             {/* IMAGE INPUT */}
// //                             {/* <input
// //                                 type="file"
// //                                 multiple
// //                                 accept="image/*"
// //                                 onChange={handleImageChange}
// //                                 className="block"
// //                             />

// //                             {previewImages.length > 0 && (
// //                                 <div className="grid grid-cols-3 gap-3 mt-4">
// //                                     {previewImages.map((src, i) => (
// //                                         <div key={i} className="relative">
// //                                             <img
// //                                                 src={src}
// //                                                 className="h-28 w-full object-cover rounded"
// //                                             />
// //                                             <button
// //                                                 type="button"
// //                                                 onClick={() => removePreviewImage(i)}
// //                                                 className="absolute top-1 right-1 bg-red-600 text-xs px-2 py-1 rounded"
// //                                             >
// //                                                 ✕
// //                                             </button>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             )} */}


// //                             <input
// //                                 type="file"
// //                                 multiple
// //                                 accept="image/*"
// //                                 onChange={handleImageChange}
// //                             />

// //                             {previewImages.length > 0 && (
// //                                 <div className="grid grid-cols-3 gap-3 mt-4">
// //                                     {previewImages.map((src, i) => (
// //                                         <div key={i} className="relative group">
// //                                             <img
// //                                                 src={src}
// //                                                 className=" w-full object-cover rounded border border-gray-600"
// //                                             />
// //                                             <button
// //                                                 type="button"
// //                                                 onClick={() => removePreviewImage(i)}
// //                                                 className="absolute top-1 right-1 bg-red-600 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
// //                                             >
// //                                                 ✕
// //                                             </button>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             )}



// //                             <button type="submit" className="w-full bg-green-600 py-3 rounded">
// //                                 {editingProgram ? 'Update Program' : 'Save Program'}
// //                             </button>
// //                         </form>
// //                     </div>
// //                 )}

// //                 <div className="m-6 p-6">
// //                     <h2 className="text-xl font-bold mb-4">Available Programs ({programs.length})</h2>
// //                     <div className="grid grid-cols-1 gap-4">
// //                         {programs.map((p: Program) => (
// //                             <div key={p._id}
// //                                 onClick={() => window.location.href = `/Admindashbord/programs/${p._id}`}
// //                                 className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:border-blue-500">
// //                                 <div>
// //                                     <h3 className="text-lg font-bold">{p.titleEn} / {p.titleAr}</h3>
// //                                     <p className="text-sm text-gray-400">{p.durationDays} Days - {p.country} - ${p.price}</p>
// //                                     <span className={`text-xs px-2 py-1 rounded ${p.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
// //                                         {p.status}
// //                                     </span>
// //                                 </div>
// //                                 <div className="flex gap-2">
// //                                     <button onClick={(e) => {
// //                                         e.stopPropagation(); // STOP link navigation
// //                                         e.preventDefault(); // STOP link navigation
// //                                         startEdit(p)
// //                                     }} className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700">Edit</button>

// //                                     <button onClick={(e) => {
// //                                         e.stopPropagation(); // STOP link navigation
// //                                         e.preventDefault(); // STOP link navigation
// //                                         deleteMutation.mutate(p._id)
// //                                     }} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>
// //             </div >
// //         </div >
// //     )
// // }

// // export default ProgramsPage
// // ================================================================================================
// 'use client'

// import React, { useState } from 'react'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
// import { ProtectedRoute } from '@/components/ProtectedRoute';

// interface Day {
//     dayNumber: number
//     titleEn: string
//     titleAr: string
//     descriptionEn: string
//     descriptionAr: string
// }

// interface Program {
//     _id: string
//     titleEn: string
//     titleAr: string
//     category: { _id: string; nameEn: string }
//     country: 'Egypt' | 'Albania'
//     durationDays: number
//     durationNights: number
//     price: number
//     descriptionEn: string
//     descriptionAr: string
//     itineraryEn: string
//     itineraryAr: string
//     status: 'active' | 'inactive'
//     images?: string[]
//     days?: Day[]
// }

// export default function ProgramsPage() {
//     return (
//         <ProtectedRoute requiredRole="admin">
//             <ProgramsPageContent />
//         </ProtectedRoute>
//     );
// }

// function ProgramsPageContent() {
//     const queryClient = useQueryClient()

//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [showForm, setShowForm] = useState(false)
//     const [editingProgram, setEditingProgram] = useState<Program | null>(null)

//     const [images, setImages] = useState<File[]>([])
//     const [previewImages, setPreviewImages] = useState<string[]>([])
//     const [error, setError] = useState('')

//     const [days, setDays] = useState<Day[]>([
//         {
//             dayNumber: 1,
//             titleEn: '',
//             titleAr: '',
//             descriptionEn: '',
//             descriptionAr: '',
//         },
//     ])

//     const [formData, setFormData] = useState({
//         titleEn: '',
//         titleAr: '',
//         category: '',
//         country: 'Egypt',
//         durationDays: 1,
//         durationNights: 0,
//         price: 0,
//         descriptionEn: '',
//         descriptionAr: '',
//         itineraryEn: '',
//         itineraryAr: '',
//         status: 'active',
//     })

//     // ================= FETCH =================
//     const { data: categories = [] } = useQuery({
//         queryKey: ['categories'],
//         queryFn: async () =>
//             (await api.categories.getAll()).data,
//     })

//     const { data: programs = [] } = useQuery({
//         queryKey: ['programs'],
//         queryFn: async () =>
//             (await api.programs.getAll()).data,
//     })

//     // ================= MUTATION =================
//     const programMutation = useMutation({
//         mutationFn: (payload: FormData) =>
//             editingProgram
//                 ? api.programs.update(editingProgram._id, payload)
//                 : api.programs.create(payload),

//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['programs'] })
//             alert(editingProgram ? 'Program updated ✅' : 'Program added ✅')
//             resetForm()
//         },
//         onError: (error: any) => {
//             setError(error.response.data.massage)
//         }
//     })

//     const deleteMutation = useMutation({
//         mutationFn: (id: string) =>
//             api.programs.delete(id),
//         onSuccess: () =>
//             queryClient.invalidateQueries({ queryKey: ['programs'] }),
//     })

//     // ================= HANDLERS =================
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()

//         const fd = new FormData()

//         Object.entries(formData).forEach(([key, value]) => {
//             fd.append(key, String(value))
//         })

//         fd.append('days', JSON.stringify(days))

//         images.forEach((img) => fd.append('images', img))

//         programMutation.mutate(fd)
//     }

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return

//         const files = Array.from(e.target.files)

//         setImages((prev) => [...prev, ...files])
//         setPreviewImages((prev) => [
//             ...prev,
//             ...files.map((file) => URL.createObjectURL(file)),
//         ])
//     }

//     const removePreviewImage = (index: number) => {
//         setImages((prev) => prev.filter((_, i) => i !== index))
//         setPreviewImages((prev) => prev.filter((_, i) => i !== index))
//     }

//     const updateDay = (i: number, field: keyof Day, value: string) => {
//         const copy = days.map((d, idx) =>
//             idx === i ? { ...d, [field]: value } : d
//         )
//         setDays(copy)
//     }

//     const addDay = () => {
//         setDays((prev) => [
//             ...prev,
//             {
//                 dayNumber: prev.length + 1,
//                 titleEn: '',
//                 titleAr: '',
//                 descriptionEn: '',
//                 descriptionAr: '',
//             },
//         ])
//     }

//     const removeDay = (i: number) => {
//         setDays((prev) =>
//             prev
//                 .filter((_, index) => index !== i)
//                 .map((d, idx) => ({ ...d, dayNumber: idx + 1 }))
//         )
//     }

//     const resetForm = () => {
//         setFormData({
//             titleEn: '',
//             titleAr: '',
//             category: '',
//             country: 'Egypt',
//             durationDays: 1,
//             durationNights: 0,
//             price: 0,
//             descriptionEn: '',
//             descriptionAr: '',
//             itineraryEn: '',
//             itineraryAr: '',
//             status: 'active',
//         })
//         setImages([])
//         setPreviewImages([])
//         setDays([
//             {
//                 dayNumber: 1,
//                 titleEn: '',
//                 titleAr: '',
//                 descriptionEn: '',
//                 descriptionAr: '',
//             },
//         ])
//         setEditingProgram(null)
//         setShowForm(false)
//     }

//     const startEdit = (p: Program) => {
//         setEditingProgram(p)
//         setFormData({
//             titleEn: p.titleEn,
//             titleAr: p.titleAr,
//             category: typeof p.category === 'object' && p.category ? p.category._id : '',
//             country: p.country,
//             durationDays: p.durationDays,
//             durationNights: p.durationNights ?? 0,
//             price: p.price,
//             descriptionEn: p.descriptionEn ?? '',
//             descriptionAr: p.descriptionAr ?? '',
//             itineraryEn: p.itineraryEn ?? '',
//             itineraryAr: p.itineraryAr ?? '',
//             status: p.status,
//         })
//         setImages([])
//         setPreviewImages((p.images || []).map((img) => `${img}`))
//         setDays(
//             p.days?.length
//                 ? p.days.map((d, idx) => ({ ...d, dayNumber: idx + 1 }))
//                 : [{ dayNumber: 1, titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '' }]
//         )
//         setShowForm(true)
//     }

//     // ================= UI =================
//     return (
//         <div className="min-h-screen flex bg-white text-black">
//             <AdminSidebar
//                 sidebarOpen={sidebarOpen}
//                 setSidebarOpen={setSidebarOpen}
//                 active="programs"
//             />

//             <div className="flex-1">
//                 <header className="bg-white p-4 flex justify-between">
//                     <h1 className="text-2xl font-bold">Programs</h1>
//                     <button
//                         onClick={() => setSidebarOpen(true)}
//                         className="lg:hidden text-gray-400 hover:text-white"
//                     >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={() => (showForm ? resetForm() : setShowForm(true))}
//                         className="bg-blue-600 px-4 py-2 rounded"
//                     >
//                         {showForm ? 'Cancel' : 'Add Program'}
//                     </button>
//                 </header>
//                 <hr />

//                 {showForm && (
//                     <form
//                         onSubmit={handleSubmit}
//                         className="flex flex-col bg-gray-300 m-6 p-6 rounded space-y-4"
//                     >
//                         {/* titles */}
//                         <div className="flex w-full gap-6">

//                             <input
//                                 placeholder="Title EN"
//                                 className="bg-white w-full input text-left p-2 rounded border border-gray-600"
//                                 value={formData.titleEn}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, titleEn: e.target.value })
//                                 }
//                                 required
//                             />

//                             <input
//                                 placeholder="العنوان بالعربي"
//                                 className="bg-white w-full input text-right p-2 rounded border border-gray-600"
//                                 value={formData.titleAr}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, titleAr: e.target.value })
//                                 }
//                                 required
//                             />
//                         </div>
//                         {/* category & country */}
//                         <div className="flex w-full gap-6">

//                             <select className="bg-white w-full p-2 rounded border border-gray-600" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
//                                 <option value="">Select Category</option>
//                                 {categories.map((c: any) => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
//                             </select>


//                             <select className="bg-white w-full p-2 rounded border border-gray-600" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value as any })}>
//                                 <option value="Egypt">Egypt</option>
//                                 <option value="Albania">Albania</option>
//                             </select>
//                         </div>
//                         <div className="flex gap-6">
//                             <label className=" gap-6 w-full">
//                                 Duration days
//                                 <input type="number" placeholder="Days"  className="bg-white p-2 rounded border border-gray-600 w-full" value={formData.durationDays} onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) })} required />
//                             </label>
//                             <label className=" gap-2 w-full">
//                                 Duration nights
//                                 <input type="number" placeholder="Nights" className="bg-white p-2 rounded border border-gray-600 w-full" value={formData.durationNights} onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) })} required />
//                             </label>
//                         </div>

//                         {/* <input type="number" placeholder="Price" className="bg-white p-2 rounded border border-gray-600" value={formData.price} onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })} required /> */}

//                         <textarea placeholder="Description (EN)"
//                             className="bg-white p-2 rounded border border-gray-600 w-full h-20"
//                             value={formData.descriptionEn}
//                             onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} />
//                         <textarea placeholder="التفاصيل بالعربي"
//                             className="bg-white p-2 rounded border border-gray-600 w-full h-20 text-right"
//                             value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} />



//                         {/* images */}
//                         <input type="file" multiple onChange={handleImageChange} />

//                         {previewImages.length > 0 && (
//                             <div className="grid grid-cols-3 gap-3">
//                                 {previewImages.map((src, i) => (
//                                     <div key={i} className="relative">
//                                         <img src={src} className="rounded h-32 object-cover" />
//                                         <button
//                                             type="button"
//                                             onClick={() => removePreviewImage(i)}
//                                             className="absolute top-1 right-1 bg-red-600 px-2 text-xs rounded"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}

//                         {/* days */}
//                         <h3 className="font-bold">Days</h3>

//                         {days.map((day, i) => (
//                             <div key={i} className="border p-4 rounded space-y-2 align-middle">
//                                 <h4>Day {day.dayNumber}</h4>

//                                 <div className="flex w-full gap-6">
//                                     <input
//                                         placeholder="Title EN"
//                                         value={day.titleEn}
//                                         className="bg-white w-full input text-left p-2 rounded border border-gray-600"
//                                         onChange={(e) =>
//                                             updateDay(i, 'titleEn', e.target.value)
//                                         }
//                                     />

//                                     <input
//                                         placeholder="العنوان بالعربي"
//                                         value={day.titleAr}
//                                         className="bg-white w-full input text-right p-2 rounded border border-gray-600"
//                                         onChange={(e) =>
//                                             updateDay(i, 'titleAr', e.target.value)
//                                         }
//                                     />
//                                 </div>
//                                 <div className="flex w-full flex-col gap-2">
//                                     <textarea
//                                         placeholder="Description EN"
//                                         value={day.descriptionEn}
//                                         className="bg-white  input text-left p-2 rounded border border-gray-600"
//                                         onChange={(e) =>
//                                             updateDay(i, 'descriptionEn', e.target.value)
//                                         }
//                                     />

//                                     <textarea
//                                         placeholder="الوصف بالعربي"
//                                         value={day.descriptionAr}
//                                         className="bg-white input text-right p-2 rounded border border-gray-600"
//                                         onChange={(e) =>
//                                             updateDay(i, 'descriptionAr', e.target.value)
//                                         }
//                                     />
//                                 </div>

//                                 <button
//                                     type="button"
//                                     onClick={() => removeDay(i)}
//                                     className="text-red-500"
//                                 >
//                                     Remove Day
//                                 </button>
//                             </div>
//                         ))}

//                         <button type="button" onClick={addDay}>
//                             ➕ Add Day
//                         </button>

//                         <button type="submit" className="w-full bg-green-600 py-3 rounded">
//                             Save Program
//                         </button>
//                     </form>
//                 )}

//                 <div className="m-6 p-6 bg-gray-300 rounded">
//                     <h2 className="text-xl font-bold mb-4">Available Programs ({programs.length})</h2>
//                     <div className="grid grid-cols-1 gap-4">
//                         {programs.map((p: Program) => (
//                             <div key={p._id}
//                                 onClick={() => window.location.href = `/Admindashbord/programs/${p._id}`}
//                                 className="bg-gray-800 p-4 text-white    rounded border border-gray-700 flex justify-between items-center hover:border-blue-500">
//                                 <div>
//                                     <h3 className="text-lg font-bold">{p.titleEn} / {p.titleAr}</h3>
//                                     <p className="text-sm text-gray-400">{p.durationDays} Days - {p.country} - ${p.price}</p>
//                                     <span className={`text-xs px-2 py-1 rounded ${p.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
//                                         {p.status}
//                                     </span>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button onClick={(e) => {
//                                         e.stopPropagation(); // STOP link navigation
//                                         e.preventDefault(); // STOP link navigation
//                                         startEdit(p)
//                                     }} className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700">Edit</button>

//                                     <button onClick={(e) => {
//                                         e.stopPropagation(); // STOP link navigation
//                                         e.preventDefault(); // STOP link navigation
//                                         deleteMutation.mutate(p._id)
//                                     }} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
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

interface Day {
    dayNumber: string
    titleEn: string
    titleAr: string
    descriptionEn: string
    descriptionAr: string
}


interface Program {
    _id: string
    titleEn: string
    titleAr: string
    category: { _id: string; nameEn: string }
    country: 'Egypt' | 'Albania'
    durationDays: number
    durationNights: number
    price: number
    descriptionEn: string
    descriptionAr: string
    itineraryEn: string
    itineraryAr: string
    status: 'active' | 'inactive'
    images?: string[]
    days?: Day[]
}

export default function ProgramsPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <ProgramsPageContent />
        </ProtectedRoute>
    );
}

function ProgramsPageContent() {
    const queryClient = useQueryClient()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingProgram, setEditingProgram] = useState<Program | null>(null)

    const [images, setImages] = useState<File[]>([])
    type PreviewImage = {
        url: string
        name?: string
        isNew: boolean
    }
    const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([]) // Track server images
    const [error, setError] = useState('')

    const [days, setDays] = useState<Day[]>([
        {
            dayNumber: '',
            titleEn: '',
            titleAr: '',
            descriptionEn: '',
            descriptionAr: '',
        },
    ])

    const [formData, setFormData] = useState({
        titleEn: '',
        titleAr: '',
        category: '',
        country: 'Egypt',
        durationDays: 1,
        durationNights: 0,
        price: 0,
        descriptionEn: '',
        descriptionAr: '',
        itineraryEn: '',
        itineraryAr: '',
        status: 'active',
    })

    // ================= FETCH =================
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () =>
            (await api.categories.getAll()).data,
    })

    const { data: programs = [] } = useQuery({
        queryKey: ['programs'],
        queryFn: async () =>
            (await api.programs.getAll()).data,
    })

    // ================= MUTATION =================
    const programMutation = useMutation({
        mutationFn: (payload: FormData) =>
            editingProgram
                ? api.programs.update(editingProgram._id, payload)
                : api.programs.create(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] })
            alert(editingProgram ? 'Program updated ✅' : 'Program added ✅')
            resetForm()
        },
        onError: (error: any) => {
            setError(error.response?.data?.message || error.response?.data?.error || 'Something went wrong')
        }
    })

    // ================= DELETE IMAGE MUTATION =================
    const deleteImageMutation = useMutation({
        mutationFn: ({ programId, imageName }: { programId: string; imageName: string }) =>
            api.programs.deleteImage(programId, imageName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['programs'] });

            if (editingProgram) {
                api.programs.getOne(editingProgram._id).then(res => {
                    const updatedProgram = res.data;
                    const rawImages = updatedProgram.images || [];

                    const serverImages = rawImages.map((img: string) => ({
                        url: img.startsWith('http')
                            ? img
                            : `${img}`,
                        name: img.split('/').pop(), // ✅ مهم
                        isNew: false
                    }));

                    setPreviewImages(serverImages); // ✅ FIX
                });
            }
        },
        onError: (error: any) => {
            alert('Failed to delete image: ' + (error.response?.data?.error || 'Unknown error'));
        }
    });


    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            api.programs.delete(id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ['programs'] }),
    })

    // ================= HANDLERS =================
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const fd = new FormData()

        // Append all form fields
        Object.entries(formData).forEach(([key, value]) => {
            fd.append(key, String(value))
        })

        fd.append('days', JSON.stringify(days))

        // Append NEW images only (File objects)
        images.forEach((img) => fd.append('images', img))

        programMutation.mutate(fd)
    }

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (!e.target.files) return

    //     const files = Array.from(e.target.files)

    //     setImages((prev) => [...prev, ...files])
    //     setPreviewImages((prev) => [
    //         ...prev,
    //         ...files.map((file) => URL.createObjectURL(file)),
    //     ])
    // }

    // const removePreviewImage = (index: number) => {
    //     // Check if it's an existing image or new image
    //     const imageToRemove = previewImages[index];

    //     // If it's a blob URL (new image), remove from images array
    //     if (imageToRemove.startsWith('blob:')) {
    //         const newIndex = previewImages.slice(0, index).filter(p => p.startsWith('blob:')).length;
    //         setImages((prev) => prev.filter((_, i) => i !== newIndex))
    //     } else {
    //         // It's an existing server image
    //         setExistingImages((prev) => prev.filter((_, i) => i !== index))
    //     }

    //     setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    // }


    // ================= UPDATED REMOVE HANDLER =================

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)

        setImages(prev => [...prev, ...files])

        setPreviewImages(prev => [
            ...prev,
            ...files.map(file => ({
                url: URL.createObjectURL(file),
                isNew: true
            }))
        ])
    }



    // const removePreviewImage = (index: number) => {
    //     const imageToRemove = previewImages[index];

    //     // If it's a blob URL (new image not yet saved), just remove from state
    //     if (imageToRemove.startsWith('blob:')) {
    //         const newIndex = previewImages.slice(0, index).filter(p => p.startsWith('blob:')).length;
    //         setImages((prev) => prev.filter((_, i) => i !== newIndex));
    //         setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    //     } else {
    //         // It's an existing server image - confirm before deleting
    //         if (!editingProgram) return;

    //         // Extract filename from URL
    //         const imageName = imageToRemove.split('/').pop();
    //         if (!imageName) return;

    //         if (confirm('Delete this image permanently?')) {
    //             deleteImageMutation.mutate({
    //                 programId: editingProgram._id,
    //                 imageName: imageName
    //             });
    //         }
    //     }
    // };


    const removePreviewImage = (index: number) => {
        const image = previewImages[index]

        if (image.isNew) {
            const newIndex = previewImages
                .slice(0, index)
                .filter(img => img.isNew).length

            setImages(prev => prev.filter((_, i) => i !== newIndex))
            setPreviewImages(prev => prev.filter((_, i) => i !== index))
        }
        // 🔵 EXISTING IMAGE
        else {
            if (!editingProgram || !image.name) return

            if (confirm('Delete this image permanently?')) {
                deleteImageMutation.mutate({
                    programId: editingProgram._id,
                    imageName: image.name // ✅ FIXED
                })
            }
        }
    }

    const updateDay = (i: number, field: keyof Day, value: string | number) => {
        const copy = days.map((d, idx) =>
            idx === i ? { ...d, [field]: value } : d
        )
        setDays(copy)
    }


    const addDay = () => {
        setDays((prev) => [
            ...prev,
            {
                dayNumber: String(prev.length + 1),
                titleEn: '',
                titleAr: '',
                descriptionEn: '',
                descriptionAr: '',
            },
        ])
    }

    const removeDay = (i: number) => {
        setDays((prev) =>
            prev
                .filter((_, index) => index !== i)
                .map((d, idx) => ({ ...d, dayNumber: String(idx + 1) }))
        )
    }

    const resetForm = () => {
        setFormData({
            titleEn: '',
            titleAr: '',
            category: '',
            country: 'Egypt',
            durationDays: 1,
            durationNights: 0,
            price: 0,
            descriptionEn: '',
            descriptionAr: '',
            itineraryEn: '',
            itineraryAr: '',
            status: 'active',
        })
        setImages([])
        setPreviewImages([])
        setExistingImages([])
        setDays([
            {
                dayNumber: '1',
                titleEn: '',
                titleAr: '',
                descriptionEn: '',
                descriptionAr: '',
            },
        ])
        setEditingProgram(null)
        setShowForm(false)
        setError('')
    }

    // const startEdit = (p: Program) => {
    //     setEditingProgram(p)
    //     setFormData({
    //         titleEn: p.titleEn,
    //         titleAr: p.titleAr,
    //         category: typeof p.category === 'object' && p.category ? p.category._id : '',
    //         country: p.country,
    //         durationDays: p.durationDays,
    //         durationNights: p.durationNights ?? 0,
    //         price: p.price,
    //         descriptionEn: p.descriptionEn ?? '',
    //         descriptionAr: p.descriptionAr ?? '',
    //         itineraryEn: p.itineraryEn ?? '',
    //         itineraryAr: p.itineraryAr ?? '',
    //         status: p.status,
    //     })

    //     // Reset new images
    //     setImages([])

    //     // Store existing images from server
    //     const rawImages = p.images || []
    //     setExistingImages(rawImages)

    //     // Create full URLs for preview
    //     const serverImages = rawImages.map((img) =>
    //         img.startsWith('http') ? img : `${img}`
    //     )
    //     setPreviewImages(serverImages)

    //     setDays(
    //         p.days?.length
    //             ? p.days.map((d, idx) => ({ ...d, dayNumber: idx + 1 }))
    //             : [{ dayNumber: 1, titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '' }]
    //     )
    //     setShowForm(true)
    // }

    // ================= UI =================


    const startEdit = (p: Program) => {
        setEditingProgram(p)

        setFormData({
            titleEn: p.titleEn,
            titleAr: p.titleAr,
            category: typeof p.category === 'object' && p.category ? p.category._id : '',
            country: p.country,
            durationDays: p.durationDays,
            durationNights: p.durationNights ?? 0,
            price: p.price,
            descriptionEn: p.descriptionEn ?? '',
            descriptionAr: p.descriptionAr ?? '',
            itineraryEn: p.itineraryEn ?? '',
            itineraryAr: p.itineraryAr ?? '',
            status: p.status,
        })

        setImages([])

        const rawImages = p.images || []

        const serverImages = rawImages.map((img) => ({
            url: img.startsWith('http')
                ? img
                : `${img}`,
            name: img.split('/').pop(),
            isNew: false
        }))

        setPreviewImages(serverImages)

        // FIXED: Convert dayNumber to string
        setDays(
            p.days?.length
                ? p.days.map((d, idx) => ({
                    ...d,
                    dayNumber: String(d.dayNumber || idx + 1)
                }))
                : [{ dayNumber: '1', titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '' }]
        )

        setShowForm(true)
    }


    return (
        <div className="min-h-screen flex bg-white text-black">
            <AdminSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                active="programs"
            />

            <div className="flex-1">
                <header className="bg-white p-4 flex justify-between">
                    <h1 className="text-2xl font-bold">Programs</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => (showForm ? resetForm() : setShowForm(true))}
                        className="bg-blue-600 px-4 py-2 rounded"
                    >
                        {showForm ? 'Cancel' : 'Add Program'}
                    </button>
                </header>
                <hr />

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col bg-gray-300 m-6 p-6 rounded space-y-4"
                    >
                        {/* titles */}
                        <div className="flex w-full gap-6">
                            <input
                                placeholder="Title EN"
                                className="bg-white w-full input text-left p-2 rounded border border-gray-600"
                                value={formData.titleEn}
                                onChange={(e) =>
                                    setFormData({ ...formData, titleEn: e.target.value })
                                }
                                required
                            />

                            <input
                                placeholder="العنوان بالعربي"
                                className="bg-white w-full input text-right p-2 rounded border border-gray-600"
                                value={formData.titleAr}
                                onChange={(e) =>
                                    setFormData({ ...formData, titleAr: e.target.value })
                                }
                                required
                            />
                        </div>

                        {/* category & country */}
                        <div className="flex w-full gap-6">
                            <select
                                className="bg-white w-full p-2 rounded border border-gray-600"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.nameEn}</option>)}
                            </select>

                            <select
                                className="bg-white w-full p-2 rounded border border-gray-600"
                                value={formData.country}
                                onChange={e => setFormData({ ...formData, country: e.target.value as any })}
                            >
                                <option value="Egypt">Egypt</option>
                                <option value="Albania">Albania</option>
                            </select>
                        </div>

                        <div className="flex gap-6">
                            <label className="gap-6 w-full">
                                Duration days
                                <input
                                    type="number"
                                    placeholder="Days"
                                    className="bg-white p-2 rounded border border-gray-600 w-full"
                                    value={formData.durationDays}
                                    onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                                    required
                                />
                            </label>
                            <label className="gap-2 w-full">
                                Duration nights
                                <input
                                    type="number"
                                    placeholder="Nights"
                                    className="bg-white p-2 rounded border border-gray-600 w-full"
                                    value={formData.durationNights}
                                    onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) })}
                                    required
                                />
                            </label>
                        </div>

                        <textarea
                            placeholder="Description (EN)"
                            className="bg-white p-2 rounded border border-gray-600 w-full h-20"
                            value={formData.descriptionEn}
                            onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
                        />

                        <textarea
                            placeholder="التفاصيل بالعربي"
                            className="bg-white p-2 rounded border border-gray-600 w-full h-20 text-right"
                            value={formData.descriptionAr}
                            onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
                        />

                        {/* images */}
                        <div className="space-y-2">
                            <label className="font-semibold">Upload Images:</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="bg-white p-2 rounded border border-gray-600 w-full"
                            />
                        </div>

                        {/* {previewImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {previewImages.map((src, i) => (
                                    <div key={i} className="relative">
                                        <img src={src} className="rounded h-32 w-full object-cover" alt={`Preview ${i + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => removePreviewImage(i)}
                                            className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )} */}
                        {/* {previewImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {previewImages.map((src, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={src}
                                            className="rounded h-32 w-full object-cover"
                                            alt={`Preview ${i + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePreviewImage(i)}
                                            disabled={deleteImageMutation.isPending}
                                            className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                                        >
                                            {deleteImageMutation.isPending && src === previewImages[i] ? (
                                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            ) : (
                                                '✕'
                                            )}
                                        </button>
                                        {!src.startsWith('blob:') && (
                                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                                Saved
                                            </span>
                                        )}
                                        {src.startsWith('blob:') && (
                                            <span className="absolute bottom-1 left-1 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded">
                                                New
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )} */}
                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-3">
                                {previewImages.map((img, i) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={img.url}
                                            className="rounded h-32 w-full object-cover"
                                            alt="preview"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => removePreviewImage(i)}
                                            disabled={deleteImageMutation.isPending}
                                            className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded"
                                        >
                                            ✕
                                        </button>

                                        {!img.isNew && (
                                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                                Saved
                                            </span>
                                        )}

                                        {img.isNew && (
                                            <span className="absolute bottom-1 left-1 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded">
                                                New
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}


                        {/* days */}
                        <h3 className="font-bold">Days</h3>

                        {days.map((day, i) => (
                            <div key={i} className="border p-4 rounded space-y-2 align-middle bg-white">

                                <div className="flex w-full gap-6">
                                    <label className="gap-2 w-full">
                                        Day Number
                                        <input
                                            type="text"
                                            value={day.dayNumber}
                                            onChange={(e) => updateDay(i, 'dayNumber', e.target.value)}
                                            className='bg-gray-50  input text-left m-2 rounded border border-gray-600'
                                            required
                                        />
                                    </label>
                                </div>
                                <div className="flex w-full gap-6">
                                    <input
                                        placeholder="Title EN"
                                        value={day.titleEn}
                                        className="bg-gray-50 w-full input text-left p-2 rounded border border-gray-600"
                                        onChange={(e) =>
                                            updateDay(i, 'titleEn', e.target.value)
                                        }
                                    />

                                    <input
                                        placeholder="العنوان بالعربي"
                                        value={day.titleAr}
                                        className="bg-gray-50 w-full input text-right p-2 rounded border border-gray-600"
                                        onChange={(e) =>
                                            updateDay(i, 'titleAr', e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex w-full flex-col gap-2">
                                    <textarea
                                        placeholder="Description EN"
                                        value={day.descriptionEn}
                                        className="bg-gray-50 input text-left p-2 rounded border border-gray-600"
                                        onChange={(e) =>
                                            updateDay(i, 'descriptionEn', e.target.value)
                                        }
                                    />

                                    <textarea
                                        placeholder="الوصف بالعربي"
                                        value={day.descriptionAr}
                                        className="bg-gray-50 input text-right p-2 rounded border border-gray-600"
                                        onChange={(e) =>
                                            updateDay(i, 'descriptionAr', e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeDay(i)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove Day
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addDay}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            ➕ Add Day
                        </button>

                        {/* Submit Button with Loading State */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 py-3 rounded text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                            disabled={programMutation.isPending}
                        >
                            {programMutation.isPending ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {editingProgram ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                editingProgram ? 'Update Program' : 'Save Program'
                            )}
                        </button>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                    </form>
                )}

                <div className="m-6 p-6 bg-gray-300 rounded">
                    <h2 className="text-xl font-bold mb-4">Available Programs ({programs.length})</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {programs.map((p: Program) => (
                            <div
                                key={p._id}
                                onClick={() => window.location.href = `/Admindashbord/programs/${p._id}`}
                                className="bg-gray-800 p-4 text-white rounded border border-gray-700 flex justify-between items-center hover:border-blue-500 cursor-pointer"
                            >
                                <div>
                                    <h3 className="text-lg font-bold">{p.titleEn} / {p.titleAr}</h3>
                                    <p className="text-sm text-gray-400">{p.durationDays} Days - {p.country} - ${p.price}</p>
                                    <span className={`text-xs px-2 py-1 rounded ${p.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            startEdit(p)
                                        }}
                                        className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (confirm('Are you sure you want to delete this program?')) {
                                                deleteMutation.mutate(p._id)
                                            }
                                        }}
                                        className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 
// 'use client'

// import React, { useState } from 'react'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
// import { ProtectedRoute } from '@/components/ProtectedRoute';

// interface Country {
//     _id: string
//     nameEn: string
//     nameAr: string
//     country: string
//     images: string[]
//     inVisa: boolean
//     inFromCountry: boolean,
//     inToCountry: boolean,
// }

// export default function CountryPage() {
//     return (
//         <ProtectedRoute requiredRole="admin">
//             <CountryPageContent />
//         </ProtectedRoute>
//     );
// }

// const CountryPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [showForm, setShowForm] = useState(false)
//     const [editingCountry, setEditingCountry] = useState<Country | null>(null)
//     const [images, setImages] = useState<File[]>([])
//     const [previewImages, setPreviewImages] = useState<string[]>([])
//     const [error, setError] = useState<string | null>(null)
//     const [formData, setFormData] = useState({
//         nameEn: '',
//         nameAr: '',
//         images: '',
//         inVisa: false,
//         inFromCountry: false,
//         inToCountry: false,
//     })

//     const queryClient = useQueryClient()

//     // ================= FETCH =================
//     const { data: countries = [] } = useQuery({
//         queryKey: ['countries'],
//         queryFn: async () => (await api.countries.getAll()).data,


//     })
//     console.log(countries)

//     // ================= MUTATION =================
//     // const countryMutation = useMutation({
//     //     mutationFn: (payload: typeof formData) =>
//     //         editingCountry
//     //             ? api.countries.update(editingCountry._id, payload)
//     //             : api.countries.create(payload),

//     //     onSuccess: () => {
//     //         queryClient.invalidateQueries({ queryKey: ['countries'] })
//     //         alert(editingCountry ? 'Country updated!' : 'Country added!')
//     //         resetForm()
//     //     },

//     //     onError: (error: any) =>
//     //         alert(error.response?.data?.error || 'Error')
//     // })


//     const deleteMutation = useMutation({
//         mutationFn: (id: string) => api.countries.delete(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['countries'] })
//     })


//     // ================= HANDLERS =================
//     // const handleSubmit = async (e: React.FormEvent) => {
//     //     e.preventDefault()
//     //     alert("Submitting form...") // Debugging alert to confirm form submission

//     //     try {
//     //         if (editingCountry) {
//     //             // If a new image was selected while editing, upload it first
//     //             if (images.length > 0) {
//     //                 const imgForm = new FormData();
//     //                 imgForm.append('images', images[0]);
//     //                 await api.countries.addImages(editingCountry._id, imgForm);
//     //             }

//     //             await api.countries.update(editingCountry._id, {
//     //                 nameEn: formData.nameEn,
//     //                 nameAr: formData.nameAr,
//     //                 inVisa: formData.inVisa,
//     //                 inFromCountry: formData.inFromCountry,
//     //                 inToCountry: formData.inToCountry
//     //             });

//     //             alert('Country updated!');
//     //         } else {
//     //             const data = new FormData();
//     //             data.append('nameEn', formData.nameEn);
//     //             data.append('nameAr', formData.nameAr);
//     //             data.append('inVisa', String(formData.inVisa));
//     //             data.append('inFromCountry', String(formData.inFromCountry));
//     //             data.append('inToCountry', String(formData.inToCountry));
//     //             if (images.length > 0) data.append('images', images[0]);

//     //             await api.countries.create(data);
//     //             alert('Country added!');
//     //         }

//     //         queryClient.invalidateQueries({ queryKey: ['countries'] });
//     //         resetForm();
//     //     } catch (err: any) {
//     //         console.log(err)
//     //         setError(err.response?.data?.error || 'Error');
//     //     }
//     // }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         try {
//             const data = new FormData();
//             data.append('nameEn', formData.nameEn);
//             data.append('nameAr', formData.nameAr);
//             data.append('inVisa', String(formData.inVisa));
//             data.append('inFromCountry', String(formData.inFromCountry));
//             data.append('inToCountry', String(formData.inToCountry));
            
//             if (images.length > 0) {
//                 data.append('images', images[0]);
//             }

//             if (editingCountry) {
//                 await api.countries.update(editingCountry._id, data);
//                 alert('Country updated!');
//             } else {
//                 await api.countries.create(data);
//                 alert('Country added!');
//             }

//             queryClient.invalidateQueries({ queryKey: ['countries'] });
//             resetForm();
//         } catch (err: any) {
//             console.log(err)
//             setError(err.response?.data?.error || 'Error');
//         }
//     }
//     const resetForm = () => {
//         setFormData({
//             nameEn: '',
//             nameAr: '',
//             images: '',
//             inVisa: false,
//             inFromCountry: false,
//             inToCountry: false
//         })
//         setImages([])
//         setPreviewImages([])
//         setEditingCountry(null)
//         setShowForm(false)
//     }

//     const startEdit = (c: Country) => {
//         setEditingCountry(c)
//         setFormData({
//             nameEn: c.nameEn,
//             nameAr: c.nameAr,
//             images: '',
//             inVisa: c.inVisa,
//             inFromCountry: c.inFromCountry,
//             inToCountry: c.inToCountry
//         })

//         // show existing images from server
//         setImages([])
//         setPreviewImages((c.images || []).map(img => `/uploads/countries/${img}`))

//         setShowForm(true)
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
//     // ================= UI =================
//     return (
//         <div className="min-h-screen flex bg-white text-black">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Countries" />

//             <div className="flex-1">
//                 <header className="bg-white p-4 flex justify-between">
//                     <h1 className="text-2xl font-bold">Country Management</h1>
//                     <button
//                         onClick={() => setSidebarOpen(true)}
//                         className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
//                     >
//                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                         </svg>
//                     </button>
//                     <button
//                         onClick={() => showForm ? resetForm() : setShowForm(true)}
//                         className="bg-blue-600 px-4 py-2 mx-4 rounded"
//                     >
//                         {showForm ? 'Cancel' : 'Add Country'}
//                     </button>
//                 </header>

//                 <hr className="border-gray-300" />

//                 {showForm && (
//                     <div className="bg-gray-200 m-6 p-6 rounded-lg">
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             {/* error massage */}
//                             {error && (
//                                 <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
//                                     {error}
//                                 </div>
//                             )}

//                             {/* TEXT INPUTS (UNCHANGED) */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <input
//                                     placeholder="Name (EN)"
//                                     className="bg-white p-2 rounded border border-gray-600"
//                                     value={formData.nameEn}
//                                     onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
//                                     required
//                                 />

//                                 <input
//                                     placeholder="Name (AR)"
//                                     className="bg-white p-2 rounded border border-gray-600 text-right"
//                                     value={formData.nameAr}
//                                     onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
//                                     required
//                                 />

//                             </div>
//                             {/* images */}
//                             <input type="file" accept="image/*" onChange={handleImageChange} />

//                             {previewImages.length > 0 && (
//                                 <div className="grid grid-cols-3 gap-3">
//                                     {previewImages.map((src, i) => (
//                                         <div key={i} className="relative">
//                                             <img src={src} className="rounded h-32 object-cover" />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removePreviewImage(i)}
//                                                 className="absolute top-1 right-1 bg-red-600 px-2 text-xs rounded"
//                                             >
//                                                 ✕
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                             <div className="flex items-center gap-4">
//                                 <label className="flex items-center gap-2">
//                                     <input type="checkbox" checked={formData.inVisa === true} onChange={() => setFormData({ ...formData, inVisa: !formData.inVisa })} /> Add to Visa
//                                 </label>
//                                 <label className="flex items-center gap-2">
//                                     <input type="checkbox" checked={formData.inFromCountry === true} onChange={() => setFormData({ ...formData, inFromCountry: !formData.inFromCountry })} /> Add to From Country
//                                 </label>
//                                 <label className="flex items-center gap-2">
//                                     <input type="checkbox" checked={formData.inToCountry === true} onChange={() => setFormData({ ...formData, inToCountry: !formData.inToCountry })} /> Add to To Country
//                                 </label>
//                                 {/* <label className="flex items-center gap-2">
//                                     <input type="radio" checked={formData.isActive === false} onChange={() => setFormData({ ...formData, isActive: false })} /> Inactive
//                                 </label> */}
//                             </div>

//                             <button type="submit" disabled={!formData.nameEn || !formData.nameAr}
//                                 className="w-full bg-green-600 py-3 rounded">
//                                 {editingCountry ? 'Update Country' : 'Save Country'}
//                             </button>
//                         </form>
//                     </div>
//                 )}

//                 <div className="m-6 p-6">
//                     <h2 className="text-xl font-bold mb-4">Available Countries ({countries.length})</h2>
//                     <div className="flex flex-wrap gap-6 justify-start">
//                         {countries.map((p: Country) => {
//                             const imageUrl =
//                                 p.images && p.images.length > 0
//                                     ? `${p.images[0]}`
//                                     : '/default-country.jpg'

//                             return (
//                                 <div key={p._id}>
//                                     <div
//                                         className="dashboard_button_img1 relative h-48 w-full bg-cover bg-center flex items-center flex-col justify-center"
//                                         style={{
//                                             backgroundImage: `
//                         linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)),
//                         url(${imageUrl})
//                     `
//                                         }}
//                                     >
//                                         <span className="text-3xl text-white font-bold text-center">
//                                             {p.nameEn} - {p.nameAr}
//                                         </span>
//                                         <div>
//                                             <button onClick={() => startEdit(p)} className=" dashboard_county_button m-2 bg-blue-600 px-3 py-1 text-sm rounded">
//                                                 Edit
//                                             </button>
//                                             <button onClick={() => deleteMutation.mutate(p._id)} className="dashboard_county_button m-2 bg-red-600 px-3 py-1 text-sm rounded">
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )
//                         })}

//                     </div>
//                 </div>
//             </div >
//         </div >
//     )
// }



'use client'

import React, { useState } from 'react'
import AdminSidebar from '@/components/adminSidebar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
    Globe, 
    Plus, 
    X, 
    Edit3, 
    Trash2, 
    Image as ImageIcon, 
    MapPin, 
    Plane, 
    FileText,
    CheckCircle2,
    Menu,
    AlertCircle,
    Flag
} from 'lucide-react';

interface Country {
    _id: string
    nameEn: string
    nameAr: string
    country: string
    images: string[]
    inVisa: boolean
    inFromCountry: boolean,
    inToCountry: boolean,
}

export default function CountryPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <CountryPageContent />
        </ProtectedRoute>
    );
}

const CountryPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingCountry, setEditingCountry] = useState<Country | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        images: '',
        inVisa: false,
        inFromCountry: false,
        inToCountry: false,
    })

    const queryClient = useQueryClient()

    // ================= FETCH =================
    const { data: countries = [] } = useQuery({
        queryKey: ['countries'],
        queryFn: async () => (await api.countries.getAll()).data,
    })

    // ================= MUTATION =================
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.countries.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['countries'] })
    })

    // ================= HANDLERS =================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const data = new FormData();
            data.append('nameEn', formData.nameEn);
            data.append('nameAr', formData.nameAr);
            data.append('inVisa', String(formData.inVisa));
            data.append('inFromCountry', String(formData.inFromCountry));
            data.append('inToCountry', String(formData.inToCountry));
            
            if (images.length > 0) {
                data.append('images', images[0]);
            }

            if (editingCountry) {
                await api.countries.update(editingCountry._id, data);
                alert('Country updated!');
            } else {
                await api.countries.create(data);
                alert('Country added!');
            }

            queryClient.invalidateQueries({ queryKey: ['countries'] });
            resetForm();
        } catch (err: any) {
            console.log(err)
            setError(err.response?.data?.error || 'Error');
        }
    }

    const resetForm = () => {
        setFormData({
            nameEn: '',
            nameAr: '',
            images: '',
            inVisa: false,
            inFromCountry: false,
            inToCountry: false
        })
        setImages([])
        setPreviewImages([])
        setEditingCountry(null)
        setShowForm(false)
        setError(null)
    }

    const startEdit = (c: Country) => {
        setEditingCountry(c)
        setFormData({
            nameEn: c.nameEn,
            nameAr: c.nameAr,
            images: '',
            inVisa: c.inVisa,
            inFromCountry: c.inFromCountry,
            inToCountry: c.inToCountry
        })

        setImages([])
        setPreviewImages((c.images || []).map(img => `/uploads/countries/${img}`))

        setShowForm(true)
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

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Countries" />

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
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Country Management</h1>
                                <p className="text-xs text-slate-500 font-medium">Manage destinations & visa options</p>
                            </div>
                        </div>

                        <button
                            onClick={() => showForm ? resetForm() : setShowForm(true)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                                showForm 
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300' 
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
                            }`}
                        >
                            {showForm ? (
                                <><X className="w-4 h-4" /> Cancel</>
                            ) : (
                                <><Plus className="w-4 h-4" /> Add Country</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    {editingCountry ? (
                                        <><Edit3 className="w-5 h-5 text-emerald-600" /> Edit Country</>
                                    ) : (
                                        <><Plus className="w-5 h-5 text-emerald-600" /> New Country</>
                                    )}
                                </h2>
                            </div>
                            
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Error Message */}
                                    {error && (
                                        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                            <p className="font-medium">{error}</p>
                                        </div>
                                    )}

                                    {/* Text Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                <Flag className="w-4 h-4" /> English Name
                                            </label>
                                            <input
                                                placeholder="Country name in English"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 outline-none text-slate-700"
                                                value={formData.nameEn}
                                                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                <Flag className="w-4 h-4" /> Arabic Name
                                            </label>
                                            <input
                                                placeholder="اسم الدولة بالعربية"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 text-right"
                                                value={formData.nameAr}
                                                onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Country Image
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleImageChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-semibold hover:file:bg-emerald-100 transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Preview Images */}
                                    {previewImages.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {previewImages.map((src, i) => (
                                                <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                                    <img src={src} className="w-full h-32 object-cover" />
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => removePreviewImage(i)}
                                                        className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-600 shadow-sm"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Options Checkboxes */}
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Usage Options</span>
                                        <div className="flex flex-wrap gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-12 h-6 rounded-full transition-all duration-200 relative ${formData.inVisa ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only"
                                                        checked={formData.inVisa}
                                                        onChange={() => setFormData({ ...formData, inVisa: !formData.inVisa })}
                                                    />
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${formData.inVisa ? 'left-7' : 'left-1'}`} />
                                                </div>
                                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                                                    <FileText className="w-4 h-4 text-emerald-600" /> Visa Applications
                                                </span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-12 h-6 rounded-full transition-all duration-200 relative ${formData.inFromCountry ? 'bg-blue-500' : 'bg-slate-300'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only"
                                                        checked={formData.inFromCountry}
                                                        onChange={() => setFormData({ ...formData, inFromCountry: !formData.inFromCountry })}
                                                    />
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${formData.inFromCountry ? 'left-7' : 'left-1'}`} />
                                                </div>
                                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                                                    <Plane className="w-4 h-4 text-blue-600" /> From Country
                                                </span>
                                            </label>

                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-12 h-6 rounded-full transition-all duration-200 relative ${formData.inToCountry ? 'bg-purple-500' : 'bg-slate-300'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only"
                                                        checked={formData.inToCountry}
                                                        onChange={() => setFormData({ ...formData, inToCountry: !formData.inToCountry })}
                                                    />
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${formData.inToCountry ? 'left-7' : 'left-1'}`} />
                                                </div>
                                                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                                                    <MapPin className="w-4 h-4 text-purple-600" /> To Country
                                                </span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit" 
                                        disabled={!formData.nameEn || !formData.nameAr}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        {editingCountry ? 'Update Country' : 'Create Country'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Countries Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-600" />
                                Available Countries
                                <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                                    {countries.length}
                                </span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {countries.map((p: Country) => {
                                const imageUrl =
                                    p.images && p.images.length > 0
                                        ? `${p.images[0]}`
                                        : '/default-country.jpg'

                                return (
                                    <div 
                                        key={p._id}
                                        className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                    >
                                        {/* Background Image */}
                                        <div 
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{
                                                backgroundImage: `url(${imageUrl})`
                                            }}
                                        />
                                        
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute inset-0 flex flex-col justify-end p-5">
                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {p.inVisa && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                                                        Visa
                                                    </span>
                                                )}
                                                {p.inFromCountry && (
                                                    <span className="px-2 py-0.5 bg-blue-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                                                        From
                                                    </span>
                                                )}
                                                {p.inToCountry && (
                                                    <span className="px-2 py-0.5 bg-purple-500/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-sm">
                                                        To
                                                    </span>
                                                )}
                                            </div>

                                            {/* Names */}
                                            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                                                {p.nameEn}
                                            </h3>
                                            <p className="text-sm text-white/80 font-medium mb-4" dir="rtl">
                                                {p.nameAr}
                                            </p>

                                            {/* Actions */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                                <button 
                                                    onClick={() => startEdit(p)} 
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all duration-200 border border-white/20"
                                                >
                                                    <Edit3 className="w-4 h-4" /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this country?')) {
                                                            deleteMutation.mutate(p._id)
                                                        }
                                                    }}
                                                    disabled={deleteMutation.isPending}
                                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-rose-500/90 backdrop-blur-md text-white rounded-xl font-semibold text-sm hover:bg-rose-600/90 transition-all duration-200 disabled:opacity-50"
                                                >
                                                    {deleteMutation.isPending ? (
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <><Trash2 className="w-4 h-4" /> Delete</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {countries.length === 0 && (
                            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-slate-600 text-lg font-medium">No countries yet</p>
                                <p className="text-slate-400 mt-1">Add your first country to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
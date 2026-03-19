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
//             if (editingCountry) {
//                 // If a new image was selected while editing, upload it first
//                 if (images.length > 0) {
//                     const imgForm = new FormData();
//                     imgForm.append('images', images[0]);
//                     await api.countries.addImages(editingCountry._id, imgForm);
//                 }

//                 await api.countries.update(editingCountry._id, {
//               nameEn: formData.nameEn,
//                     nameAr: formData.nameAr,
//                     inVisa: formData.inVisa,
//                     inFromCountry: formData.inFromCountry,
//                     inToCountry: formData.inToCountry
//                 });

//                 alert('Category updated!');
//             } else {
//              const data = new FormData();
//                 data.append('nameEn', formData.nameEn);
//                 data.append('nameAr', formData.nameAr);
//                 data.append('inVisa', String(formData.inVisa));
//                 data.append('inFromCountry', String(formData.inFromCountry));
//                 data.append('inToCountry', String(formData.inToCountry));
//                 if (images.length > 0) data.append('images', images[0]);

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
//         setPreviewImages((c.images || []).map(img => `http://147.93.126.15/uploads/countries/${img}`))

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
//                                     ? `http://147.93.126.15${p.images[0]}`
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

const API_BASE_URL = "http://147.93.126.15";

interface Country {
    _id: string
    nameEn: string
    nameAr: string
    country: string
    images: string[]
    inVisa: boolean
    inFromCountry: boolean
    inToCountry: boolean
    inhomepage?: boolean
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
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        inVisa: false,
        inFromCountry: false,
        inToCountry: false,
        inhomepage: false
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
        setIsSubmitting(true)
        setError(null)

        try {
            // ✅ FIX: Always use FormData for both create and update
            const data = new FormData();

            data.append('nameEn', formData.nameEn);
            data.append('nameAr', formData.nameAr);
            data.append('inVisa', String(formData.inVisa));
            data.append('inFromCountry', String(formData.inFromCountry));
            data.append('inToCountry', String(formData.inToCountry));
            data.append('inhomepage', String(formData.inhomepage));

            // Add new image if selected
            if (images.length > 0) {
                data.append('images', images[0]);
            }

            if (editingCountry) {
                // ✅ FIX: Send existing images to keep
                if (existingImages.length > 0) {
                    data.append('keepImages', JSON.stringify(existingImages));
                }

                await api.countries.update(editingCountry._id, data);
                alert('Country updated!');
            } else {
                await api.countries.create(data);
                alert('Country added!');
            }

            queryClient.invalidateQueries({ queryKey: ['countries'] });
            resetForm();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Error saving country');
        } finally {
            setIsSubmitting(false);
        }
    }

    const resetForm = () => {
        setFormData({
            nameEn: '',
            nameAr: '',
            inVisa: false,
            inFromCountry: false,
            inToCountry: false,
            inhomepage: false
        })
        setImages([])
        setPreviewImages([])
        setExistingImages([])
        setEditingCountry(null)
        setShowForm(false)
        setError(null)
    }

    const startEdit = (c: Country) => {
        setEditingCountry(c)
        setFormData({
            nameEn: c.nameEn,
            nameAr: c.nameAr,
            inVisa: c.inVisa,
            inFromCountry: c.inFromCountry,
            inToCountry: c.inToCountry,
            inhomepage: c.inhomepage || false
        })

        // ✅ FIX: Store existing image paths (they come as "/uploads/countries/filename.jpg")
        setImages([])
        setExistingImages(c.images || [])
        setPreviewImages(c.images || [])

        setShowForm(true)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const file = e.target.files[0]
        if (!file) return

        // Check file size (20MB limit)
        const maxSize = 20 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File too large. Maximum size is 20MB.');
            return;
        }

        setImages([file])
        setPreviewImages([URL.createObjectURL(file)])
    }

    const removePreviewImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    }

    // ✅ FIX: Remove existing image
    const removeExistingImage = (index: number) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index))
        setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    }

    // ✅ FIX: Helper to get full image URL
    const getFullImageUrl = (path: string): string => {
        if (!path) return '/default-country.jpg';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}${path}`;
    };

    // ================= UI =================
    return (
        <div className="min-h-screen flex bg-white text-black">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Countries" />

            <div className="flex-1">
                <header className="bg-white p-4 flex justify-between">
                    <h1 className="text-2xl font-bold">Country Management</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 mr-4"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => showForm ? resetForm() : setShowForm(true)}
                        className="bg-blue-600 px-4 py-2 mx-4 rounded"
                    >
                        {showForm ? 'Cancel' : 'Add Country'}
                    </button>
                </header>

                <hr className="border-gray-300" />

                {showForm && (
                    <div className="bg-gray-200 m-6 p-6 rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* error message */}
                            {error && (
                                <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {/* TEXT INPUTS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    placeholder="Name (EN)"
                                    className="bg-white p-2 rounded border border-gray-600"
                                    value={formData.nameEn}
                                    onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                    required
                                />

                                <input
                                    placeholder="Name (AR)"
                                    className="bg-white p-2 rounded border border-gray-600 text-right"
                                    value={formData.nameAr}
                                    onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Existing Images (Edit Mode) */}
                            {editingCountry && existingImages.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-sm mb-2">Current Images (click ✕ to remove):</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {existingImages.map((imgPath, i) => (
                                            <div key={`existing-${i}`} className="relative">
                                                <img 
                                                    src={getFullImageUrl(imgPath)} 
                                                    className="rounded h-32 object-cover w-full" 
                                                    alt="Current"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(i)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white px-2 text-xs rounded"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Image Upload */}
                            <div>
                                <label className="block text-sm font-bold mb-2">
                                    {editingCountry ? 'Add New Image:' : 'Upload Image:'}
                                </label>
                                <input 
                                    type="file" 
                                    accept="image/jpeg,image/png,image/jpg,image/webp" 
                                    onChange={handleImageChange} 
                                />
                                <p className="text-xs text-gray-600 mt-1">Max 20MB per image</p>
                            </div>

                            {/* Preview New Image */}
                            {previewImages.length > 0 && images.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-sm mb-2">New Image:</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {previewImages.map((src, i) => (
                                            <div key={`new-${i}`} className="relative">
                                                <img src={src} className="rounded h-32 object-cover w-full" alt="Preview" />
                                                <button
                                                    type="button"
                                                    onClick={() => removePreviewImage(i)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white px-2 text-xs rounded"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Checkboxes */}
                            <div className="flex flex-wrap items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.inVisa} 
                                        onChange={() => setFormData({ ...formData, inVisa: !formData.inVisa })} 
                                    /> 
                                    Add to Visa
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.inFromCountry} 
                                        onChange={() => setFormData({ ...formData, inFromCountry: !formData.inFromCountry })} 
                                    /> 
                                    Add to From Country
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.inToCountry} 
                                        onChange={() => setFormData({ ...formData, inToCountry: !formData.inToCountry })} 
                                    /> 
                                    Add to To Country
                                </label>
                                <label className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.inhomepage} 
                                        onChange={() => setFormData({ ...formData, inhomepage: !formData.inhomepage })} 
                                    /> 
                                    Show on Homepage
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={!formData.nameEn || !formData.nameAr || isSubmitting}
                                className="w-full bg-green-600 py-3 rounded disabled:bg-gray-400"
                            >
                                {isSubmitting 
                                    ? 'Saving...' 
                                    : (editingCountry ? 'Update Country' : 'Save Country')
                                }
                            </button>
                        </form>
                    </div>
                )}

                {/* Countries List */}
                <div className="m-6 p-6">
                    <h2 className="text-xl font-bold mb-4">Available Countries ({countries.length})</h2>
                    <div className="flex flex-wrap gap-6 justify-start">
                        {countries.map((p: Country) => {
                            const imageUrl = getFullImageUrl(p.images?.[0])

                            return (
                                <div key={p._id}>
                                    <div
                                        className="dashboard_button_img1 relative h-48 w-full bg-cover bg-center flex items-center flex-col justify-center"
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)),
                                                url(${imageUrl})
                                            `
                                        }}
                                    >
                                        <span className="text-3xl text-white font-bold text-center">
                                            {p.nameEn} - {p.nameAr}
                                        </span>
                                        <div>
                                            <button 
                                                onClick={() => startEdit(p)} 
                                                className="dashboard_county_button m-2 bg-blue-600 px-3 py-1 text-sm rounded"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (confirm('Delete this country?')) {
                                                        deleteMutation.mutate(p._id)
                                                    }
                                                }} 
                                                className="dashboard_county_button m-2 bg-red-600 px-3 py-1 text-sm rounded"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
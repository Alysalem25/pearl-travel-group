// 'use client'

// import React, { useState } from 'react'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
// import { ProtectedRoute } from '@/components/ProtectedRoute';

// function buildImageUrl(path: string) {
//     if (!path) return '';
//     return path.startsWith('http') ? path : `${path}`;
// }

// interface Category {
//     _id: string
//     nameEn: string
//     nameAr: string
//     type: 'Incoming' | 'outgoing' | 'Domestic' | 'Educational' | 'Corporate'
//     country: string
//     images: string[]
//     isActive: boolean
// }
// type CategoryPayload = {
//     nameEn: string
//     nameAr: string
//     type: string
//     country: string
//     images: string
//     isActive: boolean
// }
// export default function CategoriesPage() {
//     return (
//         <ProtectedRoute requiredRole="head" requiredPermission="add_category">
//             <CategoriesPageContent />
//         </ProtectedRoute>
//     );
// }

// const CategoriesPageContent = () => {
//     const [sidebarOpen, setSidebarOpen] = useState(false)
//     const [showForm, setShowForm] = useState(false)
//     const [editingCategory, setEditingCategory] = useState<Category | null>(null)
//     const [images, setImages] = useState<File[]>([])
//     // const [previewImages, setPreviewImages] = useState<string[]>([])
//     const [error, setError] = useState<string | null>(null)
//     const [formData, setFormData] = useState({
//         nameEn: '',
//         nameAr: '',
//         type: '',
//         country: 'Egypt',
//         images: '',
//         isActive: true
//     })
//     type PreviewImage = {
//         url: string
//         name?: string
//         isNew: boolean
//     }

//     const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])

//     const queryClient = useQueryClient()

//     // ================= FETCH =================
//     const { data: categories = [] } = useQuery({
//         queryKey: ['categories'],
//         queryFn: async () => (await api.categories.getAll()).data
//     })

//     // ================= MUTATION =================
//     // const categoryMutation = useMutation({
//     //     mutationFn: (payload: typeof formData) =>
//     //         editingCategory
//     //             ? api.categories.update(editingCategory._id, payload)
//     //             : api.categories.create(payload),

//     //     onSuccess: () => {
//     //         queryClient.invalidateQueries({ queryKey: ['categories'] })
//     //         alert(editingCategory ? 'Category updated!' : 'Category added!')
//     //         resetForm()
//     //     },

//     //     onError: (error: any) =>
//     //         alert(error.response?.data?.error || 'Error')
//     // })


//     // const categoryMutation = useMutation({
//     //     mutationFn: (payload: typeof formData) =>
//     //         editingCategory
//     //             ? api.categories.update(editingCategory._id, payload)
//     //             : api.categories.create(payload),

//     //     onSuccess: () => {
//     //         queryClient.invalidateQueries({ queryKey: ['categories'] })
//     //         alert(editingCategory ? 'Category updated!' : 'Category added!')
//     //         resetForm()
//     //     },

//     //     onError: (error: any) =>
//     //         alert(error.response?.data?.error || 'Error')
//     // })


//     const deleteMutation = useMutation({
//         mutationFn: (id: string) => api.categories.delete(id),
//         onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
//     })

//     const deleteImageMutation = useMutation({
//         mutationFn: ({ categoryId, imageName }: { categoryId: string, imageName: string }) =>
//             api.categories.deleteImage(categoryId, imageName),

//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['categories'] })

//             if (editingCategory) {
//                 api.categories.getOne(editingCategory._id).then(res => {
//                     const updated = res.data

//                     const serverImages = (updated.images || []).map((img: string) => ({
//                         url: buildImageUrl(img),
//                         name: img.split('/').pop(),
//                         isNew: false
//                     }))

//                     setPreviewImages(serverImages)
//                 })
//             }
//         }
//     })


//     // ================= HANDLERS =================
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()

//         try {
//             const data = new FormData();

//             data.append('nameEn', formData.nameEn);
//             data.append('nameAr', formData.nameAr);
//             data.append('type', formData.type);
//             data.append('country', formData.country);
//             data.append('isActive', String(formData.isActive));

//             if (images.length > 0) {
//                 data.append('images', images[0]);
//             }

//             if (editingCategory) {
//                 await api.categories.update(editingCategory._id, data);
//                 alert('Category updated!');
//             } else {
//                 await api.categories.create(data);
//                 alert('Category created!');
//             }

//             queryClient.invalidateQueries({ queryKey: ['categories'] });
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
//             type: '',
//             country: 'Egypt',
//             images: '',
//             isActive: true
//         })
//         setImages([])
//         setPreviewImages([])
//         setEditingCategory(null)
//         setShowForm(false)
//     }

//     // const startEdit = (c: Category) => {
//     //     setEditingCategory(c)
//     //     setFormData({
//     //         nameEn: c.nameEn,
//     //         nameAr: c.nameAr,
//     //         type: c.type,
//     //         country: c.country,
//     //         images: '',
//     //         isActive: c.isActive
//     //     })

//     //     // show existing images from server
//     //     setImages([])
//     //     setPreviewImages((c.images || []).map(img => `/${img}`))

//     //     setShowForm(true)
//     // }


//     const startEdit = (c: Category) => {
//         setEditingCategory(c)

//         setFormData({
//             nameEn: c.nameEn,
//             nameAr: c.nameAr,
//             type: c.type,
//             country: c.country,
//             images: '',
//             isActive: c.isActive
//         })

//         setImages([])

//         const serverImages = (c.images || []).map(img => ({
//             url: buildImageUrl(img),
//             name: img.split('/').pop(),
//             isNew: false
//         }))

//         setPreviewImages(serverImages)

//         setShowForm(true)
//     }


//     // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     //     if (!e.target.files) return

//     //     const file = e.target.files[0]
//     //     if (!file) return

//     //     setImages([file])
//     //     setPreviewImages([URL.createObjectURL(file)])
//     // }

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return

//         const file = e.target.files[0]

//         setImages([file])

//         setPreviewImages(prev => [
//             ...prev,
//             {
//                 url: URL.createObjectURL(file),
//                 isNew: true
//             }
//         ])
//     }

//     // const removePreviewImage = (index: number) => {
//     //     setImages((prev) => prev.filter((_, i) => i !== index))
//     //     setPreviewImages((prev) => prev.filter((_, i) => i !== index))
//     // }
//     const removePreviewImage = (index: number) => {
//         const image = previewImages[index]

//         // 🟡 NEW
//         if (image.isNew) {
//             setImages([])
//             setPreviewImages(prev => prev.filter((_, i) => i !== index))
//         }
//         // 🔵 EXISTING
//         else {
//             if (!editingCategory || !image.name) return

//             if (confirm('Delete this image permanently?')) {
//                 deleteImageMutation.mutate({
//                     categoryId: editingCategory._id,
//                     imageName: image.name
//                 })
//             }
//         }
//     }





//     // ================= UI =================
//     return (
//         <div className="min-h-screen flex bg-white text-black">
//             <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="categories" />

//             <div className="flex-1">
//                 <header className="bg-white p-4 flex justify-between">
//                     <h1 className="text-2xl font-bold">Category Management</h1>
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
//                         {showForm ? 'Cancel' : 'Add Program'}
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

//                                 <select className="bg-white p-2 rounded border border-gray-600" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value as any })}>
//                                     <option value="Egypt">Egypt</option>
//                                     <option value="Albania">Albania</option>
//                                 </select>

//                             </div>
//                             <div className="flex items-center gap-4">
//                                 <select
//                                     className="bg-white p-2 rounded border border-gray-600"
//                                     value={formData.type}
//                                     onChange={e => setFormData({ ...formData, type: e.target.value })}
//                                 >
//                                     <option value="">Select Type</option>
//                                     <option value="Incoming">Incoming</option>
//                                     <option value="outgoing">Outgoing</option>
//                                     <option value="Domestic">Domestic</option>
//                                     <option value="Educational">Educational</option>
//                                     <option value="Corporate">Corporate</option>
//                                 </select>
//                             </div>
//                             {/* images */}
//                             <input type="file" accept="image/*" onChange={handleImageChange} />

//                             {/* {previewImages.length > 0 && (
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
//                             )} */}

//                             {previewImages.length > 0 && (
//                                 <div className="grid grid-cols-3 gap-3">
//                                     {previewImages.map((img, i) => (
//                                         <div key={i} className="relative">
//                                             <img src={img.url} className="rounded h-32 object-cover" />

//                                             <button
//                                                 type="button"
//                                                 onClick={() => removePreviewImage(i)}
//                                                 className="absolute top-1 right-1 bg-red-600 px-2 text-xs rounded"
//                                             >
//                                                 ✕
//                                             </button>

//                                             {!img.isNew && (
//                                                 <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 rounded">
//                                                     Saved
//                                                 </span>
//                                             )}

//                                             {img.isNew && (
//                                                 <span className="absolute bottom-1 left-1 bg-yellow-600 text-white text-xs px-2 rounded">
//                                                     New
//                                                 </span>
//                                             )}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}



//                             <div className="flex items-center gap-4">
//                                 <label className="flex items-center gap-2">
//                                     <input type="radio" checked={formData.isActive === true} onChange={() => setFormData({ ...formData, isActive: true })} /> Active
//                                 </label>
//                                 <label className="flex items-center gap-2">
//                                     <input type="radio" checked={formData.isActive === false} onChange={() => setFormData({ ...formData, isActive: false })} /> Inactive
//                                 </label>
//                             </div>

//                             <button type="submit" disabled={!formData.type}
//                                 className="w-full bg-green-600 py-3 rounded">
//                                 {editingCategory ? 'Update Category' : 'Save Category'}
//                             </button>
//                         </form>
//                     </div>
//                 )}

//                 <div className="m-6 p-6 bg-gray-200 rounded-lg">
//                     <h2 className="text-xl font-bold mb-4">Available Categories ({categories.length})</h2>
//                     <div className="grid grid-cols-1 gap-4">
//                         {categories.map((p: Category) => (
//                             <div key={p._id}
//                                 className="bg-gray-800 text-white  p-4 rounded border border-gray-700 flex justify-between items-center hover:border-blue-500">
//                                 <div>
//                                     <h3 className="text-lg font-bold">{p.nameEn} / {p.nameAr}</h3>
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
    FolderTree, 
    Plus, 
    X, 
    Edit3, 
    Trash2, 
    Image as ImageIcon, 
    Globe, 
    Tag, 
    CheckCircle2, 
    XCircle,
    Menu,
    AlertCircle
} from 'lucide-react';

function buildImageUrl(path: string) {
    if (!path) return '';
    return path.startsWith('http') ? path : `${path}`;
}

interface Category {
    _id: string
    nameEn: string
    nameAr: string
    type: 'Incoming' | 'outgoing' | 'Domestic' | 'Educational' | 'Corporate'
    country: string
    images: string[]
    isActive: boolean
}

type PreviewImage = {
    url: string
    name?: string
    isNew: boolean
}

export default function CategoriesPage() {
    return (
        <ProtectedRoute requiredRole="head" requiredPermission="add_category">
            <CategoriesPageContent />
        </ProtectedRoute>
    );
}

const CategoriesPageContent = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        nameEn: '',
        nameAr: '',
        type: '',
        country: 'Egypt',
        images: '',
        isActive: true
    })

    const queryClient = useQueryClient()

    // ================= FETCH =================
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await api.categories.getAll()).data
    })

    // ================= MUTATIONS =================
    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.categories.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    })

    const deleteImageMutation = useMutation({
        mutationFn: ({ categoryId, imageName }: { categoryId: string, imageName: string }) =>
            api.categories.deleteImage(categoryId, imageName),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })

            if (editingCategory) {
                api.categories.getOne(editingCategory._id).then(res => {
                    const updated = res.data

                    const serverImages = (updated.images || []).map((img: string) => ({
                        url: buildImageUrl(img),
                        name: img.split('/').pop(),
                        isNew: false
                    }))

                    setPreviewImages(serverImages)
                })
            }
        }
    })

    // ================= HANDLERS =================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const data = new FormData();

            data.append('nameEn', formData.nameEn);
            data.append('nameAr', formData.nameAr);
            data.append('type', formData.type);
            data.append('country', formData.country);
            data.append('isActive', String(formData.isActive));

            if (images.length > 0) {
                data.append('images', images[0]);
            }

            if (editingCategory) {
                await api.categories.update(editingCategory._id, data);
                alert('Category updated!');
            } else {
                await api.categories.create(data);
                alert('Category created!');
            }

            queryClient.invalidateQueries({ queryKey: ['categories'] });
            resetForm();
        } catch (err: any) {
            // console.log(err)
            setError(err.response?.data?.error || 'Error');
        }
    }

    const resetForm = () => {
        setFormData({
            nameEn: '',
            nameAr: '',
            type: '',
            country: 'Egypt',
            images: '',
            isActive: true
        })
        setImages([])
        setPreviewImages([])
        setEditingCategory(null)
        setShowForm(false)
        setError(null)
    }

    const startEdit = (c: Category) => {
        setEditingCategory(c)

        setFormData({
            nameEn: c.nameEn,
            nameAr: c.nameAr,
            type: c.type,
            country: c.country,
            images: '',
            isActive: c.isActive
        })

        setImages([])

        const serverImages = (c.images || []).map(img => ({
            url: buildImageUrl(img),
            name: img.split('/').pop(),
            isNew: false
        }))

        setPreviewImages(serverImages)

        setShowForm(true)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const file = e.target.files[0]

        setImages([file])

        setPreviewImages(prev => [
            ...prev,
            {
                url: URL.createObjectURL(file),
                isNew: true
            }
        ])
    }

    const removePreviewImage = (index: number) => {
        const image = previewImages[index]

        if (image.isNew) {
            setImages([])
            setPreviewImages(prev => prev.filter((_, i) => i !== index))
        }
        else {
            if (!editingCategory || !image.name) return

            if (confirm('Delete this image permanently?')) {
                deleteImageMutation.mutate({
                    categoryId: editingCategory._id,
                    imageName: image.name
                })
            }
        }
    }

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'Incoming': 'bg-blue-100 text-blue-700 border-blue-200',
            'outgoing': 'bg-purple-100 text-purple-700 border-purple-200',
            'Domestic': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Educational': 'bg-amber-100 text-amber-700 border-amber-200',
            'Corporate': 'bg-rose-100 text-rose-700 border-rose-200',
        }
        return colors[type] || 'bg-slate-100 text-slate-700 border-slate-200'
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="categories" />

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
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                                <FolderTree className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Category Management</h1>
                                <p className="text-xs text-slate-500 font-medium">Organize your programs</p>
                            </div>
                        </div>

                        <button
                            onClick={() => showForm ? resetForm() : setShowForm(true)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                                showForm 
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300' 
                                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-indigo-500/25'
                            }`}
                        >
                            {showForm ? (
                                <><X className="w-4 h-4" /> Cancel</>
                            ) : (
                                <><Plus className="w-4 h-4" /> Add Category</>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    {editingCategory ? (
                                        <><Edit3 className="w-5 h-5 text-indigo-600" /> Edit Category</>
                                    ) : (
                                        <><Plus className="w-5 h-5 text-indigo-600" /> New Category</>
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
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">English Name</label>
                                            <input
                                                placeholder="Category name in English"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none text-slate-700"
                                                value={formData.nameEn}
                                                onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Arabic Name</label>
                                            <input
                                                placeholder="اسم الفئة بالعربية"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none text-slate-700 text-right"
                                                value={formData.nameAr}
                                                onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                <Globe className="w-4 h-4" /> Country
                                            </label>
                                            <select 
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none text-slate-700"
                                                value={formData.country} 
                                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                            >
                                                <option value="Egypt">🇪🇬 Egypt</option>
                                                <option value="Albania">🇦🇱 Albania</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                <Tag className="w-4 h-4" /> Type
                                            </label>
                                            <select
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 outline-none text-slate-700"
                                                value={formData.type}
                                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Incoming">Incoming</option>
                                                <option value="outgoing">Outgoing</option>
                                                <option value="Domestic">Domestic</option>
                                                <option value="Educational">Educational</option>
                                                <option value="Corporate">Corporate</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4" /> Category Image
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleImageChange}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-semibold hover:file:bg-indigo-100 transition-all duration-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Preview Images */}
                                    {previewImages.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {previewImages.map((img, i) => (
                                                <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-200">
                                                    <img src={img.url} className="w-full h-32 object-cover" />
                                                    
                                                    <button
                                                        type="button"
                                                        onClick={() => removePreviewImage(i)}
                                                        className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-rose-600 shadow-sm"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                    {!img.isNew && (
                                                        <span className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3" /> Saved
                                                        </span>
                                                    )}

                                                    {img.isNew && (
                                                        <span className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> New
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Status Toggle */}
                                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <span className="text-sm font-semibold text-slate-700">Status:</span>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <div className={`w-12 h-6 rounded-full transition-all duration-200 relative ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only"
                                                    checked={formData.isActive}
                                                    onChange={() => setFormData({ ...formData, isActive: true })}
                                                />
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 shadow-sm ${formData.isActive ? 'left-7' : 'left-1'}`} />
                                            </div>
                                            <span className={`text-sm font-semibold ${formData.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                                                {formData.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button 
                                        type="submit" 
                                        disabled={!formData.type}
                                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold text-sm hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 className="w-5 h-5" />
                                        {editingCategory ? 'Update Category' : 'Create Category'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Categories List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <FolderTree className="w-5 h-5 text-indigo-600" />
                                Available Categories
                                <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-bold">
                                    {categories.length}
                                </span>
                            </h2>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {categories.map((c: Category) => (
                                <div 
                                    key={c._id}
                                    className="p-6 hover:bg-slate-50/60 transition-all duration-200 group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {/* Category Image or Placeholder */}
                                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
                                                {c.images && c.images.length > 0 ? (
                                                    <img 
                                                        src={buildImageUrl(c.images[0])} 
                                                        alt={c.nameEn}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FolderTree className="w-8 h-8 text-slate-400" />
                                                )}
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-lg font-bold text-slate-900">{c.nameEn}</h3>
                                                    <span className="text-slate-400 font-medium">/</span>
                                                    <h3 className="text-lg font-bold text-slate-700" dir="rtl">{c.nameAr}</h3>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getTypeColor(c.type)}`}>
                                                        <Tag className="w-3 h-3" />
                                                        {c.type}
                                                    </span>
                                                    
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                        <Globe className="w-3 h-3" />
                                                        {c.country}
                                                    </span>
                                                    
                                                    {c.isActive ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                                                            <XCircle className="w-3 h-3" /> Inactive
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    startEdit(c)
                                                }} 
                                                className="flex items-center gap-1.5 px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 rounded-xl font-semibold text-sm transition-all duration-200"
                                            >
                                                <Edit3 className="w-4 h-4" /> Edit
                                            </button>

                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    if (confirm('Are you sure you want to delete this category?')) {
                                                        deleteMutation.mutate(c._id)
                                                    }
                                                }}
                                                disabled={deleteMutation.isPending}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50"
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

                            {categories.length === 0 && (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FolderTree className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <p className="text-slate-600 text-lg font-medium">No categories yet</p>
                                    <p className="text-slate-400 mt-1">Create your first category to get started</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
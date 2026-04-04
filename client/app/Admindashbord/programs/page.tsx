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
        <ProtectedRoute requiredPermission="add_program">
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

// 'use client'

// import React, { useState } from 'react'
// import AdminSidebar from '@/components/adminSidebar'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { api } from '@/lib/api'
// import { ProtectedRoute } from '@/components/ProtectedRoute';

// interface Day {
//     dayNumber: string
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
//         <ProtectedRoute requiredPermission="add_program">
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
//     type PreviewImage = {
//         url: string
//         name?: string
//         isNew: boolean
//     }
//     const [previewImages, setPreviewImages] = useState<PreviewImage[]>([])
//     const [existingImages, setExistingImages] = useState<string[]>([])
//     const [error, setError] = useState('')

//     const [days, setDays] = useState<Day[]>([
//         {
//             dayNumber: '',
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
//             setError(error.response?.data?.message || error.response?.data?.error || 'Something went wrong')
//         }
//     })

//     // ================= DELETE IMAGE MUTATION =================
//     const deleteImageMutation = useMutation({
//         mutationFn: ({ programId, imageName }: { programId: string; imageName: string }) =>
//             api.programs.deleteImage(programId, imageName),
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['programs'] });

//             if (editingProgram) {
//                 api.programs.getOne(editingProgram._id).then(res => {
//                     const updatedProgram = res.data;
//                     const rawImages = updatedProgram.images || [];

//                     const serverImages = rawImages.map((img: string) => ({
//                         url: img.startsWith('http')
//                             ? img
//                             : `${img}`,
//                         name: img.split('/').pop(),
//                         isNew: false
//                     }));

//                     setPreviewImages(serverImages);
//                 });
//             }
//         },
//         onError: (error: any) => {
//             alert('Failed to delete image: ' + (error.response?.data?.error || 'Unknown error'));
//         }
//     });

//     const deleteMutation = useMutation({
//         mutationFn: (id: string) =>
//             api.programs.delete(id),
//         onSuccess: () =>
//             queryClient.invalidateQueries({ queryKey: ['programs'] }),
//     })

//     // ================= HANDLERS =================
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         setError('')

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

//         setImages(prev => [...prev, ...files])

//         setPreviewImages(prev => [
//             ...prev,
//             ...files.map(file => ({
//                 url: URL.createObjectURL(file),
//                 isNew: true
//             }))
//         ])
//     }

//     const removePreviewImage = (index: number) => {
//         const image = previewImages[index]

//         if (image.isNew) {
//             const newIndex = previewImages
//                 .slice(0, index)
//                 .filter(img => img.isNew).length

//             setImages(prev => prev.filter((_, i) => i !== newIndex))
//             setPreviewImages(prev => prev.filter((_, i) => i !== index))
//         }
//         else {
//             if (!editingProgram || !image.name) return

//             if (confirm('Delete this image permanently?')) {
//                 deleteImageMutation.mutate({
//                     programId: editingProgram._id,
//                     imageName: image.name
//                 })
//             }
//         }
//     }

//     const updateDay = (i: number, field: keyof Day, value: string | number) => {
//         const copy = days.map((d, idx) =>
//             idx === i ? { ...d, [field]: value } : d
//         )
//         setDays(copy)
//     }

//     const addDay = () => {
//         setDays((prev) => [
//             ...prev,
//             {
//                 dayNumber: String(prev.length + 1),
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
//                 .map((d, idx) => ({ ...d, dayNumber: String(idx + 1) }))
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
//         setExistingImages([])
//         setDays([
//             {
//                 dayNumber: '1',
//                 titleEn: '',
//                 titleAr: '',
//                 descriptionEn: '',
//                 descriptionAr: '',
//             },
//         ])
//         setEditingProgram(null)
//         setShowForm(false)
//         setError('')
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

//         const rawImages = p.images || []

//         const serverImages = rawImages.map((img) => ({
//             url: img.startsWith('http')
//                 ? img
//                 : `${img}`,
//             name: img.split('/').pop(),
//             isNew: false
//         }))

//         setPreviewImages(serverImages)

//         setDays(
//             p.days?.length
//                 ? p.days.map((d, idx) => ({
//                     ...d,
//                     dayNumber: String(d.dayNumber || idx + 1)
//                 }))
//                 : [{ dayNumber: '1', titleEn: '', titleAr: '', descriptionEn: '', descriptionAr: '' }]
//         )

//         setShowForm(true)
//     }

//     // ================= UI =================
//     return (
//         <div className="min-h-screen bg-gray-50 flex">
//             <AdminSidebar
//                 sidebarOpen={sidebarOpen}
//                 setSidebarOpen={setSidebarOpen}
//                 active="programs"
//             />

//             <div className="flex-1 flex flex-col overflow-hidden">
//                 {/* Modern Header */}
//                 <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
//                     <div className="flex items-center gap-4">
//                         <button
//                             onClick={() => setSidebarOpen(true)}
//                             className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//                         >
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                             </svg>
//                         </button>
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">Travel Programs</h1>
//                             <p className="text-sm text-gray-500">Manage your tour packages and itineraries</p>
//                         </div>
//                     </div>
                    
//                     <button
//                         onClick={() => (showForm ? resetForm() : setShowForm(true))}
//                         className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
//                             showForm 
//                                 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
//                                 : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
//                         }`}
//                     >
//                         {showForm ? (
//                             <>
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                                 Cancel
//                             </>
//                         ) : (
//                             <>
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                 </svg>
//                                 Add Program
//                             </>
//                         )}
//                     </button>
//                 </header>

//                 {/* Main Content */}
//                 <main className="flex-1 overflow-y-auto p-6">
//                     {/* Form Section */}
//                     {showForm && (
//                         <div className="max-w-5xl mx-auto mb-8">
//                             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                                 <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//                                     <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                         </svg>
//                                         {editingProgram ? 'Edit Program' : 'Create New Program'}
//                                     </h2>
//                                 </div>
                                
//                                 <form onSubmit={handleSubmit} className="p-6 space-y-6">
//                                     {/* Basic Info Grid */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Title (English)</label>
//                                             <input
//                                                 placeholder="Enter program title"
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-black"
//                                                 value={formData.titleEn}
//                                                 onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">العنوان (Arabic)</label>
//                                             <input
//                                                 placeholder="أدخل العنوان"
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-right placeholder:text-black"
//                                                 value={formData.titleAr}
//                                                 onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Category</label>
//                                             <select
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
//                                                 value={formData.category}
//                                                 onChange={e => setFormData({ ...formData, category: e.target.value })}
//                                                 required
//                                             >
//                                                 <option value="" className="text-black">Select Category</option>
//                                                 {categories.map((c: any) => (
//                                                     <option key={c._id} value={c._id} className="text-black">{c.nameEn}</option>
//                                                 ))}
//                                             </select>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Country</label>
//                                             <select
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-black"
//                                                 value={formData.country}
//                                                 onChange={e => setFormData({ ...formData, country: e.target.value as any })}
//                                             >
//                                                 <option value="Egypt" className="text-black">🇪🇬 Egypt</option>
//                                                 <option value="Albania" className="text-black">🇦🇱 Albania</option>
//                                             </select>
//                                         </div>
//                                     </div>

//                                     {/* Duration & Price Row */}
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Duration (Days)</label>
//                                             <input
//                                                 type="number"
//                                                 min="1"
//                                                 placeholder="Enter days"
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-black"
//                                                 value={formData.durationDays}
//                                                 onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Nights</label>
//                                             <input
//                                                 type="number"
//                                                 min="0"
//                                                 placeholder="Enter nights"
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-black"
//                                                 value={formData.durationNights}
//                                                 onChange={e => setFormData({ ...formData, durationNights: parseInt(e.target.value) })}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Price (USD)</label>
//                                             <div className="relative">
//                                                 <span className="absolute left-3 top-2.5 text-black">$</span>
//                                                 <input
//                                                     type="number"
//                                                     min="0"
//                                                     placeholder="Enter price"
//                                                     className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-black"
//                                                     value={formData.price}
//                                                     onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Descriptions */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">Description (English)</label>
//                                             <textarea
//                                                 placeholder="Enter program description..."
//                                                 rows={3}
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-black"
//                                                 value={formData.descriptionEn}
//                                                 onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
//                                             />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="text-sm font-medium text-gray-700">الوصف (Arabic)</label>
//                                             <textarea
//                                                 placeholder="أدخل الوصف..."
//                                                 rows={3}
//                                                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-right placeholder:text-black"
//                                                 value={formData.descriptionAr}
//                                                 onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     {/* Image Upload */}
//                                     <div className="space-y-3">
//                                         <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                             </svg>
//                                             Program Images
//                                         </label>
//                                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors bg-gray-50">
//                                             <input
//                                                 type="file"
//                                                 multiple
//                                                 accept="image/*"
//                                                 onChange={handleImageChange}
//                                                 className="w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-black hover:file:bg-blue-100 cursor-pointer"
//                                             />
//                                             <p className="text-xs text-black mt-2">Upload multiple images. Supported formats: JPG, PNG, WebP</p>
//                                         </div>
//                                     </div>

//                                     {/* Image Preview Grid */}
//                                     {previewImages.length > 0 && (
//                                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                             {previewImages.map((img, i) => (
//                                                 <div key={i} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200">
//                                                     <img
//                                                         src={img.url}
//                                                         className="w-full h-32 object-cover"
//                                                         alt="preview"
//                                                     />
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removePreviewImage(i)}
//                                                         disabled={deleteImageMutation.isPending}
//                                                         className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
//                                                     >
//                                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                                         </svg>
//                                                     </button>
//                                                     <span className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${
//                                                         img.isNew 
//                                                             ? 'bg-yellow-100 text-black' 
//                                                             : 'bg-green-100 text-black'
//                                                     }`}>
//                                                         {img.isNew ? 'New' : 'Saved'}
//                                                     </span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}

//                                     {/* Days Section - Add Day button removed */}
//                                     <div className="border-t border-gray-200 pt-6">
//                                         <div className="flex items-center justify-between mb-4">
//                                             <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                                                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                                 </svg>
//                                                 Itinerary Days
//                                             </h3>
//                                         </div>

//                                         <div className="space-y-4">
//                                             {days.map((day, i) => (
//                                                 <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                                                     <div className="flex items-center justify-between mb-3">
//                                                         <div className="flex items-center gap-3">
//                                                             <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
//                                                                 {day.dayNumber}
//                                                             </span>
//                                                             <span className="font-medium text-gray-700">Day {day.dayNumber}</span>
//                                                         </div>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => removeDay(i)}
//                                                             className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
//                                                         >
//                                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                                             </svg>
//                                                         </button>
//                                                     </div>

//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
//                                                         <input
//                                                             placeholder="Day Title (EN)"
//                                                             value={day.titleEn}
//                                                             className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm placeholder:text-black"
//                                                             onChange={(e) => updateDay(i, 'titleEn', e.target.value)}
//                                                         />
//                                                         <input
//                                                             placeholder="عنوان اليوم (AR)"
//                                                             value={day.titleAr}
//                                                             className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm text-right placeholder:text-black"
//                                                             onChange={(e) => updateDay(i, 'titleAr', e.target.value)}
//                                                         />
//                                                     </div>

//                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                         <textarea
//                                                             placeholder="Description (EN)"
//                                                             value={day.descriptionEn}
//                                                             rows={2}
//                                                             className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none placeholder:text-black"
//                                                             onChange={(e) => updateDay(i, 'descriptionEn', e.target.value)}
//                                                         />
//                                                         <textarea
//                                                             placeholder="الوصف (AR)"
//                                                             value={day.descriptionAr}
//                                                             rows={2}
//                                                             className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm resize-none text-right placeholder:text-black"
//                                                             onChange={(e) => updateDay(i, 'descriptionAr', e.target.value)}
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     {/* Error Alert */}
//                                     {error && (
//                                         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
//                                             <div className="flex items-start gap-3">
//                                                 <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                 </svg>
//                                                 <p className="text-sm text-red-700">{error}</p>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Submit Button */}
//                                     <div className="flex gap-3 pt-4 border-t border-gray-200">
//                                         <button
//                                             type="button"
//                                             onClick={resetForm}
//                                             className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
//                                         >
//                                             Cancel
//                                         </button>
//                                         <button
//                                             type="submit"
//                                             disabled={programMutation.isPending}
//                                             className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
//                                         >
//                                             {programMutation.isPending ? (
//                                                 <>
//                                                     <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                                     </svg>
//                                                     {editingProgram ? 'Updating...' : 'Saving...'}
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                                     </svg>
//                                                     {editingProgram ? 'Update Program' : 'Create Program'}
//                                                 </>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     )}

//                     {/* Programs List */}
//                     <div className="max-w-6xl mx-auto">
//                         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                             <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
//                                 <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                                     </svg>
//                                     Available Programs
//                                     <span className="bg-gray-200 text-black px-2.5 py-0.5 rounded-full text-sm font-medium">
//                                         {programs.length}
//                                     </span>
//                                 </h2>
//                             </div>

//                             <div className="divide-y divide-gray-100">
//                                 {programs.length === 0 ? (
//                                     <div className="p-12 text-center">
//                                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                             </svg>
//                                         </div>
//                                         <p className="text-black font-medium">No programs found</p>
//                                         <p className="text-sm text-black mt-1">Create your first program to get started</p>
//                                     </div>
//                                 ) : (
//                                     programs.map((p: Program) => (
//                                         <div
//                                             key={p._id}
//                                             onClick={() => window.location.href = `/Admindashbord/programs/${p._id}`}
//                                             className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
//                                         >
//                                             <div className="flex items-start justify-between gap-4">
//                                                 <div className="flex-1 min-w-0">
//                                                     <div className="flex items-center gap-3 mb-2">
//                                                         <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
//                                                             {p.titleEn}
//                                                         </h3>
//                                                         <span className="text-black">|</span>
//                                                         <h3 className="text-lg font-semibold text-gray-700 text-right" dir="rtl">
//                                                             {p.titleAr}
//                                                         </h3>
//                                                     </div>
                                                    
//                                                     <div className="flex flex-wrap items-center gap-4 text-sm text-black mb-3">
//                                                         <span className="flex items-center gap-1.5">
//                                                             <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                             </svg>
//                                                             {p.durationDays} Days / {p.durationNights} Nights
//                                                         </span>
//                                                         <span className="flex items-center gap-1.5">
//                                                             <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                                             </svg>
//                                                             {p.country}
//                                                         </span>
//                                                         <span className="flex items-center gap-1.5 font-medium text-green-600">
//                                                             <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                                             </svg>
//                                                             ${p.price.toLocaleString()}
//                                                         </span>
//                                                     </div>

//                                                     <div className="flex items-center gap-2">
//                                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                                             p.status === 'active'
//                                                                 ? 'bg-green-100 text-black'
//                                                                 : 'bg-red-100 text-black'
//                                                         }`}>
//                                                             <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
//                                                                 p.status === 'active' ? 'bg-black' : 'bg-black'
//                                                             }`}></span>
//                                                             {p.status === 'active' ? 'Active' : 'Inactive'}
//                                                         </span>
//                                                         {p.images && p.images.length > 0 && (
//                                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-black">
//                                                                 <svg className="w-3 h-3 mr-1 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                                                 </svg>
//                                                                 {p.images.length} images
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             e.preventDefault();
//                                                             startEdit(p)
//                                                         }}
//                                                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                                         title="Edit"
//                                                     >
//                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                                         </svg>
//                                                     </button>

//                                                     <button
//                                                         onClick={(e) => {
//                                                             e.stopPropagation();
//                                                             e.preventDefault();
//                                                             if (confirm('Are you sure you want to delete this program?')) {
//                                                                 deleteMutation.mutate(p._id)
//                                                             }
//                                                         }}
//                                                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                                         title="Delete"
//                                                     >
//                                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }
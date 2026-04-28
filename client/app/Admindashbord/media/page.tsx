"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import AdminSidebar from "@/components/adminSidebar";
import {
    Ship,

    Menu,
  
} from 'lucide-react';
const SECTIONS = [
    // { value: "home_video", label: "Home Video" },
    { value: "about1", label: "About1" },
    { value: "about2", label: "About2" },
    { value: "about3", label: "About3" },
    // { value: "hero", label: "Hero Video" },
    { value: "egypt", label: "Egypt image" },
    // { value: "egypt_video", label: "Egypt Video" },
    { value: "albania", label: "Albania image" },
    // { value: "albania_video", label: "Albania Video" },
    { value: "flight", label: "Flight" },
    { value: "hotel", label: "Hotel" },
    // { value: "cruises_video", label: "Cruises Video" },
];

export default function MediaPage() {
    const [file, setFile] = useState<File | null>(null);
    const [externalUrl, setExternalUrl] = useState("");
    const [section, setSection] = useState("about1");
    const [mediaType, setMediaType] = useState<"image" | "video">("image");
    const [title, setTitle] = useState("");
    const [media, setMedia] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false)
    // const [searchTerm, setSearchTerm] = useState('')

    const fetchMedia = async () => {
        try {
            const res = await api.media.getAllMedia();
            setMedia(res.data || []);
        } catch (err) {
            console.error("Failed to fetch media:", err);
            setMedia([]);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [section]);

    const handleUpload = async () => {
        if (!file && !externalUrl) {
            alert("Please select a file or enter a URL");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("section", section);
        formData.append("type", mediaType);
        if (title) formData.append("title", title);
        if (externalUrl) formData.append("url", externalUrl);
        if (file) formData.append("file", file);

        try {
            if (editingId) {
                await api.media.updateMedia(editingId, formData);
            } else {
                await api.media.uploadMedia(formData);
            }

            // Reset form
            setFile(null);
            setExternalUrl("");
            setTitle("");
            setEditingId(null);
            fetchMedia();
        } catch (err: any) {
            alert(err.response?.data?.error || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item._id);
        setTitle(item.title || "");
        setExternalUrl(item.url || "");
        setMediaType(item.type);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this media?")) return;

        try {
            await api.media.deleteMedia(id);
            fetchMedia();
        } catch (err) {
            alert("Failed to delete media");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="Booked Programs" />

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
                         cd 
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight"> Media Manager</h1>
                                <p className="text-xs text-slate-500 font-medium">Manage media assets</p>
                            </div>
                        </div>

                        <div className="w-8" />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="p-6 max-w-4xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6">Media Manager</h1>

                        {/* Section Selection */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Section:</label>
                            <select
                                value={section}
                                onChange={(e) => { setSection(e.target.value); setEditingId(null); }}
                                className="border p-2 rounded w-full"
                            >
                                {SECTIONS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Media Type */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Media Type:</label>
                            <select
                                value={mediaType}
                                onChange={(e) => setMediaType(e.target.value as "image" | "video")}
                                className="border p-2 rounded w-full"
                            >
                                <option value="image">Image</option>
                                {/* <option value="video">Video</option> */}
                            </select>
                        </div>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Title (optional):</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border p-2 rounded w-full"
                                placeholder="Enter title"
                            />
                        </div>

                        {/* File Upload */}
                        {/* <div className="mb-4">
                            <label className="block mb-2 font-medium">Upload File:</label>
                            <input
                                type="file"
                                accept={mediaType === "video" ? "video/*" : "image/*"}
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] || null);
                                    if (e.target.files?.[0]) setExternalUrl("");
                                }}
                                className="border p-2 rounded w-full"
                            />
                        </div> */}

                        {/* External URL */}
                        <div className="mb-4">
                            <label className="block mb-2 font-medium">Or External URL:</label>
                            <input
                                type="url"
                                value={externalUrl}
                                onChange={(e) => {
                                    setExternalUrl(e.target.value);
                                    if (e.target.value) setFile(null);
                                }}
                                className="border p-2 rounded w-full"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleUpload}
                            disabled={(!file && !externalUrl) || loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-300 mb-6"
                        >
                            {loading ? "Processing..." : editingId ? "Update" : "Upload"}
                        </button>

                        {/* Media List */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {media.map((item: any) => (
                                <div key={item._id} className="border rounded p-2">
                                    {item.type === "image" ? (
                                        <img src={item.url} alt={item.title} className="w-full h-32 object-cover" />
                                    ) : (
                                        <video src={item.url} controls className="w-full h-32" />
                                    )}
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="text-sm font-medium">{item.title || item.section}</span>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-500 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="text-red-500 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
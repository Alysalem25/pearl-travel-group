"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { Language } from "@/data/translations";
import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
import { motion, AnimatePresence } from "framer-motion";
// import './style.css'
import { X, ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";


interface Mice {
        _id: number;
        firstName: string;
        lastName: string;
        email: string;
        organization: string;
        jobFunction: string;
        nationality: string;
        numOfGuests: number;
        dateFrom: string;
        dateTo: string;
        destination: string;
}


function MiceContent() {
    const [lang, setLang] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const [loadingMice, setLoadingMice] = useState(true)
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        organization: '',
        jobFunction: '',
        nationality: '', // ✅ FIXED
        numOfGuests: 1,
        dateFrom: '',
        dateTo: '',
        destination: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        setMounted(true);
        setLang(getLanguageFromSearchParams(searchParams));
        const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => setLang(e.detail.lang);
        window.addEventListener("languagechange", handleLanguageChange as EventListener);
        return () => window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    }, [searchParams]);




    if (!mounted) return null;

    const direction = getDirection(lang);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        try {
            const response = await api.mice.create(formData);
            setSubmitSuccess(true);
            setTimeout(() => {
                setIsPopupOpen(false);
                setSubmitSuccess(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    organization: '',
                    jobFunction: '',
                    nationality: '',
                    numOfGuests: 1,
                    dateFrom: '',
                    dateTo: '',
                    destination: ''
                });
            }, 2000);
        } catch (error: any) {
            setSubmitError(error.response?.data?.error || error.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };



    return (
        <>
            <main className="min-h-screen bg-white text-gray-800" dir={direction}>
                <Navbar />

                {/* Same layout as Egypt page: section + max-w-7xl + title + grid */}
                <div className="py-20 px-4 sm:px-6 lg:px-8  pt-40">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-red-700 mb-12 text-center">
                            {lang === "en" ? "MICE" : "مؤتمرات وفعاليات"}
                        </h2>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="text-2xl font-bold text-gray-700 mb-4 text-center">
                            {lang === "en" ? "Meeting, In Centives, Conferences, Events" : "الاجتماعات والحوافز والمؤتمرات والفعاليات"}
                        </motion.h3>
                        <br />
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl font-bold text-blue-950 mb-12 text-start">
                            {lang === "en" ? "Established in 1985, Pearl Travel Pioneered MICE in the region, becoming a leading force in meetings, incertives, Conferences, and event Planning a Cross Egypt and the wider region."
                                : "تأسست في عام 1985، كانت بيرل ترافيل رائدة في مجال مؤتمرات وفعاليات في المنطقة، وأصبحت قوة رائدة في تخطيط الاجتماعات والحوافز والمؤتمرات والفعاليات عبر مصر والمنطقة الأوسع."}
                            <br />
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl font-bold text-blue-950 mb-6 text-start">

                            {lang === "en" ? "With an extensive Portofolio of hotels, resorts, Cruises, and Premier venue Partnerships throughout Egypt, Supported by our experienced Team, We deliver seamless, tailor-made experiences with excellence at every step" :
                                "مع مجموعة واسعة من الفنادق والمنتجعات والسفن السياحية وشراكات الأماكن الرائدة في جميع أنحاء مصر، وبدعم من فريقنا ذو الخبرة، نقدم تجارب سلسة ومصممة خصيصًا مع التميز في كل خطوة"}
                        </motion.p>
                        <div className="text-center">
                            <button onClick={() => setIsPopupOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 my-4 mb-6 rounded"
                            >
                                {lang === "en" ? "Request a Personalized Quote" : "اطلب عرضًا مخصصًا"}
                            </button>
                        </div>
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="text-2xl font-bold text-gray-700 mb-4 text-center">
                            {lang === "en" ? "Pearl Travel offers." : "تقدم بيرل ترافيل."}
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl font-bold text-blue-950 mb-6 text-start">

                            {lang === "en" ? "Integrated travel and event Solutions crafted specifically Fer Corporate clients and specialized events." :
                                "حلول سفر وفعاليات متكاملة مصممة خصيصًا للعملاء الشركات والفعاليات المتخصصة."}
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 py-4 ">
                            <motion.div
                                // key={cruise.nameEN}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
                            >
                                <div className="absolute bg-red-500 p-2 rounded-lg"
                                    style={
                                        {
                                            top: "-20px",
                                            left: "20px",
                                            // transform: "translate(-50%, -50%)",
                                        }
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#e3e3e3"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" /></svg>                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Tailored Planning"
                                     : "تخطيط مخصص"} </h1>
                                    <p className="item_description text-black">{lang === "en" ? "Our experienced team develops detailed action plans and ensures flawless execution of complete itineraries, including pre- and post-conference packages."
                                     : "فريقنا ذو الخبرة يطور خطط عمل مفصلة ويضمن تنفيذ مثالي لبرامج السفر الكاملة، بما في ذلك حزم ما قبل وبعد المؤتمرات."}</p>
                                </div>
                                <Link href={`/mice/${1}`}>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
                                        {lang === "en" ? "Read More" : "اقرأ المزيد"}
                                    </button>
                                </Link>
                            </motion.div>
                            {/* =============================== */}

                            <motion.div
                                // key={cruise.nameEN}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
                            >
                                <div className="absolute bg-red-500 p-2 rounded-lg"
                                    style={
                                        {
                                            top: "-20px",
                                            left: "20px",
                                            // transform: "translate(-50%, -50%)",
                                        }
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M475-140q5 0 11.5-2.5T497-149l337-338q13-13 19.5-29.67Q860-533.33 860-550q0-17-6.5-34T834-614L654-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5Q540-807 527-794l-18 18 81 82q13 14 23 32.5t10 40.5q0 38-29.5 67T526-525q-25 0-41.5-7.5t-30.19-21.34L381-627 200-446q-5 5-7 10.53-2 5.52-2 11.84 0 12.63 8.5 21.13 8.5 8.5 21.17 8.5 6.33 0 11.83-3t9.5-7l138-138 42 42-137 137q-5 5-7 11t-2 12q0 12 9 21t21 9q6 0 11.5-2.5t9.5-6.5l138-138 42 42-137 137q-4 4-6.5 10.33-2.5 6.34-2.5 12.67 0 12 9 21t21 9q6 0 11-2t10-7l138-138 42 42-138 138q-5 5-7 11t-2 11q0 14 8 22t22 8Zm.06 60Q442-80 416-104.5t-31-60.62Q351-170 328-193t-28-57q-34-5-56.5-28.5T216-335q-37-5-61-30t-24-60q0-17 6.72-34.05Q144.45-476.1 157-489l224-224 110 110q8 8 17.33 12.5 9.34 4.5 18.67 4.5 13 0 24.5-11.5t11.5-24.65q0-5.85-3.5-13.35T548-651L405-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5-16.67 6.5-29.61 19.36L126-642q-14 14-19.5 29.5t-6.5 35q-1 19.5 7.5 38T128-506l-43 43q-20-22-32.5-53T40-579q0-30 11.5-57.5T84-685l151-151q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T448-836l18 18 18-18q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T697-836l179 179q22 22 33 50.03 11 28.04 11 57 0 28.97-11 56.47T876-444L539-107q-13 13-29.53 20t-34.41 7ZM377-626Z" /></svg>                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation"
                                     : "النقل"} </h1>
                                    <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event."
                                     : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
                                </div>
                                <Link href={`/mice/${2}`}>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
                                        {lang === "en" ? "Read More" : "اقرأ المزيد"}
                                    </button>
                                </Link>
                            </motion.div>
                            {/* =============================== */}

                            <motion.div
                                // key={cruise.nameEN}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
                            >
                                <div className="absolute bg-red-500 p-2 rounded-lg"
                                    style={
                                        {
                                            top: "-20px",
                                            left: "20px",
                                            // transform: "translate(-50%, -50%)",
                                        }
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M860-131v-649H100v320H40v-320q0-25 17.63-42.5Q75.25-840 100-840h760q24.75 0 42.38 17.62Q920-804.75 920-780v580q0 26-17 45.5T860-131ZM252-443q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42Zm172.5-43.5Q450-512 450-551t-25.5-64.5Q399-641 360-641t-64.5 25.5Q270-590 270-551t25.5 64.5Q321-461 360-461t64.5-25.5ZM40-80v-94q0-38 19-65t49-41q67-30 128.5-45T360-340q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q680-212 680-174v94H40Zm60-60h520v-34q0-16-9.5-30.5T587-226q-64-31-117-42.5T360-280q-57 0-111 11.5T132-226q-14 7-23 21.5t-9 30.5v34Zm260-411Zm0 411Z" /></svg>                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation" : "النقل"} </h1>
                                    <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event."
                                     : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
                                </div>
                                <Link href={`/mice/${3}`}>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
                                        {lang === "en" ? "Read More" : "اقرأ المزيد"}
                                    </button>
                                </Link>
                            </motion.div>
                            {/* =============================== */}
                            <motion.div
                                // key={cruise.nameEN}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="item_div w-full text-black relative bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
                            >
                                <div className="absolute bg-red-500 p-2 rounded-lg"
                                    style={
                                        {
                                            top: "-20px",
                                            left: "20px",
                                            // transform: "translate(-50%, -50%)",
                                        }
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M528-248.18q-28-28.19-28-69Q500-358 528.18-386q28.19-28 69-28Q638-414 666-385.82q28 28.19 28 69Q694-276 665.82-248q-28.19 28-69 28Q556-220 528-248.18ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z" /></svg>                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation" : "النقل"} </h1>
                                    <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event."
                                     : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
                                </div>
                                <Link href={`/mice/${4}`}>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
                                        {lang === "en" ? "Read More" : "اقرأ المزيد"}
                                    </button>
                                </Link>
                            </motion.div>
                            {/* =============================== */}
                            <motion.div
                                // key={cruise.nameEN}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="item_div w-full text-black relative bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
                            >
                                <div className="absolute bg-red-500 p-2 rounded-lg"
                                    style={
                                        {
                                            top: "-20px",
                                            left: "20px",
                                            // transform: "translate(-50%, -50%)",
                                        }
                                    }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M528-248.18q-28-28.19-28-69Q500-358 528.18-386q28.19-28 69-28Q638-414 666-385.82q28 28.19 28 69Q694-276 665.82-248q-28.19 28-69 28Q556-220 528-248.18ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z" /></svg>                                </div>
                                <div className="flex flex-col gap-4">
                                    <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation" : "النقل"} </h1>
                                    <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event>"
                                     : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
                                </div>
                                <Link href={`/mice/${5}`}>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
                                        {lang === "en" ? "Read More" : "اقرأ المزيد"}
                                    </button>
                                </Link>
                            </motion.div>
                            {/* ))} */}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isPopupOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0  bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
                            onClick={() => setIsPopupOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex p-4  bg-red-600 justify-between items-center mb-4">
                                    <h3 className="text-xl text-white font-bold">{lang === "en" ? "Request a Personalized Quote" : "اطلب عرضًا مخصصًا"}</h3>
                                    <button onClick={() => setIsPopupOpen(false)} className="text-white hover:text-gray-700">
                                        <X size={24} />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4 m-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "First Name" : "الاسم الأول"}</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Last Name" : "الاسم الأخير"}</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Email" : "البريد الإلكتروني"}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Organization" : "المنظمة"}</label>
                                        <input
                                            type="text"
                                            value={formData.organization}
                                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Job Function" : "الوظيفة"}</label>
                                        <input
                                            type="text"
                                            value={formData.jobFunction}
                                            onChange={(e) => setFormData({ ...formData, jobFunction: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Nationality" : "الجنسية"}</label>
                                        <input
                                            type="text"
                                            value={formData.nationality}
                                            onChange={(e) =>
                                                setFormData({ ...formData, nationality: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Number of Guests" : "عدد الضيوف"}</label>
                                        <input
                                            type="number"
                                            value={formData.numOfGuests}
                                            onChange={(e) => setFormData({ ...formData, numOfGuests: parseInt(e.target.value) })}
                                            required
                                            min="1"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Date From" : "تاريخ البداية"}</label>
                                        <input
                                            type="date"
                                            value={formData.dateFrom}
                                            onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Date To" : "تاريخ النهاية"}</label>
                                        <input
                                            type="date"
                                            value={formData.dateTo}
                                            onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Destination" : "الوجهة"}</label>
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>
                                    {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                                    {submitSuccess && <p className="text-green-500 text-sm">{lang === "en" ? "Request submitted successfully!" : "تم إرسال الطلب بنجاح!"}</p>}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    >
                                        {submitting ? (lang === "en" ? "Submitting..." : "جاري الإرسال...") : (lang === "en" ? "Submit" : "إرسال")}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            <Footer />


        </>
    );
}

export default function MicePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <MiceContent />
        </Suspense>
    );
}

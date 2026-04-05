"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { Language } from "@/data/translations";
import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
import { motion, AnimatePresence } from "framer-motion";
import './style.css'
import { X, ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";


interface Cruisies {
    _id: string
    nameEn: string
    titleAr: string
    country: string
    images: string[]
}


function CruisiesContent() {
    const [lang, setLang] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const [loadingCruisies, setLoadingCruisies] = useState(true)

    useEffect(() => {
        setMounted(true);
        setLang(getLanguageFromSearchParams(searchParams));
        const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => setLang(e.detail.lang);
        window.addEventListener("languagechange", handleLanguageChange as EventListener);
        return () => window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    }, [searchParams]);

    //  fetch countries
    // useEffect(() => {
    //     const fetchCountries = async () => {
    //         try {
    //             setLoadingCruisies(true)
    //             const res = await api.cruisies.getAll()
    //             const data = res.data.cruisies || res.data
    //             console.log(data)
    //             if (Array.isArray(data)) {
    //                 setCruisies(data)
    //             } else {
    //                 setCruisies([])
    //             }

    //         } catch (err) {
    //             console.error("Error fetching countries", err)
    //             setCruisies([])
    //         } finally {
    //             setLoadingCruisies(false)
    //         }
    //     }

    //     fetchCountries()
    // }, [])v


    if (!mounted) return null;

    const direction = getDirection(lang);


    // const handleFormSubmit = async () => {
    //     setSubmitting(true);
    //     setSubmitError(null);

    //     try {
    //         const payload = {
    //             fullName: stepOneForm.name,
    //             email: stepOneForm.email,
    //             phone: stepOneForm.phone,
    //             destination: stepOneForm.destination,
    //             otherCountries: stepOneForm.otherCountries,
    //             hasTraveledAbroad: stepTwoForm.hasTraveledAbroad === "yes",
    //             visitedCountries: stepTwoForm.visitedCountries
    //         };
    //         // const response = await api.visa.apply(payload);
    //         console.log("Submitting visa application with payload:", payload);
    //         const response = await axios.post("${process.env.NEXT_PUBLIC_API_URL || '/api'}/cruisies", payload);

    //         if (response.data.applicationId) {
    //             setApplicationId(response.data.applicationId);
    //             setSubmitSuccess(true);
    //             setCurrentStep(3);
    //         }
    //     } catch (error: any) {
    //         console.error("Submission error:", error);
    //         setSubmitError(
    //             error.response?.data?.error ||
    //             error.message ||

    //             "An error occurred while submitting your application."
    //         );
    //     } finally {
    //         setSubmitting(false);
    //     }
    // };
    const cruisies = [
        {
            nameEN: "Nile",
            nameAR: "نيل",
            descriptionER: "A Nile River cruise offers a unique journey through Egypt’s timeless landscapes, combining luxury accommodations with breathtaking views of ancient temples and historic treasures",
            descriptionAR: "رحلة نيل الفاخرة تقدم رحلة فريدة عبر المناظر الزمنية لمصر، حيث تجمع بين المرافق الفاخرة والمناظر الملهمة للكنائس القديمة والكنوز التاريخية",
            image: ""
        },
        {
            nameEN: "Silversea",
            nameAR: "سيلفرسيا",
            descriptionER: "Silversea Cruises offers ultra-luxury cruising with all-suite accommodations, personalized butler service, and exceptional dining — delivering an intimate and elegant experience at sea.",
            descriptionAR: "سيلفرسيا تقدم رحلات فاخرة مع جميع الوحدات، وخدمة خدمة مخصصة، وتناول طعام استثنائي — مما يوفر تجربة داخلية و  elegante في البحر.",
            image: ""
        },
        {
            nameEN: "Caribbean",
            nameAR: "سيبورن",
            descriptionER: "A Caribbean cruise lets you explore turquoise waters, sandy beaches, and vibrant islands in one unforgettable journey.",
            descriptionAR: "رحلة البحر الكاريبي تتيح لك استكشاف مياه الأزرق turquoise، والشواطئ الرملية، والجزر الملونة في رحلة لا تُنسى.",
            image: ""
        },
        {
            nameEN: "MSC",
            nameAR: "ام اس سي",
            descriptionER: "MSC Cruises offers a diverse range of cruise experiences with modern ships, exciting entertainment, and destinations across the globe — combining comfort, adventure, and value for every traveler.",
            descriptionAR: "MSC تقدم تجارب سياحية متنوعة مع السفن الحديثة، والترفيه المثير، والوجهات حول العالم — مما يجمع بين الراحة والمغامرة والقيمة لكل سائح.",
            image: ""
        }
        ,
        {
            nameEN: "Norwegian",
            nameAR: "نورويجن",
            descriptionER: "Norwegian Cruise Line offers fun and flexible cruising with modern ships, exciting entertainment, and diverse dining — perfect for travelers seeking adventure and relaxation at sea.",
            descriptionAR: "نورويجن تقدم رحلات ممتعة ومرنة مع السفن الحديثة، والترفيه المثير، والطعام المتنوع — مثالية للسياح الذين يسعون إلى المغامرة والاسترخاء في البحر.",
            image: ""
        }
    ]


    return (
        <>
            <main className="min-h-screen bg-white" dir={direction}>
                <Navbar />

                {/* Same layout as Egypt page: section + max-w-7xl + title + grid */}
                <div className="py-20 px-4 sm:px-6 lg:px-8  pt-40">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-bold text-red-700 mb-12 text-center">
                            {lang === "en" ? "Where your journey begins" : "حيث تبدأ رحلتك"}
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-xl font-bold text-blue-950 mb-12 text-center">
                            {lang === "en" ? "Discover the world in comfort and style with our exceptional cruise experiences From the elegance of MSC Cruises and the ultra-luxury of Silversea Cruises to the vibrant voyages of Norwegian Cruise Line, we offer carefully selected cruises to suit every travel style. Sail the turquoise waters of the Caribbean or explore history along the majestic Nile River — all seamlessly arranged by our expert team." : "اكتشف العالم براحة وأسلوب مع تجارب الرحلات البحرية الاستثنائية لدينا من أناقة MSC Cruises والفخامة الفائقة لـ Silversea Cruises إلى الرحلات النابضة بالحياة لـ Norwegian Cruise Line، نقدم رحلات بحرية مختارة بعناية لتناسب كل أسلوب سفر. أبحر في مياه الكاريبي الفيروزية أو استكشف التاريخ على طول نهر النيل المهيب — كل ذلك يتم ترتيبه بسلاسة من قبل فريقنا الخبير."}
                            <br />
                            {lang === "en" ? "Your journey begins at sea." : "تبدأ رحلتك في البحر."}</motion.p>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 py-4 ">
                            {cruisies.map((cruise, index) => (
                                <motion.div
                                    key={cruise.nameEN}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
                                >
                                    {/* <img src='/cruise.png' alt={cruise.nameER} width={50} height={50} className="bg-red-500 rounded-lg p-2 w-12 h-auto */}
                                    {/* absolute" style={
                                        {
                                            top: "-2px",
                                            left: "-.1px",
                                            transform: "translate(-50%, -50%)",
                                        }
                                    } /> */}
                                    <div className="absolute bg-red-500 p-2 rounded-lg"
                                        style={
                                            {
                                                top: "-20px",
                                                left: "20px",
                                                // transform: "translate(-50%, -50%)",
                                            }
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#e3e3e3"><path d="M152-80h-32v-80h32q48 0 91.5-10.5T341-204q38 19 66.5 31.5T480-160q44 0 72.5-12.5T619-204q53 23 97.5 33.5T809-160h31v80h-31q-49 0-95.5-9T622-116q-40 19-73 27t-69 8q-36 0-68.5-8T339-116q-45 18-91.5 27T152-80Zm223-200-45-40q-27 27-60.5 46T198-247l-85-273q-5-17 3-31t25-19l59-16v-134q0-33 23.5-56.5T280-800h100v-80h200v80h100q33 0 56.5 23.5T760-720v134l59 16q17 5 25 19t3 31l-85 273q-38-8-71.5-27T630-320l-45 40q-45 40-105 40t-105-40Zm107-40q31 0 55-20.5t44-43.5l46-53 41 42q11 11 22.5 20.5T713-355l46-149-279-73-278 73 46 149q11-10 22.5-19.5T293-395l41-42 46 53q20 24 45 44t57 20ZM280-607l200-53 200 53v-113H280v113Zm201 158Z" /></svg>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <h1 className="item_name text-4xl font-bold text-black">{lang === "en" ? cruise.nameEN+" cruise" : cruise.nameAR+" كروز"} </h1>
                                        <p className="item_description text-black">{lang === "en" ? cruise.descriptionER : cruise.descriptionAR}</p>
                                    </div>
                                    <Link href={`/cruisies/${cruise.nameEN}`}>
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
                                           {lang ==="en"? "Read More" : "اقرأ المزيد"}
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />


        </>
    );
}

export default function CruisiesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <CruisiesContent />
        </Suspense>
    );
}

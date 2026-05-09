// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState, useEffect, Suspense } from "react";
// import axios from "axios";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/footer";
// import { Language } from "@/data/translations";
// import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
// import { motion, AnimatePresence } from "framer-motion";
// // import './style.css'
// import { X, ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
// import { api } from "@/lib/api";
// import Link from "next/link";


// interface Mice {
//         _id: number;
//         firstName: string;
//         lastName: string;
//         email: string;
//         organization: string;
//         jobFunction: string;
//         nationality: string;
//         numOfGuests: number;
//         dateFrom: string;
//         dateTo: string;
//         destination: string;
// }


// function MiceContent() {
//     const [lang, setLang] = useState<Language>("en");
//     const [mounted, setMounted] = useState(false);
//     const searchParams = useSearchParams();
//     const [loadingMice, setLoadingMice] = useState(true)
//     const [isPopupOpen, setIsPopupOpen] = useState(false);
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         organization: '',
//         jobFunction: '',
//         nationality: '', // ✅ FIXED
//         numOfGuests: 1,
//         dateFrom: '',
//         dateTo: '',
//         destination: ''
//     });
//     const [submitting, setSubmitting] = useState(false);
//     const [submitError, setSubmitError] = useState<string | null>(null);
//     const [submitSuccess, setSubmitSuccess] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//         setLang(getLanguageFromSearchParams(searchParams));
//         const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => setLang(e.detail.lang);
//         window.addEventListener("languagechange", handleLanguageChange as EventListener);
//         return () => window.removeEventListener("languagechange", handleLanguageChange as EventListener);
//     }, [searchParams]);




//     if (!mounted) return null;

//     const direction = getDirection(lang);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setSubmitting(true);
//         setSubmitError(null);
//         try {
//             const response = await api.mice.create(formData);
//             setSubmitSuccess(true);
//             setTimeout(() => {
//                 setIsPopupOpen(false);
//                 setSubmitSuccess(false);
//                 setFormData({
//                     firstName: '',
//                     lastName: '',
//                     email: '',
//                     organization: '',
//                     jobFunction: '',
//                     nationality: '',
//                     numOfGuests: 1,
//                     dateFrom: '',
//                     dateTo: '',
//                     destination: ''
//                 });
//             }, 2000);
//         } catch (error: any) {
//             setSubmitError(error.response?.data?.error || error.message || "An error occurred");
//         } finally {
//             setSubmitting(false);
//         }
//     };



//     return (
//         <>
//             <main className="min-h-screen bg-white text-gray-800" dir={direction}>
//                 <Navbar />

//                 {/* Same layout as Egypt page: section + max-w-7xl + title + grid */}
//                 <div className="py-20 px-4 sm:px-6 lg:px-8  pt-40">
//                     <div className="max-w-7xl mx-auto">
//                         <h2 className="text-4xl font-bold text-red-700 mb-12 text-center">
//                             {lang === "en" ? "MICE" : "مؤتمرات وفعاليات"}
//                         </h2>
//                         <motion.h3
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: 0.05 }}
//                             className="text-2xl font-bold text-gray-700 mb-4 text-center">
//                             {lang === "en" ? "Meeting, In Centives, Conferences, Events" : "الاجتماعات والحوافز والمؤتمرات والفعاليات"}
//                         </motion.h3>
//                         <br />
//                         <motion.p
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: 0.1 }}
//                             className="text-xl font-bold text-blue-950 mb-12 text-start">
//                             {lang === "en" ? "Established in 1985, Pearl Travel Pioneered MICE in the region, becoming a leading force in meetings, incertives, Conferences, and event Planning a Cross Egypt and the wider region."
//                                 : "تأسست في عام 1985، كانت بيرل ترافيل رائدة في مجال مؤتمرات وفعاليات في المنطقة، وأصبحت قوة رائدة في تخطيط الاجتماعات والحوافز والمؤتمرات والفعاليات عبر مصر والمنطقة الأوسع."}
//                             <br />
//                         </motion.p>
//                         <motion.p
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: 0.1 }}
//                             className="text-xl font-bold text-blue-950 mb-6 text-start">

//                             {lang === "en" ? "With an extensive Portofolio of hotels, resorts, Cruises, and Premier venue Partnerships throughout Egypt, Supported by our experienced Team, We deliver seamless, tailor-made experiences with excellence at every step" :
//                                 "مع مجموعة واسعة من الفنادق والمنتجعات والسفن السياحية وشراكات الأماكن الرائدة في جميع أنحاء مصر، وبدعم من فريقنا ذو الخبرة، نقدم تجارب سلسة ومصممة خصيصًا مع التميز في كل خطوة"}
//                         </motion.p>
//                         <div className="text-center">
//                             <button onClick={() => setIsPopupOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 my-4 mb-6 rounded"
//                             >
//                                 {lang === "en" ? "Request a Personalized Quote" : "اطلب عرضًا مخصصًا"}
//                             </button>
//                         </div>
//                         <motion.h3
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: 0.05 }}
//                             className="text-2xl font-bold text-gray-700 mb-4 text-center">
//                             {lang === "en" ? "Pearl Travel offers." : "تقدم بيرل ترافيل."}
//                         </motion.h3>
//                         <motion.p
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: 0.1 }}
//                             className="text-xl font-bold text-blue-950 mb-6 text-start">

//                             {lang === "en" ? "Integrated travel and event Solutions crafted specifically Fer Corporate clients and specialized events." :
//                                 "حلول سفر وفعاليات متكاملة مصممة خصيصًا للعملاء الشركات والفعاليات المتخصصة."}
//                         </motion.p>

//                         <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 py-4 ">
//                             <motion.div
//                                 // key={cruise.nameEN}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.1 }}
//                                 className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
//                             >
//                                 <div className="absolute bg-red-500 p-2 rounded-lg"
//                                     style={
//                                         {
//                                             top: "-20px",
//                                             left: "20px",
//                                             // transform: "translate(-50%, -50%)",
//                                         }
//                                     }
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" height="45px" viewBox="0 -960 960 960" width="45px" fill="#e3e3e3"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" /></svg>                                </div>
//                                 <div className="flex flex-col gap-4">
//                                     <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Tailored Planning"
//                                      : "تخطيط مخصص"} </h1>
//                                     <p className="item_description text-black">{lang === "en" ? "Our experienced team develops detailed action plans and ensures flawless execution of complete itineraries, including pre- and post-conference packages."
//                                      : "فريقنا ذو الخبرة يطور خطط عمل مفصلة ويضمن تنفيذ مثالي لبرامج السفر الكاملة، بما في ذلك حزم ما قبل وبعد المؤتمرات."}</p>
//                                 </div>
//                                 <Link href={`/mice/${1}`}>
//                                     <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
//                                         {lang === "en" ? "Read More" : "اقرأ المزيد"}
//                                     </button>
//                                 </Link>
//                             </motion.div>
//                             {/* =============================== */}

//                             <motion.div
//                                 // key={cruise.nameEN}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.1 }}
//                                 className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
//                             >
//                                 <div className="absolute bg-red-500 p-2 rounded-lg"
//                                     style={
//                                         {
//                                             top: "-20px",
//                                             left: "20px",
//                                             // transform: "translate(-50%, -50%)",
//                                         }
//                                     }
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M475-140q5 0 11.5-2.5T497-149l337-338q13-13 19.5-29.67Q860-533.33 860-550q0-17-6.5-34T834-614L654-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5Q540-807 527-794l-18 18 81 82q13 14 23 32.5t10 40.5q0 38-29.5 67T526-525q-25 0-41.5-7.5t-30.19-21.34L381-627 200-446q-5 5-7 10.53-2 5.52-2 11.84 0 12.63 8.5 21.13 8.5 8.5 21.17 8.5 6.33 0 11.83-3t9.5-7l138-138 42 42-137 137q-5 5-7 11t-2 12q0 12 9 21t21 9q6 0 11.5-2.5t9.5-6.5l138-138 42 42-137 137q-4 4-6.5 10.33-2.5 6.34-2.5 12.67 0 12 9 21t21 9q6 0 11-2t10-7l138-138 42 42-138 138q-5 5-7 11t-2 11q0 14 8 22t22 8Zm.06 60Q442-80 416-104.5t-31-60.62Q351-170 328-193t-28-57q-34-5-56.5-28.5T216-335q-37-5-61-30t-24-60q0-17 6.72-34.05Q144.45-476.1 157-489l224-224 110 110q8 8 17.33 12.5 9.34 4.5 18.67 4.5 13 0 24.5-11.5t11.5-24.65q0-5.85-3.5-13.35T548-651L405-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5-16.67 6.5-29.61 19.36L126-642q-14 14-19.5 29.5t-6.5 35q-1 19.5 7.5 38T128-506l-43 43q-20-22-32.5-53T40-579q0-30 11.5-57.5T84-685l151-151q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T448-836l18 18 18-18q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T697-836l179 179q22 22 33 50.03 11 28.04 11 57 0 28.97-11 56.47T876-444L539-107q-13 13-29.53 20t-34.41 7ZM377-626Z" /></svg>                                </div>
//                                 <div className="flex flex-col gap-4">
//                                     <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation"
//                                      : "النقل"} </h1>
//                                     <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event."
//                                      : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
//                                 </div>
//                                 <Link href={`/mice/${2}`}>
//                                     <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
//                                         {lang === "en" ? "Read More" : "اقرأ المزيد"}
//                                     </button>
//                                 </Link>
//                             </motion.div>
//                             {/* =============================== */}

//                             <motion.div
//                                 // key={cruise.nameEN}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.1 }}
//                                 className="item_div w-full text-black relative   bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
//                             >
//                                 <div className="absolute bg-red-500 p-2 rounded-lg"
//                                     style={
//                                         {
//                                             top: "-20px",
//                                             left: "20px",
//                                             // transform: "translate(-50%, -50%)",
//                                         }
//                                     }
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M860-131v-649H100v320H40v-320q0-25 17.63-42.5Q75.25-840 100-840h760q24.75 0 42.38 17.62Q920-804.75 920-780v580q0 26-17 45.5T860-131ZM252-443q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42Zm172.5-43.5Q450-512 450-551t-25.5-64.5Q399-641 360-641t-64.5 25.5Q270-590 270-551t25.5 64.5Q321-461 360-461t64.5-25.5ZM40-80v-94q0-38 19-65t49-41q67-30 128.5-45T360-340q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q680-212 680-174v94H40Zm60-60h520v-34q0-16-9.5-30.5T587-226q-64-31-117-42.5T360-280q-57 0-111 11.5T132-226q-14 7-23 21.5t-9 30.5v34Zm260-411Zm0 411Z" /></svg>                                </div>
//                                 <div className="flex flex-col gap-4">
//                                     <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation" : "النقل"} </h1>
//                                     <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event."
//                                      : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
//                                 </div>
//                                 <Link href={`/mice/${3}`}>
//                                     <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
//                                         {lang === "en" ? "Read More" : "اقرأ المزيد"}
//                                     </button>
//                                 </Link>
//                             </motion.div>
//                             {/* =============================== */}
//                             <motion.div
//                                 // key={cruise.nameEN}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.1 }}
//                                 className="item_div w-full text-black relative bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
//                             >
//                                 <div className="absolute bg-red-500 p-2 rounded-lg"
//                                     style={
//                                         {
//                                             top: "-20px",
//                                             left: "20px",
//                                             // transform: "translate(-50%, -50%)",
//                                         }
//                                     }
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M528-248.18q-28-28.19-28-69Q500-358 528.18-386q28.19-28 69-28Q638-414 666-385.82q28 28.19 28 69Q694-276 665.82-248q-28.19 28-69 28Q556-220 528-248.18ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z" /></svg>                                </div>
//                                 <div className="flex flex-col gap-4">
//                                     <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation" : "النقل"} </h1>
//                                     <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event."
//                                      : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
//                                 </div>
//                                 <Link href={`/mice/${4}`}>
//                                     <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
//                                         {lang === "en" ? "Read More" : "اقرأ المزيد"}
//                                     </button>
//                                 </Link>
//                             </motion.div>
//                             {/* =============================== */}
//                             <motion.div
//                                 // key={cruise.nameEN}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: 0.1 }}
//                                 className="item_div w-full text-black relative bg-gray-100 p-12 rounded-2xl hover:shadow-lg hover:translate-y-2 cursor-pointer"
//                             >
//                                 <div className="absolute bg-red-500 p-2 rounded-lg"
//                                     style={
//                                         {
//                                             top: "-20px",
//                                             left: "20px",
//                                             // transform: "translate(-50%, -50%)",
//                                         }
//                                     }
//                                 >
//                                     <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3"><path d="M528-248.18q-28-28.19-28-69Q500-358 528.18-386q28.19-28 69-28Q638-414 666-385.82q28 28.19 28 69Q694-276 665.82-248q-28.19 28-69 28Q556-220 528-248.18ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z" /></svg>                                </div>
//                                 <div className="flex flex-col gap-4">
//                                     <h1 className="item_name text-2xl font-bold text-black">{lang === "en" ? "Transportation" : "النقل"} </h1>
//                                     <p className="item_description text-black">{lang === "en" ? "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event>"
//                                      : "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."}</p>
//                                 </div>
//                                 <Link href={`/mice/${5}`}>
//                                     <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded">
//                                         {lang === "en" ? "Read More" : "اقرأ المزيد"}
//                                     </button>
//                                 </Link>
//                             </motion.div>
//                             {/* ))} */}
//                         </div>
//                     </div>
//                 </div>

//                 <AnimatePresence>
//                     {isPopupOpen && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="fixed inset-0  bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
//                             onClick={() => setIsPopupOpen(false)}
//                         >
//                             <motion.div
//                                 initial={{ scale: 0.8, opacity: 0 }}
//                                 animate={{ scale: 1, opacity: 1 }}
//                                 exit={{ scale: 0.8, opacity: 0 }}
//                                 className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[70vh] overflow-y-auto"
//                                 onClick={(e) => e.stopPropagation()}
//                             >
//                                 <div className="flex p-4  bg-red-600 justify-between items-center mb-4">
//                                     <h3 className="text-xl text-white font-bold">{lang === "en" ? "Request a Personalized Quote" : "اطلب عرضًا مخصصًا"}</h3>
//                                     <button onClick={() => setIsPopupOpen(false)} className="text-white hover:text-gray-700">
//                                         <X size={24} />
//                                     </button>
//                                 </div>
//                                 <form onSubmit={handleSubmit} className="space-y-4 m-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "First Name" : "الاسم الأول"}</label>
//                                         <input
//                                             type="text"
//                                             value={formData.firstName}
//                                             onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Last Name" : "الاسم الأخير"}</label>
//                                         <input
//                                             type="text"
//                                             value={formData.lastName}
//                                             onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Email" : "البريد الإلكتروني"}</label>
//                                         <input
//                                             type="email"
//                                             value={formData.email}
//                                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Organization" : "المنظمة"}</label>
//                                         <input
//                                             type="text"
//                                             value={formData.organization}
//                                             onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Job Function" : "الوظيفة"}</label>
//                                         <input
//                                             type="text"
//                                             value={formData.jobFunction}
//                                             onChange={(e) => setFormData({ ...formData, jobFunction: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Nationality" : "الجنسية"}</label>
//                                         <input
//                                             type="text"
//                                             value={formData.nationality}
//                                             onChange={(e) =>
//                                                 setFormData({ ...formData, nationality: e.target.value })
//                                             }
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Number of Guests" : "عدد الضيوف"}</label>
//                                         <input
//                                             type="number"
//                                             value={formData.numOfGuests}
//                                             onChange={(e) => setFormData({ ...formData, numOfGuests: parseInt(e.target.value) })}
//                                             required
//                                             min="1"
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Date From" : "تاريخ البداية"}</label>
//                                         <input
//                                             type="date"
//                                             value={formData.dateFrom}
//                                             onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Date To" : "تاريخ النهاية"}</label>
//                                         <input
//                                             type="date"
//                                             value={formData.dateTo}
//                                             onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700">{lang === "en" ? "Destination" : "الوجهة"}</label>
//                                         <input
//                                             type="text"
//                                             value={formData.destination}
//                                             onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
//                                             required
//                                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                                         />
//                                     </div>
//                                     {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
//                                     {submitSuccess && <p className="text-green-500 text-sm">{lang === "en" ? "Request submitted successfully!" : "تم إرسال الطلب بنجاح!"}</p>}
//                                     <button
//                                         type="submit"
//                                         disabled={submitting}
//                                         className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//                                     >
//                                         {submitting ? (lang === "en" ? "Submitting..." : "جاري الإرسال...") : (lang === "en" ? "Submit" : "إرسال")}
//                                     </button>
//                                 </form>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//             </main>

//             <Footer />


//         </>
//     );
// }

// export default function MicePage() {
//     return (
//         <Suspense fallback={<div className="min-h-screen bg-white" />}>
//             <MiceContent />
//         </Suspense>
//     );
// }



"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, MapPin, Briefcase, Globe, Mail, Phone, ChevronRight, Sparkles, AlertCircle, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { Language } from "@/data/translations";
import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
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

const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer: any = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
};

const scaleIn: any = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const services = [
    {
        id: 1,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
            </svg>
        ),
        titleEN: "Tailored Planning",
        titleAR: "تخطيط مخصص",
        descEN: "Our experienced team develops detailed action plans and ensures flawless execution of complete itineraries, including pre- and post-conference packages.",
        descAR: "فريقنا ذو الخبرة يطور خطط عمل مفصلة ويضمن تنفيذ مثالي لبرامج السفر الكاملة، بما في ذلك حزم ما قبل وبعد المؤتمرات."
    },
    {
        id: 2,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                <path d="M475-140q5 0 11.5-2.5T497-149l337-338q13-13 19.5-29.67Q860-533.33 860-550q0-17-6.5-34T834-614L654-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5Q540-807 527-794l-18 18 81 82q13 14 23 32.5t10 40.5q0 38-29.5 67T526-525q-25 0-41.5-7.5t-30.19-21.34L381-627 200-446q-5 5-7 10.53-2 5.52-2 11.84 0 12.63 8.5 21.13 8.5 8.5 21.17 8.5 6.33 0 11.83-3t9.5-7l138-138 42 42-137 137q-5 5-7 11t-2 12q0 12 9 21t21 9q6 0 11.5-2.5t9.5-6.5l138-138 42 42-137 137q-4 4-6.5 10.33-2.5 6.34-2.5 12.67 0 12 9 21t21 9q6 0 11-2t10-7l138-138 42 42-138 138q-5 5-7 11t-2 11q0 14 8 22t22 8Zm.06 60Q442-80 416-104.5t-31-60.62Q351-170 328-193t-28-57q-34-5-56.5-28.5T216-335q-37-5-61-30t-24-60q0-17 6.72-34.05Q144.45-476.1 157-489l224-224 110 110q8 8 17.33 12.5 9.34 4.5 18.67 4.5 13 0 24.5-11.5t11.5-24.65q0-5.85-3.5-13.35T548-651L405-794q-13-13-30-19.5t-34-6.5q-16.67 0-33.33 6.5-16.67 6.5-29.61 19.36L126-642q-14 14-19.5 29.5t-6.5 35q-1 19.5 7.5 38T128-506l-43 43q-20-22-32.5-53T40-579q0-30 11.5-57.5T84-685l151-151q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T448-836l18 18 18-18q22-22 49.79-32.5 27.8-10.5 57-10.5 29.21 0 56.71 10.5T697-836l179 179q22 22 33 50.03 11 28.04 11 57 0 28.97-11 56.47T876-444L539-107q-13 13-29.53 20t-34.41 7ZM377-626Z" />
            </svg>
        ),
        titleEN: "Transportation",
        titleAR: "النقل",
        descEN: "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event.",
        descAR: "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية."
    },
    {
        id: 3,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                <path d="M860-131v-649H100v320H40v-320q0-25 17.63-42.5Q75.25-840 100-840h760q24.75 0 42.38 17.62Q920-804.75 920-780v580q0 26-17 45.5T860-131ZM252-443q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42Zm172.5-43.5Q450-512 450-551t-25.5-64.5Q399-641 360-641t-64.5 25.5Q270-590 270-551t25.5 64.5Q321-461 360-461t64.5-25.5ZM40-80v-94q0-38 19-65t49-41q67-30 128.5-45T360-340q62 0 123 15.5t127.92 44.69q31.3 14.13 50.19 40.97Q680-212 680-174v94H40Zm60-60h520v-34q0-16-9.5-30.5T587-226q-64-31-117-42.5T360-280q-57 0-111 11.5T132-226q-14 7-23 21.5t-9 30.5v34Zm260-411Zm0 411Z" />
            </svg>
        ),
        titleEN: "Accommodation",
        titleAR: "الإقامة",
        descEN: "Premium hotel partnerships and venue selections tailored to your event size, budget, and preferences across Egypt.",
        descAR: "شراكات فندقية متميزة واختيارات أماكن مخصصة لحجم فعاليتك وميزانيتك وتفضيلاتك في جميع أنحاء مصر."
    },
    {
        id: 4,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                <path d="M528-248.18q-28-28.19-28-69Q500-358 528.18-386q28.19-28 69-28Q638-414 666-385.82q28 28.19 28 69Q694-276 665.82-248q-28.19 28-69 28Q556-220 528-248.18ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-60h65v60h340v-60h65v60h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z" />
            </svg>
        ),
        titleEN: "Event Management",
        titleAR: "إدارة الفعاليات",
        descEN: "End-to-end event coordination from concept to execution, ensuring memorable experiences for all attendees.",
        descAR: "تنسيق الفعاليات من الألف إلى الياء من الفكرة إلى التنفيذ، مما يضمن تجارب لا تُنسى لجميع الحضور."
    },
    {
        id: 5,
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="currentColor">
                <path d="M440-120v-60h340v-304q0-123.69-87.32-210.84Q605.36-782 480-782q-72 0-137 32.5T235.5-660.5q-20.5 28-36 59.67Q184-569.17 174-535l-58 18q14-46 37.5-91t58.5-79q45-51 106.5-84.5T440-810v-90h80v90q72 3 135 33.5t109 84.5q85 92 85 215v304H440Zm40.18 160Q463-40 446.5-56.62 430-73.25 430-95q0-23.25 16.5-39.62Q463-151 480.18-151q23 0 39.32 16.38Q536-118.25 536-96q0 21.75-16.38 38.87Q503.25-40 480.18-40ZM200-80v-304h80v304h-80Zm480 0v-304h80v304h-80Z" />
            </svg>
        ),
        titleEN: "Catering & Dining",
        titleAR: "الضيافة والمطاعم",
        descEN: "Exquisite culinary experiences from gala dinners to coffee breaks, customized to your event theme and dietary needs.",
        descAR: "تجارب طهي رائعة من العشاء الاحتفالي إلى فواصل القهوة، مخصصة حسب موضوع فعاليتك واحتياجاتك الغذائية."
    }
];

function MiceContent() {
    const [lang, setLang] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [formData, setFormData] = useState({
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
    const isRTL = lang === "ar";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        try {
            await api.mice.create(formData);
            setSubmitSuccess(true);
            setTimeout(() => {
                setIsPopupOpen(false);
                setSubmitSuccess(false);
                setFormData({
                    firstName: '', lastName: '', email: '', organization: '',
                    jobFunction: '', nationality: '', numOfGuests: 1,
                    dateFrom: '', dateTo: '', destination: ''
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
            <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-800" dir={direction}>
                <Navbar />

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-red-600 uppercase bg-red-50 rounded-full">
                                <Sparkles size={16} />
                                {lang === "en" ? "Since 1985" : " تأسست 1985"}
                            </span>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                                {lang === "en" ? "MICE" : "مؤتمرات وفعاليات"}
                            </h1>
                            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto rounded-full mb-8" />
                            <h2 className={`text-2xl sm:text-3xl font-semibold text-slate-600 mb-8 ${isRTL ? "font-arabic" : ""}`}>
                                {lang === "en" ? "Meetings, Incentives, Conferences & Events" : "الاجتماعات والحوافز والمؤتمرات والفعاليات"}
                            </h2>
                        </motion.div>

                        {/* Intro Paragraphs */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="max-w-4xl mx-auto space-y-8 mb-16"
                        >
                            <motion.p variants={fadeUp} className={`text-lg sm:text-xl leading-relaxed text-slate-600 ${isRTL ? "text-right" : "text-left"}`}>
                                {lang === "en"
                                    ? "Established in 1985, Pearl Travel pioneered MICE in the region, becoming a leading force in meetings, incentives, conferences, and event planning across Egypt and the wider region."
                                    : "تأسست في عام 1985، كانت بيرل ترافيل رائدة في مجال مؤتمرات وفعاليات في المنطقة، وأصبحت قوة رائدة في تخطيط الاجتماعات والحوافز والمؤتمرات والفعاليات عبر مصر والمنطقة الأوسع."}
                            </motion.p>

                            <motion.p variants={fadeUp} className={`text-lg sm:text-xl leading-relaxed text-slate-600 ${isRTL ? "text-right" : "text-left"}`}>
                                {lang === "en"
                                    ? "With an extensive portfolio of hotels, resorts, cruises, and premier venue partnerships throughout Egypt, supported by our experienced team, we deliver seamless, tailor-made experiences with excellence at every step."
                                    : "مع مجموعة واسعة من الفنادق والمنتجعات والسفن السياحية وشراكات الأماكن الرائدة في جميع أنحاء مصر، وبدعم من فريقنا ذو الخبرة، نقدم تجارب سلسة ومصممة خصيصًا مع التميز في كل خطوة."}
                            </motion.p>
                        </motion.div>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-center mb-20"
                        >
                            <button
                                onClick={() => setIsPopupOpen(true)}
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-lg rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <Calendar size={20} />
                                {lang === "en" ? "Request a Personalized Quote" : "اطلب عرضًا مخصصًا"}
                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Services Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                                {lang === "en" ? "Pearl Travel Offers" : "تقدم بيرل ترافيل"}
                            </h3>
                            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                                {lang === "en"
                                    ? "Integrated travel and event solutions crafted specifically for corporate clients and specialized events."
                                    : "حلول سفر وفعاليات متكاملة مصممة خصيصًا للعملاء الشركات والفعاليات المتخصصة."}
                            </p>
                        </motion.div>

                        {/* Services Grid */}
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-50px" }}
                            className="flex flex-col  sm:flex-row sm:flex-wrap gap-6 lg:gap-8 justify-center"
                        // className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                        >
                            {services.map((service, index) => (
                                <Link href={`/mice/${service.id}`}
                                    key={service.id}
                                    className="group w-full sm:w-1/4 relative bg-white/80 backdrop-blur-sm border border-slate-100 rounded-3xl p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/40 hover:border-red-100 hover:-translate-y-1 transition-all duration-500"
                                >
                                    <motion.div variants={scaleIn}>
                                        {/* Icon */}
                                        <div className="relative mb-6">
                                            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                                                {service.icon}
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>

                                        {/* Content */}
                                        <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                                            {lang === "en" ? service.titleEN : service.titleAR}
                                        </h4>
                                        <p className={`text-slate-500 leading-relaxed mb-6 ${isRTL ? "text-right" : "text-left"}`}>
                                            {lang === "en" ? service.descEN : service.descAR}
                                        </p>

                                        {/* Link */}
                                        <span className="inline-flex items-center gap-2 text-red-600 font-semibold group-hover:gap-3 transition-all duration-300">
                                            {lang === "en" ? "Read More" : "اقرأ المزيد"}
                                            <ChevronRight size={16} className={`${isRTL ? "rotate-180" : ""}`} />
                                        </span>

                                        {/* Bottom accent */}
                                        <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <Footer />
            </main>

            {/* Popup Modal */}
            <AnimatePresence>
                {isPopupOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
                        onClick={() => setIsPopupOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-t-3xl">
                                <h3 className={`text-xl font-bold text-white ${isRTL ? "font-arabic" : ""}`}>
                                    {lang === "en" ? "Request a Personalized Quote" : "اطلب عرضًا مخصصًا"}
                                </h3>
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "First Name" : "الاسم الأول"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Last Name" : "الاسم الأخير"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        {lang === "en" ? "Email" : "البريد الإلكتروني"}
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Organization" : "المنظمة"}
                                        </label>
                                        <div className="relative">
                                            <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.organization}
                                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Job Function" : "الوظيفة"}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.jobFunction}
                                            onChange={(e) => setFormData({ ...formData, jobFunction: e.target.value })}
                                            required
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Nationality" : "الجنسية"}
                                        </label>
                                        <div className="relative">
                                            <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={formData.nationality}
                                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Guests" : "الضيوف"}
                                        </label>
                                        <div className="relative">
                                            <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="number"
                                                value={formData.numOfGuests}
                                                onChange={(e) => setFormData({ ...formData, numOfGuests: parseInt(e.target.value) })}
                                                required
                                                min="1"
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Date From" : "تاريخ البداية"}
                                        </label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="date"
                                                value={formData.dateFrom}
                                                onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            {lang === "en" ? "Date To" : "تاريخ النهاية"}
                                        </label>
                                        <div className="relative">
                                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="date"
                                                value={formData.dateTo}
                                                onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        {lang === "en" ? "Destination" : "الوجهة"}
                                    </label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.destination}
                                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-black"
                                        />
                                    </div>
                                </div>

                                {/* Messages */}
                                <AnimatePresence>
                                    {submitError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                                        >
                                            <AlertCircle size={16} />
                                            {submitError}
                                        </motion.div>
                                    )}
                                    {submitSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm"
                                        >
                                            <Check size={16} />
                                            {lang === "en" ? "Request submitted successfully!" : "تم إرسال الطلب بنجاح!"}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {lang === "en" ? "Submitting..." : "جاري الإرسال..."}
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={18} />
                                            {lang === "en" ? "Submit Request" : "إرسال الطلب"}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default function MicePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            </div>
        }>
            <MiceContent />
        </Suspense>
    );
}
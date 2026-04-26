// // 'use client'

// // import React, { useState } from "react";
// // import Navbar from '@/components/Navbar';
// // import Footer from '@/components/footer'
// // import { Language, getDirection } from "@/lib/language";
// // import Image from "next/image";
// // import axios from "axios";
// // import apiClient from "@/lib/api";
// // import SuccessPopup from "@/components/SuccessPopup";

// // // Corrected Interface
// // interface TripData {
// //   from: string;
// //   to: string;
// //   date: string;
// //   returnDate: string;
// //   isReturn: boolean;
// //   userEmail: string;
// //   userName: string;
// //   userNumber: string;
// //   numOfAdults: number;
// //   numOfLuggage: number;
// //   remarks: string;
// //   carType: string;
// // }

// // const Page = () => {
// //   const [lang] = useState<Language>("en");
// //   const [step, setStep] = useState<1 | 2>(1);
// //   const [error, setError] = useState<string>("");
// //   const [showPopup, setShowPopup] = useState(false);

// //   // Single state for the whole form
// //   const [formData, setFormData] = useState<TripData>({
// //     from: '',
// //     to: '',
// //     date: '',
// //     returnDate: '',
// //     isReturn: false,
// //     userEmail: '',
// //     userName: '',
// //     userNumber: '',
// //     numOfAdults: 1,
// //     numOfLuggage: 0,
// //     remarks: '',
// //     carType: '',
// //   });

// //   // Universal handler for all text, email, tel, and textarea inputs
// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //     const { name, value, type } = e.target;

// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: type === 'number' ? parseInt(value) || 0 : value
// //     }));
// //   };

// //   const handleNextStep = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (formData.carType === "") {
// //       setError("Please select a car type");
// //       return;
// //     }
// //     if (formData.from === "" || formData.to === "" || formData.date === "") {
// //       setError("Please fill all the fields");
// //       return;
// //     }
// //     setStep(2);
// //   };

// //   const handleFinalSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     console.log("Final Trip Data:", formData);
// //     try {
// //       await apiClient.post(`/carTrip`, formData)
// //       setShowPopup(true);

// //     } catch (e) {
// //       console.log(e)
// //     }
// //   };

// //   return (
// //     <div dir={getDirection(lang)} className="bg-white min-h-screen">
// //       <Navbar />
// //       <SuccessPopup
// //         isOpen={showPopup}
// //         onClose={() => setShowPopup(false)}
// //         title={lang === "en" ? "Booking Successful!" : "تم الحجز بنجاح!"}
// //         message={
// //           lang === "en"
// //             ? "Our team will contact you shortly."
// //             : "سيتواصل معك فريقنا قريبًا."
// //         }
// //       />
// //       <div className="max-w-2xl mx-auto mt-14 p-6 min-h-screen">
// //         <h1 className="text-3xl text-blue-700 font-bold text-center mb-8">{lang === "en" ? "Car Rental" : "الليموزين"}</h1>
// //         <p>{lang === "en" ? "Enjoy safe, reliable, and comfortable rides with our airport transfers, city tour, and private chauffeur services" : "استمتع برحلات آمنة وموثوقة ومريحة مع خدماتنا للتوصيل من وإلى المطار، وجولات المدينة، وخدمات السائق الخاص."}</p>

// //         {step === 1 ? (
// //           <form onSubmit={handleNextStep} className="space-y-6  border-2 border-gray-200 rounded-lg shadow-lg p-6">
// //             {error && <div className="text-red-500">{error}</div>}
// //             <h2 className="text-xl font-semibold text-blue-700">Step 1: Route Details</h2>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">From (Pickup)</label>
// //               <input
// //                 type="text"
// //                 name="from"
// //                 value={formData.from}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">To (Drop-off)</label>
// //               <input
// //                 type="text"
// //                 name="to"
// //                 value={formData.to}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 required
// //               />
// //             </div>
// //             <div className="flex justify-between">
// //               {/* premium car or normal car */}
// //               {/* <label className="block text-sm font-medium text-gray-700">Car Type</label> */}

// //               <input type="radio" id="Premium" onChange={handleChange} name="carType" value="Premium" />
// //               <label htmlFor="Premium" className="flex items-center flex-col text-black" >
// //                 <Image src="/car-wash.png" alt="Premium" width={150} height={150} className=" grayscale hover:grayscale-0  transition-all duration-300 " />
// //                 Premium Car</label><br />
// //               <input type="radio" id="Normal" onChange={handleChange} name="carType" value="Normal" />
// //               <label htmlFor="Normal" className="flex items-center flex-col text-black" >
// //                 <Image src="/car.png" alt="Normal" width={150} height={150} className=" grayscale hover:grayscale-0 transition-all duration-300 " />
// //                 Normal Car</label><br />
// //             </div>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
// //                 <input
// //                   type="datetime-local"
// //                   name="date"
// //                   value={formData.date}
// //                   onChange={handleChange}
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                   required
// //                 />
// //               </div>



// //               <div className="flex items-center mt-2 ">
// //                 <label className="inline text-sm font-medium text-gray-700 ">Is Return</label>
// //                 <input type="checkbox" className="ml-2" id="isReturn" name="isReturn" value="" onClick={() => setFormData(prev => ({ ...prev, isReturn: !prev.isReturn }))} />

// //               </div>

// //               {formData.isReturn && (
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700">Return Date & Time</label>
// //                   <input
// //                     type="datetime-local"
// //                     name="returnDate"
// //                     value={formData.returnDate}
// //                     onChange={handleChange}
// //                     className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                   />
// //                 </div>
// //               )}
// //             </div>

// //             <button
// //               type="submit"
// //               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
// //             >
// //               Continue to Personal Details
// //             </button>
// //           </form>
// //         ) : (
// //           <form onSubmit={handleFinalSubmit} className="space-y-6 border-2 border-gray-200 rounded-lg shadow-lg p-6">
// //             <h2 className="text-xl font-semibold text-blue-700">Step 2: Personal Details</h2>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Name</label>
// //               <input
// //                 type="text"
// //                 name="userName"
// //                 value={formData.userName}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Email</label>
// //               <input
// //                 type="email"
// //                 name="userEmail"
// //                 value={formData.userEmail}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 required
// //               />
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Phone</label>
// //               <input
// //                 type="tel"
// //                 name="userNumber"
// //                 value={formData.userNumber}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 required
// //               />
// //             </div>

// //             <div className="grid grid-cols-2 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Passengers</label>
// //                 <input
// //                   type="number"
// //                   name="numOfAdults"
// //                   min={1}
// //                   value={formData.numOfAdults}
// //                   onChange={handleChange}
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Luggage</label>
// //                 <input
// //                   type="number"
// //                   name="numOfLuggage"
// //                   min={0}
// //                   value={formData.numOfLuggage}
// //                   onChange={handleChange}
// //                   className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Remarks</label>
// //               <textarea
// //                 name="remarks"
// //                 value={formData.remarks}
// //                 onChange={handleChange}
// //                 className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-700"
// //                 rows={3}
// //               ></textarea>
// //             </div>

// //             <div className="flex justify-between gap-4">
// //               <button
// //                 type="button"
// //                 onClick={() => setStep(1)}
// //                 className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 p-4"
// //               >
// //                 Back
// //               </button>
// //               <button
// //                 type="submit"
// //                 className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 p-4"
// //               >
// //                 Submit Booking
// //               </button>
// //             </div>
// //           </form>
// //         )}
// //       </div>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Page;


// 'use client';

// import React, { useState, Suspense } from "react";
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/footer'
// import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
// import { useSearchParams } from 'next/navigation';
// import Image from "next/image";
// import axios from "axios";
// import apiClient from "@/lib/api";
// import SuccessPopup from "@/components/SuccessPopup";
// import {
//   MapPin,
//   Calendar,
//   Users,
//   Briefcase,
//   Car,
//   ArrowRight,
//   ArrowLeft,
//   CheckCircle2,
//   Loader2,
//   MessageSquare,
//   Phone,
//   Mail,
//   User,
//   Sparkles
// } from 'lucide-react';

// interface TripData {
//   from: string;
//   to: string;
//   date: string;
//   returnDate: string;
//   isReturn: boolean;
//   userEmail: string;
//   userName: string;
//   userNumber: string;
//   numOfAdults: number;
//   numOfLuggage: number;
//   remarks: string;
//   carType: string;
// }

// const translations = {
//   en: {
//     title: "Limo Service",
//     subtitle: "Enjoy safe, reliable, and comfortable rides with our airport transfers, city tours, and private chauffeur services",
//     step1: "Step 1: Trip Details",
//     step2: "Step 2: Passenger Details",
//     from: "From (Pickup)",
//     to: "To (Drop-off)",
//     carType: "Select Car Type",
//     premium: "Premium Car",
//     normal: "Standard Car",
//     startDate: "Pickup Date & Time",
//     isReturn: "Return Trip",
//     returnDate: "Return Date & Time",
//     continue: "Continue to Passenger Details",
//     name: "Full Name",
//     email: "Email Address",
//     phone: "Phone Number",
//     passengers: "Number of Passengers",
//     luggage: "Number of Luggage",
//     remarks: "Additional Notes",
//     back: "Back",
//     submit: "Confirm Booking",
//     processing: "Processing...",
//     successTitle: "Booking Successful!",
//     successMessage: "Our team will contact you shortly.",
//     errors: {
//       selectCar: "Please select a car type",
//       fillFields: "Please fill in all required fields"
//     },
//     trust: {
//       secure: "Secure Booking",
//       support: "24/7 Support",
//       bestPrice: "Best Price Guarantee"
//     }
//   },
//   ar: {
//     title: "تأجير السيارات",
//     subtitle: "استمتع برحلات آمنة وموثوقة ومريحة مع خدمات النقل من والى المطار، وجولات المدينة، وخدمات السائق الخاص",
//     step1: "الخطوة ١: تفاصيل الرحلة",
//     step2: "الخطوة ٢: تفاصيل الراكب",
//     from: "من (نقطة الالتقاء)",
//     to: "إلى (نقطة الوصول)",
//     carType: "اختر نوع السيارة",
//     premium: "سيارة فاخرة",
//     normal: "سيارة عادية",
//     startDate: "تاريخ ووقت الاستلام",
//     isReturn: "رحلة عودة",
//     returnDate: "تاريخ ووقت العودة",
//     continue: "المتابعة إلى تفاصيل الراكب",
//     name: "الاسم الكامل",
//     email: "عنوان البريد الإلكتروني",
//     phone: "رقم الهاتف",
//     passengers: "عدد الركاب",
//     luggage: "عدد الحقائب",
//     remarks: "ملاحظات إضافية",
//     back: "رجوع",
//     submit: "تأكيد الحجز",
//     processing: "جاري المعالجة...",
//     successTitle: "تم الحجز بنجاح!",
//     successMessage: "سيتواصل معك فريقنا قريبًا.",
//     errors: {
//       selectCar: "الرجاء اختيار نوع السيارة",
//       fillFields: "الرجاء ملء جميع الحقول المطلوبة"
//     },
//     trust: {
//       secure: "حجز آمن",
//       support: "دعم على مدار الساعة",
//       bestPrice: "أفضل ضمان للسعر"
//     }
//   }
// };

// // Loading fallback
// function CarPageLoading() {
//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-4">
//         <Car className="w-16 h-16 text-red-600" />
//         <div className="text-xl text-gray-600 font-medium">Loading...</div>
//       </div>
//     </div>
//   );
// }

// // Main export with Suspense wrapper
// export default function Page() {
//   return (
//     <Suspense fallback={<CarPageLoading />}>
//       <CarRentalContent />
//     </Suspense>
//   );
// }

// // Inner component that uses useSearchParams
// function CarRentalContent() {
//   const searchParams = useSearchParams();
//   const lang = getLanguageFromSearchParams(searchParams);
//   const t = translations[lang];
//   const isRTL = lang === "ar";

//   const [step, setStep] = useState<1 | 2>(1);
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const [formData, setFormData] = useState<TripData>({
//     from: '',
//     to: '',
//     date: '',
//     returnDate: '',
//     isReturn: false,
//     userEmail: '',
//     userName: '',
//     userNumber: '',
//     numOfAdults: 1,
//     numOfLuggage: 0,
//     remarks: '',
//     carType: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value, type } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'number' ? parseInt(value) || 0 : value
//     }));
//   };

//   const handleNextStep = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (formData.carType === "") {
//       setError(t.errors.selectCar);
//       return;
//     }
//     if (formData.from === "" || formData.to === "" || formData.date === "") {
//       setError(t.errors.fillFields);
//       return;
//     }
//     setStep(2);
//   };

//   const handleFinalSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await apiClient.post(`/carTrip`, formData);
//       setShowPopup(true);
//       setFormData({
//         from: '',
//         to: '',
//         date: '',
//         returnDate: '',
//         isReturn: false,
//         userEmail: '',
//         userName: '',
//         userNumber: '',
//         numOfAdults: 1,
//         numOfLuggage: 0,
//         remarks: '',
//         carType: '',
//       });
//       setStep(1);
//     } catch (e) {
//       console.log(e);
//       setError(t.errors.fillFields);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div dir={getDirection(lang)} className="min-h-screen bg-gray-50 text-gray-800">
//       <Navbar />

//       <SuccessPopup
//         isOpen={showPopup}
//         onClose={() => setShowPopup(false)}
//         title={t.successTitle}
//         message={t.successMessage}
//       />

//       <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4  pt-36">
//         <div className="w-full max-w-4xl">
//           {/* Header */}
//           <div className="relative mb-8 text-center">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mb-4">
//               <Sparkles className="w-4 h-4" />
//               <span>{isRTL ? "خدمة متميزة" : "Premium Service"}</span>
//             </div>

//             <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
//               {t.title}
//             </h1>
//             <p className="text-gray-500 text-lg max-w-2xl mx-auto">
//               {t.subtitle}
//             </p>
//           </div>

//           {/* Main Form Card */}
//           <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200 overflow-hidden">

//             {/* Step Indicator */}
//             <div className="flex items-center justify-center mb-8">
//               <div className="flex items-center gap-4">
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
//                   1
//                 </div>
//                 <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} />
//                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
//                   2
//                 </div>
//               </div>
//             </div>

//             {step === 1 ? (
//               <form onSubmit={handleNextStep} className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
//                   <Car className="w-5 h-5 text-red-600" />
//                   {t.step1}
//                 </h2>

//                 {error && (
//                   <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center">
//                     {error}
//                   </div>
//                 )}

//                 {/* Car Type Selection */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-3">{t.carType}</label>
//                   <div className="grid grid-cols-2 gap-4">
//                     <label className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.carType === 'Premium' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}>
//                       <input
//                         type="radio"
//                         name="carType"
//                         value="Premium"
//                         onChange={handleChange}
//                         className="absolute opacity-0"
//                       />
//                       <Image
//                         src="/car-wash.png"
//                         alt="Premium"
//                         width={80}
//                         height={80}
//                         className={`mb-3 transition-all ${formData.carType === 'Premium' ? 'grayscale-0' : 'grayscale'}`}
//                       />
//                       <span className="font-semibold text-gray-800">{t.premium}</span>
//                       {formData.carType === 'Premium' && (
//                         <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-red-600" />
//                       )}
//                     </label>

//                     <label className={`relative flex flex-col items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${formData.carType === 'Normal' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-200'}`}>
//                       <input
//                         type="radio"
//                         name="carType"
//                         value="Normal"
//                         onChange={handleChange}
//                         className="absolute opacity-0"
//                       />
//                       <Image
//                         src="/car.png"
//                         alt="Normal"
//                         width={80}
//                         height={80}
//                         className={`mb-3 transition-all ${formData.carType === 'Normal' ? 'grayscale-0' : 'grayscale'}`}
//                       />
//                       <span className="font-semibold text-gray-800">{t.normal}</span>
//                       {formData.carType === 'Normal' && (
//                         <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-red-600" />
//                       )}
//                     </label>
//                   </div>
//                 </div>

//                 {/* Route Inputs */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="text"
//                       name="from"
//                       value={formData.from}
//                       onChange={handleChange}
//                       placeholder={t.from}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   <div className="relative">
//                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="text"
//                       name="to"
//                       value={formData.to}
//                       onChange={handleChange}
//                       placeholder={t.to}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Date and Return */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="datetime-local"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleChange}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
//                       required
//                     />
//                   </div>

//                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
//                     <input
//                       type="checkbox"
//                       id="isReturn"
//                       checked={formData.isReturn}
//                       onChange={() => setFormData(prev => ({ ...prev, isReturn: !prev.isReturn }))}
//                       className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
//                     />
//                     <label htmlFor="isReturn" className="text-gray-700 font-medium cursor-pointer">
//                       {t.isReturn}
//                     </label>
//                   </div>
//                 </div>

//                 {formData.isReturn && (
//                   <div className="relative">
//                     <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="datetime-local"
//                       name="returnDate"
//                       value={formData.returnDate}
//                       onChange={handleChange}
//                       placeholder={t.returnDate}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
//                     />
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
//                 >
//                   <span className="flex items-center justify-center gap-2">
//                     {t.continue}
//                     {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
//                   </span>
//                 </button>
//               </form>
//             ) : (
//               <form onSubmit={handleFinalSubmit} className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
//                   <User className="w-5 h-5 text-red-600" />
//                   {t.step2}
//                 </h2>

//                 {error && (
//                   <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center">
//                     {error}
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="text"
//                       name="userName"
//                       value={formData.userName}
//                       onChange={handleChange}
//                       placeholder={t.name}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   <div className="relative">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="email"
//                       name="userEmail"
//                       value={formData.userEmail}
//                       onChange={handleChange}
//                       placeholder={t.email}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                   <input
//                     type="tel"
//                     name="userNumber"
//                     value={formData.userNumber}
//                     onChange={handleChange}
//                     placeholder={t.phone}
//                     className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="number"
//                       name="numOfAdults"
//                       min={1}
//                       value={formData.numOfAdults}
//                       onChange={handleChange}
//                       placeholder={t.passengers}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                       required
//                     />
//                   </div>

//                   <div className="relative">
//                     <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
//                     <input
//                       type="number"
//                       name="numOfLuggage"
//                       min={0}
//                       value={formData.numOfLuggage}
//                       onChange={handleChange}
//                       placeholder={t.luggage}
//                       className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
//                     />
//                   </div>
//                 </div>

//                 <div className="relative">
//                   <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-red-600" />
//                   <textarea
//                     name="remarks"
//                     value={formData.remarks}
//                     onChange={handleChange}
//                     placeholder={t.remarks}
//                     rows={3}
//                     className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400 resize-none"
//                   />
//                 </div>

//                 <div className="flex gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setStep(1)}
//                     className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
//                   >
//                     {isRTL ? <ArrowRight className="w-5 h-5 inline ml-2" /> : <ArrowLeft className="w-5 h-5 inline mr-2" />}
//                     {t.back}
//                   </button>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors disabled:opacity-70"
//                   >
//                     <span className="flex items-center justify-center gap-2">
//                       {loading ? (
//                         <>
//                           <Loader2 className="w-5 h-5 animate-spin" />
//                           {t.processing}
//                         </>
//                       ) : (
//                         <>
//                           <CheckCircle2 className="w-5 h-5" />
//                           {t.submit}
//                         </>
//                       )}
//                     </span>
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* Trust Badges */}
//           <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-emerald-500" />
//               <span>{t.trust.secure}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-red-500" />
//               <span>{t.trust.support}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-amber-500" />
//               <span>{t.trust.bestPrice}</span>
//             </div>
//           </div>
//         </div>


//         <div className="row w-full max-w-4xl h-52 flex flex-row justify-around m-4">

//           <div className="col flex flex-row ">
//             <div className="col bg-amber-700 h-full  w-1/2">
//               <img src="/albania.jpg" alt="car" className="w-full h-full object-cover transition-all duration-300" />
//             </div>
//             <div className="col bg-gray-300 h-full w-1/2 p-4">
//               <p>rghergvhe</p>
//             </div>
//           </div>
//           <div className="col flex flex-row">
//             <div className="col bg-amber-700 h-full  w-1/2">
//               <img src="/albania.jpg" alt="car" className="w-full h-full object-cover transition-all duration-300" />
//             </div>
//             <div className="col bg-gray-300 h-full w-1/2 p-4">
//               <p>rghergvhe</p>
//             </div>
//           </div>

//         </div>
//         <div className="row w-full max-w-4xl h-52 flex flex-row justify-around m-4">

//           <div className="col flex flex-row bg-gray-300 rounded-2xl ">
//             <div className="col  h-full  w-1/2">
//               <img src="/albania.jpg" alt="car" className="w-full h-full object-cover transition-all duration-300" />
//             </div>
//             <div className="col  h-full w-1/2 p-4">
//               <p>rghergvhe</p>
//             </div>
//           </div>
//           <div className="col flex flex-row">
//             <div className="col bg-amber-700 h-full  w-1/2">
//               <img src="/albania.jpg" alt="car" className="w-full h-full object-cover transition-all duration-300" />
//             </div>
//             <div className="col bg-gray-300 h-full w-1/2 p-4">
//               <p>rghergvhe</p>
//             </div>
//           </div>

//         </div>
//       </main>
//       {/* <div className="relative z-10 flex items-center flex-col justify-center min-h-screen px-4 ">



//       </div> */}

//       <Footer />
//     </div>
//   );
// }
'use client';

import React, { useState, Suspense } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer'
import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
import { useSearchParams } from 'next/navigation';
import Image from "next/image";
import apiClient from "@/lib/api";
import SuccessPopup from "@/components/SuccessPopup";
import {
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Car,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Phone,
  Mail,
  User,
  Sparkles
} from 'lucide-react';

interface TripData {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  isReturn: boolean;
  userEmail: string;
  userName: string;
  userNumber: string;
  numOfAdults: number;
  numOfLuggage: number;
  remarks: string;
  carType: string;
}

const translations = {
  en: {
    title: "Limo Service",
    subtitle: "Enjoy safe, reliable, and comfortable rides with our airport transfers, city tours, and private chauffeur services",
    step1: "Step 1: Trip Details",
    step2: "Step 2: Passenger Details",
    from: "From (Pickup)",
    to: "To (Drop-off)",
    carType: "Select Car Type",
    premium: "Premium Car",
    normal: "Standard Car",
    startDate: "Pickup Date & Time",
    isReturn: "Return Trip",
    returnDate: "Return Date & Time",
    continue: "Continue to Passenger Details",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    passengers: "Number of Passengers",
    luggage: "Number of Luggage",
    remarks: "Additional Notes",
    back: "Back",
    submit: "Confirm Booking",
    processing: "Processing...",
    successTitle: "Booking Successful!",
    successMessage: "Our team will contact you shortly.",
    errors: {
      selectCar: "Please select a car type",
      fillFields: "Please fill in all required fields"
    },
    trust: {
      secure: "Secure Booking",
      support: "24/7 Support",
      bestPrice: "Best Price Guarantee"
    }
  },
  ar: {
    title: "تأجير السيارات",
    subtitle: "استمتع برحلات آمنة وموثوقة ومريحة مع خدمات النقل من والى المطار، وجولات المدينة، وخدمات السائق الخاص",
    step1: "الخطوة ١: تفاصيل الرحلة",
    step2: "الخطوة ٢: تفاصيل الراكب",
    from: "من (نقطة الالتقاء)",
    to: "إلى (نقطة الوصول)",
    carType: "اختر نوع السيارة",
    premium: "سيارة فاخرة",
    normal: "سيارة عادية",
    startDate: "تاريخ ووقت الاستلام",
    isReturn: "رحلة عودة",
    returnDate: "تاريخ ووقت العودة",
    continue: "المتابعة إلى تفاصيل الراكب",
    name: "الاسم الكامل",
    email: "عنوان البريد الإلكتروني",
    phone: "رقم الهاتف",
    passengers: "عدد الركاب",
    luggage: "عدد الحقائب",
    remarks: "ملاحظات إضافية",
    back: "رجوع",
    submit: "تأكيد الحجز",
    processing: "جاري المعالجة...",
    successTitle: "تم الحجز بنجاح!",
    successMessage: "سيتواصل معك فريقنا قريبًا.",
    errors: {
      selectCar: "الرجاء اختيار نوع السيارة",
      fillFields: "الرجاء ملء جميع الحقول المطلوبة"
    },
    trust: {
      secure: "حجز آمن",
      support: "دعم على مدار الساعة",
      bestPrice: "أفضل ضمان للسعر"
    }
  }
};

function CarPageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Car className="w-16 h-16 text-gray-900" />
        <div className="text-xl text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<CarPageLoading />}>
      <CarRentalContent />
    </Suspense>
  );
}

function CarRentalContent() {
  const searchParams = useSearchParams();
  const lang = getLanguageFromSearchParams(searchParams);
  const t = translations[lang];
  const isRTL = lang === "ar";

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState<TripData>({
    from: '',
    to: '',
    date: '',
    returnDate: '',
    isReturn: false,
    userEmail: '',
    userName: '',
    userNumber: '',
    numOfAdults: 1,
    numOfLuggage: 0,
    remarks: '',
    carType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.carType === "") {
      setError(t.errors.selectCar);
      return;
    }
    if (formData.from === "" || formData.to === "" || formData.date === "") {
      setError(t.errors.fillFields);
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post(`/carTrip`, formData);
      setShowPopup(true);
      setFormData({
        from: '',
        to: '',
        date: '',
        returnDate: '',
        isReturn: false,
        userEmail: '',
        userName: '',
        userNumber: '',
        numOfAdults: 1,
        numOfLuggage: 0,
        remarks: '',
        carType: '',
      });
      setStep(1);
    } catch (e) {
      console.log(e);
      setError(t.errors.fillFields);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={getDirection(lang)} className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <SuccessPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={t.successTitle}
        message={t.successMessage}
      />

      {/* Header Section with Background Image */}
      <section
        className="relative w-full min-h-[400px] lg:min-h-[500px] bg-cover bg-center bg-no-repeat
         flex items-center text-center ali justify-center sm:flex-row flex-col text-white"
        style={{ backgroundImage: "url('https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777193957/IMG_20260426_115818.jpg_fdeth3.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center pt-20 sm:pt-0 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{isRTL ? "خدمة متميزة" : "Premium Service"}</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
            {t.subtitle}
          </p>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-16 lg:py-24 sm:mt-12">
          <div className="grid lg:grid-cols-1 gap-12 items-start">

            {/* LEFT: Form Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${step >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    1
                  </div>
                  <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-gray-900' : 'bg-gray-100'}`} />
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${step >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    2
                  </div>
                </div>
              </div>

              {step === 1 ? (
                <form onSubmit={handleNextStep} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                    <Car className="w-5 h-5 text-gray-700" />
                    {t.step1}
                  </h2>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
                      {error}
                    </div>
                  )}

                  {/* Car Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t.carType}</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${formData.carType === 'Premium' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="carType"
                          value="Premium"
                          onChange={handleChange}
                          className="absolute opacity-0"
                        />
                        <Image
                          src="/car-wash.png"
                          alt="Premium"
                          width={80}
                          height={80}
                          className={`mb-3 transition-all duration-300 ${formData.carType === 'Premium' ? 'grayscale-0' : 'grayscale opacity-60'}`}
                        />
                        <span className="font-semibold text-gray-900">{t.premium}</span>
                        {formData.carType === 'Premium' && (
                          <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-gray-900" />
                        )}
                      </label>

                      <label className={`relative flex flex-col items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${formData.carType === 'Normal' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input
                          type="radio"
                          name="carType"
                          value="Normal"
                          onChange={handleChange}
                          className="absolute opacity-0"
                        />
                        <Image
                          src="/car.png"
                          alt="Normal"
                          width={80}
                          height={80}
                          className={`mb-3 transition-all duration-300 ${formData.carType === 'Normal' ? 'grayscale-0' : 'grayscale opacity-60'}`}
                        />
                        <span className="font-semibold text-gray-900">{t.normal}</span>
                        {formData.carType === 'Normal' && (
                          <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-gray-900" />
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Route Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="from"
                        value={formData.from}
                        onChange={handleChange}
                        placeholder={t.from}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        placeholder={t.to}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Date and Return */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <input
                        type="checkbox"
                        id="isReturn"
                        checked={formData.isReturn}
                        onChange={() => setFormData(prev => ({ ...prev, isReturn: !prev.isReturn }))}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                      />
                      <label htmlFor="isReturn" className="text-gray-700 font-medium cursor-pointer">
                        {t.isReturn}
                      </label>
                    </div>
                  </div>

                  {formData.isReturn && (
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        placeholder={t.returnDate}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {t.continue}
                      {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-gray-700" />
                    {t.step2}
                  </h2>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        placeholder={t.name}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="userEmail"
                        value={formData.userEmail}
                        onChange={handleChange}
                        placeholder={t.email}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="userNumber"
                      value={formData.userNumber}
                      onChange={handleChange}
                      placeholder={t.phone}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="numOfAdults"
                        min={1}
                        value={formData.numOfAdults}
                        onChange={handleChange}
                        placeholder={t.passengers}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                        required
                      />
                    </div>

                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="numOfLuggage"
                        min={0}
                        value={formData.numOfLuggage}
                        onChange={handleChange}
                        placeholder={t.luggage}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder={t.remarks}
                      rows={3}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all placeholder-gray-400 resize-none"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl font-semibold text-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      {isRTL ? <ArrowRight className="w-5 h-5 inline ml-2" /> : <ArrowLeft className="w-5 h-5 inline mr-2" />}
                      {t.back}
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:opacity-70 shadow-lg shadow-gray-200"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t.processing}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5" />
                            {t.submit}
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: Empty / Visual space */}
            {/* <div className="hidden lg:flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center mx-auto">
                    <Car className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                    {isRTL ? "رحلة فاخرة تنتظرك" : "Luxury Awaits"}
                  </h3>
                  <p className="text-white/80 max-w-sm mx-auto">
                    {isRTL
                      ? "احجز سيارتك الفاخرة الآن واستمتع بتجربة قيادة لا مثيل لها"
                      : "Book your luxury car now and enjoy an unparalleled driving experience"}
                  </p>
                </div>
              </div> */}
          </div>
        </div>
        {/* <section
          className="relative w-full min-h-[700px] lg:min-h-[800px] bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

        </section> */}
      </section>

      {/* Form Section with Background Image - Form on Left */}


      {/* Trust Badges */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.trust.secure}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-900" />
              <span>{t.trust.support}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{t.trust.bestPrice}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Your Existing Rows */}
      <div className="w-full text-center  h-52 flex flex-row justify-around p-12">
        <div className="row w-full text-center max-w-4xl h-52 flex flex-row justify-around m-4">
          <div className="col flex flex-row">
            <div className="col bg-gray-200 h-full w-1/2 rounded-l-2xl overflow-hidden">
              <img src="/albania.jpg" alt="car" className="w-full h-full object-cover transition-all duration-300" />
            </div>
            <div className="col bg-gray-100 h-full w-1/2 p-4 rounded-r-2xl flex items-center justify-center">
              <p className="text-gray-600 font-medium">rghergvhe</p>
            </div>
          </div>
          <div className="col flex flex-row">
            <div className="col bg-gray-200 h-full w-1/2 rounded-l-2xl overflow-hidden">
              <img src="/albania.jpg" alt="car" className="w-full h-full object-cover transition-all duration-300" />
            </div>
            <div className="col bg-gray-100 h-full w-1/2 p-4 rounded-r-2xl flex items-center justify-center">
              <p className="text-gray-600 font-medium">rghergvhe</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
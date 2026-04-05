// 'use client';

// import React, { useState, useEffect, Suspense } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/footer";
// import axios from "axios";
// import apiClient from "@/lib/api";
// import SuccessPopup from "@/components/SuccessPopup";
// import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
// import { useParams, useSearchParams } from 'next/navigation';

// interface HotelBookingData {
//   country: string;
//   city: string;
//   hotelName: string;
//   fromDate: string;
//   toDate: string;
//   adults: number;
//   children: number;
//   childrenAges: number[];
//   infants: number;
//   userName: string;
//   userEmail: string;
//   userPhone: string;
//   remarks: string;
// }

// // Loading fallback for Suspense
// function HotelPageLoading() {
//   return (
//     <div className="bg-white min-h-screen flex items-center justify-center">
//       <div className="text-xl text-black">Loading...</div>
//     </div>
//   );
// }

// // Main export with Suspense wrapper
// export default function Page() {
//   return (
//     <Suspense fallback={<HotelPageLoading />}>
//       <HotelBookingContent />
//     </Suspense>
//   );
// }

// // Inner component that uses useSearchParams
// function HotelBookingContent() {
//   const [step, setStep] = useState<1 | 2>(1);
//   const [error, setError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [lang, setLang] = useState<Language>("en");
//   const searchParams = useSearchParams();
//   const [formData, setFormData] = useState<HotelBookingData>({
//     country: "",
//     city: "",
//     hotelName: "",
//     fromDate: "",
//     toDate: "",
//     adults: 1,
//     children: 0,
//     childrenAges: [],
//     infants: 0,
//     userName: "",
//     userEmail: "",
//     userPhone: "",
//     remarks: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "number" ? parseInt(value) || 0 : value,
//     }));
//   };

//   const handleChildrenChange = (value: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       children: value,
//       childrenAges: Array(value).fill(0),
//     }));
//   };

//   const handleChildAgeChange = (index: number, age: number) => {
//     const updatedAges = [...formData.childrenAges];
//     updatedAges[index] = age;

//     setFormData((prev) => ({
//       ...prev,
//       childrenAges: updatedAges,
//     }));
//   };

//   /* language */
//   useEffect(() => {
//     setLang(getLanguageFromSearchParams(searchParams));
//   }, [searchParams]);

//   const handleNextStep = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       !formData.country ||
//       !formData.city ||
//       !formData.hotelName ||
//       !formData.fromDate ||
//       !formData.toDate
//     ) {
//       setError("Please fill all hotel details");
//       return;
//     }

//     setError("");
//     setStep(2);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     await apiClient.post("/hotelBooking", formData);

//     setShowPopup(true);
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       <Navbar />
//       <SuccessPopup
//         isOpen={showPopup}
//         onClose={() => setShowPopup(false)}
//         title={lang === "en" ? "Booking Successful!" : "تم الحجز بنجاح!"}
//         message={
//           lang === "en"
//             ? "Our team will contact you shortly."
//             : "سيتواصل معك فريقنا قريبًا."
//         }
//       />
//       <div className="max-w-2xl mx-auto p-6 min-h-screen">
//         <h1 className="mb-8 text-center text-3xl font-bold">{lang === "en" ? "Hotel Services" : "خدمات الفنادق"}</h1>
//         <p>{lang === "en" ? "From luxury suites to cozy retreats and city breaks, we ensure your stay is seamless and memorable." : "من الأجنحة الفاخرة إلى الإقامات الدافئة وعطلات المدينة المميزه، نضمن لك إقامة سلسة وتجربة لا تُنسى"}</p>
//         <h2 className="text-xl font-semibold text-blue-700">
//           Step 1: Hotel Details
//         </h2>

//         {step === 1 ? (
//           <form
//             onSubmit={handleNextStep}
//             className="space-y-6 rounded-lg border-2 border-gray-200 p-6 shadow-lg"
//           >
//             {error && <div className="text-red-500">{error}</div>}

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Country
//               </label>
//               <input
//                 type="text"
//                 name="country"
//                 placeholder="Country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 City
//               </label>
//               <input
//                 type="text"
//                 name="city"
//                 placeholder="City"
//                 value={formData.city}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Hotel Name
//               </label>
//               <input
//                 type="text"
//                 name="hotelName"
//                 placeholder="Hotel Name"
//                 value={formData.hotelName}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 required
//               />
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   From Date
//                 </label>
//                 <input
//                   type="date"
//                   name="fromDate"
//                   value={formData.fromDate}
//                   onChange={handleChange}
//                   className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   To Date
//                 </label>
//                 <input
//                   type="date"
//                   name="toDate"
//                   value={formData.toDate}
//                   onChange={handleChange}
//                   className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Adults
//                 </label>
//                 <input
//                   type="number"
//                   name="adults"
//                   min={1}
//                   value={formData.adults}
//                   onChange={handleChange}
//                   className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                   placeholder="Adults"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Children
//                 </label>
//                 <input
//                   type="number"
//                   min={0}
//                   value={formData.children}
//                   onChange={(e) =>
//                     handleChildrenChange(parseInt(e.target.value) || 0)
//                   }
//                   className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                   placeholder="Children"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Infants
//                 </label>
//                 <input
//                   type="number"
//                   name="infants"
//                   min={0}
//                   value={formData.infants}
//                   onChange={handleChange}
//                   className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                   placeholder="Infants"
//                 />
//               </div>
//             </div>

//             {formData.children > 0 && (
//               <div>
//                 <h3 className="text-black font-semibold">Children Ages</h3>
//                 <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
//                   {formData.childrenAges.map((age, index) => (
//                     <input
//                       key={index}
//                       type="number"
//                       min={0}
//                       max={17}
//                       placeholder={`Child ${index + 1} Age`}
//                       value={age}
//                       onChange={(e) =>
//                         handleChildAgeChange(
//                           index,
//                           parseInt(e.target.value) || 0
//                         )
//                       }
//                       className="input-style w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
//             >
//               Continue to Personal Details
//             </button>
//           </form>
//         ) : (
//           <form
//             onSubmit={handleSubmit}
//             className="space-y-6 rounded-lg border-2 border-gray-200 p-6 shadow-lg"
//           >
//             <h2 className="text-xl font-semibold text-blue-700">
//               Step 2: Personal Details
//             </h2>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 name="userName"
//                 placeholder="Full Name"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="userEmail"
//                 placeholder="Email"
//                 value={formData.userEmail}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 name="userPhone"
//                 placeholder="Phone"
//                 value={formData.userPhone}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Remarks
//               </label>
//               <textarea
//                 name="remarks"
//                 placeholder="Remarks"
//                 value={formData.remarks}
//                 onChange={handleChange}
//                 className="input-style mt-1 w-full rounded-md border-2 border-gray-200 p-2 text-black"
//                 rows={3}
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => setStep(1)}
//                 className="w-1/2 rounded-md bg-gray-300 py-2 text-gray-800 hover:bg-gray-400"
//               >
//                 Back
//               </button>

//               <button
//                 type="submit"
//                 className="w-1/2 rounded-md bg-green-600 py-2 text-white hover:bg-green-700"
//               >
//                 Submit Booking
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// }




'use client';

import React, { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import axios from "axios";
import apiClient from "@/lib/api";
import SuccessPopup from "@/components/SuccessPopup";
import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Users,
  Baby,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Phone,
  Mail,
  User,
  Sparkles,
  Building2,
  Globe
} from 'lucide-react';

interface HotelBookingData {
  country: string;
  city: string;
  hotelName: string;
  fromDate: string;
  toDate: string;
  adults: number;
  children: number;
  childrenAges: number[];
  infants: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  remarks: string;
}

const translations = {
  en: {
    title: "Hotel Services",
    subtitle: "From luxury suites to cozy retreats and city breaks, we ensure your stay is seamless and memorable",
    step1: "Step 1: Hotel Details",
    step2: "Step 2: Guest Details",
    country: "Country",
    city: "City",
    hotelName: "Hotel Name",
    fromDate: "Check-in Date",
    toDate: "Check-out Date",
    adults: "Adults",
    children: "Children",
    infants: "Infants",
    childrenAges: "Children Ages",
    childAgePlaceholder: "Child {index} Age",
    continue: "Continue to Guest Details",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    remarks: "Additional Notes",
    back: "Back",
    submit: "Confirm Booking",
    processing: "Processing...",
    successTitle: "Booking Successful!",
    successMessage: "Our team will contact you shortly.",
    errors: {
      fillFields: "Please fill in all required fields"
    },
    trust: {
      secure: "Secure Booking",
      support: "24/7 Support",
      bestPrice: "Best Price Guarantee"
    }
  },
  ar: {
    title: "خدمات الفنادق",
    subtitle: "من الأجنحة الفاخرة إلى الإقامات الدافئة وعطلات المدينة، نضمن لك إقامة سلسة وتجربة لا تُنسى",
    step1: "الخطوة ١: تفاصيل الفندق",
    step2: "الخطوة ٢: تفاصيل النزلاء",
    country: "الدولة",
    city: "المدينة",
    hotelName: "اسم الفندق",
    fromDate: "تاريخ الوصول",
    toDate: "تاريخ المغادرة",
    adults: "البالغين",
    children: "الأطفال",
    infants: "الرضع",
    childrenAges: "أعمار الأطفال",
    childAgePlaceholder: "عمر الطفل {index}",
    continue: "المتابعة إلى تفاصيل النزلاء",
    name: "الاسم الكامل",
    email: "عنوان البريد الإلكتروني",
    phone: "رقم الهاتف",
    remarks: "ملاحظات إضافية",
    back: "رجوع",
    submit: "تأكيد الحجز",
    processing: "جاري المعالجة...",
    successTitle: "تم الحجز بنجاح!",
    successMessage: "سيتواصل معك فريقنا قريبًا.",
    errors: {
      fillFields: "الرجاء ملء جميع الحقول المطلوبة"
    },
    trust: {
      secure: "حجز آمن",
      support: "دعم على مدار الساعة",
      bestPrice: "أفضل ضمان للسعر"
    }
  }
};

// Loading fallback for Suspense
function HotelPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Building2 className="w-16 h-16 text-red-600" />
        <div className="text-xl text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function Page() {
  return (
    <Suspense fallback={<HotelPageLoading />}>
      <HotelBookingContent />
    </Suspense>
  );
}

// Inner component that uses useSearchParams
function HotelBookingContent() {
  const searchParams = useSearchParams();
  const lang = getLanguageFromSearchParams(searchParams);
  const t = translations[lang];
  const isRTL = lang === "ar";

  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState<HotelBookingData>({
    country: "",
    city: "",
    hotelName: "",
    fromDate: "",
    toDate: "",
    adults: 1,
    children: 0,
    childrenAges: [],
    infants: 0,
    userName: "",
    userEmail: "",
    userPhone: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleChildrenChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      children: value,
      childrenAges: Array(value).fill(0),
    }));
  };

  const handleChildAgeChange = (index: number, age: number) => {
    const updatedAges = [...formData.childrenAges];
    updatedAges[index] = age;
    setFormData((prev) => ({
      ...prev,
      childrenAges: updatedAges,
    }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !formData.country ||
      !formData.city ||
      !formData.hotelName ||
      !formData.fromDate ||
      !formData.toDate
    ) {
      setError(t.errors.fillFields);
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post("/hotelBooking", formData);
      setShowPopup(true);
      setFormData({
        country: "",
        city: "",
        hotelName: "",
        fromDate: "",
        toDate: "",
        adults: 1,
        children: 0,
        childrenAges: [],
        infants: 0,
        userName: "",
        userEmail: "",
        userPhone: "",
        remarks: "",
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
    <div dir={getDirection(lang)} className="min-h-screen bg-gray-50">
      <Navbar />

      <SuccessPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title={t.successTitle}
        message={t.successMessage}
      />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20  pt-36">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="relative mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{isRTL ? "إقامة فاخرة" : "Luxury Stay"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t.title}
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>

          {/* Main Form Card */}
          <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200 overflow-hidden">

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-red-600' : 'bg-gray-200'}`} />
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
              </div>
            </div>

            {step === 1 ? (
              <form onSubmit={handleNextStep} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                  <Building2 className="w-5 h-5 text-red-600" />
                  {t.step1}
                </h2>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center">
                    {error}
                  </div>
                )}

                {/* Location Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder={t.country}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t.city}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                {/* Hotel Name */}
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    placeholder={t.hotelName}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    required
                  />
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-black">
                      Check-in date
                    </span>
                    <input
                      type="date"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-42 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 text-black">
                      Check-out date
                    </span>
                    <input
                      type="date"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleChange}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-42 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Guests Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative text-black">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2">
                      Adults
                    </span>
                    <input
                      type="number"
                      name="adults"
                      min={1}
                      value={formData.adults}
                      onChange={handleChange}
                      placeholder={t.adults}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    />
                  </div>

                  <div className="relative text-black">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2">
                      Children (2-14)
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={12}
                      value={formData.children}
                      onChange={(e) => handleChildrenChange(parseInt(e.target.value) || 0)}
                      placeholder={t.children}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-42 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    />
                  </div>

                  <div className="relative text-black">
                    <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <span className="absolute left-10 top-1/2 -translate-y-1/2">
                      Infants
                    </span>
                    <input
                      type="number"
                      name="infants"
                      min={0}
                      value={formData.infants}
                      onChange={handleChange}
                      placeholder={t.infants}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Children Ages */}
                {formData.children > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-red-600" />
                      {t.childrenAges}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.childrenAges.map((age, index) => (
                        <div key={index} className="relative text-black">
                          Child {index + 1}
                          <Baby className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                          <input
                            type="number"
                            min={0}
                            max={17}
                            placeholder={t.childAgePlaceholder.replace('{index}', String(index + 1))}
                            value={age}
                            onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value) || 0)}
                            className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    {t.continue}
                    {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-red-600" />
                  {t.step2}
                </h2>

                {error && (
                  <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder={t.name}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="email"
                      name="userEmail"
                      value={formData.userEmail}
                      onChange={handleChange}
                      placeholder={t.email}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                  <input
                    type="tel"
                    name="userPhone"
                    value={formData.userPhone}
                    onChange={handleChange}
                    placeholder={t.phone}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    required
                  />
                </div>

                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-red-600" />
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder={t.remarks}
                    rows={3}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400 resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    {isRTL ? <ArrowRight className="w-5 h-5 inline ml-2" /> : <ArrowLeft className="w-5 h-5 inline mr-2" />}
                    {t.back}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors disabled:opacity-70"
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

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{t.trust.secure}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>{t.trust.support}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{t.trust.bestPrice}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
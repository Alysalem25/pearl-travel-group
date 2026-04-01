// "use client";

// import { useSearchParams } from "next/navigation";
// import { useState, useEffect, Suspense } from "react";
// import axios from "axios";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/footer";
// import { Language } from "@/data/translations";
// import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, ArrowLeft, Mail, Check, AlertCircle } from "lucide-react";
// import apiClient, { api } from "@/lib/api";

// type VisaStepOneForm = {
//   name: string;
//   phone: string;
//   email: string;
//   destination: string;
//   otherCountries: string;
// };

// type VisaStep = 1 | 2 | 3;

// type VisaStepTwoForm = {
//   hasTraveledAbroad: "yes" | "no";
//   visitedCountries: string;
// };

// type StepOneErrors = {
//   name?: string;
//   phone?: string;
//   email?: string;
//   destination?: string;
// };

// type StepTwoErrors = {
//   visitedCountries?: string;
// };

// const INITIAL_STEP_ONE_FORM: VisaStepOneForm = {
//   name: "",
//   phone: "",
//   email: "",
//   destination: "",
//   otherCountries: "",
// };

// const INITIAL_STEP_TWO_FORM: VisaStepTwoForm = {
//   hasTraveledAbroad: "no",
//   visitedCountries: "",
// };

// const countLetters = (value: string) => (value.match(/\p{L}/gu) ?? []).length;

// interface Country {
//   _id: string;
//   nameEn: string;
//   nameAr: string;
//   country: string;
//   images: string[];
//   inhomepage: boolean;
// }

// // Loading fallback for Suspense
// function VisaPageLoading() {
//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center">
//       <div className="text-xl text-black">Loading...</div>
//     </div>
//   );
// }

// // Main export with Suspense wrapper
// export default function VisaPage() {
//   return (
//     <Suspense fallback={<VisaPageLoading />}>
//       <VisaPageContent />
//     </Suspense>
//   );
// }

// // Inner component that uses useSearchParams
// function VisaPageContent() {
//   const [lang, setLang] = useState<Language>("en");
//   const [mounted, setMounted] = useState(false);
//   const [currentStep, setCurrentStep] = useState<VisaStep>(1);
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [stepOneForm, setStepOneForm] = useState<VisaStepOneForm>(INITIAL_STEP_ONE_FORM);
//   const [stepTwoForm, setStepTwoForm] = useState<VisaStepTwoForm>(INITIAL_STEP_TWO_FORM);
//   const [stepOneErrors, setStepOneErrors] = useState<StepOneErrors>({});
//   const [stepTwoErrors, setStepTwoErrors] = useState<StepTwoErrors>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [applicationId, setApplicationId] = useState<string | null>(null);
//   const searchParams = useSearchParams();
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [loadingCountries, setLoadingCountries] = useState(true);

//   useEffect(() => {
//     setMounted(true);
//     setLang(getLanguageFromSearchParams(searchParams));
//     const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => setLang(e.detail.lang);
//     window.addEventListener("languagechange", handleLanguageChange as EventListener);
//     return () => window.removeEventListener("languagechange", handleLanguageChange as EventListener);
//   }, [searchParams]);

//   //  fetch countries
//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         setLoadingCountries(true);

//         const res = await api.countries.getInVisa();

//         // لو الـ API بترجع { countries: [...] }
//         const data = res.data.countries || res.data;

//         if (Array.isArray(data)) {
//           setCountries(data);
//         } else {
//           setCountries([]);
//         }
//       } catch (err) {
//         console.error("Error fetching countries", err);
//         setCountries([]);
//       } finally {
//         setLoadingCountries(false);
//       }
//     };

//     fetchCountries();
//   }, []);

//   if (!mounted) return null;

//   const direction = getDirection(lang);
//   const resetWizardState = () => {
//     setCurrentStep(1);
//     setStepOneForm(INITIAL_STEP_ONE_FORM);
//     setStepTwoForm(INITIAL_STEP_TWO_FORM);
//     setStepOneErrors({});
//     setStepTwoErrors({});
//   };

//   const openPopup = () => {
//     resetWizardState();
//     setPopupOpen(true);
//   };

//   const closePopup = () => {
//     setPopupOpen(false);
//     resetWizardState();
//   };

//   const handleStepOneNext = () => {
//     const errors: StepOneErrors = {};
//     const normalizedName = stepOneForm.name.trim();
//     const normalizedPhone = stepOneForm.phone.trim();

//     if (!normalizedName) {
//       errors.name = "Name is required.";
//     } else if (countLetters(normalizedName) < 3) {
//       errors.name = "Name must be at least 3 letters.";
//     }

//     if (!normalizedPhone) {
//       errors.phone = "Phone is required.";
//     } else if (normalizedPhone.length < 11) {
//       errors.phone = "Phone must be at least 11 digits.";
//     }

//     if (!stepOneForm.destination) {
//       errors.destination = "Please select one destination.";
//     }

//     setStepOneErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       return;
//     }

//     setCurrentStep(2);
//   };

//   const handleStepTwoNext = () => {
//     const errors: StepTwoErrors = {};

//     if (stepTwoForm.hasTraveledAbroad === "yes" && !stepTwoForm.visitedCountries.trim()) {
//       errors.visitedCountries = "Please enter countries you have visited.";
//     }

//     setStepTwoErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       return;
//     }

//     // Submit the form
//     handleFormSubmit();
//   };

//   const handleFormSubmit = async () => {
//     setSubmitting(true);
//     setSubmitError(null);

//     try {
//       const payload = {
//         fullName: stepOneForm.name,
//         email: stepOneForm.email,
//         phone: stepOneForm.phone,
//         destination: stepOneForm.destination,
//         otherCountries: stepOneForm.otherCountries,
//         hasTraveledAbroad: stepTwoForm.hasTraveledAbroad === "yes",
//         visitedCountries: stepTwoForm.visitedCountries,
//       };
//       // const response = await api.visa.apply(payload);
//       console.log("Submitting visa application with payload:", payload);
//       const response = await apiClient.post(`/visa`, payload);

//       if (response.data.applicationId) {
//         setApplicationId(response.data.applicationId);
//         setSubmitSuccess(true);
//         setCurrentStep(3);
//       }
//     } catch (error: any) {
//       console.error("Submission error:", error);
//       setSubmitError(
//         error.response?.data?.error || error.message || "An error occurred while submitting your application."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleGoToPreviousStep = () => {
//     if (currentStep === 3) {
//       setCurrentStep(2);
//       return;
//     }

//     if (currentStep === 2) {
//       setCurrentStep(1);
//     }
//   };

//   return (
//     <>
//       <main className="min-h-screen bg-white" dir={direction}>
//         <Navbar />

//         <div className="py-20 px-4 sm:px-6 lg:px-8 pt-32">
//           <div className="max-w-7xl mx-auto">
//             <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Where your journey begins</h2>
//             <p>{lang === "en" ? "Our Visa Services simplify your travel preparations, helping you secure visas for destinations worldwide, including Schengen Area, USA, Canada, Brazil, China, and more. /n We guide you through every step of the application process, ensuring your documents are accurate, complete, and submitted on time — making your travel planning smooth, stress-free, and hassle-free." : "نُسهّل عليك إجراءات السفر من خلال خدمات التأشيرات المتكاملة، ونساعدك في الحصول على التأشيرات لمختلف الوجهات حول العالم، بما في ذلك منطقة شنغن، الولايات المتحدة الأمريكية، كندا، البرازيل، الصين وغيرها.نرافقك في كل خطوة من خطوات التقديم، مع الحرص على أن تكون مستنداتك دقيقة ومكتملة ومقدمة في الوقت المحدد — لنضمن لك تخطيط سفر سلس، خالٍ من التوتر، وبأقصى درجات الاحترافية"}</p>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 py-4">
//               {countries.map((country, index) => (
//                 <motion.div
//                   key={country._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                   className="w-full"
//                 >
//                   <div
//                     className="bg-gradient-to-br rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-12 text-white h-64 flex flex-col items-center justify-center relative overflow-hidden"
//                     style={{
//                       backgroundImage: `url('${country.images[0]}')`,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                     }}
//                   >
//                     <div className="absolute inset-0 bg-black/40" />
//                     <h3 className="text-2xl font-bold relative z-10">{country.nameEn}</h3>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* CTA Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4, delay: 0.6 }}
//               className="flex justify-center mt-12"
//             >
//               <button
//                 type="button"
//                 onClick={openPopup}
//                 className="px-10 py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-blue-500 to-sky-500 border-2 border-blue-600/80 shadow-xl shadow-blue-200/50 hover:from-blue-600 hover:to-sky-600 hover:shadow-blue-300/60 transition-all duration-300"
//               >
//                 Start your visa Application
//               </button>
//             </motion.div>
//           </div>
//         </div>
//       </main>

//       <Footer />

//       {/* Popup modal - visa step 1 preview */}
//       <AnimatePresence>
//         {popupOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={closePopup}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 z-50"
//             >
//               <div className="flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-t-2xl">
//                 <div className="w-9">
//                   {currentStep > 1 && (
//                     <button
//                       type="button"
//                       onClick={handleGoToPreviousStep}
//                       className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
//                       aria-label="Go to previous step"
//                     >
//                       <ArrowLeft className="w-5 h-5 text-white" />
//                     </button>
//                   )}
//                 </div>
//                 <p className="text-xl sm:text-2xl font-semibold text-center flex-1">
//                   {currentStep === 1 ? "Visa Registration" : currentStep === 2 ? "Travel History" : "Thank You!"}
//                 </p>
//                 <div className="flex items-center gap-3 sm:gap-4">
//                   <p className="text-sm sm:text-lg font-medium">
//                     {currentStep === 1 ? "Step 1 of 3" : currentStep === 2 ? "Step 2 of 3" : "Step 3 of 3"}
//                   </p>
//                   <button
//                     type="button"
//                     onClick={closePopup}
//                     className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
//                     aria-label="Close visa registration popup"
//                   >
//                     <X className="w-5 h-5 text-white" />
//                   </button>
//                 </div>
//               </div>

//               {currentStep === 1 ? (
//                 <div className="px-4 py-4 sm:px-6 sm:py-5 space-y-4">
//                   <div className="grid gap-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] sm:items-center gap-1.5 sm:gap-3">
//                       <label className="text-base sm:text-lg text-gray-700">Name:</label>
//                       <div>
//                         <input
//                           type="text"
//                           value={stepOneForm.name}
//                           onChange={(e) => {
//                             setStepOneForm((prev) => ({ ...prev, name: e.target.value }));
//                             setStepOneErrors((prev) => ({ ...prev, name: undefined }));
//                           }}
//                           className={`w-full h-10 px-3 rounded-sm border text-gray-900 placeholder:text-gray-400 bg-white caret-gray-900 focus:outline-none focus:ring-2 ${stepOneErrors.name
//                               ? "border-red-400 focus:ring-red-300 focus:border-red-400"
//                               : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
//                             }`}
//                         />
//                         {stepOneErrors.name && <p className="mt-1 text-sm text-red-600">{stepOneErrors.name}</p>}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] sm:items-center gap-1.5 sm:gap-3">
//                       <label className="text-base sm:text-lg text-gray-700">Phone:</label>
//                       <div>
//                         <input
//                           type="tel"
//                           inputMode="numeric"
//                           pattern="[0-9]*"
//                           value={stepOneForm.phone}
//                           onChange={(e) => {
//                             const digitsOnly = e.target.value.replace(/\D/g, "");
//                             setStepOneForm((prev) => ({ ...prev, phone: digitsOnly }));
//                             setStepOneErrors((prev) => ({ ...prev, phone: undefined }));
//                           }}
//                           className={`w-full h-10 px-3 rounded-sm border text-gray-900 placeholder:text-gray-400 bg-white caret-gray-900 focus:outline-none focus:ring-2 ${stepOneErrors.phone
//                               ? "border-red-400 focus:ring-red-300 focus:border-red-400"
//                               : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
//                             }`}
//                         />
//                         {stepOneErrors.phone && <p className="mt-1 text-sm text-red-600">{stepOneErrors.phone}</p>}
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] sm:items-center gap-1.5 sm:gap-3">
//                       <label className="text-base sm:text-lg text-gray-700">Email:</label>
//                       <div>
//                         <input
//                           type="email"
//                           value={stepOneForm.email}
//                           onChange={(e) => {
//                             setStepOneForm((prev) => ({ ...prev, email: e.target.value }));
//                             setStepOneErrors((prev) => ({ ...prev, email: undefined }));
//                           }}
//                           className={`w-full h-10 px-3 rounded-sm border text-gray-900 placeholder:text-gray-400 bg-white caret-gray-900 focus:outline-none focus:ring-2 ${stepOneErrors.email
//                               ? "border-red-400 focus:ring-red-300 focus:border-red-400"
//                               : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
//                             }`}
//                         />
//                         {stepOneErrors.email && <p className="mt-1 text-sm text-red-600">{stepOneErrors.email}</p>}
//                       </div>
//                     </div>
//                   </div>

//                   <hr className="border-gray-200" />

//                   <div>
//                     <h3 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-3">Destination:</h3>
//                     <div className="max-h-52 overflow-y-auto pr-1">
//                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4">
//                         {countries.map((country) => (
//                           <label
//                             key={country._id}
//                             className="inline-flex items-start gap-2 text-sm sm:text-base text-gray-800 cursor-pointer"
//                           >
//                             <input
//                               type="radio"
//                               name="destination"
//                               value={country.nameEn}
//                               checked={stepOneForm.destination === country.nameEn}
//                               onChange={(e) =>
//                                 setStepOneForm((prev) => ({
//                                   ...prev,
//                                   destination: e.target.value,
//                                   otherCountry: "",
//                                 }))
//                               }
//                               className="mt-0.5 h-4 w-4 accent-blue-600"
//                             />
//                             <span>{country.nameEn}</span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                     {stepOneErrors.destination && (
//                       <p className="mt-2 text-sm text-red-600">{stepOneErrors.destination}</p>
//                     )}
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-[145px_1fr] sm:items-center gap-1.5 sm:gap-3">
//                     <label className="text-base sm:text-lg text-gray-700">Other countries:</label>
//                     <input
//                       type="text"
//                       value={stepOneForm.otherCountries}
//                       onChange={(e) => setStepOneForm((prev) => ({ ...prev, otherCountries: e.target.value }))}
//                       placeholder="Enter other destinations"
//                       className="w-full h-10 px-3 rounded-sm border border-gray-300 text-gray-900 placeholder:text-gray-400 bg-white caret-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//                     />
//                   </div>

//                   <div className="border-t border-gray-200 pt-3 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={handleStepOneNext}
//                       className="px-8 py-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-500 text-white text-base font-medium hover:from-blue-800 hover:to-blue-600 transition-colors"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               ) : currentStep === 2 ? (
//                 <div className="px-4 py-5 sm:px-6 sm:py-6 space-y-5">
//                   <div className="space-y-4">
//                     <p className="text-2xl sm:text-[32px] text-gray-800">Have you ever traveled abroad?</p>
//                     <div className="flex items-center gap-8 sm:gap-12">
//                       <label className="inline-flex items-center gap-2.5 text-2xl text-gray-800 cursor-pointer">
//                         <input
//                           type="radio"
//                           name="hasTraveledAbroad"
//                           value="yes"
//                           checked={stepTwoForm.hasTraveledAbroad === "yes"}
//                           onChange={() => {
//                             setStepTwoForm((prev) => ({ ...prev, hasTraveledAbroad: "yes" }));
//                             setStepTwoErrors((prev) => ({ ...prev, visitedCountries: undefined }));
//                           }}
//                           className="h-5 w-5 accent-blue-600"
//                         />
//                         <span>Yes</span>
//                       </label>
//                       <label className="inline-flex items-center gap-2.5 text-2xl text-gray-800 cursor-pointer">
//                         <input
//                           type="radio"
//                           name="hasTraveledAbroad"
//                           value="no"
//                           checked={stepTwoForm.hasTraveledAbroad === "no"}
//                           onChange={() => {
//                             setStepTwoForm((prev) => ({
//                               ...prev,
//                               hasTraveledAbroad: "no",
//                               visitedCountries: "",
//                             }));
//                             setStepTwoErrors((prev) => ({ ...prev, visitedCountries: undefined }));
//                           }}
//                           className="h-5 w-5 accent-blue-600"
//                         />
//                         <span>No</span>
//                       </label>
//                     </div>
//                   </div>

//                   {stepTwoForm.hasTraveledAbroad === "yes" && (
//                     <div className="space-y-3">
//                       <label className="inline-flex items-center gap-2 text-xl text-gray-800">
//                         <input type="checkbox" checked readOnly className="h-5 w-5 accent-blue-600 pointer-events-none" />
//                         <span>Countries you have visited:</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={stepTwoForm.visitedCountries}
//                         onChange={(e) => {
//                           setStepTwoForm((prev) => ({
//                             ...prev,
//                             visitedCountries: e.target.value,
//                           }));
//                           setStepTwoErrors((prev) => ({ ...prev, visitedCountries: undefined }));
//                         }}
//                         className={`w-full h-11 px-3 rounded-sm border text-gray-900 placeholder:text-gray-400 bg-white caret-gray-900 focus:outline-none focus:ring-2 ${stepTwoErrors.visitedCountries
//                             ? "border-red-400 focus:ring-red-300 focus:border-red-400"
//                             : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
//                           }`}
//                       />
//                       {stepTwoErrors.visitedCountries && (
//                         <p className="text-sm text-red-600">{stepTwoErrors.visitedCountries}</p>
//                       )}
//                     </div>
//                   )}

//                   {submitError && (
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
//                       <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//                       <p className="text-sm text-red-700">{submitError}</p>
//                     </div>
//                   )}

//                   <div className="border-t border-gray-200 pt-3 flex justify-end gap-2">
//                     <button
//                       type="button"
//                       onClick={handleGoToPreviousStep}
//                       disabled={submitting}
//                       className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 text-base font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                     >
//                       Back
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleStepTwoNext}
//                       disabled={submitting}
//                       className="px-8 py-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-500 text-white text-base font-medium hover:from-blue-800 hover:to-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {submitting ? "Submitting..." : "Submit"}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="px-4 py-8 sm:px-6 sm:py-10">
//                   {submitSuccess ? (
//                     <>
//                       <div className="flex items-center gap-3 sm:gap-4">
//                         <div className="h-px flex-1 bg-gray-200" />
//                         <div className="relative">
//                           <div className="h-14 w-20 sm:h-16 sm:w-24 rounded-md bg-blue-100 border border-blue-300 flex items-center justify-center shadow-sm">
//                             <Mail className="h-8 w-8 text-blue-700" />
//                           </div>
//                           <div className="absolute -right-2 -bottom-2 h-9 w-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
//                             <Check className="h-5 w-5 text-white" />
//                           </div>
//                         </div>
//                         <div className="h-px flex-1 bg-gray-200" />
//                       </div>

//                       <div className="mt-8 text-center space-y-4">
//                         <p className="text-3xl sm:text-4xl font-semibold text-blue-900">Thank you for registering!</p>
//                         <p className="text-xl sm:text-2xl text-gray-700">Our visa team will contact you shortly.</p>
//                         <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
//                           <strong>Application ID:</strong> {applicationId}
//                         </p>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="flex items-center justify-center gap-4">
//                       <AlertCircle className="w-8 h-8 text-red-600" />
//                       <div>
//                         <p className="text-2xl font-semibold text-red-900">Error</p>
//                         <p className="text-red-700">{submitError || "Failed to submit application"}</p>
//                       </div>
//                     </div>
//                   )}

//                   <div className="border-t border-gray-200 mt-8 pt-4 flex justify-center">
//                     <button
//                       type="button"
//                       onClick={closePopup}
//                       className="px-8 py-2 rounded-md bg-gray-200 text-gray-800 text-base font-medium hover:bg-gray-300 transition-colors"
//                     >
//                       Close
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { Language } from "@/data/translations";
import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Mail,
  Check,
  AlertCircle,
  Globe,
  User,
  Phone,
  MapPin,
  Sparkles,
  Loader2,
  FileText,
  Plane
} from "lucide-react";
import apiClient, { api } from "@/lib/api";

type VisaStepOneForm = {
  name: string;
  phone: string;
  email: string;
  destination: string;
  otherCountries: string;
};

type VisaStep = 1 | 2 | 3;

type VisaStepTwoForm = {
  hasTraveledAbroad: "yes" | "no";
  visitedCountries: string;
};

type StepOneErrors = {
  name?: string;
  phone?: string;
  email?: string;
  destination?: string;
};

type StepTwoErrors = {
  visitedCountries?: string;
};

const INITIAL_STEP_ONE_FORM: VisaStepOneForm = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  otherCountries: "",
};

const INITIAL_STEP_TWO_FORM: VisaStepTwoForm = {
  hasTraveledAbroad: "no",
  visitedCountries: "",
};

const countLetters = (value: string) => (value.match(/\p{L}/gu) ?? []).length;

interface Country {
  _id: string;
  nameEn: string;
  nameAr: string;
  country: string;
  images: string[];
  inhomepage: boolean;
}

const translations = {
  en: {
    title: "Visa Services",
    subtitle: "Our Visa Services simplify your travel preparations, helping you secure visas for destinations worldwide, including Schengen Area, USA, Canada, Brazil, China, and more. We guide you through every step of the application process, ensuring your documents are accurate, complete, and submitted on time — making your travel planning smooth, stress-free, and hassle-free.",
    journeyBegins: "Where your journey begins",
    startApplication: "Start Your Visa Application",
    step1: "Step 1: Personal Information",
    step2: "Step 2: Travel History",
    step3: "Step 3: Confirmation",
    name: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    destination: "Destination",
    otherCountries: "Other Countries",
    otherCountriesPlaceholder: "Enter other destinations",
    hasTraveled: "Have you ever traveled abroad?",
    yes: "Yes",
    no: "No",
    visitedCountries: "Countries you have visited",
    visitedCountriesPlaceholder: "Enter countries you have visited",
    next: "Next",
    back: "Back",
    submit: "Submit Application",
    submitting: "Submitting...",
    thankYou: "Thank you for registering!",
    contactSoon: "Our visa team will contact you shortly.",
    applicationId: "Application ID",
    close: "Close",
    error: "Error",
    submitError: "Failed to submit application",
    errors: {
      nameRequired: "Name is required",
      nameLength: "Name must be at least 3 letters",
      phoneRequired: "Phone is required",
      phoneLength: "Phone must be at least 11 digits",
      emailRequired:"Email is required",
      destinationRequired: "Please select one destination",
      visitedRequired: "Please enter countries you have visited"
    },
    trust: {
      secure: "Secure Process",
      support: "24/7 Support",
      bestPrice: "Best Service"
    }
  },
  ar: {
    title: "خدمات التأشيرات",
    subtitle: "نُسهّل عليك إجراءات السفر من خلال خدمات التأشيرات المتكاملة، ونساعدك في الحصول على التأشيرات لمختلف الوجهات حول العالم، بما في ذلك منطقة شنغن، الولايات المتحدة الأمريكية، كندا، البرازيل، الصين وغيرها. نرافقك في كل خطوة من خطوات التقديم، مع الحرص على أن تكون مستنداتك دقيقة ومكتملة ومقدمة في الوقت المحدد — لنضمن لك تخطيط سفر سلس، خالٍ من التوتر، وبأقصى درجات الاحترافية.",
    journeyBegins: "حيث تبدأ رحلتك",
    startApplication: "ابدأ طلب التأشيرة",
    step1: "الخطوة ١: المعلومات الشخصية",
    step2: "الخطوة ٢: سجل السفر",
    step3: "الخطوة ٣: التأكيد",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "عنوان البريد الإلكتروني",
    destination: "الوجهة",
    otherCountries: "دول أخرى",
    otherCountriesPlaceholder: "أدخل وجهات أخرى",
    hasTraveled: "هل سافرت إلى الخارج من قبل؟",
    yes: "نعم",
    no: "لا",
    visitedCountries: "الدول التي زرتها",
    visitedCountriesPlaceholder: "أدخل الدول التي زرتها",
    next: "التالي",
    back: "رجوع",
    submit: "تقديم الطلب",
    submitting: "جاري التقديم...",
    thankYou: "شكراً لتسجيلك!",
    contactSoon: "سيتواصل معك فريق التأشيرات قريباً.",
    applicationId: "رقم الطلب",
    close: "إغلاق",
    error: "خطأ",
    submitError: "فشل في تقديم الطلب",
    errors: {
      nameRequired: "الاسم مطلوب",
      nameLength: "يجب أن يكون الاسم ٣ أحرف على الأقل",
      phoneRequired: "رقم الهاتف مطلوب",
      phoneLength: "يجب أن يكون رقم الهاتف ١١ رقماً على الأقل",
      destinationRequired: "الرجاء اختيار وجهة واحدة",
      emailRequired:"الايميل مطلوب",
      visitedRequired: "الرجاء إدخال الدول التي زرتها"
    },
    trust: {
      secure: "إجراءات آمنة",
      support: "دعم على مدار الساعة",
      bestPrice: "أفضل خدمة"
    }
  }
};

// Loading fallback for Suspense
function VisaPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <FileText className="w-16 h-16 text-red-600" />
        <div className="text-xl text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function VisaPage() {
  return (
    <Suspense fallback={<VisaPageLoading />}>
      <VisaPageContent />
    </Suspense>
  );
}

// Inner component that uses useSearchParams
function VisaPageContent() {
  const searchParams = useSearchParams();
  const lang = getLanguageFromSearchParams(searchParams);
  const t = translations[lang];
  const isRTL = lang === "ar";

  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<VisaStep>(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [stepOneForm, setStepOneForm] = useState<VisaStepOneForm>(INITIAL_STEP_ONE_FORM);
  const [stepTwoForm, setStepTwoForm] = useState<VisaStepTwoForm>(INITIAL_STEP_TWO_FORM);
  const [stepOneErrors, setStepOneErrors] = useState<StepOneErrors>({});
  const [stepTwoErrors, setStepTwoErrors] = useState<StepTwoErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  useEffect(() => {
    setMounted(true);
    const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => {
      // Language change handled by page reload
    };
    window.addEventListener("languagechange", handleLanguageChange as EventListener);
    return () => window.removeEventListener("languagechange", handleLanguageChange as EventListener);
  }, [searchParams]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const res = await api.countries.getInVisa();
        const data = res.data.countries || res.data;
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          setCountries([]);
        }
      } catch (err) {
        console.error("Error fetching countries", err);
        setCountries([]);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  if (!mounted) return null;

  const direction = getDirection(lang);

  const resetWizardState = () => {
    setCurrentStep(1);
    setStepOneForm(INITIAL_STEP_ONE_FORM);
    setStepTwoForm(INITIAL_STEP_TWO_FORM);
    setStepOneErrors({});
    setStepTwoErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setApplicationId(null);
  };

  const openPopup = () => {
    resetWizardState();
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
    resetWizardState();
  };

  const handleStepOneNext = () => {
    const errors: StepOneErrors = {};
    const normalizedName = stepOneForm.name.trim();
    const normalizedPhone = stepOneForm.phone.trim();
    const normalizedEmail = stepOneForm.email.trim();

    if (!normalizedName) {
      errors.name = t.errors.nameRequired;
    } else if (countLetters(normalizedName) < 3) {
      errors.name = t.errors.nameLength;
    }

    if (!normalizedPhone) {
      errors.phone = t.errors.phoneRequired;
    } else if (normalizedPhone.length < 11) {
      errors.phone = t.errors.phoneLength;
    }

    if (!normalizedEmail) {
      errors.email = t.errors.emailRequired;
    }



    if (!stepOneForm.destination) {
      errors.destination = t.errors.destinationRequired;
    }

    setStepOneErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setCurrentStep(2);
  };

  const handleStepTwoNext = () => {
    const errors: StepTwoErrors = {};

    if (stepTwoForm.hasTraveledAbroad === "yes" && !stepTwoForm.visitedCountries.trim()) {
      errors.visitedCountries = t.errors.visitedRequired;
    }

    setStepTwoErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    handleFormSubmit();
  };

  const handleFormSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        fullName: stepOneForm.name,
        email: stepOneForm.email,
        phone: stepOneForm.phone,
        destination: stepOneForm.destination,
        otherCountries: stepOneForm.otherCountries,
        hasTraveledAbroad: stepTwoForm.hasTraveledAbroad === "yes",
        visitedCountries: stepTwoForm.visitedCountries,
      };

      const response = await apiClient.post(`/visa`, payload);

      if (response.data.applicationId) {
        setApplicationId(response.data.applicationId);
        setSubmitSuccess(true);
        setCurrentStep(3);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(
        error.response?.data?.error || error.message || t.submitError
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoToPreviousStep = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
      return;
    }
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={direction}>
      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20 pt-32">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="relative mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{isRTL ? "خدمة متميزة" : "Premium Service"}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t.title}
            </h1>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {countries.map((country, index) => (
              <div
                key={country._id}
                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url('${country.images[0]}')`,
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white relative z-10">
                    {lang === "ar" && country.nameAr ? country.nameAr : country.nameEn}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-16">
            <button
              type="button"
              onClick={openPopup}
              className="px-10 py-4 bg-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              {t.startApplication}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
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

      {/* Popup Modal */}
      {popupOpen && (
        <>
          <div
            onClick={closePopup}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[94%] max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-2 border-gray-200 z-50">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-red-600 text-white rounded-t-3xl">
              <div className="w-9">
                {currentStep > 1 && currentStep < 3 && (
                  <button
                    type="button"
                    onClick={handleGoToPreviousStep}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                  </button>
                )}
              </div>
              <p className="text-xl font-semibold text-center flex-1">
                {currentStep === 1 ? t.step1 : currentStep === 2 ? t.step2 : t.step3}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium">
                  {currentStep === 1 ? "1/3" : currentStep === 2 ? "2/3" : "3/3"}
                </p>
                <button
                  type="button"
                  onClick={closePopup}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Step 1 */}
            {currentStep === 1 ? (
              <div className="px-6 py-6 space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      value={stepOneForm.name}
                      onChange={(e) => {
                        setStepOneForm((prev) => ({ ...prev, name: e.target.value }));
                        setStepOneErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder={t.name}
                      className={`w-full bg-white border-2 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400 ${stepOneErrors.name ? "border-red-400" : "border-gray-200 focus:border-red-500"
                        }`}
                    />
                    {stepOneErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{stepOneErrors.name}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={stepOneForm.phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        setStepOneForm((prev) => ({ ...prev, phone: digitsOnly }));
                        setStepOneErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder={t.phone}
                      className={`w-full bg-white border-2 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400 ${stepOneErrors.phone ? "border-red-400" : "border-gray-200 focus:border-red-500"
                        }`}
                    />
                    {stepOneErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{stepOneErrors.phone}</p>
                    )}
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="email"
                      value={stepOneForm.email}
                      onChange={(e) => {
                        setStepOneForm((prev) => ({ ...prev, email: e.target.value }));
                        setStepOneErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      placeholder={t.email}
                      className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    />
                        {stepOneErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{stepOneErrors.email}</p>
                    )}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Destination Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    {t.destination}
                  </h3>
                  <div className="max-h-48 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {countries.map((country) => (
                        <label
                          key={country._id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${stepOneForm.destination === country.nameEn
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-red-200"
                            }`}
                        >
                          <input
                            type="radio"
                            name="destination"
                            value={country.nameEn}
                            checked={stepOneForm.destination === country.nameEn}
                            onChange={(e) => {
                              setStepOneForm((prev) => ({
                                ...prev,
                                destination: e.target.value,
                                otherCountries: "",
                              }));
                              setStepOneErrors((prev) => ({ ...prev, destination: undefined }));
                            }}
                            className="w-4 h-4 accent-red-600"
                          />
                          <span className="text-gray-800">
                            {lang === "ar" && country.nameAr ? country.nameAr : country.nameEn}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {stepOneErrors.destination && (
                    <p className="mt-2 text-sm text-red-600">{stepOneErrors.destination}</p>
                  )}
                </div>

                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                  <input
                    type="text"
                    value={stepOneForm.otherCountries}
                    onChange={(e) => setStepOneForm((prev) => ({ ...prev, otherCountries: e.target.value }))}
                    placeholder={t.otherCountriesPlaceholder}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleStepOneNext}
                    className="px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    {t.next}
                    {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ) : currentStep === 2 ? (
              /* Step 2 */
              <div className="px-6 py-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-xl font-semibold text-gray-800">{t.hasTraveled}</p>
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-3 text-lg text-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name="hasTraveledAbroad"
                        value="yes"
                        checked={stepTwoForm.hasTraveledAbroad === "yes"}
                        onChange={() => {
                          setStepTwoForm((prev) => ({ ...prev, hasTraveledAbroad: "yes" }));
                          setStepTwoErrors((prev) => ({ ...prev, visitedCountries: undefined }));
                        }}
                        className="w-5 h-5 accent-red-600"
                      />
                      <span>{t.yes}</span>
                    </label>
                    <label className="flex items-center gap-3 text-lg text-gray-800 cursor-pointer">
                      <input
                        type="radio"
                        name="hasTraveledAbroad"
                        value="no"
                        checked={stepTwoForm.hasTraveledAbroad === "no"}
                        onChange={() => {
                          setStepTwoForm((prev) => ({
                            ...prev,
                            hasTraveledAbroad: "no",
                            visitedCountries: "",
                          }));
                          setStepTwoErrors((prev) => ({ ...prev, visitedCountries: undefined }));
                        }}
                        className="w-5 h-5 accent-red-600"
                      />
                      <span>{t.no}</span>
                    </label>
                  </div>
                </div>

                {stepTwoForm.hasTraveledAbroad === "yes" && (
                  <div className="relative">
                    <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      value={stepTwoForm.visitedCountries}
                      onChange={(e) => {
                        setStepTwoForm((prev) => ({
                          ...prev,
                          visitedCountries: e.target.value,
                        }));
                        setStepTwoErrors((prev) => ({ ...prev, visitedCountries: undefined }));
                      }}
                      placeholder={t.visitedCountriesPlaceholder}
                      className={`w-full bg-white border-2 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400 ${stepTwoErrors.visitedCountries ? "border-red-400" : "border-gray-200 focus:border-red-500"
                        }`}
                    />
                    {stepTwoErrors.visitedCountries && (
                      <p className="mt-1 text-sm text-red-600">{stepTwoErrors.visitedCountries}</p>
                    )}
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{submitError}</p>
                  </div>
                )}

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleGoToPreviousStep}
                    disabled={submitting}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    onClick={handleStepTwoNext}
                    disabled={submitting}
                    className="px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        {t.submit}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Step 3 - Success/Error */
              <div className="px-6 py-10">
                {submitSuccess ? (
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-16 w-20 rounded-xl bg-red-100 border-2 border-red-300 flex items-center justify-center">
                        <Mail className="h-8 w-8 text-red-600" />
                      </div>
                      <div className="h-10 w-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-lg">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-gray-800">{t.thankYou}</p>
                      <p className="text-lg text-gray-600">{t.contactSoon}</p>
                      <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl">
                        <p className="text-sm text-gray-600">
                          <strong>{t.applicationId}:</strong>{" "}
                          <span className="text-red-600 font-mono">{applicationId}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-4">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                    <div className="text-left">
                      <p className="text-xl font-bold text-gray-800">{t.error}</p>
                      <p className="text-gray-600">{submitError || t.submitError}</p>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t-2 border-gray-200 flex justify-center">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
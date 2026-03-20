// 'use client'

// import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import axios from "axios";

// import Navbar from '@/components/Navbar';
// import CountryHero from '@/components/country-hero';
// import Footer from '@/components/footer';
// import { motion } from "framer-motion";
// import {
//   Language,
//   getDirection,
//   getLanguageFromSearchParams
// } from "@/lib/language";
// import Link from "next/link";
// import apiClient from "@/lib/api";

// interface Cruise {
//   _id: string;
//   titleEn: string;
//   titleAr: string;
//   images: string[];
//   status: string;
// }

// const Page = () => {

//   const { type } = useParams<{ type: string }>();
//   const searchParams = useSearchParams();

//   const [lang, setLang] = useState<Language>("en");
//   const [mounted, setMounted] = useState(false);
//   const [cruises, setCruises] = useState<Cruise[]>([]);

//   /* Language */
//   useEffect(() => {
//     setMounted(true);
//     setLang(getLanguageFromSearchParams(searchParams));
//   }, [searchParams]);

//   /* Fetch Programs */
//   useEffect(() => {
//     if (!type) return;
//     fetchPrograms(type);
//   }, [type]);

//   const fetchPrograms = async (type: string) => {
//     try {
//       const res = await apiClient.get(`/cruisies/type/${type}`)

//       if (Array.isArray(res.data)) {
//         setCruises(res.data);
//       } else {
//         console.error("Invalid response shape", res.data);
//         setCruises([]);
//       }

//     } catch (err) {
//       console.error("Error fetching programs:", err);
//       setCruises([]);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div dir={getDirection(lang)} className="bg-white min-h-screen">

//       <Navbar />

  
    
//         {/* Background Video */}
//         <div className="absolute inset-0 -z-10" >
//           <video autoPlay muted loop className="w-full h-full object-cover">
//             <source src={"/albania-bg-video.mp4"} type="video/mp4" />
//           </video>
//           <div className="absolute inset-0 bg-black/50" />
//         </div>

//         {/* Content */}
//         <motion.h1
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true }}
//           // variants={item}

//           className={`text-white font-bold text-6xl`}
//         >
//           {/* {country ? (lang === "ar" ? country.nameAr : country.nameEn) : data[lang][params.id as "Egypt" | "Albania"]} */}
//         </motion.h1 >
  
//       <motion.h1
//         className="text-3xl font-bold text-center mt-10 text-black"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         {lang === "ar" ? "البرامج" : type + " Cruisies"}
//       </motion.h1>

//       <div className="max-w-[1400px] mx-auto mt-10 flex flex-wrap justify-center gap-10 px-4">
//         {cruises.length === 0 && (
//           <p className="text-gray-400 text-lg">No programs found</p>
//         )}

//         {cruises.map(cruise => (

//           <Link
//             href={`/cruisies/${type}/${cruise._id}`}
//             key={cruise._id}
//           >

//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="w-[350px]"
//             >

//               <div
//                 className="
//                 h-[300px]
//                 rounded-[30px]
//                 bg-cover
//                 bg-center
//                 flex
//                 items-end
//                 justify-center
//                 cursor-pointer
//                 transition-all
//                 hover:brightness-75
//                 hover:scale-[1.03]
//                 "
//                 style={{
//                   backgroundImage: `
//                   linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)),
//                   url(http://147.93.126.15${cruise.images?.[0]})
//                   `
//                 }}
//               >

//                 <h2 className="text-white text-xl font-bold mb-6 text-center px-4">
//                   {lang === "ar" ? cruise.titleAr : cruise.titleEn}
//                 </h2>

//               </div>

//             </motion.div>

//           </Link>

//         ))}

//       </div>

//       <Footer />

//     </div>
//   );
// };

// export default Page;



'use client';

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import {
  Language,
  getDirection,
  getLanguageFromSearchParams
} from "@/lib/language";
import Link from "next/link";
import apiClient from "@/lib/api";
import { 
  Ship, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';

interface Cruise {
  _id: string;
  titleEn: string;
  titleAr: string;
  images: string[];
  status: string;
  duration?: string;
  price?: string;
}

const translations = {
  en: {
    title: "Cruise Packages",
    subtitle: "Discover breathtaking destinations with our premium cruise experiences. Sail through crystal-clear waters and explore exotic ports.",
    programs: "Programs",
    noPrograms: "No cruise programs found",
    duration: "Duration",
    days: "days",
    from: "From",
    viewDetails: "View Details",
    explore: "Explore Our Cruises",
    trust: {
      secure: "Secure Booking",
      support: "24/7 Support",
      bestPrice: "Best Price Guarantee"
    }
  },
  ar: {
    title: "باقات الرحلات البحرية",
    subtitle: "اكتشف وجهات خلابة مع تجارب الرحلات البحرية المتميزة. ابحر عبر المياه الصافية واستكشف الموانئ الغريبة.",
    programs: "البرامج",
    noPrograms: "لا توجد برامج رحلات بحرية",
    duration: "المدة",
    days: "أيام",
    from: "ابتداءً من",
    viewDetails: "عرض التفاصيل",
    explore: "استكشف رحلاتنا البحرية",
    trust: {
      secure: "حجز آمن",
      support: "دعم على مدار الساعة",
      bestPrice: "أفضل ضمان للسعر"
    }
  }
};

// Loading fallback
function CruisesPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Ship className="w-16 h-16 text-red-600" />
        <div className="text-xl text-gray-600 font-medium">Loading...</div>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function Page() {
  return (
    <Suspense fallback={<CruisesPageLoading />}>
      <CruisesContent />
    </Suspense>
  );
}

// Inner component that uses useSearchParams
function CruisesContent() {
  const { type } = useParams<{ type: string }>();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loading, setLoading] = useState(true);

  const t = translations[lang];
  const isRTL = lang === "ar";

  /* Language */
  useEffect(() => {
    setMounted(true);
    setLang(getLanguageFromSearchParams(searchParams));
  }, [searchParams]);

  /* Fetch Programs */
  useEffect(() => {
    if (!type) return;
    fetchPrograms(type);
  }, [type]);

  const fetchPrograms = async (type: string) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/cruisies/type/${type}`);

      if (Array.isArray(res.data)) {
        setCruises(res.data);
      } else {
        console.error("Invalid response shape", res.data);
        setCruises([]);
      }
    } catch (err) {
      console.error("Error fetching programs:", err);
      setCruises([]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div dir={getDirection(lang)} className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video autoPlay muted loop className="w-full h-full object-cover">
            <source src={"/Cruise.mp4"} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50/20 border border-red-200/30 text-red-200 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{isRTL ? "تجربة بحرية فاخرة" : "Luxury Cruise Experience"}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-20 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Programs Section */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <Ship className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                {lang === "ar" ? t.programs : `${type} ${t.programs}`}
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
              </div>
            ) : cruises.length === 0 ? (
              <div className="text-center py-16">
                <Ship className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t.noPrograms}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cruises.map((cruise, index) => (
                  <Link
                    href={`/cruisies/${type}/${cruise._id}`}
                    key={cruise._id}
                    className="group"
                  >
                    <div className="relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-red-500 transition-all duration-300 hover:shadow-xl hover:shadow-red-100">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={cruise.images && cruise.images.length > 0 ? `http://147.93.126.15${cruise.images[0]}` : '/default-image.jpg'}
                          alt={lang === "ar" ? cruise.titleAr : cruise.titleEn}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Status Badge */}
                        {cruise.status && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                            {cruise.status}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {lang === "ar" ? cruise.titleAr : cruise.titleEn}
                        </h3>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          {cruise.duration && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-red-600" />
                              <span>{cruise.duration} {t.days}</span>
                            </div>
                          )}
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          {cruise.price && (
                            <div className="text-sm">
                              <span className="text-gray-500">{t.from} </span>
                              <span className="text-lg font-bold text-red-600">${cruise.price}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-red-600 font-medium text-sm group-hover:gap-2 transition-all">
                            {t.viewDetails}
                            {isRTL ? (
                              <ArrowLeft className="w-4 h-4" />
                            ) : (
                              <ArrowRight className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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
// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { motion } from "framer-motion";
// import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
// import { api } from "@/lib/api";

// export default function About() {
//   const [lang, setLang] = useState<Language>("en");
//   const [mounted, setMounted] = useState(false);
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     setMounted(true);
//     setLang(getLanguageFromSearchParams(searchParams));

//     const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => {
//       setLang(e.detail.lang);
//     };

//     window.addEventListener("languagechange", handleLanguageChange as EventListener);
//     return () =>
//       window.removeEventListener("languagechange", handleLanguageChange as EventListener);
//   }, [searchParams]);

//     const [media, setMedia] = useState<any[]>([]);
//     const [aboutImage1, setAboutImage1] = useState<any>(null);
//     const [aboutImage2, setAboutImage2] = useState<any>(null);
//     const [aboutImage3, setAboutImage3] = useState<any>(null);

//   useEffect(() => {
//     // Fetch all media for about section
    
//     // Fetch single image for about section (for main hero image)
//     api.media.getMediaBySectionAndType("about1", "image")
//     .then(res => {
//       if (res.data) setAboutImage1(res.data);
//     })
//     .catch(err => console.error("Failed to fetch about image:", err));
//     api.media.getMediaBySectionAndType("about2" , "image")
//       .then(res => setAboutImage2(res.data || []))
//       .catch(err => console.error("Failed to fetch media:", err));
//     api.media.getMediaBySectionAndType("about3" , "image")
//       .then(res => setAboutImage3(res.data || []))
//       .catch(err => console.error("Failed to fetch media:", err));
//   }, []);

//   if (!mounted) return null;

//   const isRTL = lang === "ar";
//   const direction = getDirection(lang);

//   const data = {
//     en: {
//       title: "About Us",
//       paragraph:
//         "It is our great pleasure to extend our services to your esteemed company. Established in 1985, Pearl Travel is a fully accredited IATA travel agency based in Alexandria.  Being in business since 1985 makes us one of Egypt's leading travel agencies  with proven financial record, representing most international airlines. "+ "space" +" Moreover, we are among the few who hold the 'Category A' rating from IATA in Egypt. Our large client base varies between governmental and private sector entities. Our diverse services also include the following:",
//       points: [
//         "Domestic and international air reservations and ticketing.",
//         "Hotel reservations world-wide.",
//         "Conference and incentive tours.",
//         "Visa Processing applications for Schengen, USA, China and Australia.",
//         "Arranging domestic and international holiday packages.",
//         "Meet and greet at the Airport and visa processing.",
//         "Limousine and car hire service.",
//         "Educational packages and youth summer camps.",
//       ]
//     },
//     ar: {
//       title: "معلومات عنا",
//       paragraph: "يسرنا أن نقدم خدماتنا لشركائنا في العمل. تأسست شركة بيرل للسفر في عام 1985، وهي وكالة سفر معتمدة بالكامل من IATA وتقع في الإسكندرية. كوننا في مجال الأعمال لمدة 40 عامًا يجعلنا واحدة من وكالات السفر الرائدة في مصر بسجل مالي مثبت، نمثل معظم شركات الطيران الدولية. علاوة على ذلك، نحن من بين القلائل الذين يحملون تصنيف 'الفئة أ' من IATA في مصر. تتنوع قاعدة عملائنا الكبيرة بين الهيئات الحكومية والقطاع الخاص. كما تشمل خدماتنا المتنوعة ما يلي:",
//       points: [
//         "الحجز والتأشيرات الجوية المحلية والدولية.",
//         "الحجز في الفنادق حول العالم.",
//         "جولات المؤتمرات والمكافآت.",
//         "معالجة طلبات التأشيرة لمنطقة شنغن، الولايات المتحدة، الصين وأستراليا.",
//         "تنظيم حزم العطل المحلية والدولية.",
//         "الاستقبال والترحيب في المطار وإجراءات الحصول على التأشيرة.",
//         "خدمة ليموزين وتأجير السيارات.",
//         "حزم تعليمية ومخيمات صيفية للشباب."
//       ]
//     },
//   }

//   /* ================= Animations ================= */
//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.15 },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 30 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
//   };

//   return (
//     <section
//       dir={direction}
//       id="about-section"
//       className="relative py-20 bg-gradient-to-b from-gray-50 to-white"
//     >
//       <motion.div
//         variants={container}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true }}
//         className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
//       >
//         {/* Title */}
//         <motion.h1
//           variants={item}
//           className={`font-bold mb-8 text-center text-[var(--mainColor)] text-2xl ${isRTL ? "font-arabic" : ""
//             } text-4xl sm:text-5xl md:text-6xl`}
//         >
//           {data[lang].title}
//         </motion.h1>



//         {/* Content */}
//         <div
//           className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? "lg:flex-row-reverse" : ""
//             }`}
//         >
//           {/* Text */}
//           <motion.div
//             variants={item}
//             className="space-y-6 text-[var(--secondColor)] text-2xl">
//             <motion.p variants={item} className="text-start align-middle sm:text-2xl mb-8 max-w-full text-xl
//          text-[var(--secondColor)]">
//               {data[lang].paragraph}
//             </motion.p>

//             <ol type="1" className="list-decimal list-inside space-y-2">
//               {data[lang].points.map((point, i) => (
//                 <li className="text-xl sm:text-2xl" key={i}>{point}</li>
//               ))}
//             </ol>
//           </motion.div>

//           {/* Images */}
//           <motion.div
//             variants={item}
//             className="grid grid-cols-2 gap-6"
//           >
//             <img
//               src={aboutImage1?.url ||"WhatsApp Image 2026-02-22 at 4.49.51 PM.jpeg"}
//                             // src={aboutImage?.url || media[0]?.url }

//               alt="..."
//               className="col-span-2 rounded-2xl object-cover w-full h-auto shadow-lg"
//             />
//             <img
//               src={aboutImage2?.url ||"WhatsApp Image 2026-02-22 at 4.47.40 PM.jpeg"}
//               alt=""
//               className="rounded-3xl object-cover w-full shadow-lg"
//             />
//             <img
//               src={aboutImage3?.url ||"WhatsApp Image 2026-02-22 at 4.47.25 PM.jpeg"}
//               alt=""
//               className="rounded-3xl object-cover w-full shadow-xl"
//             />
//           </motion.div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }


// =========================================================

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";

export default function About() {
  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
    setLang(getLanguageFromSearchParams(searchParams));

    const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => {
      setLang(e.detail.lang);
    };

    window.addEventListener("languagechange", handleLanguageChange as EventListener);
    return () =>
      window.removeEventListener("languagechange", handleLanguageChange as EventListener);
  }, [searchParams]);

  if (!mounted) return null;

  const isRTL = lang === "ar";
  const direction = getDirection(lang);

  const data = {
    en: {
      title: "About us",
      paragraph: `It is our great pleasure to extend our services to your esteemed company. Established in 1985, Pearl Travel is a fully accredited IATA travel agency based in Alexandria. Being in business since 1985 makes us one of Egypt's leading travel agencies with proven financial record, representing most international airlines.
      
Moreover, we are among the few who hold the 'Category A' rating from IATA in Egypt. Our large client base varies between governmental and private sector entities. Our diverse services also include the following:`,
      points: [
        "Domestic and international air reservations and ticketing.",
        "Hotel reservations world-wide.",
        "Conference and incentive tours.",
        "Visa Processing applications for Schengen, USA, China and Australia.",
        "Arranging domestic and international holiday packages.",
        "Meet and greet at the Airport and visa processing.",
        "Limousine and car hire service.",
        "Educational packages and youth summer camps.",
      ]
    },
    ar: {
      title: "معلومات عنا",
      paragraph: `يسرنا أن نقدم خدماتنا لشركائنا في العمل. تأسست شركة بيرل للسفر في عام 1985، وهي وكالة سفر معتمدة بالكامل من IATA وتقع في الإسكندرية. كوننا في مجال الأعمال لمدة 40 عامًا يجعلنا واحدة من وكالات السفر الرائدة في مصر بسجل مالي مثبت، نمثل معظم شركات الطيران الدولية.

علاوة على ذلك، نحن من بين القلائل الذين يحملون تصنيف 'الفئة أ' من IATA في مصر. تتنوع قاعدة عملائنا الكبيرة بين الهيئات الحكومية والقطاع الخاص. كما تشمل خدماتنا المتنوعة ما يلي:`,
      points: [
        "الحجز والتأشيرات الجوية المحلية والدولية.",
        "الحجز في الفنادق حول العالم.",
        "جولات المؤتمرات والمكافآت.",
        "معالجة طلبات التأشيرة لمنطقة شنغن، الولايات المتحدة، الصين وأستراليا.",
        "تنظيم حزم العطل المحلية والدولية.",
        "الاستقبال والترحيب في المطار وإجراءات الحصول على التأشيرة.",
        "خدمة ليموزين وتأجير السيارات.",
        "حزم تعليمية ومخيمات صيفية للشباب."
      ]
    },
  }

  /* ================= Animations ================= */
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12,
        delayChildren: 0.1 
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.9, 
        ease: [0.25, 0.1, 0.25, 1] as const
      } 
    },
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        duration: 1, 
        ease: "easeOut" 
      } 
    },
  };

  const listItem: Variants = {
    hidden: { opacity: 0, x: isRTL ? 20 : -20 },
    show: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const paragraphs = data[lang].paragraph.split('\n').filter(p => p.trim() !== '');

  return (
    <section
      dir={direction}
      id="about-section"
      className="relative py-24 lg:py-32 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Section Header */}
        <motion.div variants={fadeUp} className="text-center mb-16 lg:mb-20">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium tracking-wider text-[var(--mainColor)] uppercase bg-[var(--mainColor)]/10 rounded-full">
            {lang === "en" ? "Since 1985" : " تأسست 1985"}
          </span>
          <h1
            className={`font-bold text-[var(--mainColor)] ${isRTL ? "font-arabic" : ""} text-4xl sm:text-5xl lg:text-6xl tracking-tight`}
          >
            {data[lang].title}
          </h1>
          <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-[var(--mainColor)] to-transparent rounded-full" />
        </motion.div>

        {/* Content Grid - items-stretch ensures equal height columns */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-stretch ${isRTL ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Text Content */}
          <motion.div variants={fadeUp} className="space-y-8">
            {/* Paragraphs */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, idx) => (
                <motion.p
                  key={idx}
                  variants={fadeUp}
                  className={`text-lg sm:text-xl leading-relaxed text-slate-600 ${isRTL ? "text-right" : "text-left"}`}
                >
                  {paragraph.trim()}
                </motion.p>
              ))}
            </div>

            {/* Services List */}
            <motion.div variants={fadeUp} className="pt-4">
              <h3 className={`text-xl font-semibold text-[var(--secondColor)] mb-6 ${isRTL ? "text-right" : "text-left"}`}>
                {lang === "en" ? "Our Services" : "خدماتنا"}
              </h3>
              <ol className={`space-y-4 ${isRTL ? "pr-2" : "pl-2"}`}>
                {data[lang].points.map((point, i) => (
                  <motion.li
                    key={i}
                    variants={listItem}
                    custom={i}
                    className="flex items-start gap-3 group"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--mainColor)]/10 text-[var(--mainColor)] font-semibold text-sm group-hover:bg-[var(--mainColor)] group-hover:text-white transition-colors duration-300">
                      {i + 1}
                    </span>
                    <span className={`text-base sm:text-lg text-slate-700 leading-relaxed pt-0.5 ${isRTL ? "text-right" : "text-left"}`}>
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </motion.div>

          {/* Images Grid - h-full to match text column height */}
          <motion.div
            variants={scaleIn}
            className="relative grid grid-cols-2 grid-rows-[1fr_auto] gap-4 lg:gap-6 h-full"
          >
            {/* Main large image - takes remaining height */}
            <motion.div 
              className="col-span-2 row-span-1 relative group h-full"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="WhatsApp Image 2026-02-22 at 4.49.51 PM.jpeg"
                alt="Pearl Travel Office"
                className="w-full h-full object-cover rounded-2xl shadow-lg shadow-slate-200/50 group-hover:shadow-xl group-hover:shadow-slate-300/50 transition-shadow duration-500"
              />
            </motion.div>

            {/* Two smaller images - fixed height */}
            <motion.div 
              className="relative group"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="WhatsApp Image 2026-02-22 at 4.47.40 PM.jpeg"
                alt="Travel Services"
                className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md shadow-slate-200/50 group-hover:shadow-lg transition-shadow duration-500"
              />
            </motion.div>

            <motion.div 
              className="relative group"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="WhatsApp Image 2026-02-22 at 4.47.25 PM.jpeg"
                alt="Team"
                className="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md shadow-slate-200/50 group-hover:shadow-lg transition-shadow duration-500"
              />
            </motion.div>

            {/* Decorative element */}
            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full border-2 border-[var(--mainColor)]/20 rounded-2xl" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
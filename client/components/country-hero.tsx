"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";

export default function Hero({ country }: { country?: { nameEn: string; nameAr: string; images: string[] } | null }) {
  const params = useParams();
  const searchParams = useSearchParams();

  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);
  const [urlVideo, setUrlVideo] = useState("/egypt-bg-video.mp4");

  // ✅ Effect 1: mounting + language
  useEffect(() => {
    setMounted(true);

    const currentLang = getLanguageFromSearchParams(searchParams);
    setLang(currentLang);

    const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => {
      setLang(e.detail.lang);
    };

    window.addEventListener("languagechange", handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    };
  }, [searchParams]);

  // ✅ Effect 2: video based on params
  useEffect(() => {
    if (params.id === "Egypt") {
      setUrlVideo("/egypt-bg-video.mp4");
    } else if (params.id === "Albania") {
      setUrlVideo("/albania-bg-video.mp4");
    }
  }, [params.id]);

  // ✅ return AFTER all hooks
  if (!mounted) return null;

  const data = {
    en: { Egypt: "Egypt", Albania: "Albania" },
    ar: { Egypt: "مصر", Albania: "ألبانيا" },
  };

  const direction = getDirection(lang);
  const isRTL = lang === "ar";
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden z-10 "
      style={
        {
          minHeight: "443px",
        }
      }
      dir={direction}
    >
      {/* Background Video */}
      <div className="absolute inset-0 -z-10" >
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src={urlVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <motion.h1
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={item}

        className={`text-white font-bold text-6xl ${isRTL ? "font-arabic" : ""}`}
      >
        {country ? (lang === "ar" ? country.nameAr : country.nameEn) : data[lang][params.id as "Egypt" | "Albania"]}
      </motion.h1 >
    </section >
  );
}

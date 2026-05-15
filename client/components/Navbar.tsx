"use client";


import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, Globe, BarChart3, User, Instagram, Facebook, ChevronRight, Briefcase, Zap, GraduationCap, MapPin } from "lucide-react";
import { translations } from "@/data/translations";
import { Language, getDirection } from "@/lib/language";
import { getLanguageFromSearchParams, updateLanguage } from "@/lib/language";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";


function NavbarContent() {
  const [open, setOpen] = useState(false);
  const [destinationsDropdown, setDestinationsDropdown] = useState(false);
  const [affiliateDropdown, setAffiliateDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isHead } = useAuth();

  // Initialize language from URL or localStorage
  useEffect(() => {
    setMounted(true);
    const currentLang = getLanguageFromSearchParams(searchParams);
    setLang(currentLang);

    // Listen for language changes
    const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => {
      setLang(e.detail.lang);
    };

    window.addEventListener(
      "languagechange",
      handleLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "languagechange",
        handleLanguageChange as EventListener
      );
    };
  }, [searchParams]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('[data-dropdown="destinations"]') &&
        !target.closest('[data-dropdown="language"]')
      ) {
        setDestinationsDropdown(false);
        setAffiliateDropdown(false);
        setLangDropdown(false);
      }
    };

    if (destinationsDropdown || affiliateDropdown || langDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [destinationsDropdown, affiliateDropdown, langDropdown]);

  const changeLang = (newLang: Language) => {
    updateLanguage(newLang);
    setLang(newLang);
    setLangDropdown(false);
    setDestinationsDropdown(false);
    setAffiliateDropdown(false);
    setOpen(false);
    // Refresh the page to apply language changes
    router.refresh();
  };

  const t = translations[lang];
  const isRTL = lang === "ar";
  const direction = getDirection(lang);


  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);


  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        bg-white/95  backdrop-blur-xl shadow-md ${isRTL ? "font-arabic" : ""}`}
      dir='ltr'
    >
      <div className={`
  flex flex-row bg-[#141f2f] sm:items-center justify-around sm:justify-between sm:px-6
   gap-3 text-sm text-white
  transition-all duration-5000 ease-in-out overf  low-hidden
  ${scrolled
          ? "opacity-0 max-h-0 py-0 pointer-events-none"
          : "opacity-100 max-h-20"
        }
`}>

        {/* LEFT SIDE */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">

          {/* PHONE */}
          <div className={`flex items-center gap-2 text-white`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" fill="#fff" viewBox="0 -960 960 960">
              <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z" />
            </svg>
            <a href="tel:+201098076669" className="hover:underline">
              +20 109 807 6669
            </a>
          </div>

          {/* EMAIL */}
          <div className={` flex items-center gap-2   sm:border-l sm:pl-4 text-white border-white`}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" fill={scrolled ? "#000" : "#ffffff"} viewBox="0 -960 960 960">
              <path fill="currentColor" d="M440-520 120-720v400h400v80H120q-33 0-56.5-23.5T40-320v-480q0-33 23.5-56.5T120-880h640q33 0 56.5 23.5T840-800v200h-80v-120L440-520Zm0-80 320-200H120l320 200Z" />
            </svg>
            <a href="mailto:info@pearltravelgroup.com" className="hover:underline break-all">
              info@pearltravelgroup.com
            </a>
          </div>

        </div>

        <div className="flex  flex-col sm:flex-row sm:items-center gap-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <a
              href="https://www.facebook.com/share/1DWP3cFfix/"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:p-2 "
              aria-label="Facebook"
            >
              <Facebook size={20} className="text-white" />
            </a>
          </div>
          <div className="flex items-center gap-2 border-white sm:border-l sm:pl-4">
            <a
              href="https://www.instagram.com/pearltravel1?igsh=MTBsaXdtMGhtcGxseg=="
              target="_blank"
              rel="noopener noreferrer"
              className="sm:p-2"
              aria-label="Instagram"
            >
              <Instagram size={20} className={`text-white`} />
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-full mx-auto px-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/?lang=${lang}`}
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <img
              src="/Logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-blue-950 font-bold">
              Pearl Travel Group
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href={`/?lang=${lang}`}
              className={`transition-colors duration-200 font-medium text-black ${scrolled
                ? "text-black hover:text-[var(--mainColor)]"
                : " hover:text-red-700"
                }`}
            >
              {t.navbar.home}
            </Link>
            <Link
              href={`/Flight?lang=${lang}`}
              className={`transition-colors duration-200 font-medium text-black ${scrolled
                ? "hover:text-[var(--mainColor)]"
                : " hover:text-red-700"
                }`}
            >
              {t.navbar.flight}
            </Link>
            <Link
              href={`/hotel?lang=${lang}`}
              className={`transition-colors duration-200 font-medium text-black ${scrolled
                ? "hover:text-[var(--mainColor)]"
                : "  hover:text-red-700"
                }`}
            >
              {t.navbar.hotel}
            </Link>

            <Link
              href={`/cars?lang=${lang}`}
              className={`transition-colors duration-200 font-medium text-black ${scrolled
                ? "hover:text-[var(--mainColor)]"
                : "  hover:text-red-700"
                }`}
            >
              {t.navbar.cars}
            </Link>

            <Link
              href={`/cruisies?lang=${lang}`}
              className={`transition-colors duration-200 font-medium text-black ${scrolled
                ? "text-black hover:text-[var(--mainColor)]"
                : " hover:text-red-700"
                }`}
            >
              {t.navbar.cruisies}
            </Link>
            <Link
              href={`/visa?lang=${lang}`}
              className={`transition-colors duration-200 font-medium  text-black ${scrolled
                ? "text-black hover:text-[var(--mainColor)]"
                : " hover:text-red-700"
                }`}
            >
              {t.navbar.visa}
            </Link>
            <Link
              href={`/mice?lang=${lang}`}
              className={`transition-colors duration-200 font-medium  text-black ${scrolled
                ? "text-black hover:text-[var(--mainColor)]"
                : " hover:text-red-700"
                }`}
            >
              {t.navbar.mice}
            </Link>

            <div className="relative" data-dropdown="affiliate">
              <button
                onClick={() => setAffiliateDropdown(!affiliateDropdown)}
                className={`flex items-center gap-1 transition-colors duration-200 font-medium  text-black ${scrolled
                  ? "text-black hover:text-[var(--mainColor)]"
                  : " hover:text-red-700"
                  }`}
              >
                {t.navbar.affiliate}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ease-out ${affiliateDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {affiliateDropdown && (
                  <>
                    {/* Backdrop overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setAffiliateDropdown(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.25, 0.1, 0.25, 1] as const
                      }}
                      className={`absolute ${isRTL ? "left-0" : "right-0"} top-full mt-2 z-50 min-w-[200px]`}
                    >
                      {/* Dropdown card with arrow */}
                      <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-slate-100 overflow-hidden">
                        {/* Top arrow */}
                        <div
                          className={`absolute -top-2 ${isRTL ? "left-6" : "right-6"} w-4 h-4 bg-white border-l border-t border-slate-100 rotate-45`}
                        />

                        {/* Header */}
                        {/* <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-red-50/50 to-transparent">
                          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                            {lang === "en" ? "Our Partners" : "شركاؤنا"}
                          </span>
                        </div> */}

                        {/* Items */}
                        <div className="py-2">
                          <p
                            onClick={() => setAffiliateDropdown(false)}
                            className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors duration-200">
                              {/* <Briefcase size={16} /> */}
                              <img src="https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777217687/1_eapn1r.png" alt="Classy Travel" className="w-12 object-contain" />
                            </span>
                            <span className="font-medium text-sm">{t.navbar.classy_travel}</span>
                          </p>

                          <p
                            onClick={() => setAffiliateDropdown(false)}
                            className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors duration-200">

                              <img src="https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777217662/dabdabc9-e773-42b0-9ff1-8db429e05e1d_g2oulv.png" />

                              {/* <Zap size={16} /> */}
                            </span>
                            <span className="font-medium text-sm">{t.navbar.bounce}</span>
                          </p>

                          <p
                            onClick={() => setAffiliateDropdown(false)}
                            className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors duration-200">
                              {/* <GraduationCap size={16} /> */}
                              <img src="https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777217702/d2976c14-ebb1-485d-8e7f-8948da50c5f2_t4pskm.png" alt="Buckswood" className="w-12 object-contain" />
                            </span>
                            <span className="font-medium text-sm">{t.navbar.buckswood}</span>
                          </p>
                   
                          <p
                            onClick={() => setAffiliateDropdown(false)}
                            className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors duration-200">
                              {/* <GraduationCap size={16} /> */}
                              <img src="https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777218769/msc_logo-removebg-preview_mjjvi6.png" alt="MSC" className="w-12 object-contain" />
                            </span>
                            <span className="font-medium text-sm">{t.navbar.msc}</span>
                          </p>

                          <p
                            onClick={() => setAffiliateDropdown(false)}
                            className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-slate-700 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                          >
                            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-red-100 text-slate-500 group-hover:text-red-600 transition-colors duration-200">
                              <img src="https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1778857950/Rail_Europe_g9igof.webp" alt="Rail Europe" className="w-12 object-contain" />
                            </span>
                            <span className="font-medium text-sm">Rail Europe</span>
                          </p>

                          <div className="mx-3 my-2 h-px bg-slate-100" />
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            {/* Dropdown */}
            <div className="relative" data-dropdown="destinations">
              <button
                onClick={() => setDestinationsDropdown(!destinationsDropdown)}
                className={`flex items-center gap-1 transition-colors duration-200 font-medium  text-black ${scrolled
                  ? "text-black hover:text-[var(--mainColor)]"
                  : " hover:text-red-700"
                  }`}
              >
                {t.navbar.destinations}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${destinationsDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence>
                {destinationsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute ${isRTL ? "left-0" : "right-0"
                      } top-full mt-2 bg-white backdrop-blur-xl shadow-lg rounded-lg w-40 overflow-hidden`}
                  >
                    <Link
                      href={`/Egypt?lang=${lang}`}
                      className="block px-4 py-3 text-black hover:text-white  hover:bg-red-700 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      {t.navbar.egypt}
                    </Link>
                    <Link
                      href={`/Albania?lang=${lang}`}
                      className="block px-4 py-3 text-black hover:text-white  hover:bg-red-700 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      {t.navbar.albania}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Dropdown 
            Affiliate
              Classy Travel
              Bounce 
              Buckswood
            */}




            {/* Language Switcher */}
            <div className="relative ml-4" data-dropdown="language">
              <button
                onClick={() => changeLang(lang === "en" ? "ar" : "en")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-md 
                     bg-red-600 text-white hover:bg-red-700
                `}
              >
                <Globe size={18} />
                <span>{lang === "en" ? "AR" : "EN"}</span>
              </button>
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className={`flex items-center gap-3 ml-4 pl-4 border-l ${scrolled ? "border-gray-300 dark:border-gray-700" : "text-black hover:text-red-700"

                }`}>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${scrolled ? "text-black" : ""
                    }`}>
                    {user?.name}
                  </p>
                  <p className={`text-xs ${scrolled ? "text-gray-500 dark:text-gray-400" : ""
                    }`}>
                    {/* {user?.role === "admin" ? "Admin" : "User"} */}
                    {isAdmin() ? "Admin" : isHead() ? "Head" : "User"}
                  </p>
                </div>

                {(isAdmin() || isHead()) && (
                  <div className="flex flex-row">

                    <Link
                      href={`/profile/${user?.id}`}  // Use actual user ID instead of hardcoded
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 m-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href={`/Admindashbord?lang=${lang}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 m-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                    >
                      <BarChart3 size={16} />
                      Dashboard
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              // <Link
              //   href={`/login?lang=${lang}`}
              //   className={`ml-4 px-4 py-2 rounded-lg transition-colors duration-200 font-medium shadow-md
              //      bg-blue-600 hover:bg-blue-700 text-white"
              //    `}
              // >
              //   Login
              // </Link>
              <div></div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors duration-200 ${scrolled
              ? "text-black hover:text-blue-600 dark:hover:text-blue-400"
              : "text-black hover:text-black/80"
              }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            // <motion.div
            //   initial={{ opacity: 0, height: 0 }}
            //   animate={{ opacity: 1, height: "auto" }}
            //   exit={{ opacity: 0, height: 0 }}
            //   transition={{ duration: 0.2 }}
            //   className={`md:hidden backdrop-blur-xl shadow-lg rounded-lg mt-2 mb-4 overflow-hidden overflow-y-scroll ${scrolled ? "bg-gray-900/95" : "bg-black/80"
            //     }`}
            // >
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`md:hidden backdrop-blur-xl shadow-lg rounded-lg mt-2 mb-4 overflow-hidden ${scrolled ? "bg-gray-900/95" : "bg-black/80"
                }`}
            >
              {/* <div className="px-4 py-4 space-y-3"> */}
              <div className="px-4 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
                <Link
                  href={`/?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.home}
                </Link>
                <Link
                  href={`/Flight?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.flight}
                </Link>
                <Link
                  href={`/hotel?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.hotel}
                </Link>
                <Link
                  href={`/cars?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.cars}
                </Link>
                <Link
                  href={`/cruisies?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.cruisies}
                </Link>
                <Link
                  href={`/visa?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.visa}
                </Link>
                <Link
                  href={`/mice?lang=${lang}`}
                  onClick={() => setOpen(false)}
                  className={`block py-2 transition-colors duration-200 font-medium ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}
                >
                  {t.navbar.mice}
                </Link>
                {/* Mobile Dropdown */}


                <details className="group">
                  <summary className={`cursor-pointer py-2 transition-colors duration-200 font-medium list-none ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span>{t.navbar.affiliate}</span>
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200 group-open:rotate-180"
                      />
                    </div>
                  </summary>
                  <div className={`pl-4 mt-2 space-y-2 rtl:pl-0 rtl:pr-4 ${scrolled ?
                    "text-gray-600 dark:text-gray-400" : "text-white/80"
                    }`}>
                    <p
                      className="block px-4 py-3 text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      {t.navbar.classy_travel}
                    </p>
                    <p
                      className="block px-4 py-3 text-white  hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      {t.navbar.bounce}
                    </p>
                    <p
                      className="block px-4 py-3 text-white  hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      {t.navbar.buckswood}
                    </p>
                    <p
                      className="block px-4 py-3 text-white  hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      {t.navbar.msc}
                    </p>
                    <p
                      className="block px-4 py-3 text-white  hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setAffiliateDropdown(false)}
                    >
                      Rail Europe
                    </p>
                  </div>
                </details>

                <details className="group">
                  <summary className={`cursor-pointer py-2 transition-colors duration-200 font-medium list-none ${scrolled
                    ? "text-white hover:text-blue-600 dark:hover:text-blue-400"
                    : "text-white hover:text-white/80"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span>{t.navbar.destinations}</span>
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200 group-open:rotate-180"
                      />
                    </div>
                  </summary>
                  <div className={`pl-4 mt-2 space-y-2 rtl:pl-0 rtl:pr-4 ${scrolled ?
                    "text-gray-600 dark:text-gray-400" : "text-white/80"
                    }`}>
                    <Link
                      href={`/Egypt?lang=${lang}`}
                      className="block px-4 py-3 text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setDestinationsDropdown(false)}
                    >
                      {t.navbar.egypt}
                    </Link>
                    <Link
                      href={`/Albania?lang=${lang}`}
                      className="block px-4 py-3 text-white  hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                      onClick={() => setDestinationsDropdown(false)}
                    >
                      {t.navbar.albania}
                    </Link>
                  </div>
                </details>




                {/* Mobile Language Switcher */}
                <div className={`pt-4 border-t ${scrolled ? "border-gray-200 dark:border-gray-700" : "border-white/20"
                  }`}>
                  <div className={`flex items-center gap-2 mb-2 ${scrolled ? "text-gray-600 dark:text-gray-400" : "text-white/70"
                    }`}>
                    <Globe size={18} />
                    <span className={`text-sm font-semibold ${scrolled ? "text-black" : "text-white"
                      }`}>
                      {lang === "en" ? "Language" : "اللغة"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeLang("en")}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${lang === "en"
                        ? "bg-blue-600 text-white"
                        : scrolled
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-700  hover:bg-gray-200 dark:hover:bg-gray-700"
                          : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLang("ar")}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${lang === "ar"
                        ? "bg-blue-600 text-white"
                        : scrolled
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-700    hover:bg-gray-200 dark:hover:bg-gray-700"
                          : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                {/* Mobile Auth Section */}
                {isAuthenticated ? (
                  <div className={`pt-4 border-t space-y-3 ${scrolled ? "border-gray-200 dark:border-gray-700" : "border-white/20"
                    }`}>
                    <div className={`px-4 py-2 rounded-lg ${scrolled ? "bg-gray-100 dark:bg-gray-800" : "bg-white/10"
                      }`}>
                      <p className={`text-sm font-semibold ${scrolled ? "text-black" : "text-white"
                        }`}>
                        {user?.name}
                      </p>
                      <p className={`text-xs ${scrolled ? "text-gray-500 dark:text-gray-400" : "text-white/70"
                        }`}>
                        {user?.role === "admin" ? "Admin" : "User"}
                      </p>

                    </div>
                    {isAdmin() && (
                      <div>

                        <Link
                          href={`/profile/${user?.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600
                                   hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href={`/Admindashbord?lang=${lang}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        >
                          <BarChart3 size={16} />
                          Dashboard
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
<p></p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 w-full bg-transparent z-50 fixed top-0 left-0" />}>
      <NavbarContent />
    </Suspense>
  );
}
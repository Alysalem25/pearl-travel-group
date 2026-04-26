"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";
import { Language } from "@/data/translations";
import { getDirection, getLanguageFromSearchParams } from "@/lib/language";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MiceService {
    id: number;
    titleEN: string;
    titleAR: string;
    descriptionEN: string;
    descriptionAR: string;
    longDescriptionEN: string;
    longDescriptionAR: string;
    featuresEN: string[];
    featuresAR: string[];
    icon: string;
    heroImage: string;
}

const miceServices: MiceService[] = [
    {
        id: 1,
        titleEN: "Tailored Planning",
        titleAR: "تخطيط مخصص",
        descriptionEN: "Our experienced team develops detailed action plans and ensures flawless execution of complete itineraries, including pre- and post-conference packages.",
        descriptionAR: "فريقنا ذو الخبرة يطور خطط عمل مفصلة ويضمن تنفيذ مثالي لبرامج السفر الكاملة، بما في ذلك حزم ما قبل وبعد المؤتمرات.",
        longDescriptionEN: "With decades of expertise in MICE planning, we craft bespoke solutions that align perfectly with your corporate objectives. From initial concept to final execution, our dedicated planners handle every detail including venue selection, agenda creation, logistics coordination, and on-site management. We specialize in pre-conference tours, post-event leisure packages, and comprehensive itinerary management that ensures seamless transitions between all program elements.",
        longDescriptionAR: "مع عقود من الخبرة في تخطيط مؤتمرات وفعاليات، نصمم حلولاً مخصصة تتماشى تماماً مع أهداف شركتك. من المفهوم الأولي إلى التنفيذ النهائي، يتعامل مخططونا المخصصون مع كل التفاصيل بما في ذلك اختيار المكان، وإنشاء الأجندة، وتنسيق اللوجستيات، والإدارة في الموقع. نحن متخصصون في الجولات قبل المؤتمر، وحزم الترفيه بعد الفعالية، وإدارة البرامج الشاملة التي تضمن انتقالات سلسة بين جميع عناصر البرنامج.",
        featuresEN: [
            "Customized itinerary design",
            "Pre & post conference packages",
            "Dedicated on-site coordinators",
            "Real-time schedule adjustments",
            "Vendor & supplier management"
        ],
        featuresAR: [
            "تصميم برنامج مخصص",
            "حزم ما قبل وبعد المؤتمر",
            "منسقون مخصصون في الموقع",
            "تعديلات الجدول الزمني في الوقت الفعلي",
            "إدارة البائعين والموردين"
        ],
        icon: "planning",
        heroImage: "https://kimi-web-img.moonshot.cn/img/excel.travel/90ef1834212e46442a3a12239cfea066a3d3d673.jpeg"
    },
    {
        id: 2,
        titleEN: "Transportation",
        titleAR: "النقل",
        descriptionEN: "From brand-new vehicles to personalized meet-and-greet services, we ensure reliable and seamless transportation for every event.",
        descriptionAR: "من السيارات الجديدة إلى خدمات الترحيب الشخصية، نضمن نقلًا موثوقًا وسريعًا لكل فعالية.",
        longDescriptionEN: "Our premium transportation fleet includes luxury coaches, executive sedans, and specialized vehicles to accommodate groups of any size. We provide airport meet-and-greet services with professional multilingual representatives, coordinated shuttle services between venues, and bespoke city tours. All vehicles are equipped with modern amenities and maintained to the highest safety standards, ensuring comfort and punctuality throughout your event.",
        longDescriptionAR: "يتضمن أسطول النقل الفاخر لدينا حافلات فاخرة وسيارات تنفيذية ومركبات متخصصة لاستيعاب مجموعات من أي حجم. نحن نقدم خدمات الاستقبال في المطار مع ممثلين محترفين متعددي اللغات، وخدمات النقل المنسقة بين الأماكن، وجولات مخصصة في المدينة. جميع المركبات مجهزة بوسائل الراحة الحديثة ويتم صيانتها وفقاً لأعلى معايير السلامة، مما يضمن الراحة والدقة طوال فعاليتك.",
        featuresEN: [
            "Luxury vehicle fleet",
            "Airport meet & greet",
            "Multilingual drivers",
            "Real-time GPS tracking",
            "24/7 coordination support"
        ],
        featuresAR: [
            "أسطول مركبات فاخر",
            "الاستقبال في المطار",
            "سائقون متعددو اللغات",
            "تتبع GPS في الوقت الفعلي",
            "دعم التنسيق على مدار الساعة"
        ],
        icon: "transport",
        heroImage: "https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777193868/IMG_20260426_114707.jpg_fjeviz.jpg"
    },
    {
        id: 3,
        titleEN: "Accommodation",
        titleAR: "الإقامة",
        descriptionEN: "Premium hotel partnerships across Egypt offering exclusive rates and dedicated group management services.",
        descriptionAR: "شراكات فندقية متميزة في جميع أنحاء مصر تقدم أسعاراً حصرية وخدمات إدارة مجموعات مخصصة.",
        longDescriptionEN: "Through our extensive network of partnerships with 5-star hotels, boutique resorts, and Nile cruises across Egypt, we secure preferential rates and exclusive amenities for your group. Our accommodation services include room block management, VIP upgrades, special dietary arrangements, and dedicated check-in/check-out coordination. Whether you prefer the historic charm of Old Cairo or the modern luxury of New Capital, we find the perfect lodging solution.",
        longDescriptionAR: "من خلال شبكتنا الواسعة من الشراكات مع الفنادق الفاخرة والمنتجعات البوتيكية والرحلات النيلية في جميع أنحاء مصر، نضمن أسعاراً مفضلة ومزايا حصرية لمجموعتك. تشمل خدمات الإقامة لدينا إدارة كتل الغرف، والترقيات المميزة، والترتيبات الغذائية الخاصة، وتنسيق تسجيل الوصول/المغادرة المخصص. سواء كنت تفضل سحر القاهرة التاريخي أو الفخامة الحديثة للعاصمة الإدارية، نجد حل الإقامة المثالي.",
        featuresEN: [
            "5-star hotel partnerships",
            "Group room block management",
            "VIP suite upgrades",
            "Special dietary catering",
            "Express group check-in"
        ],
        featuresAR: [
            "شراكات فنادق 5 نجوم",
            "إدارة كتل غرف المجموعات",
            "ترقيات الأجنحة المميزة",
            "تموين غذائي خاص",
            "تسجيل وصول سريع للمجموعات"
        ],
        icon: "accommodation",
        heroImage: "https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777193619/IMG_20260426_114912.jpg_wzuxna.jpg"
    },
    {
        id: 4,
        titleEN: "Event Management",
        titleAR: "إدارة الفعاليات",
        descriptionEN: "Full-service event production from concept to completion, including AV technology and stage design.",
        descriptionAR: "إنتاج فعاليات متكامل من المفهوم إلى الإنجاز، بما في ذلك تقنية الصوت والصورة وتصميم المسرح.",
        longDescriptionEN: "Our event management division delivers world-class productions for conferences, gala dinners, product launches, and team-building events. We provide state-of-the-art audiovisual equipment, custom stage design, professional lighting, and simultaneous interpretation services. Our creative team works closely with clients to develop unique themes and branding that leave lasting impressions on attendees.",
        longDescriptionAR: "يوفر قسم إدارة الفعاليات لدينا إنتاجاً عالمي المستوى للمؤتمرات والعشاء الرسمي وإطلاق المنتجات وفعاليات بناء الفريق. نحن نقدم أحدث معدات الصوت والصورة، وتصميم مسرح مخصص، وإضاءة احترافية، وخدمات الترجمة الفورية. يعمل فريقنا الإبداعي بشكل وثيق مع العملاء لتطوير موضوعات وعلامات تجارية فريدة تترك انطباعات دائمة على الحضور.",
        featuresEN: [
            "AV equipment & technology",
            "Custom stage & set design",
            "Professional lighting",
            "Simultaneous interpretation",
            "Theme & branding development"
        ],
        featuresAR: [
            "معدات وتقنية الصوت والصورة",
            "تصميم مسرح وديكور مخصص",
            "إضاءة احترافية",
            "ترجمة فورية",
            "تطوير الموضوع والعلامة التجارية"
        ],
        icon: "events",
        heroImage: "https://res.cloudinary.com/dyissekq4/image/upload/q_auto/f_auto/v1777193560/pexels-eran-design-2158190390-35215413_1_uvsehr.jpg"
    },
    {
        id: 5,
        titleEN: "Dining & Catering",
        titleAR: "الطعام والتموين",
        descriptionEN: "Exquisite culinary experiences from gala dinners to coffee breaks, tailored to your event theme.",
        descriptionAR: "تجارب طهي رائعة من العشاء الرسمي إلى فترات استراحة القهوة، مصممة حسب موضوع فعاليتك.",
        longDescriptionEN: "Elevate your event with our exceptional catering services featuring international cuisine, traditional Egyptian specialties, and customized menus. Our culinary team handles everything from elegant coffee breaks and working lunches to elaborate gala dinners and themed banquets. We accommodate all dietary requirements including halal, kosher, vegetarian, and allergen-free options, ensuring every guest enjoys a memorable dining experience.",
        longDescriptionAR: "ارتقِ بفعاليتك مع خدمات التموين الاستثنائية لدينا التي تضم المأكولات العالمية والأطباق المصرية التقليدية والقوائم المخصصة. يتعامل فريق الطهي لدينا مع كل شيء من فترات استراحة القهوة الأنيقة والغداء العملي إلى العشاء الرسمي المفصل والولائم ذات الموضوع المحدد. نحن نلبي جميع المتطلبات الغذائية بما في ذلك الحلال والكوشر والنباتي والخيارات الخالية من المسببات الحساسية، مما يضمن أن يستمتع كل ضيف بتجربة طعام لا تُنسى.",
        featuresEN: [
            "International & local cuisine",
            "Themed gala dinners",
            "Dietary requirement accommodation",
            "Live cooking stations",
            "Beverage & bar services"
        ],
        featuresAR: [
            "مأكولات عالمية ومحلية",
            "عشاء رسمي بموضوع محدد",
            "تلبية المتطلبات الغذائية",
            "محطات طهي حية",
            "خدمات المشروبات والبار"
        ],
        icon: "dining",
        heroImage: "https://kimi-web-img.moonshot.cn/img/cache.marriott.com/1caec8d84bef3d641ca2ca78cc24c3d47e8d9105.jpg"
    }
];

function MiceDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [lang, setLang] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<"overview" | "features" | "other">("overview");

    const serviceId = Number(params.id);
    const service = miceServices.find((s) => s.id === serviceId);
    const otherServices = miceServices.filter((s) => s.id !== serviceId);

    useEffect(() => {
        setMounted(true);
        setLang(getLanguageFromSearchParams(searchParams));
        const handleLanguageChange = (e: CustomEvent<{ lang: Language }>) => setLang(e.detail.lang);
        window.addEventListener("languagechange", handleLanguageChange as EventListener);
        return () => window.removeEventListener("languagechange", handleLanguageChange as EventListener);
    }, [searchParams]);

    if (!mounted) return null;
    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        {lang === "en" ? "Service Not Found" : "الخدمة غير موجودة"}
                    </h1>
                    <Link href="/mice" className="text-blue-600 hover:underline">
                        {lang === "en" ? "Back to MICE Services" : "العودة إلى خدمات مؤتمرات وفعاليات"}
                    </Link>
                </div>
            </div>
        );
    }

    const direction = getDirection(lang);
    const isRTL = lang === "ar";

    return (
        <>
            <main className="min-h-screen bg-white text-gray-800" dir={direction}>
                <Navbar />

                {/* Hero Section */}
                <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                    <img
                        src={service.heroImage}
                        alt={lang === "en" ? service.titleEN : service.titleAR}
                        // fill
                        className="object-cover w-full h-full"
                    // priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-end">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Link
                                    href="/mice"
                                    className={`inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                                >
                                    <ArrowLeft className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
                                    <span className="text-sm font-medium">
                                        {lang === "en" ? "Back to MICE" : "العودة إلى مؤتمرات وفعاليات"}
                                    </span>
                                </Link>
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                    {lang === "en" ? service.titleEN : service.titleAR}
                                </h1>
                                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                                    {lang === "en" ? service.descriptionEN : service.descriptionAR}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                {/* <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex gap-1 overflow-x-auto">
                            {[
                                { id: "overview" as const, labelEN: "Overview", labelAR: "نظرة عامة" },
                                { id: "features" as const, labelEN: "Features", labelAR: "المميزات" },
                                { id: "other" as const, labelEN: "Other Services", labelAR: "خدمات أخرى" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                            ? "border-red-600 text-red-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {lang === "en" ? tab.labelEN : tab.labelAR}
                                </button>
                            ))}
                        </div>
                    </div>
                </div> */}

                {/* Content Sections */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-12"
                            >
                                <div className="lg:col-span-6 space-y-6">
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {lang === "en" ? "About This Service" : "عن هذه الخدمة"}
                                    </h2>
                                    <p className="text-lg text-gray-600 leading-relaxed">
                                        {lang === "en" ? service.longDescriptionEN : service.longDescriptionAR}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                                        <div className="bg-blue-50 rounded-xl p-6 text-center">
                                            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {lang === "en" ? "Flexible Scheduling" : "جدولة مرنة"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {lang === "en" ? "Any date, any time" : "أي تاريخ، أي وقت"}
                                            </p>
                                        </div>
                                        <div className="bg-red-50 rounded-xl p-6 text-center">
                                            <Users className="w-8 h-8 text-red-600 mx-auto mb-3" />
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {lang === "en" ? "Any Group Size" : "أي حجم مجموعة"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {lang === "en" ? "From 10 to 1000+" : "من 10 إلى 1000+"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-100 rounded-xl p-6 text-center">
                                            <MapPin className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                {lang === "en" ? "World-wide" : "جميع أنحاء العالم"}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {lang === "en" ? "Nationwide coverage" : "تغطية على مستوى الجمهورية"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="bg-gray-50 rounded-2xl p-8 h-fit">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    {lang === "en" ? "Quick Facts" : "معلومات سريعة"}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            {lang === "en" ? "Service ID" : "معرف الخدمة"}
                                        </span>
                                        <span className="font-semibold text-gray-900">#{service.id}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            {lang === "en" ? "Category" : "الفئة"}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {lang === "en" ? "MICE" : "مؤتمرات وفعاليات"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            {lang === "en" ? "Experience" : "الخبرة"}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {lang === "en" ? "Since 1985" : "منذ 1985"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            {lang === "en" ? "Support" : "الدعم"}
                                        </span>
                                        <span className="font-semibold text-green-600">
                                            {lang === "en" ? "24/7 Available" : "متاح 24/7"}
                                        </span>
                                    </div>
                                </div>

                                <Link href="/mice">
                                    <button className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                        {lang === "en" ? "Request a Quote" : "اطلب عرض سعر"}
                                    </button>
                                </Link>
                            </div> */}

                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                    {lang === "en" ? "Explore Other Services" : "استكشاف خدمات أخرى"}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {otherServices.map((otherService, index) => (
                                        <motion.div
                                            key={otherService.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <Link href={`/mice/${otherService.id}`}>
                                                <div className="group bg-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={otherService.heroImage}
                                                            alt={lang === "en" ? otherService.titleEN : otherService.titleAR}
                                                            // fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                                        {/* <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        #{otherService.id}
                                                    </div> */}
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                                            {lang === "en" ? otherService.titleEN : otherService.titleAR}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm line-clamp-2">
                                                            {lang === "en" ? otherService.descriptionEN : otherService.descriptionAR}
                                                        </p>
                                                        <div className={`mt-4 flex items-center text-red-600 font-medium text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                                                            <span>{lang === "en" ? "Learn More" : "اقرأ المزيد"}</span>
                                                            <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180 mr-2" : "ml-2"}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}

                    {/* 
                    {activeTab === "features" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                {lang === "en" ? "Key Features" : "المميزات الرئيسية"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(lang === "en" ? service.featuresEN : service.featuresAR).map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-red-200 transition-all"
                                    >
                                        <CheckCircle2 className="w-10 h-10 text-red-600 mb-4" />
                                        <p className="text-lg font-medium text-gray-900">{feature}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "other" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                {lang === "en" ? "Explore Other Services" : "استكشاف خدمات أخرى"}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {otherServices.map((otherService, index) => (
                                    <motion.div
                                        key={otherService.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                    >
                                        <Link href={`/mice/${otherService.id}`}>
                                            <div className="group bg-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={otherService.heroImage}
                                                        alt={lang === "en" ? otherService.titleEN : otherService.titleAR}
                                                        // fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                                                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        #{otherService.id}
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                                        {lang === "en" ? otherService.titleEN : otherService.titleAR}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {lang === "en" ? otherService.descriptionEN : otherService.descriptionAR}
                                                    </p>
                                                    <div className={`mt-4 flex items-center text-red-600 font-medium text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                                                        <span>{lang === "en" ? "Learn More" : "اقرأ المزيد"}</span>
                                                        <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180 mr-2" : "ml-2"}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )} */}
                </div>

                {/* Bottom CTA Section */}
                <div className="bg-gray-900 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {lang === "en" ? "Ready to Plan Your Event?" : "مستعد لتخطيط فعاليتك؟"}
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                {lang === "en"
                                    ? "Contact our MICE specialists today and let us create an unforgettable experience for your team."
                                    : "تواصل مع متخصصي مؤتمرات وفعاليات لدينا اليوم ودعنا نخلق تجربة لا تُنسى لفريقك."}
                            </p>
                            <Link href="/mice" >
                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                                    {lang === "en" ? "Get Started" : "ابدأ الآن"}
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}

export default function MiceDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <MiceDetailContent />
        </Suspense>
    );
}
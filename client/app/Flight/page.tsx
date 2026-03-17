// 'use client'

// import Footer from "@/components/footer";
// import Navbar from "@/components/Navbar";
// import axios from "axios";
// import { useState, useEffect, Suspense } from "react";
// import AirportDropdown from "@/components/SearchableDropdown"
// import apiClient from "@/lib/api";
// import SuccessPopup from "@/components/SuccessPopup";
// import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
// import { useParams, useSearchParams } from 'next/navigation';

// // Loading fallback for Suspense
// function FlightSearchLoading() {
//     return (
//         <div className="flex items-center justify-center min-h-screen">
//             <div className="text-xl text-black">Loading...</div>
//         </div>
//     );
// }

// // Main component wrapper that provides Suspense boundary
// export default function FlightSearchPage() {
//     return (
//         <Suspense fallback={<FlightSearchLoading />}>
//             <FlightSearch />
//         </Suspense>
//     );
// }

// // Inner component that uses useSearchParams
// function FlightSearch() {
//     const [tripType, setTripType] = useState("round");
//     const [userInfoForm, setUserInfoForm] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [showPopup, setShowPopup] = useState(false);

//     const [fromCountries, setFromCountriess] = useState<any[]>([]);
//     const [lang, setLang] = useState<Language>("en");
//     const searchParams = useSearchParams();
//     const [formData, setFormData] = useState({
//         userEmail: "",
//         userName: "",
//         userNumber: "",
//         from: "",
//         to: "",
//         date: "",
//         returnDate: "",
//         tripType: "round",
//         numOfAdults: 1,
//         numOfChildren: 0,
//         cabinClass: "economy",
//         multiCities: [
//             { from: "", to: "", date: "" },
//             { from: "", to: "", date: "" },
//         ],
//     });

//     /* language */
//     useEffect(() => {
//         setLang(getLanguageFromSearchParams(searchParams));
//     }, [searchParams]);

//     useEffect(() => {
//         fetchFromCountries();
//     }, []);

//     const fetchFromCountries = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`https://www.airportroutes.com/api/all-airports/`);
//             setFromCountriess(res.data);
//             console.log("From Countries:", res.data);
//         } catch (err) {
//             console.error("Error fetching from countries:", err);
//         } finally {
//             setLoading(false);
//         }
//     }

//     const handelValidation = () => {
//         if (tripType === "round") {
//             if (!formData.from) {
//                 setError("from is required");
//                 return false;
//             }
//             if (!formData.to) {
//                 setError("to is required");
//                 return false;
//             }
//             if (!formData.date) {
//                 setError("depart date is required");
//                 return false;
//             }
//             if (!formData.returnDate) {
//                 setError("return date is required");
//                 return false;
//             }
//         }
//         if (tripType === "oneway") {
//             if (!formData.from || !formData.to || !formData.date) {
//                 setError("All fields are required");
//                 return false;
//             }
//         }
//         if (tripType === "multi") {
//             if (!formData.multiCities || formData.multiCities.length < 2) {
//                 setError("All fields are required");
//                 return false;
//             }
//         }
//         return true;
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!handelValidation()) return;
//         setLoading(true);
//         console.log(formData);
//         setError("");

//         try {
//             const res = await apiClient.post("/flights", formData);
//             const data = res.data;

//             setShowPopup(true);
//             setFormData({
//                 userEmail: "",
//                 userName: "",
//                 userNumber: "",
//                 from: "",
//                 to: "",
//                 date: "",
//                 returnDate: "",
//                 tripType: "round",
//                 numOfAdults: 1,
//                 numOfChildren: 0,
//                 cabinClass: "economy",
//                 multiCities: [
//                     { from: "", to: "", date: "" },
//                     { from: "", to: "", date: "" },
//                 ],
//             });
//             setTripType("round");
//             setUserInfoForm(false);
//         } catch (err) {
//             console.error(err);
//             if (axios.isAxiosError(err) && err.response) {
//                 setError(err.response.data?.message || "Something went wrong");
//             } else {
//                 setError("Network error. Please try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ================= ROUND TRIP =================
//     const RoundTripForm = () => (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
//             <AirportDropdown
//                 airports={fromCountries}
//                 value={formData.from}
//                 onChange={(iata) =>
//                     setFormData({ ...formData, from: iata })
//                 }
//                 placeholder="From Airport"
//             />
//             <AirportDropdown
//                 airports={fromCountries}
//                 value={formData.to}
//                 onChange={(iata) =>
//                     setFormData({ ...formData, to: iata })
//                 }
//                 placeholder="To Airport"
//             />
//             <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) =>
//                     setFormData({ ...formData, date: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="date"
//                 value={formData.returnDate}
//                 onChange={(e) =>
//                     setFormData({ ...formData, returnDate: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="number"
//                 min="1"
//                 value={formData.numOfAdults}
//                 onChange={(e) =>
//                     setFormData({
//                         ...formData,
//                         numOfAdults: parseInt(e.target.value, 10) || 0,
//                     })
//                 }
//                 placeholder="Adults"
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="number"
//                 min="0"
//                 value={formData.numOfChildren}
//                 onChange={(e) =>
//                     setFormData({
//                         ...formData,
//                         numOfChildren: parseInt(e.target.value, 10) || 0,
//                     })
//                 }
//                 placeholder="Children"
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <select
//                 value={formData.cabinClass}
//                 onChange={(e) =>
//                     setFormData({ ...formData, cabinClass: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 w-full border-2 border-black rounded-2xl"
//             >
//                 <option value="economy">Economy</option>
//                 <option value="business">Business</option>
//                 <option value="first">First</option>
//             </select>
//         </div>
//     );

//     // ================= ONE WAY =================
//     const OneWayForm = () => (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
//             <input
//                 type="text"
//                 placeholder="Leaving From"
//                 value={formData.from}
//                 onChange={(e) =>
//                     setFormData({ ...formData, from: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="text"
//                 placeholder="Going To"
//                 value={formData.to}
//                 onChange={(e) =>
//                     setFormData({ ...formData, to: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) =>
//                     setFormData({ ...formData, date: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="number"
//                 min="1"
//                 value={formData.numOfAdults}
//                 onChange={(e) =>
//                     setFormData({
//                         ...formData,
//                         numOfAdults: parseInt(e.target.value, 10) || 0,
//                     })
//                 }
//                 placeholder="Adults"
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <input
//                 type="number"
//                 min="0"
//                 value={formData.numOfChildren}
//                 onChange={(e) =>
//                     setFormData({
//                         ...formData,
//                         numOfChildren: parseInt(e.target.value, 10) || 0,
//                     })
//                 }
//                 placeholder="Children"
//                 className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//             />
//             <select
//                 value={formData.cabinClass}
//                 onChange={(e) =>
//                     setFormData({ ...formData, cabinClass: e.target.value })
//                 }
//                 className="input bg-white text-black p-2 w-full border-2 border-black rounded-2xl"
//             >
//                 <option value="economy">Economy</option>
//                 <option value="business">Business</option>
//                 <option value="first">First</option>
//             </select>
//         </div>
//     );

//     // ================= MULTI CITY =================
//     const MultiCityForm = () => {
//         const updateCity = (index: number, field: 'from' | 'to' | 'date', value: string) => {
//             const updated = [...formData.multiCities];
//             updated[index] = { ...updated[index], [field]: value };
//             setFormData({ ...formData, multiCities: updated });
//         };

//         const addCity = () => {
//             if (formData.multiCities.length < 5) {
//                 setFormData({
//                     ...formData,
//                     multiCities: [
//                         ...formData.multiCities,
//                         { from: "", to: "", date: "" }
//                     ]
//                 });
//             }
//         };
        
//         const deleteCity = () => {
//             if (formData.multiCities.length > 2) {
//                 setFormData({
//                     ...formData,
//                     multiCities: formData.multiCities.slice(0, -1)
//                 });
//             }
//         };

//         return (
//             <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
//                 {formData.multiCities.map((city, index) => (
//                     <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <input
//                             type="text"
//                             placeholder="From"
//                             value={city.from}
//                             onChange={(e) =>
//                                 updateCity(index, "from", e.target.value)
//                             }
//                             className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//                         />
//                         <input
//                             type="text"
//                             placeholder="To"
//                             value={city.to}
//                             onChange={(e) =>
//                                 updateCity(index, "to", e.target.value)
//                             }
//                             className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//                         />
//                         <input
//                             type="date"
//                             value={city.date}
//                             onChange={(e) =>
//                                 updateCity(index, "date", e.target.value)
//                             }
//                             className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//                         />
//                     </div>
//                 ))}

//                 <div className="flex flex-row">
//                     {formData.multiCities.length < 5 && (
//                         <button
//                             type="button"
//                             onClick={addCity}
//                             className="text-blue-600 font-semibold bg-white m-5 p-2"
//                         >
//                             + Add Another Flight
//                         </button>
//                     )}
//                     {formData.multiCities.length > 2 && (
//                         <button
//                             type="button"
//                             onClick={deleteCity}
//                             className="font-semibold bg-white text-red-600 p-2"
//                         >
//                             - Delete Flight
//                         </button>
//                     )}
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <input
//                         type="number"
//                         min="1"
//                         value={formData.numOfAdults}
//                         onChange={(e) =>
//                             setFormData({
//                                 ...formData,
//                                 numOfAdults: parseInt(e.target.value, 10) || 0,
//                             })
//                         }
//                         placeholder="Adults"
//                         className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//                     />
//                     <input
//                         type="number"
//                         min="0"
//                         value={formData.numOfChildren}
//                         onChange={(e) =>
//                             setFormData({
//                                 ...formData,
//                                 numOfChildren: parseInt(e.target.value, 10) || 0,
//                             })
//                         }
//                         placeholder="Children"
//                         className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
//                     />
//                     <select
//                         value={formData.cabinClass}
//                         onChange={(e) =>
//                             setFormData({ ...formData, cabinClass: e.target.value })
//                         }
//                         className="input bg-white text-black p-2 w-full border-2 border-black rounded-2xl"
//                     >
//                         <option value="economy">Economy</option>
//                         <option value="business">Business</option>
//                         <option value="first">First</option>
//                     </select>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div>
//             <Navbar />
//             <SuccessPopup
//                 isOpen={showPopup}
//                 onClose={() => setShowPopup(false)}
//                 title={lang === "en" ? "Booking Successful!" : "تم الحجز بنجاح!"}
//                 message={
//                     lang === "en"
//                         ? "Our team will contact you shortly."
//                         : "سيتواصل معك فريقنا قريبًا."
//                 }
//             />
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="bg-white p-8 rounded-2xl shadow-xl mx-12 max-w-6xl w-full">
//                     <h1 className="text-2xl text-black m-2">
//                         Flight Services
//                     </h1>
//                     <p className="text-black m-2">
//                         Travel at ease, let our professional team arrange your convenient and shortest route to your destination
//                     </p>
//                     <div className="line bg-black w-full border-b-2 border-black"></div>

//                     <div className="flex gap-4 my-6">
//                         <button onClick={() => { setTripType("round"); setFormData({ ...formData, tripType: "round" }) }}
//                             className={tripType === "round" ? "btn-active text-blue-700 border-b-2 border-blue-700" : "btn text-black border-b-2 border-black"}>
//                             Round Trip
//                         </button>

//                         <button onClick={() => { setTripType("oneway"); setFormData({ ...formData, tripType: "oneway" }) }}
//                             className={tripType === "oneway" ? "btn-active text-blue-700 border-b-2 border-blue-700" : "btn text-black border-b-2 border-black"}>
//                             One Way
//                         </button>

//                         <button onClick={() => { setTripType("multi"); setFormData({ ...formData, tripType: "multi" }) }}
//                             className={tripType === "multi" ? "btn-active text-blue-700 border-b-2 border-blue-700" : "btn text-black border-b-2 border-black"}>
//                             Multi City
//                         </button>
//                     </div>

//                     {error && <p className="text-red-500">{error}</p>}

//                     <form className="" onSubmit={handleSubmit}>
//                         {tripType === "round" && <RoundTripForm />}
//                         {tripType === "oneway" && <OneWayForm />}
//                         {tripType === "multi" && <MultiCityForm />}

//                         {userInfoForm && (
//                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//                                 <input type="text" placeholder="Name"
//                                     onChange={(e) => setFormData({ ...formData, userName: e.target.value })} className="input bg-white text-black p-2 border-2 border-black rounded-2xl" />
//                                 <input type="text" placeholder="Email"
//                                     onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })} className="input bg-white text-black p-2 border-2 border-black rounded-2xl" />
//                                 <input type="text" placeholder="Phone"
//                                     onChange={(e) => setFormData({ ...formData, userNumber: e.target.value })} className="input bg-white text-black p-2 border-2 border-black rounded-2xl" />
//                             </div>
//                         )}

//                         {!userInfoForm ? <div
//                             onClick={() => setUserInfoForm(true)}
//                             className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl text-center cursor-pointer">
//                             Next
//                         </div> : <button
//                             type="submit"
//                             className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl">
//                             Submit
//                         </button>}
//                     </form>
//                 </div>
//             </div>

//             <div className="w-full">
//                 <Footer />
//             </div>
//         </div>
//     );
// }

'use client'

import Footer from "@/components/footer";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useState, useEffect, Suspense } from "react";
import AirportDropdown from "@/components/SearchableDropdown"
import apiClient from "@/lib/api";
import SuccessPopup from "@/components/SuccessPopup";
import { Language, getDirection, getLanguageFromSearchParams } from "@/lib/language";
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Plane, 
  Calendar, 
  Users, 
  ArrowRightLeft, 
  ArrowRight, 
  MapPin, 
  Sparkles,
  Loader2,
  Plus,
  Trash2,
  Armchair,
  Mail,
  User,
  Phone,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Loading fallback for Suspense
function FlightSearchLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative"
            >
                <Plane className="w-16 h-16 text-cyan-400" />
                <div className="absolute inset-0 blur-xl bg-cyan-400/50 rounded-full" />
            </motion.div>
        </div>
    );
}

// Main component wrapper that provides Suspense boundary
export default function FlightSearchPage() {
    return (
        <Suspense fallback={<FlightSearchLoading />}>
            <FlightSearch />
        </Suspense>
    );
}

// Inner component that uses useSearchParams
function FlightSearch() {
    const [tripType, setTripType] = useState("round");
    const [userInfoForm, setUserInfoForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const [fromCountries, setFromCountriess] = useState<any[]>([]);
    const [lang, setLang] = useState<Language>("en");
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        userEmail: "",
        userName: "",
        userNumber: "",
        from: "",
        to: "",
        date: "",
        returnDate: "",
        tripType: "round",
        numOfAdults: 1,
        numOfChildren: 0,
        cabinClass: "economy",
        multiCities: [
            { from: "", to: "", date: "" },
            { from: "", to: "", date: "" },
        ],
    });

    /* language */
    useEffect(() => {
        setLang(getLanguageFromSearchParams(searchParams));
    }, [searchParams]);

    useEffect(() => {
        fetchFromCountries();
    }, []);

    const fetchFromCountries = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`https://www.airportroutes.com/api/all-airports/`);
            setFromCountriess(res.data);
            console.log("From Countries:", res.data);
        } catch (err) {
            console.error("Error fetching from countries:", err);
        } finally {
            setLoading(false);
        }
    }

    const handelValidation = () => {
        if (tripType === "round") {
            if (!formData.from) {
                setError("From airport is required");
                return false;
            }
            if (!formData.to) {
                setError("To airport is required");
                return false;
            }
            if (!formData.date) {
                setError("Departure date is required");
                return false;
            }
            if (!formData.returnDate) {
                setError("Return date is required");
                return false;
            }
        }
        if (tripType === "oneway") {
            if (!formData.from || !formData.to || !formData.date) {
                setError("All fields are required");
                return false;
            }
        }
        if (tripType === "multi") {
            if (!formData.multiCities || formData.multiCities.length < 2) {
                setError("All fields are required");
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!handelValidation()) return;
        setLoading(true);
        console.log(formData);
        setError("");

        try {
            const res = await apiClient.post("/flights", formData);
            const data = res.data;

            setShowPopup(true);
            setFormData({
                userEmail: "",
                userName: "",
                userNumber: "",
                from: "",
                to: "",
                date: "",
                returnDate: "",
                tripType: "round",
                numOfAdults: 1,
                numOfChildren: 0,
                cabinClass: "economy",
                multiCities: [
                    { from: "", to: "", date: "" },
                    { from: "", to: "", date: "" },
                ],
            });
            setTripType("round");
            setUserInfoForm(false);
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err) && err.response) {
                setError(err.response.data?.message || "Something went wrong");
            } else {
                setError("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const tripTypes = [
        { id: "round", label: "Round Trip", icon: ArrowRightLeft },
        { id: "oneway", label: "One Way", icon: ArrowRight },
        { id: "multi", label: "Multi City", icon: Globe },
    ];

    const cabinClasses = [
        { value: "economy", label: "Economy", color: "from-emerald-400 to-teal-500" },
        { value: "business", label: "Business", color: "from-violet-400 to-purple-500" },
        { value: "first", label: "First Class", color: "from-amber-400 to-orange-500" },
    ];

    // ================= ROUND TRIP =================
    const RoundTripForm = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
            <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                <AirportDropdown
                    airports={fromCountries}
                    value={formData.from}
                    onChange={(iata) => setFormData({ ...formData, from: iata })}
                    placeholder="From Airport"
                />
            </div>
            
            <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors" />
                <AirportDropdown
                    airports={fromCountries}
                    value={formData.to}
                    onChange={(iata) => setFormData({ ...formData, to: iata })}
                    placeholder="To Airport"
                />
            </div>

            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors z-10" />
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors z-10" />
                <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors z-10" />
                <input
                    type="number"
                    min="1"
                    value={formData.numOfAdults}
                    onChange={(e) => setFormData({ ...formData, numOfAdults: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Adults"
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors z-10" />
                <input
                    type="number"
                    min="0"
                    value={formData.numOfChildren}
                    onChange={(e) => setFormData({ ...formData, numOfChildren: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Children"
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="lg:col-span-2 relative group">
                <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-300 transition-colors z-10" />
                <select
                    value={formData.cabinClass}
                    onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
                >
                    {cabinClasses.map((cabin) => (
                        <option key={cabin.value} value={cabin.value} className="bg-slate-800">
                            {cabin.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${cabinClasses.find(c => c.value === formData.cabinClass)?.color}`} />
                </div>
            </div>
        </motion.div>
    );

    // ================= ONE WAY =================
    const OneWayForm = () => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                <input
                    type="text"
                    placeholder="Leaving From"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors" />
                <input
                    type="text"
                    placeholder="Going To"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors z-10" />
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 group-focus-within:text-cyan-300 transition-colors z-10" />
                <input
                    type="number"
                    min="1"
                    value={formData.numOfAdults}
                    onChange={(e) => setFormData({ ...formData, numOfAdults: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Adults"
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors z-10" />
                <input
                    type="number"
                    min="0"
                    value={formData.numOfChildren}
                    onChange={(e) => setFormData({ ...formData, numOfChildren: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Children"
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                />
            </div>

            <div className="relative group">
                <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-300 transition-colors z-10" />
                <select
                    value={formData.cabinClass}
                    onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
                >
                    {cabinClasses.map((cabin) => (
                        <option key={cabin.value} value={cabin.value} className="bg-slate-800">
                            {cabin.label}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );

    // ================= MULTI CITY =================
    const MultiCityForm = () => {
        const updateCity = (index: number, field: 'from' | 'to' | 'date', value: string) => {
            const updated = [...formData.multiCities];
            updated[index] = { ...updated[index], [field]: value };
            setFormData({ ...formData, multiCities: updated });
        };

        const addCity = () => {
            if (formData.multiCities.length < 5) {
                setFormData({
                    ...formData,
                    multiCities: [...formData.multiCities, { from: "", to: "", date: "" }]
                });
            }
        };
        
        const deleteCity = () => {
            if (formData.multiCities.length > 2) {
                setFormData({
                    ...formData,
                    multiCities: formData.multiCities.slice(0, -1)
                });
            }
        };

        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
            >
                <AnimatePresence>
                    {formData.multiCities.map((city, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-pink-400" />
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl" />
                            
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                <input
                                    type="text"
                                    placeholder="From"
                                    value={city.from}
                                    onChange={(e) => updateCity(index, "from", e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-600 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                                />
                            </div>
                            
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                                <input
                                    type="text"
                                    placeholder="To"
                                    value={city.to}
                                    onChange={(e) => updateCity(index, "to", e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-600 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                                />
                            </div>
                            
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 z-10" />
                                <input
                                    type="date"
                                    value={city.date}
                                    onChange={(e) => updateCity(index, "date", e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-600 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder-slate-400"
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="flex flex-wrap gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={addCity}
                        disabled={formData.multiCities.length >= 5}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Flight
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={deleteCity}
                        disabled={formData.multiCities.length <= 2}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-red-400 border border-red-400/30 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-400/10 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Remove
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                    <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 z-10" />
                        <input
                            type="number"
                            min="1"
                            value={formData.numOfAdults}
                            onChange={(e) => setFormData({ ...formData, numOfAdults: parseInt(e.target.value, 10) || 0 })}
                            placeholder="Adults"
                            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                        />
                    </div>

                    <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 z-10" />
                        <input
                            type="number"
                            min="0"
                            value={formData.numOfChildren}
                            onChange={(e) => setFormData({ ...formData, numOfChildren: parseInt(e.target.value, 10) || 0 })}
                            placeholder="Children"
                            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                        />
                    </div>

                    <div className="relative group">
                        <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 z-10" />
                        <select
                            value={formData.cabinClass}
                            onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
                        >
                            {cabinClasses.map((cabin) => (
                                <option key={cabin.value} value={cabin.value} className="bg-slate-800">
                                    {cabin.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[200px]" />
            </div>

            <Navbar />
            
            <SuccessPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                title={lang === "en" ? "Booking Successful!" : "تم الحجز بنجاح!"}
                message={lang === "en" ? "Our team will contact you shortly." : "سيتواصل معك فريقنا قريبًا."}
            />

            <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-6xl"
                >
                    {/* Header Card */}
                    <div className="relative mb-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-4"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Premium Travel Experience</span>
                        </motion.div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-pink-200 bg-clip-text text-transparent mb-4">
                            Flight Services
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Travel at ease, let our professional team arrange your convenient and shortest route to your destination
                        </p>
                    </div>

                    {/* Main Form Card */}
                    <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden">
                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/20 to-transparent rounded-full blur-3xl" />
                        
                        {/* Trip Type Tabs */}
                        <div className="relative flex flex-wrap gap-2 mb-8 p-1 bg-slate-800/50 rounded-2xl">
                            {tripTypes.map((type) => {
                                const Icon = type.icon;
                                const isActive = tripType === type.id;
                                return (
                                    <motion.button
                                        key={type.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { setTripType(type.id); setFormData({ ...formData, tripType: type.id }) }}
                                        className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                                            isActive 
                                                ? 'text-white' 
                                                : 'text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            {type.label}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {tripType === "round" && <RoundTripForm key="round" />}
                                {tripType === "oneway" && <OneWayForm key="oneway" />}
                                {tripType === "multi" && <MultiCityForm key="multi" />}
                            </AnimatePresence>

                            {/* User Info Section */}
                            <AnimatePresence>
                                {userInfoForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pt-6 border-t border-slate-700/50 overflow-hidden"
                                    >
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <User className="w-5 h-5 text-cyan-400" />
                                            Passenger Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Full Name"
                                                    value={formData.userName}
                                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400"
                                                />
                                            </div>
                                            
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                                                <input 
                                                    type="email" 
                                                    placeholder="Email Address"
                                                    value={formData.userEmail}
                                                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all placeholder-slate-400"
                                                />
                                            </div>
                                            
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
                                                <input 
                                                    type="tel" 
                                                    placeholder="Phone Number"
                                                    value={formData.userNumber}
                                                    onChange={(e) => setFormData({ ...formData, userNumber: e.target.value })}
                                                    className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all placeholder-slate-400"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="pt-6">
                                {!userInfoForm ? (
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setUserInfoForm(true)}
                                        className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Continue to Passenger Details
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.button>
                                ) : (
                                    <div className="flex gap-4">
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setUserInfoForm(false)}
                                            className="flex-1 py-4 rounded-2xl font-semibold text-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all"
                                        >
                                            Back
                                        </motion.button>
                                        
                                        <motion.button
                                            type="submit"
                                            disabled={loading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-[2] group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-70"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plane className="w-5 h-5" />
                                                        Confirm Booking
                                                    </>
                                                )}
                                            </span>
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 flex flex-wrap justify-center gap-8 text-slate-500 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Secure Booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pink-400" />
                            <span>Best Price Guarantee</span>
                        </div>
                    </div>
                </motion.div>
            </main>

            <div className="relative z-10 w-full">
                <Footer />
            </div>
        </div>
    );
}
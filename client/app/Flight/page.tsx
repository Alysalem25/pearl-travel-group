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
// FlightSearch.tsx - Updated with formal white/red design
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
    Phone, Baby,
    Globe
} from 'lucide-react';

// Loading fallback for Suspense
function FlightSearchLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Plane className="w-16 h-16 text-red-600" />
                <div className="text-xl text-gray-600 font-medium">Loading...</div>
            </div>
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
        { value: "economy", label: "Economy", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        { value: "business", label: "Business", color: "bg-purple-50 text-purple-700 border-purple-200" },
        { value: "first", label: "First Class", color: "bg-amber-50 text-amber-700 border-amber-200" },
    ];

    // ================= ROUND TRIP =================
    const RoundTripForm = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                <AirportDropdown
                    airports={fromCountries}
                    value={formData.from}
                    onChange={(iata) => setFormData({ ...formData, from: iata })}
                    placeholder="From Airport"
                />
            </div>

            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                <AirportDropdown
                    airports={fromCountries}
                    value={formData.to}
                    onChange={(iata) => setFormData({ ...formData, to: iata })}
                    placeholder="To Airport"
                />
            </div>

            <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Going
                </span>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                />
            </div>

            <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Return
                </span>
                <label>
                    <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                        placeholder="to date"
                        className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24  pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                    />
                </label>
            </div>

            <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Adults
                </span>
                <input
                    type="number"
                    min="1"
                    value={formData.numOfAdults}
                    onChange={(e) => setFormData({ ...formData, numOfAdults: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Adults"
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                />
            </div>

            <div className="relative">
                <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Children
                </span>
                <input
                    type="number"
                    min="0"
                    value={formData.numOfChildren}
                    onChange={(e) => setFormData({ ...formData, numOfChildren: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Children"
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-26 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                />
            </div>

            <div className="lg:col-span-2 relative">
                <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <select
                    value={formData.cabinClass}
                    onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                >
                    {cabinClasses.map((cabin) => (
                        <option key={cabin.value} value={cabin.value} className="bg-white">
                            {cabin.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    // ================= ONE WAY =================
    const OneWayForm = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                <AirportDropdown
                    airports={fromCountries}
                    value={formData.from}
                    onChange={(iata) => setFormData({ ...formData, from: iata })}
                    placeholder="From Airport"
                />
            </div>

            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                <AirportDropdown
                    airports={fromCountries}
                    value={formData.to}
                    onChange={(iata) => setFormData({ ...formData, to: iata })}
                    placeholder="To Airport"
                />
            </div>

            <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Going
                </span>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                />
            </div>

            <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Adults
                </span>
                <input
                    type="number"
                    min="1"
                    value={formData.numOfAdults}
                    onChange={(e) => setFormData({ ...formData, numOfAdults: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Adults"
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                />
            </div>

            <div className="relative">
                <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <span className="absolute left-10 top-1/2 -translate-y-1/2">
                    Children
                </span>
                <input
                    type="number"
                    min="0"
                    value={formData.numOfChildren}
                    onChange={(e) => setFormData({ ...formData, numOfChildren: parseInt(e.target.value, 10) || 0 })}
                    placeholder="Children"
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-26 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                />
            </div>

            <div className="relative">
                <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                <select
                    value={formData.cabinClass}
                    onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                    className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                >
                    {cabinClasses.map((cabin) => (
                        <option key={cabin.value} value={cabin.value} className="bg-white">
                            {cabin.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
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
            <div className="space-y-4">
                {formData.multiCities.map((city, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border-2 border-gray-100 rounded-xl relative"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />

                        {/* From Airport - FIXED: use city.from instead of formData.from */}
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10 pointer-events-none" />
                            <AirportDropdown
                                airports={fromCountries}
                                value={city.from}
                                onChange={(iata) => updateCity(index, "from", iata)}
                                placeholder="From Airport"
                            />
                        </div>

                        {/* To Airport - FIXED: use city.to instead of formData.to */}
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10 pointer-events-none" />
                            <AirportDropdown
                                airports={fromCountries}
                                value={city.to}
                                onChange={(iata) => updateCity(index, "to", iata)}
                                placeholder="To Airport"
                            />
                        </div>

                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                            <input
                                type="date"
                                value={city.date}
                                onChange={(e) => updateCity(index, "date", e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-800 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                            />
                        </div>
                    </div>
                ))}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={addCity}
                        disabled={formData.multiCities.length >= 5}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        <Plus className="w-4 h-4" />
                        Add Flight
                    </button>

                    <button
                        type="button"
                        onClick={deleteCity}
                        disabled={formData.multiCities.length <= 2}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Remove
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-gray-100">
                    <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2">
                            Adults
                        </span>
                        <input
                            type="number"
                            min="1"
                            value={formData.numOfAdults}
                            onChange={(e) => setFormData({ ...formData, numOfAdults: parseInt(e.target.value, 10) || 0 })}
                            placeholder="Adults"
                            className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-24 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="relative">
                        <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2">
                            Children
                        </span>
                        <input
                            type="number"
                            min="0"
                            value={formData.numOfChildren}
                            onChange={(e) => setFormData({ ...formData, numOfChildren: parseInt(e.target.value, 10) || 0 })}
                            placeholder="Children"
                            className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-26 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                        />
                    </div>

                    <div className="relative">
                        <Armchair className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 z-10" />
                        <select
                            value={formData.cabinClass}
                            onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value })}
                            className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer"
                        >
                            {cabinClasses.map((cabin) => (
                                <option key={cabin.value} value={cabin.value} className="bg-white">
                                    {cabin.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Navbar />

            <SuccessPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                title={lang === "en" ? "Booking Successful!" : "تم الحجز بنجاح!"}
                message={lang === "en" ? "Our team will contact you shortly." : "سيتواصل معك فريقنا قريبًا."}
            />

            <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
                <div className="w-full max-w-6xl">
                    {/* Header Card */}
                    <div className="relative mb-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium mb-4">
                            <Sparkles className="w-4 h-4" />
                            <span>Premium Travel Experience</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
                            Flight Services
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                            Travel at ease, let our professional team arrange your convenient and shortest route to your destination
                        </p>
                    </div>

                    {/* Main Form Card */}
                    <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-xl shadow-gray-200 overflow-hidden">

                        {/* Trip Type Tabs */}
                        <div className="relative flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-2xl">
                            {tripTypes.map((type) => {
                                const Icon = type.icon;
                                const isActive = tripType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => { setTripType(type.id); setFormData({ ...formData, tripType: type.id }) }}
                                        className={`relative flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-200 ${isActive
                                            ? 'bg-red-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            {type.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-center">
                                {error}
                            </div>
                        )}

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {tripType === "round" && <RoundTripForm key="round" />}
                            {tripType === "oneway" && <OneWayForm key="oneway" />}
                            {tripType === "multi" && <MultiCityForm key="multi" />}

                            {/* User Info Section */}
                            {userInfoForm && (
                                <div className="pt-6 border-t-2 border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-red-600" />
                                        Passenger Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={formData.userName}
                                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                                className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                            <input
                                                type="email"
                                                placeholder="Email Address"
                                                value={formData.userEmail}
                                                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                                                className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={formData.userNumber}
                                                onChange={(e) => setFormData({ ...formData, userNumber: e.target.value })}
                                                className="w-full bg-white border-2 border-gray-200 text-gray-800 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-6">
                                {!userInfoForm ? (
                                    <button
                                        type="button"
                                        onClick={() => setUserInfoForm(true)}
                                        className="w-full bg-red-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Continue to Passenger Details
                                            <ArrowRight className="w-5 h-5" />
                                        </span>
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setUserInfoForm(false)}
                                            className="flex-1 py-4 rounded-xl font-semibold text-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                                        >
                                            Back
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
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plane className="w-5 h-5" />
                                                        Confirm Booking
                                                    </>
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Secure Booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Best Price Guarantee</span>
                        </div>
                    </div>
                </div>
            </main>

            <div className="relative z-10 w-full">
                <Footer />
            </div>
        </div>
    );
}
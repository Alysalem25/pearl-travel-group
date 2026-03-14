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

// Loading fallback for Suspense
function FlightSearchLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-black">Loading...</div>
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
                setError("from is required");
                return false;
            }
            if (!formData.to) {
                setError("to is required");
                return false;
            }
            if (!formData.date) {
                setError("depart date is required");
                return false;
            }
            if (!formData.returnDate) {
                setError("return date is required");
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

    // ================= ROUND TRIP =================
    const RoundTripForm = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <AirportDropdown
                airports={fromCountries}
                value={formData.from}
                onChange={(iata) =>
                    setFormData({ ...formData, from: iata })
                }
                placeholder="From Airport"
            />
            <AirportDropdown
                airports={fromCountries}
                value={formData.to}
                onChange={(iata) =>
                    setFormData({ ...formData, to: iata })
                }
                placeholder="To Airport"
            />
            <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                }
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="date"
                value={formData.returnDate}
                onChange={(e) =>
                    setFormData({ ...formData, returnDate: e.target.value })
                }
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="number"
                min="1"
                value={formData.numOfAdults}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        numOfAdults: parseInt(e.target.value, 10) || 0,
                    })
                }
                placeholder="Adults"
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="number"
                min="0"
                value={formData.numOfChildren}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        numOfChildren: parseInt(e.target.value, 10) || 0,
                    })
                }
                placeholder="Children"
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <select
                value={formData.cabinClass}
                onChange={(e) =>
                    setFormData({ ...formData, cabinClass: e.target.value })
                }
                className="input bg-white text-black p-2 w-full border-2 border-black rounded-2xl"
            >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
            </select>
        </div>
    );

    // ================= ONE WAY =================
    const OneWayForm = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <input
                type="text"
                placeholder="Leaving From"
                value={formData.from}
                onChange={(e) =>
                    setFormData({ ...formData, from: e.target.value })
                }
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="text"
                placeholder="Going To"
                value={formData.to}
                onChange={(e) =>
                    setFormData({ ...formData, to: e.target.value })
                }
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                }
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="number"
                min="1"
                value={formData.numOfAdults}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        numOfAdults: parseInt(e.target.value, 10) || 0,
                    })
                }
                placeholder="Adults"
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <input
                type="number"
                min="0"
                value={formData.numOfChildren}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        numOfChildren: parseInt(e.target.value, 10) || 0,
                    })
                }
                placeholder="Children"
                className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
            />
            <select
                value={formData.cabinClass}
                onChange={(e) =>
                    setFormData({ ...formData, cabinClass: e.target.value })
                }
                className="input bg-white text-black p-2 w-full border-2 border-black rounded-2xl"
            >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
            </select>
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
                    multiCities: [
                        ...formData.multiCities,
                        { from: "", to: "", date: "" }
                    ]
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
                {formData.multiCities.map((city, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="From"
                            value={city.from}
                            onChange={(e) =>
                                updateCity(index, "from", e.target.value)
                            }
                            className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
                        />
                        <input
                            type="text"
                            placeholder="To"
                            value={city.to}
                            onChange={(e) =>
                                updateCity(index, "to", e.target.value)
                            }
                            className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
                        />
                        <input
                            type="date"
                            value={city.date}
                            onChange={(e) =>
                                updateCity(index, "date", e.target.value)
                            }
                            className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
                        />
                    </div>
                ))}

                <div className="flex flex-row">
                    {formData.multiCities.length < 5 && (
                        <button
                            type="button"
                            onClick={addCity}
                            className="text-blue-600 font-semibold bg-white m-5 p-2"
                        >
                            + Add Another Flight
                        </button>
                    )}
                    {formData.multiCities.length > 2 && (
                        <button
                            type="button"
                            onClick={deleteCity}
                            className="font-semibold bg-white text-red-600 p-2"
                        >
                            - Delete Flight
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="number"
                        min="1"
                        value={formData.numOfAdults}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                numOfAdults: parseInt(e.target.value, 10) || 0,
                            })
                        }
                        placeholder="Adults"
                        className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
                    />
                    <input
                        type="number"
                        min="0"
                        value={formData.numOfChildren}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                numOfChildren: parseInt(e.target.value, 10) || 0,
                            })
                        }
                        placeholder="Children"
                        className="input bg-white text-black p-2 border-2 border-black rounded-2xl"
                    />
                    <select
                        value={formData.cabinClass}
                        onChange={(e) =>
                            setFormData({ ...formData, cabinClass: e.target.value })
                        }
                        className="input bg-white text-black p-2 w-full border-2 border-black rounded-2xl"
                    >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Navbar />
            <SuccessPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                title={lang === "en" ? "Booking Successful!" : "تم الحجز بنجاح!"}
                message={
                    lang === "en"
                        ? "Our team will contact you shortly."
                        : "سيتواصل معك فريقنا قريبًا."
                }
            />
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-2xl shadow-xl mx-12 max-w-6xl w-full">
                    <h1 className="text-2xl text-black m-2">
                        Flight Services
                    </h1>
                    <p className="text-black m-2">
                        Travel at ease, let our professional team arrange your convenient and shortest route to your destination
                    </p>
                    <div className="line bg-black w-full border-b-2 border-black"></div>

                    <div className="flex gap-4 my-6">
                        <button onClick={() => { setTripType("round"); setFormData({ ...formData, tripType: "round" }) }}
                            className={tripType === "round" ? "btn-active text-blue-700 border-b-2 border-blue-700" : "btn text-black border-b-2 border-black"}>
                            Round Trip
                        </button>

                        <button onClick={() => { setTripType("oneway"); setFormData({ ...formData, tripType: "oneway" }) }}
                            className={tripType === "oneway" ? "btn-active text-blue-700 border-b-2 border-blue-700" : "btn text-black border-b-2 border-black"}>
                            One Way
                        </button>

                        <button onClick={() => { setTripType("multi"); setFormData({ ...formData, tripType: "multi" }) }}
                            className={tripType === "multi" ? "btn-active text-blue-700 border-b-2 border-blue-700" : "btn text-black border-b-2 border-black"}>
                            Multi City
                        </button>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <form className="" onSubmit={handleSubmit}>
                        {tripType === "round" && <RoundTripForm />}
                        {tripType === "oneway" && <OneWayForm />}
                        {tripType === "multi" && <MultiCityForm />}

                        {userInfoForm && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                <input type="text" placeholder="Name"
                                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })} className="input bg-white text-black p-2 border-2 border-black rounded-2xl" />
                                <input type="text" placeholder="Email"
                                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })} className="input bg-white text-black p-2 border-2 border-black rounded-2xl" />
                                <input type="text" placeholder="Phone"
                                    onChange={(e) => setFormData({ ...formData, userNumber: e.target.value })} className="input bg-white text-black p-2 border-2 border-black rounded-2xl" />
                            </div>
                        )}

                        {!userInfoForm ? <div
                            onClick={() => setUserInfoForm(true)}
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl text-center cursor-pointer">
                            Next
                        </div> : <button
                            type="submit"
                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl">
                            Submit
                        </button>}
                    </form>
                </div>
            </div>

            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}
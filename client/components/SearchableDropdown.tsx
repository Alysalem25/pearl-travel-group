// "use client";
// import { useState, useEffect, useRef } from "react";

// type Airport = {
//   icao: string;
//   iata: string;
//   name: string;
//   city: string;
//   country: string;
// };

// export default function AirportDropdown({
//   airports,
//   value,
//   onChange,
//   placeholder = "Select airport"
// }: {
//   airports: Airport[];
//   value: string;
//   onChange: (iata: string) => void;
//   placeholder?: string;
// }) {
//   const [open, setOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [highlight, setHighlight] = useState<number>(-1);
//   const ref = useRef<HTMLDivElement>(null);

//   const selectedAirport = airports.find(a => a.iata === value);

//   const filtered = airports.filter(a =>
//     `${a.name} ${a.city} ${a.iata}`
//       .toLowerCase()
//       .includes(query.toLowerCase())
//   );

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (!ref.current?.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   function selectAirport(airport: Airport) {
//     onChange(airport.iata);
//     setQuery("");
//     setOpen(false);
//     setHighlight(-1);
//   }

//   function clearSelection(e: React.MouseEvent) {
//     e.stopPropagation();
//     onChange("");
//     setQuery("");
//     setHighlight(-1);
//   }

//   function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (!open) setOpen(true);

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlight(prev =>
//         prev < filtered.length - 1 ? prev + 1 : 0
//       );
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlight(prev =>
//         prev > 0 ? prev - 1 : filtered.length - 1
//       );
//     }

//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (highlight >= 0) {
//         selectAirport(filtered[highlight]);
//       }
//     }

//     if (e.key === "Escape") {
//       setOpen(false);
//     }
//   }

//   return (
//     <div ref={ref} className="relative w-full">
//       <div
//         className="relative flex items-center"
//         onClick={() => setOpen(true)}
//       >
//         <input
//           type="text"
//           value={
//             query ||
//             (selectedAirport
//               ? `${selectedAirport.name} (${selectedAirport.iata})`
//               : "")
//           }
//           onChange={e => {
//             setQuery(e.target.value);
//             setOpen(true);
//           }}
//           onFocus={() => setOpen(true)}
//           onKeyDown={handleKey}
//           placeholder={placeholder}
//           className="w-full p-2 pr-10 border-2 border-black rounded-xl bg-white text-black"
//         />

//         {/* X Button */}
//         {value && (
//           <button
//             type="button"
//             onClick={clearSelection}
//             className="absolute right-3 text-gray-500 hover:text-black text-lg"
//           >
//             ✕
//           </button>
//         )}
//       </div>

//       {open && (
//         <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-xl shadow-lg z-50">

//           {/* Scroll Wrapper */}
//           <div
//             style={{ maxHeight: "200px", overflowY: "auto" }}
//             className="w-full"
//           >
//             {filtered.length === 0 ? (
//               <div className="p-3 text-sm text-gray-500">
//                 No airports found
//               </div>
//             ) : (
//               filtered.map((airport, index) => (
//                 <div
//                   key={airport.iata}
//                   onMouseEnter={() => setHighlight(index)}
//                   onClick={() => selectAirport(airport)}
//                   className={`p-3 cursor-pointer ${highlight === index
//                       ? "bg-blue-100"
//                       : "hover:bg-gray-100"
//                     }`}
//                 >
//                   <div className="font-semibold text-black">
//                     {airport.name} ({airport.iata})
//                   </div>
//                   <div className="text-sm text-gray-600">
//                     {airport.city}, {airport.country}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// ===============================================================================
// AirportDropdown.tsx - Updated with formal white/red design
"use client";
import { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";

type Airport = {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
};

export default function AirportDropdown({
  airports,
  value,
  onChange,
  placeholder = "Select airport"
}: {
  airports: Airport[];
  value: string;
  onChange: (iata: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const selectedAirport = airports.find(a => a.iata === value);

  const filtered = airports.filter(a =>
    `${a.name} ${a.city} ${a.iata}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function selectAirport(airport: Airport) {
    onChange(airport.iata);
    setQuery("");
    setOpen(false);
    setHighlight(-1);
  }

  function clearSelection(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setHighlight(-1);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) setOpen(true);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight(prev => prev < filtered.length - 1 ? prev + 1 : 0);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight(prev => prev > 0 ? prev - 1 : filtered.length - 1);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlight >= 0) {
        selectAirport(filtered[highlight]);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="relative flex items-center group"
        onClick={() => setOpen(true)}
      >
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
        <input
          type="text"
          value={
            query ||
            (selectedAirport
              ? `${selectedAirport.name} (${selectedAirport.iata})`
              : "")
          }
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-10 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No airports found
              </div>
            ) : (
              filtered.map((airport, index) => (
                <div
                  key={airport.iata}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => selectAirport(airport)}
                  className={`p-4 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors ${
                    highlight === index
                      ? "bg-red-50 border-l-4 border-red-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-semibold text-gray-800">
                    {airport.name} ({airport.iata})
                  </div>
                  <div className="text-sm text-gray-500">
                    {airport.city}, {airport.country}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

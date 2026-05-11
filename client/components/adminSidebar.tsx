'use client'
import React, { useState } from "react";
import Link from 'next/link'
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/lib/permissionConstants";
import { useRouter } from "next/navigation";
import { p } from "framer-motion/client";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  active: string;
}

const admin_sidebar = ({ sidebarOpen, setSidebarOpen, active }: AdminSidebarProps) => {
  const [Active, setActive] = useState(active);
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const { hasPermission, logout } = useAuth();
  const router = useRouter();
  
  const toggleDropdown = (name: string) => {
    setExpandedDropdown(expandedDropdown === name ? null : name);
  };

  const insertWebDataItems = [
    {
      name: "Programs",
      path: "/Admindashbord/programs",
      permission: PERMISSIONS.ADD_PROGRAM
    },
    {
      name: "Visa Department",
      path: "/Admindashbord/countries",
      permission: PERMISSIONS.ADD_COUNTRY
    },
    {
      name: "Categories",
      path: "/Admindashbord/categories",
      permission: PERMISSIONS.ADD_CATEGORY
    },
    {
      name: "Cruises",
      path: "/Admindashbord/cruisies",
      permission: PERMISSIONS.ADD_CRUISE
    },
    {
      name: "Media",
      path: "/Admindashbord/media",
      permission: null
    },
  ];

  const inquiriesItems = [
    {
      name: "Booked Programs",
      path: "/Admindashbord/bookedPrograms",
      permission: PERMISSIONS.MANAGE_BOOKED_PROGRAMS
    },
    {
      name: "Booked Cruises",
      path: "/Admindashbord/bookedCrusies",
      permission: PERMISSIONS.MANAGE_BOOKED_CRUISES
    },
    {
      name: "Visa Inquiry",
      path: "/Admindashbord/visa",
      permission: PERMISSIONS.MANAGE_VISA
    },
    {
      name: "Transportation",
      path: "/Admindashbord/transportation",
      permission: PERMISSIONS.MANAGE_BOOKED_TRANSPORTATION
    },
    {
      name: "Hotel Reservations",
      path: "/Admindashbord/hotel",
      permission: PERMISSIONS.MANAGE_BOOKED_HOTELS
    },
    {
      name: "Flights",
      path: "/Admindashbord/flights",
      permission: PERMISSIONS.MANAGE_BOOKED_FLIGHTS
    },
    {
      name: "Booked Mice",
      path: "/Admindashbord/mice",
      permission: PERMISSIONS.MANAGE_BOOKED_MICE
    },
  ];

  const menuItems = [
    {
      name: "Dashboard",
      path: "/Admindashbord",
      permission: null
    },
  ];

  const bottomMenuItems = [
    {
      name: "Our Team",
      path: "/Admindashbord/users",
      permission: PERMISSIONS.MANAGE_USERS
    },
    {
      name: "Clients",
      path: "/Admindashbord/clients",
      permission: PERMISSIONS.MANAGE_CLIENTS
    },
    {
      name: "Search",
      path: "/Admindashbord/allInOne",
      permission: null
    },
    {
      name: "Logs",
      path: "/Admindashbord/logs",
      permission: PERMISSIONS.MANAGE_USERS
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link
              href={`/`}
              className="flex items-center space-x-2 rtl:space-x-reverse"
            >

              {/* <img
              src="/Logo.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            /> */}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                if (item.permission && !hasPermission(item.permission)) {
                  return null;
                }

                return (
                  <li
                    key={item.path}
                    onClick={() => setActive(item.name)}
                    className={Active === item.name ? "bg-gray-200 rounded-lg" : ""}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center px-4 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}

              {/* Insert Web Data Dropdown */}
              <li className="mt-4">
                <button
                  onClick={() => toggleDropdown("insertWebData")}
                  className="w-full flex items-center justify-between px-4 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Insert Web Data
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedDropdown === "insertWebData" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                {expandedDropdown === "insertWebData" && (
                  <ul className="pl-4 space-y-1 mt-2">
                    {insertWebDataItems.map((item) => {
                      if (item.permission && !hasPermission(item.permission)) {
                        return null;
                      }

                      return (
                        <li
                          key={item.path}
                          onClick={() => setActive(item.name)}
                          className={Active === item.name ? "bg-gray-200 rounded-lg" : ""}
                        >
                          <Link
                            href={item.path}
                            className="flex items-center px-4 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors text-sm"
                          >
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>

              {/* Inquiries Dropdown */}
              <li>
                <button
                  onClick={() => toggleDropdown("inquiries")}
                  className="w-full flex items-center justify-between px-4 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Inquiries
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      expandedDropdown === "inquiries" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                {expandedDropdown === "inquiries" && (
                  <ul className="pl-4 space-y-1 mt-2">
                    {inquiriesItems.map((item) => {
                      if (item.permission && !hasPermission(item.permission)) {
                        return null;
                      }

                      return (
                        <li
                          key={item.path}
                          onClick={() => setActive(item.name)}
                          className={Active === item.name ? "bg-gray-200 rounded-lg" : ""}
                        >
                          <Link
                            href={item.path}
                            className="flex items-center px-4 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors text-sm"
                          >
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>

              {/* Bottom Menu Items */}
              {bottomMenuItems.map((item) => {
                if (item.permission && !hasPermission(item.permission)) {
                  return null;
                }

                return (
                  <li
                    key={item.path}
                    onClick={() => setActive(item.name)}
                    className={Active === item.name ? "bg-gray-200 rounded-lg" : ""}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center px-4 py-3 text-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-1 px-3 py-2 m-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </aside>
    </div>
  )
}

export default admin_sidebar

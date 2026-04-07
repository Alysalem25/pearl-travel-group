'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import AdminSidebar from '@/components/adminSidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import { User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Summary {
  reviewedFlightsCount: number;
  reviewedHotelsCount: number;
  reviewedCarsCount: number;
  reviewedVisasCount: number;
  reviewedProgramsCount: number;
  reviewedCruisesCount: number;
}

interface Booking {
  _id: string;
  userEmail: string;
  userName: string;
  userNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

const UserSummaryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = React.useState<'flights' | 'hotels' | 'cars' | 'visa' | 'programs' | 'cruises'>('flights');

  // fetch profile data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => api.users.getOne(id!).then(r => r.data.user),
    enabled: !!id
  });

  // default range: start of current month to today
  const getDefaultDates = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const toInput = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      start: toInput(startOfMonth),
      end: toInput(now)
    };
  };

  const defaults = getDefaultDates();

  const [startDate, setStartDate] = React.useState(defaults.start);
  const [endDate, setEndDate] = React.useState(defaults.end);

  const { data, isLoading, error } = useQuery<Summary>({
    queryKey: ['userSummary', id, startDate, endDate],
    queryFn: () => api.users.getSummary(id!, startDate, endDate).then(r => r.data),
    enabled: !!id
  });

  // Fetch reviewed bookings based on active tab
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['reviewedBookings', id, activeTab, startDate, endDate],
    queryFn: async () => {
      if (!id) return [];
      
      switch (activeTab) {
        case 'flights':
          return api.users.getReviewedFlights(id, startDate, endDate).then(r => r.data || []);
        case 'hotels':
          return api.users.getReviewedHotels(id, startDate, endDate).then(r => r.data || []);
        case 'cars':
          return api.users.getReviewedCarTrips(id, startDate, endDate).then(r => r.data || []);
        case 'visa':
          return api.users.getReviewedVisa(id, startDate, endDate).then(r => r.data || []);
        case 'programs':
          return api.users.getReviewedPrograms(id, startDate, endDate).then(r => r.data || []);
        case 'cruises':
          return api.users.getReviewedCruises(id, startDate, endDate).then(r => r.data || []);
        default:
          return [];
      }
    },
    enabled: !!id
  });

  if (userLoading) return <div className="p-6">Loading user...</div>;
  if (!userData) return <div className="p-6 text-red-600">User not found</div>;

  const tabs: { key: typeof activeTab; label: string; count?: number }[] = [
    { key: 'flights', label: 'Flights', count: data?.reviewedFlightsCount },
    { key: 'hotels', label: 'Hotels', count: data?.reviewedHotelsCount },
    { key: 'cars', label: 'Car Trips', count: data?.reviewedCarsCount },
    { key: 'visa', label: 'Visa', count: data?.reviewedVisasCount },
    { key: 'programs', label: 'Programs', count: data?.reviewedProgramsCount },
    { key: 'cruises', label: 'Cruises', count: data?.reviewedCruisesCount },
  ];

  // returned summary data structure example:
  // console.log("User Summary Data:", data);

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <AdminSidebar sidebarOpen={false} setSidebarOpen={() => { }} active="Users" />

      <div className="flex-1 p-8 space-y-8">
        {/* Back Button */}
        <Link href="/Admindashbord/users">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft size={18} />
            Back to Users
          </button>
        </Link>

        {/* header / profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
          {userData.images && userData.images.length > 0 ? (
            <img
              src={`${userData.images[0]}`}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover ring-2 ring-slate-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-slate-200">
              <User className="w-10 h-10 text-slate-500" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{userData.name}</h1>
            <p className="text-sm text-slate-600">{userData.email}</p>
            <p className="text-sm text-slate-600">{userData.number}</p>
            <div className="mt-2 flex gap-2">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Role: {userData.role}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                userData.workStatus === 'active' ? 'bg-green-100 text-green-700' :
                userData.workStatus === 'inactive' ? 'bg-gray-100 text-gray-700' :
                userData.workStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                userData.workStatus === 'suspended' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                Status: {userData.workStatus || 'active'}
              </span>
            </div>
          </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Review statistics</p>
            <p className="text-[11px]">
              Default range: from start of this month
            </p>
          </div>
        </div>

        {/* date filter */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800">
              Filter reviews by date
            </h3>
            <p className="text-xs text-slate-500">
              Showing reviews from {startDate || 'start'} to {endDate || 'now'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <button
              type="button"
              onClick={() => {
                const d = getDefaultDates();
                setStartDate(d.start);
                setEndDate(d.end);
              }}
              className="ml-auto inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              This month
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {isLoading ? (
            <div className="col-span-full text-sm text-slate-600">
              Loading stats...
            </div>
          ) : error ? (
            <div className="col-span-full text-sm text-red-600">
              Error loading user stats
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed Flights
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data?.reviewedFlightsCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed Hotel Bookings
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data?.reviewedHotelsCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed Car Trips
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data?.reviewedCarsCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed Visa Applications
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data?.reviewedVisasCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed Programs
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data?.reviewedProgramsCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed Cruises
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {data?.reviewedCruisesCount ?? 0}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Tabs for reviewed bookings */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && <span className="ml-2 text-xs text-slate-500">({tab.count})</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {bookingsLoading ? (
              <div className="text-center py-8 text-slate-600">
                Loading {activeTab} bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                No reviewed {activeTab} found for this user in the selected date range.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {bookings.map((booking: Booking) => (
                  <div key={booking._id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{booking.userName}</h4>
                        <p className="text-sm text-slate-600">{booking.userEmail}</p>
                        {activeTab === 'flights' && (
                          <div className="mt-2 text-sm text-slate-600">
                            <span>{booking.from} → {booking.to}</span>
                            {booking.date && <span className="ml-4">Date: {new Date(booking.date).toLocaleDateString()}</span>}
                          </div>
                        )}
                        {activeTab === 'hotels' && booking.hotelId && (
                          <div className="mt-2 text-sm text-slate-600">
                            Hotel ID: {booking.hotelId}
                          </div>
                        )}
                        {activeTab === 'cars' && booking.carId && (
                          <div className="mt-2 text-sm text-slate-600">
                            Car ID: {booking.carId}
                          </div>
                        )}
                        {activeTab === 'programs' && booking.programId && (
                          <div className="mt-2 text-sm text-slate-600">
                            Program ID: {booking.programId}
                          </div>
                        )}
                        {activeTab === 'visa' && (
                          <div className="mt-2 text-sm text-slate-600">
                            Country: {booking.country || 'N/A'}
                          </div>
                        )}
                      </div>
                      <div className="ml-4 text-right">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                          {booking.status}
                        </span>
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(booking.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UserSummaryPage />
    </ProtectedRoute>
  );
}

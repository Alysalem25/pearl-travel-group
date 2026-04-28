// 'use client';

// /**
//  * 📊 AUDIT LOGS ADMIN DASHBOARD - Next.js Component
//  * 
//  * Features:
//  * - View all audit logs in real-time with advanced filtering
//  * - Activity statistics and trends analysis
//  * - Suspicious activity detection (multiple failed attempts)
//  * - Export audit logs to CSV for compliance
//  * - Role-based access control (admin only)
//  * 
//  * Tech Stack:
//  * - Next.js 16+ with App Router
//  * - Uses auth.ts utilities for authentication
//  * - TypeScript with full type safety
//  * - Tailwind CSS for styling
//  * - Axios for API calls
//  * 
//  * Authentication: (✅ USES auth.ts)
//  * - getAuthToken() - Get JWT from auth.ts
//  * - getAuthUser() - Get current user from auth.ts
//  * - isAdmin() - Check admin role from auth.ts
//  * 
//  * Location: /client/app/Admindashbord/logs/page.tsx
//  * API Endpoints: /api/logs (admin only)
//  */

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { getAuthToken, getAuthUser, isAdmin } from '@/lib/auth';
// import apiClient from '@/lib/api';
// import AdminSidebar from '@/components/adminSidebar';
// import { Menu } from 'lucide-react';

// /**
//  * Type Definitions
//  */
// interface Log {
//   _id: string;
//   user?: { _id: string; name: string; email: string; role: string };
//   action: string;
//   entity: string;
//   status: 'success' | 'failed';
//   ip?: string;
//   createdAt: string;
//   details?: Record<string, any>;
// }

// interface Pagination {
//   page: number;
//   limit: number;
//   pages: number;
//   total: number;
// }

// interface Filters {
//   action: string;
//   entity: string;
//   status: string;
//   userId: string;
//   ip: string;
//   startDate: string;
//   endDate: string;
// }

// interface Stat {
//   _id: string;
//   count: number;
//   successCount: number;
//   failedCount: number;
// }

// /**
//  * Main Logs Page Component
//  * 🔐 Protected: Admin role required
//  * 🎨 Theme: Dark gradient (slate-900 to slate-800)
//  * 📱 Responsive: Mobile-first with Tailwind
//  */
// export default function LogsPage() {
//   const router = useRouter();

//   // Sidebar state
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // State: Logs and Pagination
//   const [logs, setLogs] = useState<Log[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<Pagination>({
//     page: 1,
//     limit: 20,
//     pages: 1,
//     total: 0
//   });

//   // State: Filters
//   const [filters, setFilters] = useState<Filters>({
//     action: '',
//     entity: '',
//     status: '',
//     userId: '',
//     ip: '',
//     startDate: '',
//     endDate: ''
//   });

//   // State: Data and UI
//   const [stats, setStats] = useState<Stat[]>([]);
//   const [suspicious, setSuspicious] = useState<any>({});
//   const [activeTab, setActiveTab] = useState<'logs' | 'stats' | 'suspicious'>('logs');

//   /**
//    * 🔐 Auth Verification on Mount
//    * Redirects to /login if not authenticated
//    * Redirects to / if not admin
//    */
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = getAuthToken();
//       const user = getAuthUser();

//       if (!token || !user) {
//         router.push('/login');
//         return;
//       }

//       if (!isAdmin() && user.role !== 'admin') {
//         setError('⛔ Access Denied: Admin role required');
//         setTimeout(() => router.push('/'), 2000);
//       }
//     };

//     checkAuth();
//   }, [router]);

//   /**
//    * 📥 Fetch logs with filters and pagination
//    */
//   const fetchLogs = useCallback(async (pageParams = 1) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const queryParams = new URLSearchParams({
//         page: pageParams.toString(),
//         limit: '20',
//         ...(filters.action && { action: filters.action }),
//         ...(filters.entity && { entity: filters.entity }),
//         ...(filters.status && { status: filters.status }),
//         ...(filters.userId && { userId: filters.userId }),
//         ...(filters.ip && { ip: filters.ip }),
//         ...(filters.startDate && { startDate: filters.startDate }),
//         ...(filters.endDate && { endDate: filters.endDate })
//       });

//       const response = await apiClient.get(`/logs?${queryParams.toString()}`);

//       setLogs(response.data.logs || []);
//       setPagination(response.data.pagination || { page: 1, limit: 20, pages: 1, total: 0 });
//     } catch (err: any) {
//       const msg = err.message || 'Failed to fetch logs';
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters]);

//   /**
//    * 📈 Fetch activity statistics (7 days)
//    */
//   const fetchStats = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get('/logs/stats?days=7');
//       setStats(response.data.stats || []);
//     } catch (err: any) {
//       console.error('Error fetching stats:', err);
//       setError(err.message || 'Failed to load statistics');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * 🔴 Fetch suspicious activity
//    */
//   const fetchSuspicious = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await apiClient.get('/logs/suspicious?withinMinutes=30&threshold=5');
//       setSuspicious(response.data || {});
//     } catch (err: any) {
//       console.error('Error fetching suspicious:', err);
//       setError(err.message || 'Failed to load suspicious activity');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   /**
//    * 📊 Auto-load data when tab, filters, or pagination change
//    */
//   useEffect(() => {
//     if (activeTab === 'logs') {
//       fetchLogs(pagination.page);
//     } else if (activeTab === 'stats') {
//       fetchStats();
//     } else if (activeTab === 'suspicious') {
//       fetchSuspicious();
//     }
//   }, [activeTab, filters, pagination.page, fetchLogs, fetchStats, fetchSuspicious]);

//   /**
//    * 📥 Export logs to CSV
//    */
//   const handleExport = async () => {
//     try {
//       // Create identical query params to fetchLogs to match what is visibly filtered
//       const queryParams = new URLSearchParams({
//         ...(filters.action && { action: filters.action }),
//         ...(filters.entity && { entity: filters.entity }),
//         ...(filters.status && { status: filters.status }),
//         ...(filters.userId && { userId: filters.userId }),
//         ...(filters.ip && { ip: filters.ip }),
//         ...(filters.startDate && { startDate: filters.startDate }),
//         ...(filters.endDate && { endDate: filters.endDate })
//       });

//       const response = await apiClient.post(
//         '/logs/export',
//         { format: 'csv', filters },
//         { responseType: 'blob' }
//       );

//       const url = window.URL.createObjectURL(response.data);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `audit_logs_${Date.now()}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (err: any) {
//       console.error('Export error:', err);
//       setError(err.message || 'Failed to export logs');
//     }
//   };

//   /**
//    * 🔄 Clear all filters
//    */
//   const handleClearFilters = () => {
//     setFilters({
//       action: '',
//       entity: '',
//       status: '',
//       userId: '',
//       ip: '',
//       startDate: '',
//       endDate: ''
//     });
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   /**
//    * 📝 Handle filter changes
//    */
//   const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   /**
//    * 🎨 RENDER - Main UI
//    */
//   return (
//     <div className="flex h-screen bg-white">
//       <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="logs" />
      
//       <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
//         <div className="p-6 max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8 flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
//               >
//                 <Menu className="w-6 h-6" />
//               </button>
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Audit Logs</h1>
//                 <p className="text-gray-600">Monitor system activity • Detect anomalies • Maintain compliance</p>
//               </div>
//             </div>
//           </div>

//           {/* Error Alert */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-500 text-white rounded-lg flex justify-between items-center">
//               <span>{error}</span>
//               <button onClick={() => setError(null)} className="font-bold hover:opacity-80">✕</button>
//             </div>
//           )}

//           {/* Tab Navigation */}
//           <div className="flex gap-2 mb-6 border-b border-gray-300">
//             {(['logs', 'stats', 'suspicious'] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-3 font-semibold transition-all ${
//                   activeTab === tab
//                     ? 'text-blue-600 border-b-2 border-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 {tab === 'logs' && '📋 Logs'}
//                 {tab === 'stats' && '📊 Statistics'}
//                 {tab === 'suspicious' && '🚨 Suspicious Activity'}
//               </button>
//             ))}
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
//             </div>
//           )}

//           {/* TAB 1: LOGS */}
//           {!loading && activeTab === 'logs' && (
//             <div className="space-y-6">
//               {/* Filters */}
//               <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg">
//                 <h2 className="text-xl font-bold text-gray-900 mb-4">🔎 Advanced Filters</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
//                     <select name="action" value={filters.action} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none">
//                       <option value="">All Actions</option>
//                       <option value="LOGIN">Login</option>
//                       <option value="REGISTER">Register</option>
//                       <option value="DELETE">Delete</option>
//                       <option value="UPDATE">Update</option>
//                       <option value="CREATE">Create</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Entity</label>
//                     <select name="entity" value={filters.entity} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none">
//                       <option value="">All Entities</option>
//                       <option value="System">System</option>
//                       <option value="USER">User</option>
//                       <option value="PROGRAM">Program</option>
//                       <option value="BOOKING">Booking</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                     <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none">
//                       <option value="">All Status</option>
//                       <option value="success">✓ Success</option>
//                       <option value="failed">✕ Failed</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
//                     <input type="text" name="ip" value={filters.ip} onChange={handleFilterChange} placeholder="192.168.1.1" className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
//                     <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
//                     <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none" />
//                   </div>
//                 </div>
//                 <div className="flex gap-3 mt-4">
//                   <button onClick={handleClearFilters} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded font-semibold transition">🔄 Clear</button>
//                   <button onClick={handleExport} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition">📥 Export CSV</button>
//                 </div>
//               </div>

//               {/* Logs Table */}
//               {logs.length > 0 ? (
//                 <div className="bg-white rounded-lg overflow-x-auto border border-gray-300 shadow-xl">
//                   <table className="w-full text-left border-collapse">
//                     <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
//                       <tr>
//                         <th className="px-6 py-4 font-semibold">User</th>
//                         <th className="px-6 py-4 font-semibold">Action</th>
//                         <th className="px-6 py-4 font-semibold">Entity</th>
//                         <th className="px-6 py-4 font-semibold">Status</th>
//                         <th className="px-6 py-4 font-semibold">IP</th>
//                         <th className="px-6 py-4 font-semibold">Date</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {logs.map((log: Log) => (
//                         <tr key={log._id} className="hover:bg-gray-50 transition-colors">
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             <div>{log.user?.name || 'System'}</div>
//                             {log.user?.email && <div className="text-xs text-gray-500">{log.user.email}</div>}
//                           </td>
//                           <td className="px-6 py-4 text-sm">
//                             <span className="px-2.5 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-md text-xs font-medium">
//                               {log.action}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-700">
//                             {log.entity}
//                           </td>
//                           <td className="px-6 py-4 text-sm">
//                             <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${log.status === 'success' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
//                               {log.status === 'success' ? '✓ Success' : '✕ Failed'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-600 font-mono">
//                             {log.ip || '-'}
//                           </td>
//                           <td className="px-6 py-4 text-sm text-gray-600">
//                             {new Date(log.createdAt).toLocaleString()}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-lg p-12 text-center border border-gray-300 text-gray-500 shadow-lg">
//                   <div className="text-4xl mb-4">📭</div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">No logs found</h3>
//                   <p>Try adjusting your search filters or dates</p>
//                 </div>
//               )}

//               {/* Pagination */}
//               {pagination.pages > 1 && (
//                 <div className="flex justify-between items-center bg-white rounded-lg p-5 border border-gray-300 shadow-lg">
//                   <span className="text-gray-700 text-sm font-medium">
//                     Page <strong className="text-gray-900">{pagination.page}</strong> of <strong className="text-gray-900">{pagination.pages}</strong>
//                   </span>
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => setPagination(prev => ({...prev, page: Math.max(1, prev.page - 1)}))} 
//                       disabled={pagination.page === 1} 
//                       className="px-5 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-md transition font-medium text-sm"
//                     >
//                       ← Prev
//                     </button>
//                     <button 
//                       onClick={() => setPagination(prev => ({...prev, page: Math.min(prev.pages, prev.page + 1)}))} 
//                       disabled={pagination.page === pagination.pages} 
//                       className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition font-medium text-sm"
//                     >
//                       Next →
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* TAB 2: STATISTICS */}
//           {!loading && activeTab === 'stats' && (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900">\ud83d\udcca Activity (7 Days)</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {stats.map((stat: Stat) => (
//                   <div key={stat._id} className="bg-white rounded-lg p-6 border border-gray-300 shadow-xl">
//                     <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">{stat._id}</h3>
//                     <div className="space-y-4 text-sm">
//                       <div className="flex justify-between items-center p-2 rounded bg-gray-100">
//                         <span className="text-gray-700 font-medium">Total Attempts</span>
//                         <span className="text-gray-900 font-bold text-lg">{stat.count}</span>
//                       </div>
//                       <div className="flex justify-between items-center p-2 rounded bg-green-100 border border-green-300">
//                         <span className="text-green-700 font-semibold flex items-center gap-2">✓ Success</span>
//                         <span className="text-green-700 font-bold text-lg">{stat.successCount}</span>
//                       </div>
//                       <div className="flex justify-between items-center p-2 rounded bg-red-100 border border-red-300">
//                         <span className="text-red-700 font-semibold flex items-center gap-2">✕ Failed</span>
//                         <span className="text-red-700 font-bold text-lg">{stat.failedCount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}}
//               </div>
//             </div>
//           )}

//           {/* TAB 3: SUSPICIOUS ACTIVITY */}
//           {!loading && activeTab === 'suspicious' && (
//             <div className="space-y-6">
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">\ud83d\udea8 Suspicious Activity</h2>
//               <p className="text-gray-600 mb-6">Monitoring failed attempts and anomalies over the last 30 minutes.</p>
              
//               {(suspicious.byIPAddress?.length > 0 || suspicious.byUser?.length > 0) ? (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   {suspicious.byIPAddress?.length > 0 && (
//                     <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-xl">
//                       <div className="p-5 border-b border-gray-300 bg-gray-50">
//                         <h3 className="font-bold text-gray-900 text-lg">Suspicious IPs</h3>
//                       </div>
//                       <table className="w-full text-sm">
//                         <thead className="bg-gray-100 border-b border-gray-300">
//                           <tr>
//                             <th className="px-5 py-3 text-left text-gray-700 font-medium">IP Address</th>
//                             <th className="px-5 py-3 text-left text-gray-700 font-medium">Failed Attempts</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {suspicious.byIPAddress.map((ip: any, idx: number) => (
//                             <tr key={idx} className="hover:bg-gray-50 transition-colors">
//                               <td className="px-5 py-4 text-gray-900 font-mono">{ip._id}</td>
//                               <td className="px-5 py-4">
//                                 <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md font-bold">
//                                   {ip.failedAttempts || ip.count}
//                                 </span>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}

//                   {suspicious.byUser?.length > 0 && (
//                     <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-xl">
//                       <div className="p-5 border-b border-gray-300 bg-gray-50">
//                         <h3 className="font-bold text-gray-900 text-lg">Suspicious Users</h3>
//                       </div>
//                       <table className="w-full text-sm">
//                         <thead className="bg-gray-100 border-b border-gray-300">
//                           <tr>
//                             <th className="px-5 py-3 text-left text-gray-700 font-medium">User</th>
//                             <th className="px-5 py-3 text-left text-gray-700 font-medium">Denied Attempts</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {suspicious.byUser.map((userStats: any, idx: number) => {
//                             const userDetails = userStats.userInfo?.[0] || {};
//                             return (
//                               <tr key={idx} className="hover:bg-gray-50 transition-colors">
//                                 <td className="px-5 py-4">
//                                   <div className="text-gray-900 font-medium">{userDetails.name || userStats._id}</div>
//                                   <div className="text-xs text-gray-500">{userDetails.email}</div>
//                                 </td>
//                                 <td className="px-5 py-4">
//                                   <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md font-bold">
//                                     {userStats.deniedAttempts || userStats.count}
//                                   </span>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-white rounded-lg p-12 text-center border border-gray-300 shadow-lg">
//                   <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
//                     <span className="text-2xl">🛡️</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-green-700 mb-2">System Secure</h3>
//                   <p className="text-gray-600">No suspicious activity detected within the monitored timeframe.</p>
//                 </div>
//               )}

//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

/**
 * 📊 AUDIT LOGS ADMIN DASHBOARD - Next.js Component
 * 
 * Features:
 * - View all audit logs in real-time with advanced filtering
 * - Activity statistics and trends analysis
 * - Suspicious activity detection (multiple failed attempts)
 * - Export audit logs to CSV for compliance
 * - Role-based access control (admin only)
 * 
 * Tech Stack:
 * - Next.js 16+ with App Router
 * - Uses auth.ts utilities for authentication
 * - TypeScript with full type safety
 * - Tailwind CSS for styling
 * - Axios for API calls
 * 
 * Authentication: (✅ USES auth.ts)
 * - getAuthToken() - Get JWT from auth.ts
 * - getAuthUser() - Get current user from auth.ts
 * - isAdmin() - Check admin role from auth.ts
 * 
 * Location: /client/app/Admindashbord/logs/page.tsx
 * API Endpoints: /api/logs (admin only)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getAuthUser, isAdmin } from '@/lib/auth';
import apiClient from '@/lib/api';
import AdminSidebar from '@/components/adminSidebar';
import { Menu } from 'lucide-react';

/**
 * Type Definitions
 */
interface Log {
  _id: string;
  user?: { _id: string; name: string; email: string; role: string };
  action: string;
  entity: string;
  status: 'success' | 'failed';
  ip?: string;
  createdAt: string;
  details?: Record<string, any>;
}

interface Pagination {
  page: number;
  limit: number;
  pages: number;
  total: number;
}

interface Filters {
  action: string;
  entity: string;
  status: string;
  userId: string;
  ip: string;
  startDate: string;
  endDate: string;
}

interface Stat {
  _id: string;
  count: number;
  successCount: number;
  failedCount: number;
}

// All action enum values from the Mongoose model
const ACTION_OPTIONS = [
  // Auth actions
  { value: 'LOGIN_SUCCESS', label: 'Login Success' },
  { value: 'LOGIN_FAILED', label: 'Login Failed' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'REGISTER_SUCCESS', label: 'Register Success' },
  { value: 'REGISTER_FAILED', label: 'Register Failed' },
  { value: 'PASSWORD_RESET', label: 'Password Reset' },
  { value: 'TOKEN_REFRESH', label: 'Token Refresh' },
  
  // User actions
  { value: 'CREATE_USER', label: 'Create User' },
  { value: 'UPDATE_USER', label: 'Update User' },
  { value: 'DELETE_CLIENT', label: 'Delete Client' },
  { value: 'USER_ROLE_CHANGED', label: 'User Role Changed' },
  
  // Program actions
  { value: 'CREATE_PROGRAM', label: 'Create Program' },
  { value: 'EDIT_PROGRAM', label: 'Edit Program' },
  { value: 'DELETE_PROGRAM', label: 'Delete Program' },
  { value: 'SEARCH_PROGRAM', label: 'Search Program' },
  { value: 'CREATE_BOOKED_PROGRAM', label: 'Create Booked Program' },
  { value: 'DELETE_BOOKED_PROGRAM', label: 'Delete Booked Program' },
  { value: 'SEARCH_BOOKED_PROGRAM', label: 'Search Booked Program' },
  { value: 'EDIT_BOOKED_PROGRAM', label: 'Edit Booked Program' },
  
  // Booking actions
  { value: 'CREATE_BOOKING', label: 'Create Booking' },
  { value: 'UPDATE_BOOKING', label: 'Update Booking' },
  { value: 'CANCEL_BOOKING', label: 'Cancel Booking' },
  { value: 'DELETE_BOOKING', label: 'Delete Booking' },
  
  // Admin actions
  { value: 'ADMIN_ACCESS', label: 'Admin Access' },
  { value: 'ADMIN_EXPORT_DATA', label: 'Admin Export Data' },
  { value: 'ADMIN_BULK_DELETE', label: 'Admin Bulk Delete' },
  
  // Category actions
  { value: 'CREATE_CATEGORY', label: 'Create Category' },
  { value: 'EDIT_CATEGORY', label: 'Edit Category' },
  { value: 'DELETE_CATEGORY', label: 'Delete Category' },
  { value: 'SEARCH_CATEGORY', label: 'Search Category' },
  
  // Country actions
  { value: 'CREATE_COUNTRY', label: 'Create Country' },
  { value: 'EDIT_COUNTRY', label: 'Edit Country' },
  { value: 'DELETE_COUNTRY', label: 'Delete Country' },
  { value: 'SEARCH_COUNTRY', label: 'Search Country' },
  
  // Cruise actions
  { value: 'CREATE_CRUISE', label: 'Create Cruise' },
  { value: 'EDIT_CRUISE', label: 'Edit Cruise' },
  { value: 'DELETE_CRUISE', label: 'Delete Cruise' },
  { value: 'SEARCH_CRUISE', label: 'Search Cruise' },
  { value: 'CREATE_BOOKED_CRUISE', label: 'Create Booked Cruise' },
  { value: 'DELETE_BOOKED_CRUISE', label: 'Delete Booked Cruise' },
  { value: 'EDIT_BOOKED_CRUISE', label: 'Edit Booked Cruise' },
  
  // Hotel actions
  { value: 'CREATE_HOTEL', label: 'Create Hotel' },
  { value: 'EDIT_HOTEL', label: 'Edit Hotel' },
  { value: 'DELETE_HOTEL', label: 'Delete Hotel' },
  { value: 'SEARCH_HOTEL', label: 'Search Hotel' },

  // Flight actions
  { value: 'CREATE_FLIGHT', label: 'Create Flight' },
  { value: 'EDIT_FLIGHT', label: 'Edit Flight' },
  { value: 'DELETE_FLIGHT', label: 'Delete Flight' },
  { value: 'SEARCH_FLIGHT', label: 'Search Flight' },

  // Transportation actions
  { value: 'CREATE_TRANSPORTATION', label: 'Create Transportation' },
  { value: 'EDIT_TRANSPORTATION', label: 'Edit Transportation' },
  { value: 'DELETE_TRANSPORTATION', label: 'Delete Transportation' },
  { value: 'SEARCH_TRANSPORTATION', label: 'Search Transportation' },

  // Visa actions
  { value: 'CREATE_VISA', label: 'Create Visa' },
  { value: 'EDIT_VISA', label: 'Edit Visa' },
  { value: 'DELETE_VISA', label: 'Delete Visa' },
  { value: 'SEARCH_VISA', label: 'Search Visa' },

  // Other
  { value: 'PERMISSION_DENIED', label: 'Permission Denied' },
  { value: 'INVALID_REQUEST', label: 'Invalid Request' },
  { value: 'SYSTEM_ERROR', label: 'System Error' }
];

// Entity options from the Mongoose model
const ENTITY_OPTIONS = [
  { value: 'User', label: 'User' },
  { value: 'Program', label: 'Program' },
  { value: 'Booking', label: 'Booking' },
  { value: 'Category', label: 'Category' },
  { value: 'Country', label: 'Country' },
  { value: 'Cruise', label: 'Cruise' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Flight', label: 'Flight' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Visa', label: 'Visa' },
  { value: 'Company', label: 'Company' },
  { value: 'Event', label: 'Event' },
  { value: 'System', label: 'System' }
];

/**
 * Main Logs Page Component
 * 🔐 Protected: Admin role required
 * 🎨 Theme: Dark gradient (slate-900 to slate-800)
 * 📱 Responsive: Mobile-first with Tailwind
 */
export default function LogsPage() {
  const router = useRouter();

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // State: Logs and Pagination
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    pages: 1,
    total: 0
  });

  // State: Filters
  const [filters, setFilters] = useState<Filters>({
    action: '',
    entity: '',
    status: '',
    userId: '',
    ip: '',
    startDate: '',
    endDate: ''
  });

  // State: Data and UI
  const [stats, setStats] = useState<Stat[]>([]);
  const [suspicious, setSuspicious] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'logs' | 'stats' | 'suspicious'>('logs');

  /**
   * 🔐 Auth Verification on Mount
   * Redirects to /login if not authenticated
   * Redirects to / if not admin
   */
  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();
      const user = getAuthUser();

      if (!token || !user) {
        router.push('/login');
        return;
      }

      if (!isAdmin() && user.role !== 'admin') {
        setError('⛔ Access Denied: Admin role required');
        setTimeout(() => router.push('/'), 2000);
      }
    };

    checkAuth();
  }, [router]);

  /**
   * 📥 Fetch logs with filters and pagination
   * FIXED: Always include all filter params to allow clearing filters properly
   */
  const fetchLogs = useCallback(async (pageParams = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Build query params - always include all filters (even if empty)
      const queryParams = new URLSearchParams({
        page: pageParams.toString(),
        limit: '20',
        action: filters.action,
        entity: filters.entity,
        status: filters.status,
        userId: filters.userId,
        ip: filters.ip,
        startDate: filters.startDate,
        endDate: filters.endDate
      });

      const response = await apiClient.get(`/logs?${queryParams.toString()}`);

      setLogs(response.data.logs || []);
      setPagination(response.data.pagination || { page: 1, limit: 20, pages: 1, total: 0 });
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch logs';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * 📈 Fetch activity statistics (7 days)
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/logs/stats?days=7');
      setStats(response.data.stats || []);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchSuspicious = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/logs/suspicious?withinMinutes=30&threshold=5');
      setSuspicious(response.data || {});
    } catch (err: any) {
      console.error('Error fetching suspicious:', err);
      setError(err.message || 'Failed to load suspicious activity');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 📊 Auto-load data when tab, filters, or pagination change
   */
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs(pagination.page);
    } else if (activeTab === 'stats') {
      fetchStats();
    } else if (activeTab === 'suspicious') {
      fetchSuspicious();
    }
  }, [activeTab, filters, pagination.page, fetchLogs, fetchStats, fetchSuspicious]);

  /**
   * 📥 Export logs to CSV
   */
  const handleExport = async () => {
    try {
      const response = await apiClient.post(
        '/logs/export',
        { 
          format: 'csv', 
          filters: {
            action: filters.action,
            entity: filters.entity,
            status: filters.status,
            userId: filters.userId,
            ip: filters.ip,
            startDate: filters.startDate,
            endDate: filters.endDate
          }
        },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export logs');
    }
  };

  /**
   * 🔄 Clear all filters
   */
  const handleClearFilters = () => {
    setFilters({
      action: '',
      entity: '',
      status: '',
      userId: '',
      ip: '',
      startDate: '',
      endDate: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  /**
   * 📝 Handle filter changes
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  /**
   * 🎨 RENDER - Main UI
   */
  return (
    <div className="flex h-screen bg-white">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active="logs" />
      
      <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Audit Logs</h1>
                <p className="text-gray-600">Monitor system activity • Detect anomalies • Maintain compliance</p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500 text-white rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="font-bold hover:opacity-80">✕</button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-gray-300">
            {(['logs', 'stats', 'suspicious'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'logs' && '📋 Logs'}
                {tab === 'stats' && '📊 Statistics'}
                {tab === 'suspicious' && '🚨 Suspicious Activity'}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
          )}

          {/* TAB 1: LOGS */}
          {!loading && activeTab === 'logs' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-lg p-6 border border-gray-300 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🔎 Advanced Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className='max-h-40'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                    <select 
                      name="action" 
                      value={filters.action} 
                      onChange={handleFilterChange} 
                      size={1}
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none overflow-y-auto max-h-24"
                    >
                      <option value="">All Actions</option>
                      {ACTION_OPTIONS.map((action) => (
                        <option key={action.value} value={action.value}>
                          {action.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Entity</label>
                    <select 
                      name="entity" 
                      value={filters.entity} 
                      onChange={handleFilterChange} 
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">All Entities</option>
                      {ENTITY_OPTIONS.map((entity) => (
                        <option key={entity.value} value={entity.value}>
                          {entity.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      name="status" 
                      value={filters.status} 
                      onChange={handleFilterChange} 
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">All Status</option>
                      <option value="success">✓ Success</option>
                      <option value="failed">✕ Failed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
                    <input 
                      type="text" 
                      name="ip" 
                      value={filters.ip} 
                      onChange={handleFilterChange} 
                      placeholder="192.168.1.1" 
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input 
                      type="date" 
                      name="startDate" 
                      value={filters.startDate} 
                      onChange={handleFilterChange} 
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input 
                      type="date" 
                      name="endDate" 
                      value={filters.endDate} 
                      onChange={handleFilterChange} 
                      className="w-full px-3 py-2 bg-white text-gray-900 rounded border border-gray-400 focus:border-blue-600 focus:outline-none" 
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={handleClearFilters} 
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded font-semibold transition"
                  >
                    🔄 Clear
                  </button>
                  <button 
                    onClick={handleExport} 
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition"
                  >
                    📥 Export CSV
                  </button>
                </div>
              </div>

              {/* Logs Table */}
              {logs.length > 0 ? (
                <div className="bg-white rounded-lg overflow-x-auto border border-gray-300 shadow-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 text-sm">
                      <tr>
                        <th className="px-6 py-4 font-semibold">User</th>
                        <th className="px-6 py-4 font-semibold">Action</th>
                        <th className="px-6 py-4 font-semibold">Entity</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">IP</th>
                        <th className="px-6 py-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {logs.map((log: Log) => (
                        <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div>{log.user?.name || 'System'}</div>
                            {log.user?.email && <div className="text-xs text-gray-500">{log.user.email}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded-md text-xs font-medium">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {log.entity}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${log.status === 'success' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}>
                              {log.status === 'success' ? '✓ Success' : '✕ Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                            {log.ip || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center border border-gray-300 text-gray-500 shadow-lg">
                  <div className="text-4xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No logs found</h3>
                  <p>Try adjusting your search filters or dates</p>
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-between items-center bg-white rounded-lg p-5 border border-gray-300 shadow-lg">
                  <span className="text-gray-700 text-sm font-medium">
                    Page <strong className="text-gray-900">{pagination.page}</strong> of <strong className="text-gray-900">{pagination.pages}</strong>
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPagination(prev => ({...prev, page: Math.max(1, prev.page - 1)}))} 
                      disabled={pagination.page === 1} 
                      className="px-5 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 rounded-md transition font-medium text-sm"
                    >
                      ← Prev
                    </button>
                    <button 
                      onClick={() => setPagination(prev => ({...prev, page: Math.min(prev.pages, prev.page + 1)}))} 
                      disabled={pagination.page === pagination.pages} 
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition font-medium text-sm"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STATISTICS */}
          {!loading && activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">📊 Activity (7 Days)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat: Stat) => (
                  <div key={stat._id} className="bg-white rounded-lg p-6 border border-gray-300 shadow-xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">{stat._id}</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center p-2 rounded bg-gray-100">
                        <span className="text-gray-700 font-medium">Total Attempts</span>
                        <span className="text-gray-900 font-bold text-lg">{stat.count}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-green-100 border border-green-300">
                        <span className="text-green-700 font-semibold flex items-center gap-2">✓ Success</span>
                        <span className="text-green-700 font-bold text-lg">{stat.successCount}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-red-100 border border-red-300">
                        <span className="text-red-700 font-semibold flex items-center gap-2">✕ Failed</span>
                        <span className="text-red-700 font-bold text-lg">{stat.failedCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SUSPICIOUS ACTIVITY */}
          {!loading && activeTab === 'suspicious' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">🚨 Suspicious Activity</h2>
              <p className="text-gray-600 mb-6">Monitoring failed attempts and anomalies over the last 30 minutes.</p>
              
              {(suspicious.byIPAddress?.length > 0 || suspicious.byUser?.length > 0) ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {suspicious.byIPAddress?.length > 0 && (
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-xl">
                      <div className="p-5 border-b border-gray-300 bg-gray-50">
                        <h3 className="font-bold text-gray-900 text-lg">Suspicious IPs</h3>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="px-5 py-3 text-left text-gray-700 font-medium">IP Address</th>
                            <th className="px-5 py-3 text-left text-gray-700 font-medium">Failed Attempts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {suspicious.byIPAddress.map((ip: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 text-gray-900 font-mono">{ip._id}</td>
                              <td className="px-5 py-4">
                                <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md font-bold">
                                  {ip.failedAttempts || ip.count}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {suspicious.byUser?.length > 0 && (
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-300 shadow-xl">
                      <div className="p-5 border-b border-gray-300 bg-gray-50">
                        <h3 className="font-bold text-gray-900 text-lg">Suspicious Users</h3>
                      </div>
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="px-5 py-3 text-left text-gray-700 font-medium">User</th>
                            <th className="px-5 py-3 text-left text-gray-700 font-medium">Denied Attempts</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {suspicious.byUser.map((userStats: any, idx: number) => {
                            const userDetails = userStats.userInfo?.[0] || {};
                            return (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-5 py-4">
                                  <div className="text-gray-900 font-medium">{userDetails.name || userStats._id}</div>
                                  <div className="text-xs text-gray-500">{userDetails.email}</div>
                                </td>
                                <td className="px-5 py-4">
                                  <span className="px-3 py-1 bg-red-100 text-red-700 border border-red-300 rounded-md font-bold">
                                    {userStats.deniedAttempts || userStats.count}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center border border-gray-300 shadow-lg">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-700 mb-2">System Secure</h3>
                  <p className="text-gray-600">No suspicious activity detected within the monitored timeframe.</p>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
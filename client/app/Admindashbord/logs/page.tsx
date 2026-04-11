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

/**
 * Main Logs Page Component
 * 🔐 Protected: Admin role required
 * 🎨 Theme: Dark gradient (slate-900 to slate-800)
 * 📱 Responsive: Mobile-first with Tailwind
 */
export default function LogsPage() {
  const router = useRouter();

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
   */
  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.action && { action: filters.action }),
        ...(filters.entity && { entity: filters.entity }),
        ...(filters.status && { status: filters.status }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.ip && { ip: filters.ip }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await apiClient.get(`/logs?${queryParams.toString()}`);

      setLogs(response.data.logs || []);
      setPagination(response.data.pagination || {});
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

  /**
   * 🔴 Fetch suspicious activity
   */
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
   * 📊 Auto-load data when tab or filters change
   */
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs(1);
    } else if (activeTab === 'stats') {
      fetchStats();
    } else if (activeTab === 'suspicious') {
      fetchSuspicious();
    }
  }, [activeTab, fetchLogs, fetchStats, fetchSuspicious]);

  /**
   * 📥 Export logs to CSV
   */
  const handleExport = async () => {
    try {
      const response = await apiClient.post(
        '/logs/export',
        { format: 'csv', filters },
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
    setPagination({ ...pagination, page: 1 });
  };

  /**
   * 📝 Handle filter changes
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination({ ...pagination, page: 1 });
  };

  /**
   * 🎨 RENDER - Main UI
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔍 Audit Logs</h1>
          <p className="text-slate-300">Monitor system activity • Detect anomalies • Maintain compliance</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500 text-white rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="font-bold hover:opacity-80">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-600">
          {(['logs', 'stats', 'suspicious'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
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
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <h2 className="text-xl font-bold text-white mb-4">🔎 Advanced Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Action</label>
                  <select name="action" value={filters.action} onChange={handleFilterChange} className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none">
                    <option value="">All Actions</option>
                    <option value="LOGIN">Login</option>
                    <option value="REGISTER">Register</option>
                    <option value="DELETE">Delete</option>
                    <option value="UPDATE">Update</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Entity</label>
                  <select name="entity" value={filters.entity} onChange={handleFilterChange} className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none">
                    <option value="">All Entities</option>
                    <option value="USER">User</option>
                    <option value="PROGRAM">Program</option>
                    <option value="BOOKING">Booking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none">
                    <option value="">All Status</option>
                    <option value="success">✓ Success</option>
                    <option value="failed">✕ Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">IP Address</label>
                  <input type="text" name="ip" value={filters.ip} onChange={handleFilterChange} placeholder="192.168.1.1" className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={handleClearFilters} className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded font-semibold transition">🔄 Clear</button>
                <button onClick={handleExport} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-semibold transition">📥 Export CSV</button>
              </div>
            </div>

            {/* Logs Table */}
            {logs.length > 0 ? (
              <div className="bg-slate-700 rounded-lg overflow-x-auto border border-slate-600">
                <table className="w-full">
                  <thead className="bg-slate-800 border-b border-slate-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">User</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Action</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Entity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">IP</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log: Log) => (
                      <tr key={log._id} className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="px-6 py-4 text-sm text-slate-200">{log.user?.name || 'System'}</td>
                        <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-blue-600 text-white rounded text-xs">{log.action}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-300">{log.entity}</td>
                        <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded text-xs font-semibold ${log.status === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{log.status === 'success' ? '✓ Success' : '✕ Failed'}</span></td>
                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{log.ip || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600 text-slate-400">No logs found</div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-between items-center bg-slate-700 rounded-lg p-4 border border-slate-600">
                <span className="text-slate-300 text-sm">Page {pagination.page} of {pagination.pages}</span>
                <div className="flex gap-2">
                  <button onClick={() => setPagination({...pagination, page: Math.max(1, pagination.page - 1)})} disabled={pagination.page === 1} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white rounded">← Prev</button>
                  <button onClick={() => setPagination({...pagination, page: Math.min(pagination.pages, pagination.page + 1)})} disabled={pagination.page === pagination.pages} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded">Next →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STATISTICS */}
        {!loading && activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">📊 Activity (7 Days)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat: Stat) => (
                <div key={stat._id} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-lg font-bold text-white mb-4">{stat._id}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-300">Total:</span><span className="text-white font-bold">{stat.count}</span></div>
                    <div className="flex justify-between"><span className="text-green-400">✓ Success:</span><span className="text-green-400 font-bold">{stat.successCount}</span></div>
                    <div className="flex justify-between"><span className="text-red-400">✕ Failed:</span><span className="text-red-400 font-bold">{stat.failedCount}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SUSPICIOUS ACTIVITY */}
        {!loading && activeTab === 'suspicious' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">🚨 Suspicious Activity</h2>
            {(suspicious.byIPAddress?.length > 0 || suspicious.byUser?.length > 0) ? (
              <>
                {suspicious.byIPAddress?.length > 0 && (
                  <div className="bg-slate-700 rounded-lg overflow-x-auto border border-slate-600">
                    <div className="p-4 border-b border-slate-600"><h3 className="font-bold text-white">Suspicious IPs</h3></div>
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800 border-b border-slate-600">
                        <tr><th className="px-4 py-2 text-left text-slate-300">IP</th><th className="px-4 py-2 text-left text-slate-300">Failed Attempts</th></tr>
                      </thead>
                      <tbody>
                        {suspicious.byIPAddress.map((ip: any, idx: number) => (
                          <tr key={idx} className="border-b border-slate-600 hover:bg-slate-600">
                            <td className="px-4 py-2 text-slate-200 font-mono">{ip._id}</td>
                            <td className="px-4 py-2"><span className="px-2 py-1 bg-red-600 text-white rounded">{ip.count}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-700 rounded-lg p-8 text-center border border-slate-600 text-green-400">✓ No suspicious activity detected</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

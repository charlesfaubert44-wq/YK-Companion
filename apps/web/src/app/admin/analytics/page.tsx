'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface AnalyticsData {
  totalUsers: number;
  totalSponsors: number;
  totalGarageSales: number;
  activeSponsors: number;
  pendingGarageSales: number;
  revenueThisMonth: number;
  revenueYTD: number;
  newUsersThisWeek: number;
  usersByType: {
    visiting: number;
    living: number;
    moving: number;
  };
  revenueByMonth: Array<{ month: string; revenue: number }>;
  sponsorsByPosition: Array<{ position: string; count: number }>;
}

export default function AdminAnalyticsPage() {
  const supabase = createClient();
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalSponsors: 0,
    totalGarageSales: 0,
    activeSponsors: 0,
    pendingGarageSales: 0,
    revenueThisMonth: 0,
    revenueYTD: 0,
    newUsersThisWeek: 0,
    usersByType: { visiting: 0, living: 0, moving: 0 },
    revenueByMonth: [],
    sponsorsByPosition: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    end: new Date().toISOString().split('T')[0] // Today
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);

    try {
      // Fetch users
      const { data: users, count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Fetch users by type
      const { data: visitingUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'visiting');

      const { data: livingUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'living');

      const { data: movingUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'moving');

      // Fetch new users this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const { data: newUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', oneWeekAgo.toISOString());

      // Fetch sponsors
      const { data: sponsors, count: sponsorCount } = await supabase
        .from('premium_sponsors')
        .select('*', { count: 'exact' });

      // Fetch active sponsors (current date between start and end)
      const today = new Date().toISOString();
      const { data: activeSponsorsData } = await supabase
        .from('premium_sponsors')
        .select('*')
        .lte('start_date', today)
        .gte('end_date', today)
        .eq('is_active', true);

      // Fetch garage sales
      const { data: garageSales, count: garageSaleCount } = await supabase
        .from('garage_sales')
        .select('*', { count: 'exact' });

      // Fetch pending garage sales
      const { data: pendingGarageSalesData } = await supabase
        .from('garage_sales')
        .select('id')
        .eq('approval_status', 'pending');

      // Calculate revenue this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlySponsors } = await supabase
        .from('premium_sponsors')
        .select('total_price, payment_status')
        .gte('created_at', firstDayOfMonth.toISOString())
        .eq('payment_status', 'paid');

      const revenueThisMonth = monthlySponsors?.reduce((sum: number, s) => sum + Number(s.total_price), 0) || 0;

      // Calculate revenue YTD
      const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const { data: ytdSponsors } = await supabase
        .from('premium_sponsors')
        .select('total_price, payment_status')
        .gte('created_at', firstDayOfYear)
        .eq('payment_status', 'paid');

      const revenueYTD = ytdSponsors?.reduce((sum: number, s) => sum + Number(s.total_price), 0) || 0;

      // Revenue by month (last 12 months)
      const revenueByMonth = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();

        const { data: monthSponsors } = await supabase
          .from('premium_sponsors')
          .select('total_price')
          .gte('created_at', monthStart)
          .lte('created_at', monthEnd)
          .eq('payment_status', 'paid');

        revenueByMonth.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue: monthSponsors?.reduce((sum: number, s) => sum + Number(s.total_price), 0) || 0
        });
      }

      // Sponsors by position
      const positions = ['home_top', 'home_middle', 'home_bottom', 'visiting', 'living', 'moving'];
      const sponsorsByPosition = await Promise.all(
        positions.map(async (position) => {
          const { data } = await supabase
            .from('premium_sponsors')
            .select('id')
            .eq('position', position);

          return {
            position: position.replace('_', ' '),
            count: data?.length || 0
          };
        })
      );

      setData({
        totalUsers: userCount || 0,
        totalSponsors: sponsorCount || 0,
        totalGarageSales: garageSaleCount || 0,
        activeSponsors: activeSponsorsData?.length || 0,
        pendingGarageSales: pendingGarageSalesData?.length || 0,
        revenueThisMonth,
        revenueYTD,
        newUsersThisWeek: newUsers?.length || 0,
        usersByType: {
          visiting: visitingUsers?.length || 0,
          living: livingUsers?.length || 0,
          moving: movingUsers?.length || 0
        },
        revenueByMonth,
        sponsorsByPosition
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }

    setLoading(false);
  };

  const exportReport = () => {
    const report = `
YK Buddy Analytics Report
Generated: ${new Date().toLocaleString()}

OVERVIEW
--------
Total Users: ${data.totalUsers}
New Users (Last 7 Days): ${data.newUsersThisWeek}
Total Sponsors: ${data.totalSponsors}
Active Sponsors: ${data.activeSponsors}
Total Garage Sales: ${data.totalGarageSales}
Pending Garage Sales: ${data.pendingGarageSales}

REVENUE
-------
This Month: $${data.revenueThisMonth.toFixed(2)} CAD
Year to Date: $${data.revenueYTD.toFixed(2)} CAD

USER BREAKDOWN
--------------
Visiting: ${data.usersByType.visiting}
Living: ${data.usersByType.living}
Moving: ${data.usersByType.moving}

REVENUE BY MONTH (Last 12 Months)
----------------------------------
${data.revenueByMonth.map(m => `${m.month}: $${m.revenue.toFixed(2)}`).join('\n')}

SPONSORS BY POSITION
--------------------
${data.sponsorsByPosition.map(s => `${s.position}: ${s.count}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Platform metrics and insights</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              ← Back to Admin
            </Link>
            <button
              onClick={exportReport}
              className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              Export Report
            </button>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-white text-xl">Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* Overview Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-aurora-blue/20 to-aurora-blue/5 rounded-xl p-6 border border-aurora-blue/30">
                <div className="text-sm text-gray-400 mb-2">Total Users</div>
                <div className="text-3xl font-bold text-white mb-1">{data.totalUsers}</div>
                <div className="text-xs text-aurora-blue">+{data.newUsersThisWeek} this week</div>
              </div>

              <div className="bg-gradient-to-br from-aurora-green/20 to-aurora-green/5 rounded-xl p-6 border border-aurora-green/30">
                <div className="text-sm text-gray-400 mb-2">Active Sponsors</div>
                <div className="text-3xl font-bold text-white mb-1">{data.activeSponsors}</div>
                <div className="text-xs text-aurora-green">of {data.totalSponsors} total</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 rounded-xl p-6 border border-yellow-500/30">
                <div className="text-sm text-gray-400 mb-2">Revenue (Month)</div>
                <div className="text-3xl font-bold text-white mb-1">${data.revenueThisMonth.toFixed(0)}</div>
                <div className="text-xs text-yellow-400">CAD</div>
              </div>

              <div className="bg-gradient-to-br from-aurora-purple/20 to-aurora-purple/5 rounded-xl p-6 border border-aurora-purple/30">
                <div className="text-sm text-gray-400 mb-2">Revenue (YTD)</div>
                <div className="text-3xl font-bold text-white mb-1">${data.revenueYTD.toFixed(0)}</div>
                <div className="text-xs text-aurora-purple">CAD</div>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Garage Sales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Listings</span>
                    <span className="text-white font-semibold">{data.totalGarageSales}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Pending Approval</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                      {data.pendingGarageSales}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">User Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Visiting</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(data.usersByType.visiting / data.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {data.usersByType.visiting}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Living</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(data.usersByType.living / data.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {data.usersByType.living}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Moving</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(data.usersByType.moving / data.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold w-12 text-right">
                        {data.usersByType.moving}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-bold text-white mb-6">Revenue Trend (Last 12 Months)</h3>
              <div className="space-y-3">
                {data.revenueByMonth.map((month, index) => {
                  const maxRevenue = Math.max(...data.revenueByMonth.map(m => m.revenue), 1);
                  const widthPercent = (month.revenue / maxRevenue) * 100;

                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-24 text-sm text-gray-400">{month.month}</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-8 relative overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-aurora-green to-aurora-blue rounded-full transition-all duration-500"
                          style={{ width: `${widthPercent}%` }}
                        />
                        <div className="relative z-10 flex items-center justify-end h-full px-3">
                          <span className="text-white text-sm font-semibold">
                            ${month.revenue.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sponsors by Position */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-6">Sponsors by Position</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {data.sponsorsByPosition.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="text-sm text-gray-400 mb-1 capitalize">{item.position}</div>
                    <div className="text-2xl font-bold text-white">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

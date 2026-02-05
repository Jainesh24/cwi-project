import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { 
  Trash2, 
  AlertTriangle, 
  DollarSign, 
  Leaf,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await wasteAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to delete all waste data? This action cannot be undone.')) {
      try {
        setResetting(true);
        await wasteAPI.resetData();
        await fetchStats();
        alert('All data has been reset successfully');
      } catch (error) {
        console.error('Error resetting data:', error);
        alert('Failed to reset data');
      } finally {
        setResetting(false);
      }
    }
  };

  // Transform trend data for chart
  const getTrendChartData = () => {
    if (!stats?.sevenDayTrend) return [];
    
    const dateMap = {};
    stats.sevenDayTrend.forEach(item => {
      const date = item._id.date;
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      
      if (!dateMap[dayName]) {
        dateMap[dayName] = { day: dayName };
      }
      dateMap[dayName][item._id.wasteType] = item.quantity;
    });

    return Object.values(dateMap);
  };

  const calculateSustainabilityScore = () => {
    if (!stats?.wasteComposition) return 82;
    
    const total = stats.wasteComposition.reduce((sum, item) => sum + item.quantity, 0);
    if (total === 0) return 82;
    
    const recyclable = stats.wasteComposition.find(item => item._id === 'Recyclable')?.quantity || 0;
    const general = stats.wasteComposition.find(item => item._id === 'General')?.quantity || 0;
    
    const recyclingRate = ((recyclable + general) / total) * 100;
    return Math.round(recyclingRate);
  };

  const calculateCostImpact = () => {
    if (!stats?.departmentPerformance) return 0;
    
    const totalKg = stats.departmentPerformance.reduce((sum, dept) => sum + dept.totalQuantity, 0);
    const avgCostPerKg = 2.5; // Default cost
    return Math.round(totalKg * avgCostPerKg);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const sustainabilityScore = calculateSustainabilityScore();
  const costImpact = calculateCostImpact();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clinical Waste Intelligence</h1>
          <p className="text-gray-500 mt-1">Real-time waste monitoring & risk analysis</p>
        </div>
        <button
          onClick={handleResetData}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
          Reset Data
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Waste */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">Total Waste Today</h3>
            <Trash2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {stats?.totalWasteToday?.toFixed(1) || '0.0'} kg
          </p>
          <div className="flex items-center gap-1 mt-2">
            {stats?.percentChange !== undefined && stats.percentChange !== 0 ? (
              <>
                {stats.percentChange > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm ${stats.percentChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(stats.percentChange)}% vs yesterday
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">No change</span>
            )}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-orange-900">Active Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-900">{stats?.activeAlerts || 0}</p>
          <p className="text-sm text-orange-600 mt-2">
            {stats?.activeAlerts === 0 ? 'All systems operating normally' : `${stats.activeAlerts} anomalies detected`}
          </p>
        </div>

        {/* Cost Impact */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">Cost Impact</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-900">${costImpact}</p>
          <p className="text-sm text-green-600 mt-2">Estimated disposal cost</p>
        </div>

        {/* Sustainability Score */}
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-purple-900">Sustainability Score</h3>
            <Leaf className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-900">{sustainabilityScore}%</p>
          <p className="text-sm text-purple-600 mt-2">Recycling compliance</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Waste Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">7-Day Waste Trend</h2>
          {getTrendChartData().length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getTrendChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="Infectious" 
                  stackId="1"
                  stroke="#06b6d4" 
                  fill="#06b6d4" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="Pharmaceutical" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="Sharps" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="General" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No waste data available
            </div>
          )}
        </div>

        {/* Active Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">Active Alerts</h2>
          </div>
          {stats?.activeAlerts > 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.activeAlerts}</p>
              <p className="text-sm text-gray-500 mt-1">Anomalies detected</p>
              <button
                onClick={() => navigate('/alerts')}
                className="mt-4 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                View all alerts →
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-800">No active alerts</p>
              <p className="text-sm text-gray-500 mt-1">All systems operating normally</p>
            </div>
          )}
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Performance</h2>
        {stats?.departmentPerformance && stats.departmentPerformance.length > 0 ? (
          <div className="space-y-4">
            {stats.departmentPerformance.map((dept) => {
              const expectedDaily = 50; // You can fetch this from baselines
              const performance = expectedDaily > 0 
                ? ((expectedDaily - dept.totalQuantity) / expectedDaily * 100).toFixed(1)
                : 0;
              const isOverPerforming = performance > 0;

              return (
                <div key={dept._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{dept._id}</h3>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        isOverPerforming 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {isOverPerforming ? '-' : '+'}{Math.abs(performance)}%
                      </span>
                      <span className="text-sm text-gray-500">{dept.alertCount || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{dept.totalQuantity.toFixed(1)} kg / {expectedDaily} kg expected</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        isOverPerforming ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((dept.totalQuantity / expectedDaily) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No department data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

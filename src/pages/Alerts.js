import React, { useState, useEffect } from 'react';
import { wasteAPI } from '../services/api';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await wasteAPI.getAlerts(filter);
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskColor = (score) => {
    if (score >= 70) return 'border-red-200 bg-red-50';
    if (score >= 50) return 'border-orange-200 bg-orange-50';
    return 'border-yellow-200 bg-yellow-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Alert Center</h1>
        <p className="text-gray-500">Monitor and manage waste intelligence alerts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-900">
                {alerts.filter(a => a.aiAnalysis?.anomalyDetected).length}
              </p>
              <p className="text-sm text-red-700">Active Alerts</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-900">0</p>
              <p className="text-sm text-orange-700">Acknowledged</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900">0</p>
              <p className="text-sm text-green-700">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {['Active', 'Acknowledged', 'Resolved', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab.toLowerCase())}
              className={`px-6 py-4 font-medium transition-colors ${
                filter === tab.toLowerCase()
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className={`bg-white rounded-xl border-2 p-6 ${getRiskColor(alert.aiAnalysis?.riskScore || 0)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      {alert.aiAnalysis?.alertMessage || 'Waste Anomaly Detected'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {alert.department} • {alert.wasteType} • {formatDate(alert.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    alert.aiAnalysis?.riskScore >= 70 
                      ? 'bg-red-500 text-white'
                      : alert.aiAnalysis?.riskScore >= 50
                      ? 'bg-orange-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {alert.aiAnalysis?.riskScore}/100
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-3">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Waste Details:</strong> {alert.quantity} kg of {alert.wasteType} from {alert.procedureCategory}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Disposal Method:</strong> {alert.disposalMethod} • <strong>Shift:</strong> {alert.shift}
                </p>
              </div>

              {alert.aiAnalysis?.assessment && (
                <div className="bg-white rounded-lg p-4 mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Assessment:</p>
                  <p className="text-sm text-gray-600">{alert.aiAnalysis.assessment}</p>
                </div>
              )}

              {alert.aiAnalysis?.recommendedAction && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm font-medium text-amber-900 mb-1">Recommended Action:</p>
                  <p className="text-sm text-amber-800 whitespace-pre-line">
                    {alert.aiAnalysis.recommendedAction}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No alerts found</h3>
            <p className="text-gray-500">All systems operating normally</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baselineAPI } from '../services/api';
import { logOut } from '../config/firebase';
import { Settings as SettingsIcon, Trash2, LogOut, Leaf } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [baselines, setBaselines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    department: '',
    expectedDaily: '',
    riskThreshold: '70',
    infectiousRatio: '30',
    sharpsRatio: '15',
    costPerKg: '2.5'
  });

  const departments = [
    'Emergency',
    'Surgery',
    'ICU',
    'Pediatrics',
    'Oncology',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'General Ward',
    'Outpatient'
  ];

  const fetchBaselines = async () => {
    try {
      setLoading(true);
      const response = await baselineAPI.getBaselines();
      setBaselines(response.data);
    } catch (error) {
      console.error('Error fetching baselines:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaselines();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await baselineAPI.saveBaseline(formData);
      
      // Reset form
      setFormData({
        department: '',
        expectedDaily: '',
        riskThreshold: '70',
        infectiousRatio: '30',
        sharpsRatio: '15',
        costPerKg: '2.5'
      });
      
      // Refresh baselines
      await fetchBaselines();
      alert('Baseline saved successfully');
      
    } catch (error) {
      console.error('Error saving baseline:', error);
      alert('Failed to save baseline');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (department) => {
    if (window.confirm(`Delete baseline for ${department}?`)) {
      try {
        await baselineAPI.deleteBaseline(department);
        await fetchBaselines();
      } catch (error) {
        console.error('Error deleting baseline:', error);
        alert('Failed to delete baseline');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const sustainabilityScore = 82; // Could be calculated from data

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-500">Configure department baselines and thresholds</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Sustainability Score */}
      <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 mb-6 border border-teal-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-800">Sustainability Score</p>
            <p className="text-4xl font-bold text-teal-900">{sustainabilityScore}%</p>
          </div>
          <div className="ml-auto">
            <div className="relative w-24 h-24">
              <svg className="transform -rotate-90 w-24 h-24">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#d1fae5"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#14b8a6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(sustainabilityScore / 100) * 251.2} 251.2`}
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Baseline Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-teal-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Add Department Baseline</h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Set expected waste levels and risk thresholds for AI analysis
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Daily (kg)
                </label>
                <input
                  type="number"
                  name="expectedDaily"
                  value={formData.expectedDaily}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="e.g., 50"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Threshold (0-100)
                </label>
                <input
                  type="number"
                  name="riskThreshold"
                  value={formData.riskThreshold}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="e.g., 70"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Infectious Ratio (%)
                </label>
                <input
                  type="number"
                  name="infectiousRatio"
                  value={formData.infectiousRatio}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="e.g., 30"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sharps Ratio (%)
                </label>
                <input
                  type="number"
                  name="sharpsRatio"
                  value={formData.sharpsRatio}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="e.g., 15"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per kg ($)
              </label>
              <input
                type="number"
                name="costPerKg"
                value={formData.costPerKg}
                onChange={handleChange}
                step="0.1"
                min="0"
                placeholder="e.g., 2.5"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Baseline'}
            </button>
          </form>
        </div>

        {/* Department Baselines List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Department Baselines</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : baselines.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {baselines.map((baseline) => (
                <div
                  key={baseline._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{baseline.department}</h3>
                    <button
                      onClick={() => handleDelete(baseline.department)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">
                      Daily: <span className="font-medium text-gray-800">{baseline.expectedDaily} kg</span>
                    </p>
                    <p className="text-gray-600">
                      Threshold: <span className="font-medium text-gray-800">{baseline.riskThreshold}</span>
                    </p>
                    <p className="text-gray-600">
                      Cost: <span className="font-medium text-gray-800">${baseline.costPerKg}/kg</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              No baselines configured yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

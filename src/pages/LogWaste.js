import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { Clipboard, Sparkles } from 'lucide-react';

const LogWaste = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const [formData, setFormData] = useState({
    department: '',
    wasteType: '',
    quantity: '',
    procedureCategory: '',
    disposalMethod: '',
    shift: '',
    notes: ''
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

  const wasteTypes = [
    'Infectious',
    'Pharmaceutical',
    'Sharps',
    'Chemical',
    'Radioactive',
    'General',
    'Recyclable'
  ];

  const procedureCategories = [
    'Routine Care',
    'Minor Procedure',
    'Major Surgery',
    'Diagnostic',
    'Treatment',
    'Emergency Response',
    'Chemotherapy',
    'Dialysis'
  ];

  const disposalMethods = [
    'Incineration',
    'Autoclave',
    'Chemical Treatment',
    'Secure Landfill',
    'Recycling',
    'Special Handling'
  ];

  const shifts = ['Morning', 'Afternoon', 'Night'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await wasteAPI.logWaste(formData);
      
      setAiAnalysis(response.data.aiAnalysis);
      setShowAnalysis(true);

    } catch (error) {
      console.error('Error logging waste:', error);
      alert('Failed to log waste entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogAnother = () => {
    setFormData({
      department: '',
      wasteType: '',
      quantity: '',
      procedureCategory: '',
      disposalMethod: '',
      shift: '',
      notes: ''
    });
    setShowAnalysis(false);
    setAiAnalysis(null);
  };

  if (showAnalysis && aiAnalysis) {
    const getRiskColor = (score) => {
      if (score >= 70) return 'bg-red-50 border-red-200 text-red-800';
      if (score >= 50) return 'bg-orange-50 border-orange-200 text-orange-800';
      return 'bg-green-50 border-green-200 text-green-800';
    };

    const getRiskBadge = (score) => {
      if (score >= 70) return { text: 'High Risk', color: 'bg-red-500' };
      if (score >= 50) return { text: 'Medium Risk', color: 'bg-orange-500' };
      return { text: 'Low Risk', color: 'bg-green-500' };
    };

    const badge = getRiskBadge(aiAnalysis.riskScore);

    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI Analysis Results</h2>
          </div>

          {/* Risk Score */}
          <div className={`rounded-xl p-6 border-2 mb-6 ${getRiskColor(aiAnalysis.riskScore)}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium opacity-70">Risk Score</p>
                <p className="text-5xl font-bold mt-1">{aiAnalysis.riskScore}/100</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-white font-medium ${badge.color}`}>
                {badge.text}
              </span>
            </div>
          </div>

          {/* Assessment */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Assessment</h3>
            <p className="text-gray-700 leading-relaxed">{aiAnalysis.assessment}</p>
          </div>

          {/* Recommended Action */}
          <div className="bg-amber-50 rounded-xl p-6 mb-6 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-3">Recommended Action</h3>
            <div className="text-amber-800 whitespace-pre-line">{aiAnalysis.recommendedAction}</div>
          </div>

          {/* Alert Message */}
          {aiAnalysis.alertMessage && (
            <div className="bg-red-50 rounded-xl p-4 mb-6 border border-red-200 flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-semibold text-red-900 mb-1">Alert Created: {aiAnalysis.alertMessage}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleViewDashboard}
              className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
            >
              View Dashboard
            </button>
            <button
              onClick={handleLogAnother}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Log Another Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Log Waste Entry</h1>
          <p className="text-gray-500">Record clinical waste with AI-powered risk analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Waste Details Section */}
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Clipboard className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-semibold text-gray-800">Waste Details</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">Enter waste information for AI analysis and risk scoring</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Waste Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="wasteType"
                  value={formData.wasteType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select waste type</option>
                  {wasteTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  placeholder="Enter weight in kg"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Procedure Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Procedure Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="procedureCategory"
                  value={formData.procedureCategory}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select procedure</option>
                  {procedureCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Disposal Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disposal Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="disposalMethod"
                  value={formData.disposalMethod}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select method</option>
                  {disposalMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>

              {/* Shift */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift <span className="text-red-500">*</span>
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select shift</option>
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional observations..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 text-white py-4 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Clipboard className="w-5 h-5" />
                Log Waste Entry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogWaste;

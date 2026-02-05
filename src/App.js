import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LogWaste from './pages/LogWaste';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route - Login */}
          <Route path="/" element={<Login />} />

          {/* Private Routes with Sidebar */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
                    <Dashboard />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/log-waste"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
                    <LogWaste />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
                    <Alerts />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <div className="flex">
                  <Sidebar />
                  <div className="ml-64 flex-1 bg-gray-50 min-h-screen">
                    <Settings />
                  </div>
                </div>
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

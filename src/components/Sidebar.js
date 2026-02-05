import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, ClipboardList, AlertTriangle, Settings, Leaf } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/log-waste',
      icon: ClipboardList,
      label: 'Log Waste'
    },
    {
      path: '/alerts',
      icon: AlertTriangle,
      label: 'Alerts'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Settings'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">CWI</h1>
            <p className="text-xs text-gray-500">Clinical Waste Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : ''}`} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Sustainability Score */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-4 border border-teal-100">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-teal-600" />
            <p className="text-xs font-medium text-teal-800">Sustainability Score</p>
          </div>
          <p className="text-2xl font-bold text-teal-900">82%</p>
          <div className="mt-2 w-full bg-teal-200 rounded-full h-1.5">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

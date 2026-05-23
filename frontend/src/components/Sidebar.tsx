import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Wallet,
  Activity,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/wallets', icon: Wallet, label: 'Wallets' },
  { path: '/activity', icon: Activity, label: 'Activity' },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-amber-100 z-40 transition-all duration-300 shadow-[4px_0_20px_rgba(217,119,6,0.06)] ${
        collapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-amber-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
          <span className="text-xl">🪂</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-heading font-bold text-gray-900">Airdrop</h1>
            <p className="text-xs text-amber-600 font-medium">Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100/50 text-amber-700 shadow-sm'
                  : 'text-gray-500 hover:bg-amber-50/50 hover:text-amber-600'
              }`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-amber-500' : ''}
              />
              {!collapsed && (
                <span className={`font-medium animate-fade-in ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 w-1 h-8 rounded-r-full bg-amber-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-amber-50">
        <div className={`flex items-center gap-3 px-3 py-2 text-gray-400 rounded-xl hover:bg-amber-50/50 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <Settings size={18} />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-end'} px-3 py-2 mt-2 text-gray-400 hover:text-amber-600 transition-colors`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};
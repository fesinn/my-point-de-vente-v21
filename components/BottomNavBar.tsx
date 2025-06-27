
import React from 'react';
import Icon from './Icon';
import { AppView, User, UserRole } from '../types';

interface BottomNavBarProps {
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  user: User | null;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onNavigate, currentView, user }) => {
  
  const navItems = [
    { id: AppView.POS, label: 'Caisse', icon: 'PriceCheckIcon' },
    { id: AppView.MANAGEMENT, label: 'Gestion', icon: 'SettingsIcon', requiredRole: UserRole.Admin },
    { id: AppView.FINANCIAL, label: 'Financier', icon: 'FinancialIcon' },
  ];

  if (!user) return null;

  const visibleNavItems = navItems.filter(item => {
    if (item.requiredRole) {
      return user.role === item.requiredRole;
    }
    return true;
  });

  return (
    <nav className="bg-gray-800 text-white p-2 shadow-inner_top fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around items-center">
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppView)}
            className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/3 ${
                currentView === item.id ? 'bg-sky-600' : 'hover:bg-gray-700'
            }`}
            aria-label={item.label}
            aria-current={currentView === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} className="w-6 h-6 mb-0.5" />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
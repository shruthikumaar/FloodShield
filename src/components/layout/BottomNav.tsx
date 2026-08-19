import { NavLink } from 'react-router-dom';
import { Home, Map as MapIcon, ShieldPlus, CloudRain, Bell } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { path: '/app/safety', icon: Home, label: 'Home' },
    { path: '/app/map', icon: MapIcon, label: 'Map' }, // Map is integrated into safety for now, or a separate full screen
    { path: '/app/shelters', icon: ShieldPlus, label: 'Shelters' },
    { path: '/app/weather', icon: CloudRain, label: 'Weather' },
    { path: '/app/alerts', icon: Bell, label: 'Alerts' },
  ];

  return (
    <div className="bg-[#1e293b] border-t border-slate-700 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-300'
              }`
            }
          >
            <item.icon size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

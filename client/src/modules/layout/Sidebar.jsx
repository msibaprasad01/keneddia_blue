// Sidebar.jsx
import React, { useState } from 'react';
import { colors } from '../../lib/colors/colors';
import { 
  Home, 
  MapPin, 
  Users, 
  Building2, 
  Coffee, 
  UtensilsCrossed, 
  Wine,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

function Sidebar() {
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    { icon: Home, label: 'Homepage', path: '/', active: true },
    { icon: MapPin, label: 'Location', path: '/location' },
    { icon: Users, label: 'Manage Users', path: '/users' },
    { 
      icon: Building2, 
      label: 'Hotel', 
      path: '/hotel',
      hasSubmenu: true,
      submenu: ['Rooms', 'Amenities', 'Bookings']
    },
    { 
      icon: Coffee, 
      label: 'Cafe', 
      path: '/cafe',
      hasSubmenu: true,
      submenu: ['Menu', 'Orders', 'Tables']
    },
    { 
      icon: UtensilsCrossed, 
      label: 'Restaurant', 
      path: '/restaurant',
      hasSubmenu: true,
      submenu: ['Menu', 'Reservations', 'Orders']
    },
    { 
      icon: Wine, 
      label: 'Wine & Dine', 
      path: '/wine-dine',
      hasSubmenu: true,
      submenu: ['Wine List', 'Packages', 'Events']
    },
  ];

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <div 
      className="w-60 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto"
      style={{ backgroundColor: colors.sidebarBg }}
    >
      {/* Logo/Brand Section */}
      <div 
        className="p-5 border-b"
        style={{ borderColor: colors.sidebarActive }}
      >
        <h2 
          className="text-lg font-semibold m-0"
          style={{ color: colors.sidebarText }}
        >
          Hotel Kennedia
        </h2>
      </div>

      {/* User Profile */}
      <div 
        className="p-5 flex items-center gap-3 border-b relative"
        style={{ borderColor: colors.sidebarActive }}
      >
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.sidebarActive }}
        >
          <span className="text-xl">👋</span>
        </div>
        <div className="flex-1">
          <div 
            className="text-xs"
            style={{ color: colors.sidebarTextSecondary }}
          >
            Hello 👋
          </div>
          <div 
            className="text-sm font-medium mt-0.5"
            style={{ color: colors.sidebarText }}
          >
            Balaram Sikdar
          </div>
        </div>
        <div 
          className="w-2 h-2 rounded-full absolute top-6 right-5"
          style={{ backgroundColor: colors.success }}
        ></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-5">
        {menuItems.map((item) => (
          <div key={item.label}>
            <div
              className={`flex items-center px-5 py-3 cursor-pointer transition-all gap-3 relative ${
                item.active ? 'border-l-[3px]' : ''
              }`}
              style={{ 
                color: colors.sidebarText,
                backgroundColor: item.active ? colors.sidebarActive : 'transparent',
                borderColor: item.active ? colors.primary : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = colors.sidebarHover;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
              onClick={() => item.hasSubmenu && toggleMenu(item.label)}
            >
              <item.icon size={20} className="min-w-[20px]" />
              <span className="text-sm flex-1">{item.label}</span>
              {item.hasSubmenu && (
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${
                    expandedMenus[item.label] ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              )}
            </div>
            
            {/* Submenu */}
            {item.hasSubmenu && expandedMenus[item.label] && (
              <div 
                className="pl-[52px]"
                style={{ backgroundColor: colors.sidebarActive }}
              >
                {item.submenu.map((subItem) => (
                  <div 
                    key={subItem} 
                    className="py-2 px-5 text-[13px] cursor-pointer transition-colors"
                    style={{ color: colors.sidebarTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.sidebarText;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.sidebarTextSecondary;
                    }}
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div 
        className="border-t py-5"
        style={{ borderColor: colors.sidebarActive }}
      >
        <div 
          className="flex items-center px-5 py-3 cursor-pointer transition-all gap-3"
          style={{ color: colors.sidebarText }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.sidebarHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Settings size={20} className="min-w-[20px]" />
          <span className="text-sm">Settings</span>
        </div>
        <div 
          className="flex items-center px-5 py-3 cursor-pointer transition-all gap-3"
          style={{ color: colors.sidebarText }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.sidebarHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} className="min-w-[20px]" />
          <span className="text-sm">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
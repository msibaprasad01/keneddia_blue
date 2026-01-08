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
  ChevronDown,
  X,
  LayoutDashboard,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Sidebar({ role = 'admin', isOpen, onToggle }) {
  const [expandedMenus, setExpandedMenus] = useState({});

  // Role-based menu items
  const getMenuItemsByRole = (userRole) => {
    const superAdminMenus = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: Home, label: 'Homepage', path: '/', active: true },
      { icon: MapPin, label: 'Location', path: '/location' },
      { icon: Users, label: 'Manage Users', path: '/users' },
      { icon: BarChart3, label: 'Analytics', path: '/analytics' },
      { 
        icon: Building2, 
        label: 'Hotel', 
        path: '/hotel',
        hasSubmenu: true,
        submenu: ['Rooms', 'Amenities', 'Bookings', 'Pricing']
      },
      { 
        icon: Coffee, 
        label: 'Cafe', 
        path: '/cafe',
        hasSubmenu: true,
        submenu: ['Menu', 'Orders', 'Tables', 'Inventory']
      },
      { 
        icon: UtensilsCrossed, 
        label: 'Restaurant', 
        path: '/restaurant',
        hasSubmenu: true,
        submenu: ['Menu', 'Reservations', 'Orders', 'Kitchen']
      },
      { 
        icon: Wine, 
        label: 'Wine & Dine', 
        path: '/wine-dine',
        hasSubmenu: true,
        submenu: ['Wine List', 'Packages', 'Events']
      },
      { icon: FileText, label: 'Reports', path: '/reports' },
    ];

    const adminMenus = [
      { icon: Home, label: 'Homepage', path: '/', active: true },
      { icon: MapPin, label: 'Location', path: '/location' },
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
        submenu: ['Wine List', 'Events']
      },
    ];

    return userRole === 'superadmin' ? superAdminMenus : adminMenus;
  };

  const menuItems = getMenuItemsByRole(role);

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const getRoleBadge = (userRole) => {
    return userRole === 'superadmin' ? 'Super Admin' : 'Admin';
  };

  const getRoleBadgeColor = (userRole) => {
    return userRole === 'superadmin' ? colors.primary : colors.info;
  };

  return (
    <>
      {/* Overlay for mobile only */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`w-60 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: colors.sidebarBg }}
      >
        {/* Logo/Brand Section with Close Button */}
        <div 
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: colors.sidebarActive }}
        >
          <h2 
            className="text-lg font-semibold m-0"
            style={{ color: colors.sidebarText }}
          >
            Hotel Kennedia
          </h2>
          {/* Close button for both mobile and desktop */}
          <button
            onClick={onToggle}
            className="p-1 rounded transition-colors"
            style={{ color: colors.sidebarText }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.sidebarHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* User Profile with Role */}
        <div 
          className="p-5 flex items-center gap-3 border-b relative"
          style={{ borderColor: colors.sidebarActive }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: colors.sidebarActive }}
          >
            <span className="text-xl">👋</span>
          </div>
          <div className="flex-1 min-w-0">
            <div 
              className="text-xs"
              style={{ color: colors.sidebarTextSecondary }}
            >
              Hello 👋
            </div>
            <div 
              className="text-sm font-medium mt-0.5 truncate"
              style={{ color: colors.sidebarText }}
            >
              Balaram Sikdar
            </div>
            <div 
              className="text-[10px] font-medium mt-1 px-2 py-0.5 rounded inline-block"
              style={{ 
                backgroundColor: getRoleBadgeColor(role) + '20',
                color: getRoleBadgeColor(role)
              }}
            >
              {getRoleBadge(role)}
            </div>
          </div>
          <div 
            className="w-2 h-2 rounded-full absolute top-6 right-5"
            style={{ backgroundColor: colors.success }}
          ></div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-5 overflow-y-auto">
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
                <item.icon size={20} className="min-w-5 shrink-0" />
                <span className="text-sm flex-1 truncate">{item.label}</span>
                {item.hasSubmenu && (
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform shrink-0 ${
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
                      className="py-2 px-5 text-[13px] cursor-pointer transition-colors truncate"
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
            <Settings size={20} className="min-w-5 shrink-0" />
            <span className="text-sm truncate">Settings</span>
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
            <LogOut size={20} className="min-w-5 shrink-0" />
            <span className="text-sm truncate">Logout</span>
          </div>
        </div>
      </div>

      {/* Toggle Button when Sidebar is Closed (Desktop) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-r-lg shadow-lg transition-all items-center justify-center"
          style={{ 
            backgroundColor: colors.sidebarBg,
            color: colors.sidebarText
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.sidebarHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.sidebarBg;
          }}
        >
          <ChevronRight size={20} />
        </button>
      )}
    </>
  );
}

export default Sidebar;
// Navbar.jsx
import React from 'react';
import { colors } from '@/lib/colors/colors';
import { Save, Eye } from 'lucide-react';

function Navbar({ title, subtitle, showActions = true }) {
  return (
    <div 
      className="flex justify-between items-start p-6 border-b"
      style={{ 
        backgroundColor: colors.contentBg,
        borderColor: colors.border 
      }}
    >
      <div className="flex-1">
        <h1 
          className="text-[28px] font-semibold m-0 mb-1"
          style={{ color: colors.textPrimary }}
        >
          {title}
        </h1>
        <p 
          className="text-sm m-0"
          style={{ color: colors.textSecondary }}
        >
          {subtitle}
        </p>
      </div>
      
      {showActions && (
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 border-none rounded-md text-sm font-medium cursor-pointer transition-colors"
            style={{ 
              backgroundColor: colors.buttonGray,
              color: colors.sidebarText 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonGrayHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonGray;
            }}
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 border-none rounded-md text-sm font-medium cursor-pointer transition-colors"
            style={{ 
              backgroundColor: colors.buttonGreen,
              color: colors.sidebarText 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonGreenHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonGreen;
            }}
          >
            <Eye size={16} />
            <span>Preview Site</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
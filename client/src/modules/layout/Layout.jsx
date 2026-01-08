// Layout.jsx
import React from 'react';
import { colors } from '@/lib/colors/colors';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout({ children, title, subtitle, showActions = true }) {
  return (
    <div 
      className="flex min-h-screen"
      style={{ backgroundColor: colors.mainBg }}
    >
      <Sidebar />
      
      <div className="ml-60 flex-1 flex flex-col">
        {(title || subtitle) && (
          <Navbar 
            title={title}
            subtitle={subtitle}
            showActions={showActions}
          />
        )}
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
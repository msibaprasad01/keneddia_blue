// components/KennediaGroup.jsx
import React from 'react';
import { colors } from "@/lib/colors/colors";

function KennediaGroup() {
  return (
    <div 
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: colors.contentBg }}
    >
      <h2 
        className="text-xl font-semibold m-0 mb-4"
        style={{ color: colors.textPrimary }}
      >
        Kennedia Group
      </h2>
      <p style={{ color: colors.textSecondary }}>
        Configure Kennedia Group content here...
      </p>
    </div>
  );
}

export default KennediaGroup;
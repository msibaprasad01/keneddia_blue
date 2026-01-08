// components/AboutUs.jsx
import React from 'react';
import { colors } from "@/lib/colors/colors";

function AboutUs() {
  return (
    <div 
      className="rounded-lg p-6 shadow-sm"
      style={{ backgroundColor: colors.contentBg }}
    >
      <h2 
        className="text-xl font-semibold m-0 mb-4"
        style={{ color: colors.textPrimary }}
      >
        About Us
      </h2>
      <p style={{ color: colors.textSecondary }}>
        Configure about us content here...
      </p>
    </div>
  );
}

export default AboutUs;
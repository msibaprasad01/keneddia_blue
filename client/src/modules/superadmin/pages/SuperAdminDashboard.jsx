// SuperAdminDashboard.jsx
import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import Layout from '@/modules/layout/Layout';
import { 
  Upload, 
  Home, 
  DollarSign, 
  Building, 
  Info, 
  Building2, 
  Calendar, 
  Newspaper, 
  Star 
} from 'lucide-react';

function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState({
    mainTitle: 'Where Luxury Meets Experience',
    subtitle: 'KENNEDIA BLU GROUP',
    buttonText: 'Explore →',
  });

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: Home },
    { id: 'offers', label: 'Daily Offers', icon: DollarSign },
    { id: 'properties', label: 'Our Properties', icon: Building },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'kennedia', label: 'Kennedia Group', icon: Building2 },
    { id: 'events', label: 'Upcoming Events', icon: Calendar },
    { id: 'news', label: 'News & Press', icon: Newspaper },
    { id: 'guest', label: 'Guest Exp', icon: Star },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Layout 
      title="Home Page Management"
      subtitle="Control what visitors see on your hotel's homepage"
    >
      {/* Tab Navigation */}
      <div 
        className="flex gap-1 px-8 border-b overflow-x-auto sticky top-0 z-10"
        style={{ 
          backgroundColor: colors.contentBg,
          borderColor: colors.border 
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="flex items-center gap-2 px-4 py-3 bg-transparent border-none border-b-[3px] text-[13px] font-medium cursor-pointer transition-all whitespace-nowrap"
            style={{
              color: activeTab === tab.id ? colors.primary : colors.textSecondary,
              borderColor: activeTab === tab.id ? colors.primary : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = colors.textPrimary;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = colors.textSecondary;
              }
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="p-6">
        <div 
          className="rounded-lg p-6 shadow-sm"
          style={{ backgroundColor: colors.contentBg }}
        >
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="flex flex-col gap-5">
              <h2 
                className="text-xl font-semibold m-0 mb-2"
                style={{ color: colors.textPrimary }}
              >
                Hero Section
              </h2>
              
              <div className="flex flex-col gap-2">
                <label 
                  className="text-[13px] font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Main Title
                </label>
                <input
                  type="text"
                  value={formData.mainTitle}
                  onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                  className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label 
                  className="text-[13px] font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label 
                  className="text-[13px] font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Call-to-Action Button Text
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  className="px-3 py-2.5 border rounded-md text-sm outline-none transition-colors"
                  style={{ 
                    borderColor: colors.border,
                    color: colors.textPrimary 
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border;
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label 
                  className="text-[13px] font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Background Image/Video
                </label>
                <button 
                  className="flex items-center gap-2 px-4 py-2.5 border-none rounded-md text-sm font-medium cursor-pointer transition-colors w-fit"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.sidebarText 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                >
                  <Upload size={16} />
                  <span>Upload</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label 
                  className="text-[13px] font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Add Sub Image/Video
                </label>
                <button 
                  className="flex items-center gap-2 px-4 py-2.5 border-none rounded-md text-sm font-medium cursor-pointer transition-colors w-fit"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: colors.sidebarText 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                  }}
                >
                  <Upload size={16} />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="flex flex-col gap-3">
              <h3 
                className="text-base font-semibold m-0"
                style={{ color: colors.textPrimary }}
              >
                Preview
              </h3>
              <div 
                className="w-full h-[400px] rounded-lg flex items-center justify-center relative overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800')"
                }}
              >
                <div className="text-center p-10 z-10">
                  <h1 
                    className="text-[32px] font-bold m-0 mb-2"
                    style={{ 
                      color: colors.sidebarText,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {formData.mainTitle}
                  </h1>
                  <p 
                    className="text-sm font-medium m-0 mb-6 tracking-[2px]"
                    style={{ color: colors.sidebarText }}
                  >
                    {formData.subtitle}
                  </p>
                  <button 
                    className="px-8 py-3 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors"
                    style={{ 
                      backgroundColor: colors.primary,
                      color: colors.sidebarText 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primaryHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                    }}
                  >
                    {formData.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SuperAdminDashboard;
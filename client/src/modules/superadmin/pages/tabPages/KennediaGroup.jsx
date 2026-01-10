import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

function KennediaGroup() {
  const [headerSettings, setHeaderSettings] = useState({
    mainTitle: 'Kennedia Group',
    subtitle: 'A Diverse ecosystem of luxury hospitality brands'
  });

  const [centerLogoSettings, setCenterLogoSettings] = useState({
    logoText: 'KB',
    subtext: 'Group'
  });

  const [businessDivisions, setBusinessDivisions] = useState([
    {
      id: 1,
      icon: 'Hotel',
      title: 'Hotels & Resorts',
      description: 'Luxury stays globally',
      order: 1
    }
  ]);

  const handleAddDivision = () => {
    const newDivision = {
      id: Date.now(),
      icon: '',
      title: '',
      description: '',
      order: businessDivisions.length + 1
    };
    setBusinessDivisions([...businessDivisions, newDivision]);
  };

  const handleDeleteDivision = (id) => {
    setBusinessDivisions(businessDivisions.filter(d => d.id !== id));
  };

  const handleDivisionChange = (id, field, value) => {
    setBusinessDivisions(businessDivisions.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  return (
    <div className="space-y-3">
      {/* Header Settings */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <h3 
          className="text-sm font-semibold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Header Settings
        </h3>

        <div className="space-y-3">
          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Main Title
            </label>
            <input
              type="text"
              value={headerSettings.mainTitle}
              onChange={(e) => setHeaderSettings({...headerSettings, mainTitle: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="Kennedia Group"
            />
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Subtitle
            </label>
            <input
              type="text"
              value={headerSettings.subtitle}
              onChange={(e) => setHeaderSettings({...headerSettings, subtitle: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="A Diverse ecosystem of luxury hospitality brands"
            />
          </div>
        </div>
      </div>

      {/* Center Logo Settings */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <h3 
          className="text-sm font-semibold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Center Logo Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Logo Text
            </label>
            <input
              type="text"
              value={centerLogoSettings.logoText}
              onChange={(e) => setCenterLogoSettings({...centerLogoSettings, logoText: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="KB"
            />
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Subtext
            </label>
            <input
              type="text"
              value={centerLogoSettings.subtext}
              onChange={(e) => setCenterLogoSettings({...centerLogoSettings, subtext: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="Group"
            />
          </div>
        </div>
      </div>

      {/* Business Divisions */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Business Divisions
          </h3>
          <button
            onClick={handleAddDivision}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
          >
            <Plus size={16} />
            Add Division
          </button>
        </div>

        <div className="space-y-3">
          {businessDivisions.map((division, index) => (
            <div
              key={division.id}
              className="rounded-lg p-4 border"
              style={{ 
                backgroundColor: colors.mainBg,
                borderColor: colors.border
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Icon
                  </label>
                  <input
                    type="text"
                    value={division.icon}
                    onChange={(e) => handleDivisionChange(division.id, 'icon', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Hotel"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={division.title}
                    onChange={(e) => handleDivisionChange(division.id, 'title', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Hotels & Resorts"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    value={division.description}
                    onChange={(e) => handleDivisionChange(division.id, 'description', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Luxury stays globally"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Order
                  </label>
                  <input
                    type="number"
                    value={division.order}
                    onChange={(e) => handleDivisionChange(division.id, 'order', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => handleDeleteDivision(division.id)}
                  className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: colors.danger,
                    color: '#ffffff'
                  }}
                >
                  <Trash2 size={14} className="inline mr-1" />
                </button>
              </div>

              {/* Navigation Arrows */}
              {index < businessDivisions.length - 1 && (
                <div className="flex justify-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                  <button
                    className="p-1.5 rounded border"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg
                    }}
                  >
                    <ChevronLeft size={16} style={{ color: colors.textSecondary }} />
                  </button>
                  <button
                    className="p-1.5 rounded border"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg
                    }}
                  >
                    <ChevronRight size={16} style={{ color: colors.textSecondary }} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KennediaGroup;
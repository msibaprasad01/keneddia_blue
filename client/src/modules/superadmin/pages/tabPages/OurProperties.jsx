import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Trash2, ChevronLeft, ChevronRight, Upload } from 'lucide-react';

function OurProperties() {
  const [properties, setProperties] = useState([
    {
      id: 1,
      propertyName: 'Kennedia Blu Bengaluru',
      locationName: 'Connaught Place, Delhi',
      rating: '4.8',
      type: 'Hotel',
      image: null,
      buttonTitle1: 'Details',
      buttonTitleURL1: 'ww.mmmmmmmmmm.com',
      buttonTitle2: 'Book Details',
      buttonTitleLink2: 'ww.sssssssssss.com'
    }
  ]);

  const [sectionTitle, setSectionTitle] = useState('Explore Our Properties');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddProperty = () => {
    const newProperty = {
      id: Date.now(),
      propertyName: '',
      locationName: '',
      rating: '',
      type: 'Hotel',
      image: null,
      buttonTitle1: '',
      buttonTitleURL1: '',
      buttonTitle2: '',
      buttonTitleLink2: ''
    };
    setProperties([...properties, newProperty]);
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handlePropertyChange = (id, field, value) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div>
      {/* Section Settings */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm mb-3"
        style={{ backgroundColor: colors.contentBg }}
      >
        <h3 
          className="text-sm font-semibold mb-3"
          style={{ color: colors.textPrimary }}
        >
          Section Settings
        </h3>
        
        <div>
          <label 
            className="block text-xs font-medium mb-1.5"
            style={{ color: colors.textSecondary }}
          >
            Section Title
          </label>
          <input
            type="text"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full px-3 py-2 rounded border text-sm"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.mainBg,
              color: colors.textPrimary
            }}
            placeholder="Explore Our Properties"
          />
        </div>
      </div>

      {/* Properties Section */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Properties
          </h3>
          <button
            onClick={handleAddProperty}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>

        {/* Properties List */}
        <div className="space-y-4">
          {properties.map((property, index) => (
            <div
              key={property.id}
              className="rounded-lg p-4 border"
              style={{ 
                backgroundColor: colors.mainBg,
                borderColor: colors.border
              }}
            >
              {/* Property Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Property Name
                  </label>
                  <input
                    type="text"
                    value={property.propertyName}
                    onChange={(e) => handlePropertyChange(property.id, 'propertyName', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Kennedia Blu Bengaluru"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={property.locationName}
                    onChange={(e) => handlePropertyChange(property.id, 'locationName', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Connaught Place, Delhi"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Rating
                  </label>
                  <input
                    type="text"
                    value={property.rating}
                    onChange={(e) => handlePropertyChange(property.id, 'rating', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="4.8"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Type
                  </label>
                  <select
                    value={property.type}
                    onChange={(e) => handlePropertyChange(property.id, 'type', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                  >
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                  </select>
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`image-${property.id}`}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handlePropertyChange(property.id, 'image', file.name);
                        }
                      }}
                    />
                    <label
                      htmlFor={`image-${property.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-2.5 py-1.5 rounded border text-xs cursor-pointer"
                      style={{ 
                        borderColor: colors.border,
                        backgroundColor: colors.contentBg,
                        color: colors.textSecondary
                      }}
                    >
                      <Upload size={14} />
                      <span className="truncate">
                        {property.image || 'Upload File'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Button URLs Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Button Title
                  </label>
                  <input
                    type="text"
                    value={property.buttonTitle1}
                    onChange={(e) => handlePropertyChange(property.id, 'buttonTitle1', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Details"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Button Title URL
                  </label>
                  <input
                    type="text"
                    value={property.buttonTitleURL1}
                    onChange={(e) => handlePropertyChange(property.id, 'buttonTitleURL1', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="ww.mmmmmmmmmm.com"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Button Title
                  </label>
                  <input
                    type="text"
                    value={property.buttonTitle2}
                    onChange={(e) => handlePropertyChange(property.id, 'buttonTitle2', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="Book Details"
                  />
                </div>

                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Button Title Link
                  </label>
                  <input
                    type="text"
                    value={property.buttonTitleLink2}
                    onChange={(e) => handlePropertyChange(property.id, 'buttonTitleLink2', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder="ww.sssssssssss.com"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: colors.danger,
                    color: '#ffffff'
                  }}
                >
                  <Trash2 size={14} className="inline mr-1" />
                  Delete
                </button>
                <button
                  className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff'
                  }}
                >
                  Save
                </button>
              </div>

              {/* Navigation Arrows (shown between properties) */}
              {index < properties.length - 1 && (
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

export default OurProperties;
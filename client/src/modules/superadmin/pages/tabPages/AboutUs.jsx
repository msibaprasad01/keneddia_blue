import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Upload, Trash2 } from 'lucide-react';

function AboutUs() {
  const [basicInfo, setBasicInfo] = useState({
    sectionTitle: 'About Kennedia Blu',
    subTitle: 'Kennedia Blu',
    description: 'Kennedia Blu is built on trust and excellence, delivering premium hospitality experiences that exceed customer expectations. Redefining luxury hospitality with a commitment to excellence, comfort, and authentic experiences.'
  });

  const [videoSection, setVideoSection] = useState({
    videoURL: 'https://www.youtube.com/embed/example',
    videoTitle: 'Dr. Jay Prakash – Kennedia Blu Cafe Wins Excellence in ...',
    buttonText: 'More Details →',
    buttonURL: 'www.gggggggggggggggggg.com'
  });

  const [ventures, setVentures] = useState([
    { id: 1, name: 'HOTEL', logo: 'hotel-logo.png' },
    { id: 2, name: 'RESTAURANT', logo: 'restaurant-logo.png' },
    { id: 3, name: 'CAFE', logo: 'cafe-logo.png' },
    { id: 4, name: 'LIQUOR SHOP', logo: 'liquor-logo.png' }
  ]);

  const [recognitions, setRecognitions] = useState([
    { id: 1, title: '98/100', subtitle: 'GOLD LIST 2024', badge: 'CONE NAST TRAVELLER' },
    { id: 2, title: '5.0', subtitle: '5 STAR RATING', badge: '5 STAR RATING' },
    { id: 3, title: '3 Keys', subtitle: 'LUXURY KEYS', badge: 'LUXURY KEYS' }
  ]);

  const handleAddVenture = () => {
    setVentures([...ventures, { id: Date.now(), name: '', logo: null }]);
  };

  const handleDeleteVenture = (id) => {
    setVentures(ventures.filter(v => v.id !== id));
  };

  const handleAddRecognition = () => {
    setRecognitions([...recognitions, { id: Date.now(), title: '', subtitle: '', badge: '' }]);
  };

  const handleDeleteRecognition = (id) => {
    setRecognitions(recognitions.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Basic Information */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <h3 
          className="text-sm font-semibold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Basic Information
        </h3>

        <div className="space-y-3">
          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Section Title
            </label>
            <input
              type="text"
              value={basicInfo.sectionTitle}
              onChange={(e) => setBasicInfo({...basicInfo, sectionTitle: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            />
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Sub Title
            </label>
            <input
              type="text"
              value={basicInfo.subTitle}
              onChange={(e) => setBasicInfo({...basicInfo, subTitle: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            />
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Description
            </label>
            <textarea
              value={basicInfo.description}
              onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 rounded border text-sm resize-none"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            />
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <h3 
          className="text-sm font-semibold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Video Section
        </h3>

        <div className="space-y-3">
          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Video URL
            </label>
            <input
              type="text"
              value={videoSection.videoURL}
              onChange={(e) => setVideoSection({...videoSection, videoURL: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="https://www.youtube.com/embed/example"
            />
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Video Title
            </label>
            <input
              type="text"
              value={videoSection.videoTitle}
              onChange={(e) => setVideoSection({...videoSection, videoTitle: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                Button Text
              </label>
              <input
                type="text"
                value={videoSection.buttonText}
                onChange={(e) => setVideoSection({...videoSection, buttonText: e.target.value})}
                className="w-full px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
              />
            </div>

            <div>
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                Button URL
              </label>
              <input
                type="text"
                value={videoSection.buttonURL}
                onChange={(e) => setVideoSection({...videoSection, buttonURL: e.target.value})}
                className="w-full px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Ventures */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Our Ventures
          </h3>
          <button
            onClick={handleAddVenture}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
          >
            + Add Venture
          </button>
        </div>

        <div className="space-y-3">
          {ventures.map((venture) => (
            <div 
              key={venture.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded border"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg
              }}
            >
              <input
                type="text"
                value={venture.name}
                onChange={(e) => {
                  setVentures(ventures.map(v => 
                    v.id === venture.id ? {...v, name: e.target.value} : v
                  ));
                }}
                className="px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.contentBg,
                  color: colors.textPrimary
                }}
                placeholder="HOTEL"
              />

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`venture-${venture.id}`}
                />
                <label
                  htmlFor={`venture-${venture.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border text-xs cursor-pointer"
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: colors.contentBg,
                    color: colors.textSecondary
                  }}
                >
                  <Upload size={14} />
                  {venture.logo || 'Upload File'}
                </label>
                <button
                  onClick={() => handleDeleteVenture(venture.id)}
                  className="p-2 rounded"
                  style={{ 
                    backgroundColor: colors.danger,
                    color: '#ffffff'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Recognition */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Global Recognition
          </h3>
          <button
            onClick={handleAddRecognition}
            className="px-3 py-1.5 rounded text-xs font-medium"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
          >
            + Add Venture
          </button>
        </div>

        <div className="space-y-3">
          {recognitions.map((recognition) => (
            <div 
              key={recognition.id}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 rounded border"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg
              }}
            >
              <input
                type="text"
                value={recognition.title}
                onChange={(e) => {
                  setRecognitions(recognitions.map(r => 
                    r.id === recognition.id ? {...r, title: e.target.value} : r
                  ));
                }}
                className="px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.contentBg,
                  color: colors.textPrimary
                }}
                placeholder="98/100"
              />

              <input
                type="text"
                value={recognition.subtitle}
                onChange={(e) => {
                  setRecognitions(recognitions.map(r => 
                    r.id === recognition.id ? {...r, subtitle: e.target.value} : r
                  ));
                }}
                className="px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.contentBg,
                  color: colors.textPrimary
                }}
                placeholder="GOLD LIST 2024"
              />

              <input
                type="text"
                value={recognition.badge}
                onChange={(e) => {
                  setRecognitions(recognitions.map(r => 
                    r.id === recognition.id ? {...r, badge: e.target.value} : r
                  ));
                }}
                className="px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.contentBg,
                  color: colors.textPrimary
                }}
                placeholder="CONE NAST TRAVELLER"
              />

              <button
                onClick={() => handleDeleteRecognition(recognition.id)}
                className="px-3 py-2 rounded text-sm font-medium"
                style={{ 
                  backgroundColor: colors.danger,
                  color: '#ffffff'
                }}
              >
                <Trash2 size={14} className="inline mr-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
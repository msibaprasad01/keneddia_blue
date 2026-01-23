import React, { useState, useEffect, useCallback } from 'react';
import { colors } from "@/lib/colors/colors";
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { addAboutUs, getAboutUsAdmin, updateAboutUsById } from '@/Api/Api';
import { toast } from 'react-hot-toast';

function AboutUs() {
  const [basicInfo, setBasicInfo] = useState({
    sectionTitle: '',
    subTitle: '',
    description: ''
  });

  const [videoSection, setVideoSection] = useState({
    videoUrl: '',
    videoTitle: '',
    ctaButtonText: '',
    ctaButtonUrl: ''
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

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingData, setExistingData] = useState(null);

  // Fetch About Us data on component mount
  const fetchAboutUs = useCallback(async () => {
    try {
      setFetching(true);
      const response = await getAboutUsAdmin();
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Get the latest about us (highest id)
        const latestAboutUs = response.data.reduce((latest, current) => 
          current.id > latest.id ? current : latest
        );
        
        setExistingData(latestAboutUs);
        
        // Populate form with latest data
        setBasicInfo({
          sectionTitle: latestAboutUs.sectionTitle || '',
          subTitle: latestAboutUs.subTitle || '',
          description: latestAboutUs.description || ''
        });

        setVideoSection({
          videoUrl: latestAboutUs.videoUrl || '',
          videoTitle: latestAboutUs.videoTitle || '',
          ctaButtonText: latestAboutUs.ctaButtonText || '',
          ctaButtonUrl: latestAboutUs.ctaButtonUrl || ''
        });

        console.log("Latest About Us:", latestAboutUs);
      } else {
        // Set default values if no data
        setBasicInfo({
          sectionTitle: 'About Kennedia Blu',
          subTitle: 'Kennedia Blu',
          description: 'Kennedia Blu is built on trust and excellence, delivering premium hospitality experiences that exceed customer expectations.'
        });
        
        setVideoSection({
          videoUrl: '',
          videoTitle: '',
          ctaButtonText: 'More Details →',
          ctaButtonUrl: ''
        });
      }
    } catch (error) {
      console.error("Error fetching about us:", error);
      toast.error("Failed to load about us data");
      
      // Set default values on error
      setBasicInfo({
        sectionTitle: 'About Kennedia Blu',
        subTitle: 'Kennedia Blu',
        description: 'Kennedia Blu is built on trust and excellence.'
      });
    } finally {
      setFetching(false);
    }
  }, []);

  // Fetch on mount only
  useEffect(() => {
    fetchAboutUs();
  }, []);

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

  const handleSubmit = async () => {
    // Validation
    if (!basicInfo.sectionTitle.trim()) {
      toast.error("Section title is required");
      return;
    }
    if (!basicInfo.subTitle.trim()) {
      toast.error("Subtitle is required");
      return;
    }
    if (!basicInfo.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        sectionTitle: basicInfo.sectionTitle,
        subTitle: basicInfo.subTitle,
        description: basicInfo.description,
        videoUrl: videoSection.videoUrl,
        videoTitle: videoSection.videoTitle,
        ctaButtonText: videoSection.ctaButtonText,
        ctaButtonUrl: videoSection.ctaButtonUrl
      };

      let response;
      
      if (existingData?.id) {
        // Update existing
        response = await updateAboutUsById(existingData.id, payload);
        toast.success("About Us updated successfully!");
      } else {
        // Create new
        response = await addAboutUs(payload);
        toast.success("About Us created successfully!");
      }

      console.log("Response:", response.data);

      // Refresh data after successful save
      await fetchAboutUs();
      
    } catch (error) {
      console.error("Error saving about us:", error);
      toast.error(
        error.response?.data?.message || "Failed to save about us"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching
  if (fetching) {
    return (
      <div
        className="rounded-lg p-6 shadow-sm flex items-center justify-center h-[400px]"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin" style={{ color: colors.primary }} />
          <p style={{ color: colors.textSecondary }}>Loading about us data...</p>
        </div>
      </div>
    );
  }

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
              Section Title <span style={{ color: "#ef4444" }}>*</span>
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
              Sub Title <span style={{ color: "#ef4444" }}>*</span>
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
              Description <span style={{ color: "#ef4444" }}>*</span>
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
              value={videoSection.videoUrl}
              onChange={(e) => setVideoSection({...videoSection, videoUrl: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="https://www.youtube.com/watch?v=example123"
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
              placeholder="Discover Kennedia Blu"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                CTA Button Text
              </label>
              <input
                type="text"
                value={videoSection.ctaButtonText}
                onChange={(e) => setVideoSection({...videoSection, ctaButtonText: e.target.value})}
                className="w-full px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
                placeholder="Learn More"
              />
            </div>

            <div>
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                CTA Button URL
              </label>
              <input
                type="text"
                value={videoSection.ctaButtonUrl}
                onChange={(e) => setVideoSection({...videoSection, ctaButtonUrl: e.target.value})}
                className="w-full px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.mainBg,
                  color: colors.textPrimary
                }}
                placeholder="https://www.kennediablu.com/about-us"
              />
            </div>
          </div>

          {/* Video Preview */}
          {videoSection.videoUrl && (
            <div className="mt-3">
              <label 
                className="block text-xs font-medium mb-1.5"
                style={{ color: colors.textSecondary }}
              >
                Video Preview
              </label>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={videoSection.videoUrl.replace('watch?v=', 'embed/')}
                  title={videoSection.videoTitle || "Video preview"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
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
            + Add Recognition
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

      {/* Submit Button */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: colors.primary,
            color: colors.sidebarText,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = colors.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = colors.primary;
            }
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>{existingData?.id ? 'Update About Us' : 'Save About Us'}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default AboutUs;
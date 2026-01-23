import React, { useState, useEffect, useCallback } from 'react';
import { colors } from "@/lib/colors/colors";
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { 
  addAboutUs, 
  getAboutUsAdmin, 
  updateAboutUsById,
  addVenture,
  updateVentureById,
  getVenturesByAboutUsId,
  addRecognition,
  updateRecognition,
  getRecognitionsByAboutUsId 
} from '@/Api/Api';
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

  const [ventures, setVentures] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  const [ventureFiles, setVentureFiles] = useState({});

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

        // Fetch ventures and recognitions for this about us
        if (latestAboutUs.id) {
          await fetchVentures(latestAboutUs.id);
          await fetchRecognitions(latestAboutUs.id);
        }

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

  // Fetch ventures for about us
  const fetchVentures = async (aboutUsId) => {
    try {
      const response = await getVenturesByAboutUsId(aboutUsId);
      if (response.data && Array.isArray(response.data)) {
        setVentures(response.data.map(v => ({
          id: v.id,
          ventureName: v.ventureName,
          logoUrl: v.logoUrl,
          isExisting: true
        })));
      }
    } catch (error) {
      console.error("Error fetching ventures:", error);
    }
  };

  // Fetch recognitions for about us
  const fetchRecognitions = async (aboutUsId) => {
    try {
      const response = await getRecognitionsByAboutUsId(aboutUsId);
      if (response.data && Array.isArray(response.data)) {
        setRecognitions(response.data.map(r => ({
          id: r.id,
          value: r.value,
          title: r.title,
          subTitle: r.subTitle,
          isExisting: true
        })));
      }
    } catch (error) {
      console.error("Error fetching recognitions:", error);
    }
  };

  // Fetch on mount only
  useEffect(() => {
    fetchAboutUs();
  }, []);

  const handleAddVenture = () => {
    setVentures([...ventures, { 
      id: Date.now(), 
      ventureName: '', 
      logoUrl: null,
      isExisting: false 
    }]);
  };

  const handleDeleteVenture = (id) => {
    setVentures(ventures.filter(v => v.id !== id));
    // Remove file from ventureFiles if exists
    const newFiles = { ...ventureFiles };
    delete newFiles[id];
    setVentureFiles(newFiles);
  };

  const handleVentureFileChange = (ventureId, file) => {
    setVentureFiles(prev => ({
      ...prev,
      [ventureId]: file
    }));
  };

  const handleAddRecognition = () => {
    setRecognitions([...recognitions, { 
      id: Date.now(), 
      value: '', 
      title: '', 
      subTitle: '',
      isExisting: false 
    }]);
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

      // Step 1: Save About Us basic info
      const payload = {
        sectionTitle: basicInfo.sectionTitle,
        subTitle: basicInfo.subTitle,
        description: basicInfo.description,
        videoUrl: videoSection.videoUrl,
        videoTitle: videoSection.videoTitle,
        ctaButtonText: videoSection.ctaButtonText,
        ctaButtonUrl: videoSection.ctaButtonUrl
      };

      let aboutUsResponse;
      let aboutUsId;
      
      if (existingData?.id) {
        // Update existing
        aboutUsResponse = await updateAboutUsById(existingData.id, payload);
        aboutUsId = existingData.id;
        toast.success("About Us updated successfully!");
      } else {
        // Create new
        aboutUsResponse = await addAboutUs(payload);
        aboutUsId = aboutUsResponse.data.id;
        toast.success("About Us created successfully!");
      }

      console.log("About Us Response:", aboutUsResponse.data);

      // Step 2: Save Ventures
      for (const venture of ventures) {
        if (venture.isExisting) {
          // Update existing venture if name changed or new file uploaded
          if (ventureFiles[venture.id]) {
            const ventureFormData = new FormData();
            ventureFormData.append('ventureName', venture.ventureName);
            ventureFormData.append('logo', ventureFiles[venture.id]);
            
            await updateVentureById(venture.id, ventureFormData);
            console.log(`Updated venture ${venture.id}`);
          }
        } else {
          // Add new venture
          if (venture.ventureName.trim()) {
            const ventureFormData = new FormData();
            ventureFormData.append('ventureName', venture.ventureName);
            
            if (ventureFiles[venture.id]) {
              ventureFormData.append('logo', ventureFiles[venture.id]);
            }
            
            await addVenture(aboutUsId, ventureFormData);
            console.log(`Added new venture: ${venture.ventureName}`);
          }
        }
      }

      // Step 3: Save Recognitions
      for (const recognition of recognitions) {
        if (recognition.isExisting) {
          // Update existing recognition
          const recognitionPayload = {
            value: recognition.value,
            title: recognition.title,
            subTitle: recognition.subTitle
          };
          
          await updateRecognition(recognition.id, recognitionPayload);
          console.log(`Updated recognition ${recognition.id}`);
        } else {
          // Add new recognition
          if (recognition.value.trim() && recognition.title.trim()) {
            const recognitionPayload = {
              value: recognition.value,
              title: recognition.title,
              subTitle: recognition.subTitle
            };
            
            await addRecognition(aboutUsId, recognitionPayload);
            console.log(`Added new recognition: ${recognition.title}`);
          }
        }
      }

      toast.success("All data saved successfully!");

      // Refresh data after successful save
      await fetchAboutUs();
      
      // Clear venture files
      setVentureFiles({});
      
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save data"
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
                value={venture.ventureName}
                onChange={(e) => {
                  setVentures(ventures.map(v => 
                    v.id === venture.id ? {...v, ventureName: e.target.value} : v
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
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleVentureFileChange(venture.id, e.target.files[0]);
                    }
                  }}
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
                  {ventureFiles[venture.id] 
                    ? ventureFiles[venture.id].name 
                    : venture.logoUrl 
                      ? 'Change Logo' 
                      : 'Upload Logo'}
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

              {/* Show existing logo preview */}
              {venture.logoUrl && !ventureFiles[venture.id] && (
                <div className="md:col-span-2">
                  <img 
                    src={venture.logoUrl} 
                    alt={venture.ventureName}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
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
                value={recognition.value}
                onChange={(e) => {
                  setRecognitions(recognitions.map(r => 
                    r.id === recognition.id ? {...r, value: e.target.value} : r
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
                placeholder="Years of Excellence"
              />

              <input
                type="text"
                value={recognition.subTitle}
                onChange={(e) => {
                  setRecognitions(recognitions.map(r => 
                    r.id === recognition.id ? {...r, subTitle: e.target.value} : r
                  ));
                }}
                className="px-3 py-2 rounded border text-sm"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.contentBg,
                  color: colors.textPrimary
                }}
                placeholder="Trusted globally"
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
            <span>Save All Changes</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default AboutUs;
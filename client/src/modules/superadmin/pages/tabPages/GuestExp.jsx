import React, { useState, useEffect, useCallback } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Upload, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { 
  addGuestExperienceSection,
  getGuestExperienceSection,
  addGuestExperienceItem,
  updateGuestExperienceItem 
} from '@/Api/Api';
import { toast } from 'react-hot-toast';

function GuestExp() {
  const [sectionHeader, setSectionHeader] = useState({
    sectionTag: 'GUEST EXPERIENCES',
    title: 'Moments of Excellence'
  });

  const [experiences, setExperiences] = useState([]);
  const [experienceFiles, setExperienceFiles] = useState({});

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingSectionId, setExistingSectionId] = useState(null);
  const [savingItemId, setSavingItemId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate pagination
  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiences = experiences.slice(startIndex, endIndex);

  // Fetch guest experience section
  const fetchGuestExperience = useCallback(async () => {
    try {
      setFetching(true);
      
      const response = await getGuestExperienceSection();
      
      if (response.data) {
        // Handle both single object and array responses
        let sectionData, itemsData;
        
        if (Array.isArray(response.data)) {
          // If array, find section and items
          sectionData = response.data.find(item => item.sectionTag || item.title);
          itemsData = response.data.filter(item => item.title && item.description && item.author);
        } else if (response.data.sectionTag || response.data.title) {
          // Single section object
          sectionData = response.data;
          itemsData = response.data.items || [];
        } else {
          itemsData = [response.data];
        }
        
        // Set section data if found
        if (sectionData) {
          setExistingSectionId(sectionData.id);
          setSectionHeader({
            sectionTag: sectionData.sectionTag || 'GUEST EXPERIENCES',
            title: sectionData.title || 'Moments of Excellence'
          });
        }
        
        // Set items data
        if (itemsData && itemsData.length > 0) {
          setExperiences(itemsData.map(item => ({
            id: item.id,
            title: item.title || '',
            imageUrl: item.imageUrl,
            description: item.description || '',
            author: item.author || '',
            isExisting: true
          })));
        }
        
        console.log("Guest Experience Data:", response.data);
      }
      
    } catch (error) {
      console.error("Error fetching guest experience:", error);
      // Don't show error toast on initial load if no data exists
      if (error.response?.status !== 404) {
        toast.error("Failed to load guest experience data");
      }
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchGuestExperience();
  }, []);

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: '',
      imageUrl: null,
      description: '',
      author: '',
      isExisting: false
    };
    setExperiences([...experiences, newExperience]);
    
    // Navigate to the page containing the new item
    const newTotalPages = Math.ceil((experiences.length + 1) / itemsPerPage);
    setCurrentPage(newTotalPages);
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
    
    // Remove file from experienceFiles if exists
    const newFiles = { ...experienceFiles };
    delete newFiles[id];
    setExperienceFiles(newFiles);
    
    // Adjust current page if needed
    const newTotalPages = Math.ceil((experiences.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleExperienceChange = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const handleFileChange = (experienceId, file) => {
    setExperienceFiles(prev => ({
      ...prev,
      [experienceId]: file
    }));
  };

  const handleSaveSection = async () => {
    // Validation
    if (!sectionHeader.sectionTag.trim()) {
      toast.error("Section tag is required");
      return;
    }
    if (!sectionHeader.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        sectionTag: sectionHeader.sectionTag,
        title: sectionHeader.title
      };

      const response = await addGuestExperienceSection(payload);
      
      if (response.data?.id) {
        setExistingSectionId(response.data.id);
      }
      
      toast.success("Section saved successfully!");
      console.log("Section Response:", response.data);
      
      // Refresh data
      await fetchGuestExperience();
      
    } catch (error) {
      console.error("Error saving section:", error);
      toast.error(
        error.response?.data?.message || "Failed to save section"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExperience = async (experience) => {
    // Validation
    if (!experience.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!experience.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!experience.author.trim()) {
      toast.error("Author is required");
      return;
    }
    
    // For new items, image is required
    if (!experience.isExisting && !experienceFiles[experience.id]) {
      toast.error("Image is required for new experience");
      return;
    }

    // For updates, if no new file and no existing imageUrl, show error
    if (experience.isExisting && !experienceFiles[experience.id] && !experience.imageUrl) {
      toast.error("Image is required");
      return;
    }

    try {
      setSavingItemId(experience.id);

      const formData = new FormData();
      formData.append('title', experience.title);
      formData.append('description', experience.description);
      formData.append('author', experience.author);
      
      // Only append file if a new one is selected
      if (experienceFiles[experience.id]) {
        formData.append('file', experienceFiles[experience.id]);
      }

      let response;
      
      if (experience.isExisting) {
        // Update existing item
        response = await updateGuestExperienceItem(experience.id, formData);
        toast.success("Experience updated successfully!");
      } else {
        // Add new item
        response = await addGuestExperienceItem(formData);
        toast.success("Experience saved successfully!");
      }
      
      console.log("Experience Response:", response.data);

      // Refresh the data
      await fetchGuestExperience();
      
      // Clear the file for this experience
      const newFiles = { ...experienceFiles };
      delete newFiles[experience.id];
      setExperienceFiles(newFiles);
      
    } catch (error) {
      console.error("Error saving experience:", error);
      toast.error(
        error.response?.data?.message || "Failed to save experience"
      );
    } finally {
      setSavingItemId(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
          <p style={{ color: colors.textSecondary }}>Loading guest experience data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <h3 
          className="text-sm font-semibold mb-4"
          style={{ color: colors.textPrimary }}
        >
          Section Header
        </h3>

        <div className="space-y-3">
          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Section Tag <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={sectionHeader.sectionTag}
              onChange={(e) => setSectionHeader({...sectionHeader, sectionTag: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="GUEST EXPERIENCES"
            />
          </div>

          <div>
            <label 
              className="block text-xs font-medium mb-1.5"
              style={{ color: colors.textSecondary }}
            >
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={sectionHeader.title}
              onChange={(e) => setSectionHeader({...sectionHeader, title: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ 
                borderColor: colors.border,
                backgroundColor: colors.mainBg,
                color: colors.textPrimary
              }}
              placeholder="Moments of Excellence"
            />
          </div>

          <button
            onClick={handleSaveSection}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 border-none rounded-md text-sm font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.primary,
              color: colors.sidebarText,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Section</span>
            )}
          </button>
        </div>
      </div>

      {/* Guest Experiences */}
      <div 
        className="rounded-lg p-4 sm:p-5 shadow-sm"
        style={{ backgroundColor: colors.contentBg }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-sm font-semibold m-0"
            style={{ color: colors.textPrimary }}
          >
            Guest Experiences
          </h3>
          <button
            onClick={handleAddExperience}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ 
              backgroundColor: colors.primary,
              color: '#ffffff'
            }}
          >
            <Plus size={16} />
            Add Experience
          </button>
        </div>

        {/* Experiences List */}
        {experiences.length > 0 ? (
          <>
            <div className="space-y-4 mb-4">
              {currentExperiences.map((experience) => (
                <div
                  key={experience.id}
                  className="rounded-lg p-4 border"
                  style={{ 
                    backgroundColor: colors.mainBg,
                    borderColor: colors.border
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label 
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: colors.textSecondary }}
                      >
                        Title <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={experience.title}
                        onChange={(e) => handleExperienceChange(experience.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border text-sm"
                        style={{ 
                          borderColor: colors.border,
                          backgroundColor: colors.contentBg,
                          color: colors.textPrimary
                        }}
                        placeholder="Vibrant Socials"
                      />
                    </div>

                    <div>
                      <label 
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: colors.textSecondary }}
                      >
                        Image <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`image-${experience.id}`}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                handleFileChange(experience.id, file);
                              }
                            }}
                          />
                          <label
                            htmlFor={`image-${experience.id}`}
                            className="flex-1 flex items-center justify-center gap-2 px-2.5 py-1.5 rounded border text-xs cursor-pointer"
                            style={{ 
                              borderColor: colors.border,
                              backgroundColor: colors.contentBg,
                              color: colors.textSecondary
                            }}
                          >
                            <Upload size={14} />
                            <span className="truncate">
                              {experienceFiles[experience.id] 
                                ? experienceFiles[experience.id].name
                                : experience.imageUrl 
                                  ? 'Change Image' 
                                  : 'Upload Image'}
                            </span>
                          </label>
                        </div>
                        {experience.imageUrl && !experienceFiles[experience.id] && (
                          <img 
                            src={experience.imageUrl} 
                            alt={experience.title}
                            className="w-full h-20 object-cover rounded"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label 
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: colors.textSecondary }}
                      >
                        Description <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border text-sm"
                        style={{ 
                          borderColor: colors.border,
                          backgroundColor: colors.contentBg,
                          color: colors.textPrimary
                        }}
                        placeholder='"The perfect setting..."'
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label 
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: colors.textSecondary }}
                      >
                        Author <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={experience.author}
                        onChange={(e) => handleExperienceChange(experience.id, 'author', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded border text-sm"
                        style={{ 
                          borderColor: colors.border,
                          backgroundColor: colors.contentBg,
                          color: colors.textPrimary
                        }}
                        placeholder="Sarah Jenning, Event Planner"
                      />
                    </div>

                    <div className="md:col-span-2 flex items-end justify-end gap-2">
                      <button
                        onClick={() => handleDeleteExperience(experience.id)}
                        disabled={savingItemId === experience.id}
                        className="px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: colors.danger,
                          color: '#ffffff'
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleSaveExperience(experience)}
                        disabled={savingItemId === experience.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50"
                        style={{ 
                          backgroundColor: colors.primary,
                          color: '#ffffff'
                        }}
                      >
                        {savingItemId === experience.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          'Save'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                        style={{ 
                          backgroundColor: currentPage === index + 1 ? colors.primary : colors.mainBg,
                          color: currentPage === index + 1 ? '#ffffff' : colors.textPrimary,
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.mainBg,
                      color: colors.textPrimary
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Pagination Info */}
                <div 
                  className="text-center mt-3 text-xs"
                  style={{ color: colors.textSecondary }}
                >
                  Showing {startIndex + 1}-{Math.min(endIndex, experiences.length)} of {experiences.length} items
                </div>
              </>
            )}
          </>
        ) : (
          <div 
            className="text-center py-8 text-sm"
            style={{ color: colors.textSecondary }}
          >
            No experiences added yet. Click "Add Experience" to create one.
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestExp;
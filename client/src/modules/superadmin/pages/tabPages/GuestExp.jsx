import React, { useState } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

function GuestExp() {
  const [sectionHeader, setSectionHeader] = useState({
    sectionTag: 'GUEST EXPERIENCES',
    title: 'Moments of Excellence'
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      title: 'Vibrant Socials',
      image: 'vibrant-socials.jpg',
      description: '"The perfect setting for connecting with friends and colleagues."',
      author: 'Sarah Jenning, Event Planner'
    },
    {
      id: 2,
      title: 'Exquisite Dining',
      image: 'exquisite-dining.jpg',
      description: '"A culinary journey that delights the senses with every bite."',
      author: 'James Cameron, Food Critic'
    },
    {
      id: 3,
      title: 'Luxurious Spa',
      image: 'luxurious-spa.jpg',
      description: '"Relaxation and rejuvenation in a serene environment."',
      author: 'Emily Watson, Wellness Coach'
    },
    {
      id: 4,
      title: 'Rooftop Views',
      image: 'rooftop-views.jpg',
      description: '"Breathtaking panoramic views that create unforgettable moments."',
      author: 'Michael Chen, Travel Blogger'
    }
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate pagination
  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiences = experiences.slice(startIndex, endIndex);

  const handleAddExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: '',
      image: null,
      description: '',
      author: ''
    };
    setExperiences([...experiences, newExperience]);
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
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
              Section Tag
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
              Title
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
                    Title
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
                    Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`image-${experience.id}`}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleExperienceChange(experience.id, 'image', file.name);
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
                        {experience.image || 'Upload File'}
                      </span>
                    </label>
                  </div>
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
                    value={experience.description}
                    onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border text-sm"
                    style={{ 
                      borderColor: colors.border,
                      backgroundColor: colors.contentBg,
                      color: colors.textPrimary
                    }}
                    placeholder='"The perfect setting for connecting with friends and colleagues."'
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label 
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: colors.textSecondary }}
                  >
                    Author
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
                    className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                    style={{ 
                      backgroundColor: colors.danger,
                      color: '#ffffff'
                    }}
                  >
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
      </div>
    </div>
  );
}

export default GuestExp;
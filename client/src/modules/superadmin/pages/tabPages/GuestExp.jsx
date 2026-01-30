import React, { useState, useEffect, useCallback } from 'react';
import { colors } from "@/lib/colors/colors";
import { Plus, Upload, ChevronLeft, ChevronRight, Loader2, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [existingSectionId, setExistingSectionId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchGuestExperience = useCallback(async () => {
    try {
      setFetching(true);
      const response = await getGuestExperienceSection();
      
      const responseData = response.data?.data || response.data;
      const items = responseData?.content || [];
      
      if (responseData) {
        setExistingSectionId(responseData.id);
        setExperiences(items.map(item => ({
          ...item,
          isActive: true // Mock status
        })));
      }
    } catch (error) {
      console.error("Error fetching guest experience:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to load guest experience data");
      }
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchGuestExperience();
  }, [fetchGuestExperience]);

  // Pagination Logic
  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const currentExperiences = experiences.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      {/* <div className="rounded-lg p-5 shadow-sm" style={{ backgroundColor: colors.contentBg }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: colors.textPrimary }}>Section Header</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Section Tag</label>
            <input
              type="text"
              value={sectionHeader.sectionTag}
              onChange={(e) => setSectionHeader({...sectionHeader, sectionTag: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg, color: colors.textPrimary }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: colors.textSecondary }}>Title</label>
            <input
              type="text"
              value={sectionHeader.title}
              onChange={(e) => setSectionHeader({...sectionHeader, title: e.target.value})}
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ borderColor: colors.border, backgroundColor: colors.mainBg, color: colors.textPrimary }}
            />
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-md text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: colors.primary }}
          disabled={loading}
        >
          Save Header
        </button>
      </div> */}

      {/* Experiences Table */}
      <div className="rounded-lg shadow-sm overflow-hidden" style={{ backgroundColor: colors.contentBg }}>
        <div className="p-5 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
          <h3 className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Guest Experiences List</h3>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={14} /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: colors.mainBg }}>
                <th className="p-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Media</th>
                <th className="p-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Details</th>
                <th className="p-4 text-xs font-semibold uppercase" style={{ color: colors.textSecondary }}>Author</th>
                <th className="p-4 text-xs font-semibold uppercase text-center" style={{ color: colors.textSecondary }}>Status</th>
                <th className="p-4 text-xs font-semibold uppercase text-right" style={{ color: colors.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: colors.border }}>
              {fetching ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto mb-2" style={{ color: colors.primary }} />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>Fetching experiences...</span>
                  </td>
                </tr>
              ) : currentExperiences.map((exp) => (
                <tr key={exp.id} className="hover:bg-black/5 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-12 rounded bg-gray-200 overflow-hidden border" style={{ borderColor: colors.border }}>
                      {exp.imageUrl ? (
                        <img src={exp.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : exp.videoUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800 text-[10px] text-white">VIDEO</div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">NA</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{exp.title}</div>
                    <div className="text-xs line-clamp-1 max-w-[200px]" style={{ color: colors.textSecondary }}>{exp.description}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm" style={{ color: colors.textPrimary }}>{exp.author}</div>
                  </td>
                  <td className="p-4 text-center">
                    {/* Disable/Enable Action Button (Disabled for now) */}
                    <button 
                      disabled 
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-50 cursor-not-allowed border"
                      style={{ 
                        backgroundColor: exp.isActive ? `${colors.primary}15` : '#fee2e2', 
                        color: exp.isActive ? colors.primary : '#ef4444',
                        borderColor: exp.isActive ? colors.primary : '#ef4444'
                      }}
                    >
                      {exp.isActive ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded hover:bg-gray-100" style={{ color: colors.textSecondary }} title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-red-50" style={{ color: '#ef4444' }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 flex items-center justify-between border-t" style={{ borderColor: colors.border, backgroundColor: colors.mainBg }}>
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            Showing {currentExperiences.length} of {experiences.length} items
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border disabled:opacity-30"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-medium" style={{ color: colors.textPrimary }}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded border disabled:opacity-30"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestExp;
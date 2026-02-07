import React, { useState, useEffect } from "react";
import { 
  PencilSquareIcon, 
  ClockIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  InformationCircleIcon 
} from "@heroicons/react/24/outline";
import { colors } from "@/lib/colors/colors";
import { getAllPropertyPolicies } from "@/Api/Api";
import { showError, showSuccess } from "@/lib/toasters/toastUtils";
import EditPoliciesModal from "../modals/EditPoliciesModal";

const PoliciesTab = ({ propertyData }) => {
  console.log(propertyData);
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPolicies = async () => {
    if (!propertyData?.id) return;
    
    setLoading(true);
    try {
      const response = await getAllPropertyPolicies(propertyData.id);
      const actualData = response?.data || response;

      // Handle both array and object responses from API
      if (Array.isArray(actualData) && actualData.length > 0) {
        setPolicyData(actualData[0]);
      } else if (actualData && !Array.isArray(actualData)) {
        setPolicyData(actualData);
      } else {
        setPolicyData(null);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      showError("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [propertyData?.id]);

  const handleSave = () => {
    fetchPolicies();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500 animate-pulse">Loading property policies...</p>
      </div>
    );
  }

  const attachedPolicies = policyData?.policies || [];
  const hasPolicies = attachedPolicies.length > 0;
  const hasCheckInOut = policyData?.checkInTime || policyData?.checkOutTime;
  const hasCancellation = policyData?.cancellationPolicy && policyData.cancellationPolicy !== "null";

  // Check if there is absolutely no data to show
  const isEmpty = !hasPolicies && !hasCheckInOut && !hasCancellation;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Property Policies</h2>
          <p className="text-sm text-gray-500">
            Rules, timing, and cancellation terms for {propertyData?.propertyName || "this property"}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-lg hover:opacity-90 transition-all shadow-md active:scale-95"
          style={{ backgroundColor: colors.primary }}
        >
          <PencilSquareIcon className="w-4 h-4" /> 
          {isEmpty ? "Add Policies" : "Edit Policies"}
        </button>
      </div>

      {isEmpty ? (
        /* Empty State */
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <DocumentTextIcon className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No policies configured yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8">
            Set your check-in times, cancellation rules, and property requirements to help guests prepare for their stay.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            Configure Policies Now
          </button>
        </div>
      ) : (
        /* Data Display State */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 & 2: Main Rules & Cancellation */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Rules Section */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Property Rules & Guidelines</h3>
              </div>
              <div className="p-6">
                {hasPolicies ? (
                  <div className="flex flex-wrap gap-3">
                    {attachedPolicies.map((policy) => (
                      <span
                        key={policy.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-sm font-semibold"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        {policy.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400 italic text-sm">
                    <InformationCircleIcon className="w-4 h-4" />
                    No custom policy tags selected.
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Cancellation Terms</h3>
              </div>
              <div className="p-6">
                {hasCancellation ? (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {policyData.cancellationPolicy}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">No cancellation policy description provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Timing Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm sticky top-6">
              <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Timing</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-tighter">Check-in After</span>
                    <span className="text-lg font-black text-gray-900">{policyData.checkInTime || "--:--"}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-tighter">Check-out Before</span>
                    <span className="text-lg font-black text-gray-900">{policyData.checkOutTime || "--:--"}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 text-center px-2 italic">
                  * Times are shown based on local property time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Integration */}
      <EditPoliciesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyData={propertyData}
        initialData={policyData}
        onSave={handleSave}
      />
    </div>
  );
};

export default PoliciesTab;
import React, { useState, useEffect } from "react";
import { PencilSquareIcon, ClockIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { colors } from "@/lib/colors/colors";
import { getAllPropertyPolicies } from "@/Api/Api";
import { showError, showSuccess } from "@/lib/toasters/toastUtils";
import EditPoliciesModal from "../modals/EditPoliciesModal";

const PoliciesTab = ({ propertyData }) => {
  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPolicies = async () => {
    if (!propertyData?.id) return;
    
    setLoading(true);
    try {
      const response = await getAllPropertyPolicies(propertyData.id);
      
      // FIX: Handle Axios structure. If response.data exists, use it.
      const actualData = response?.data || response;

      if (Array.isArray(actualData) && actualData.length > 0) {
        setPolicyData(actualData[0]);
      } else {
        setPolicyData(actualData && !Array.isArray(actualData) ? actualData : null);
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
    showSuccess("Policies updated successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const attachedPolicies = policyData?.policies || [];
  const hasPolicies = attachedPolicies.length > 0;
  
  // Logic check for non-null values
  const hasCheckInOut = policyData?.checkInTime && policyData?.checkOutTime;
  const hasCancellationPolicy = policyData?.cancellationPolicy && policyData.cancellationPolicy !== "null";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Property Policies</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your property rules and guest guidelines
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors shadow-sm"
          style={{ backgroundColor: colors.primary }}
        >
          <PencilSquareIcon className="w-4 h-4" /> 
          {policyData ? "Edit Policies" : "Add Policies"}
        </button>
      </div>

      {/* Main Content Area */}
      {!policyData || (!hasPolicies && !hasCheckInOut && !hasCancellationPolicy) ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Policies Found</h3>
          <p className="text-sm text-gray-500 mb-6">Select from available rules or create new ones for your property.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold"
          >
            Manage Policies
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Rules & Amenities Section - Primary Focus */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              Property Rules & Amenities
            </h3>

            {hasPolicies ? (
              <div className="flex flex-wrap gap-3">
                {attachedPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    {policy.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No specific rules selected.</p>
            )}
          </div>

          {/* Conditional Rendering for Check-in/out if they exist */}
          {hasCheckInOut && (
             <div className="bg-white border rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <h3 className="text-base font-semibold text-gray-900">Timing</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 block uppercase">Check-in</span>
                    <span className="text-lg font-bold">{policyData.checkInTime}</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-500 block uppercase">Check-out</span>
                    <span className="text-lg font-bold">{policyData.checkOutTime}</span>
                  </div>
                </div>
             </div>
          )}

          {/* Cancellation Section */}
          {hasCancellationPolicy && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
              <p className="text-sm text-gray-600 bg-orange-50 p-4 rounded-lg border border-orange-100">
                {policyData.cancellationPolicy}
              </p>
            </div>
          )}
        </div>
      )}

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
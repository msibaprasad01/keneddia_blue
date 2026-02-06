import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { colors } from '@/lib/colors/colors';
import { 
  createPolicyOption, 
  getAllPolicyOptions, 
  attachPoliciesToProperty 
} from '@/Api/Api';
import { showError, showSuccess } from '@/lib/toasters/toastUtils';

const EditPoliciesModal = ({ isOpen, onClose, propertyData, initialData, onSave }) => {
  const [formData, setFormData] = useState({
    selectedPolicyIds: []
  });

  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPolicyInput, setShowNewPolicyInput] = useState(false);
  const [loadingPolicies, setLoadingPolicies] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailablePolicies();
      
      if (initialData?.policies) {
        setFormData({
          selectedPolicyIds: initialData.policies.map(p => p.id)
        });
      } else {
        setFormData({ selectedPolicyIds: [] });
      }
    }
  }, [isOpen, initialData]);

  const fetchAvailablePolicies = async () => {
    setLoadingPolicies(true);
    try {
      const response = await getAllPolicyOptions();
      // Accessing response.data based on the structure you shared
      const policyList = response?.data || [];
      setAvailablePolicies(policyList);
    } catch (error) {
      console.error("Error fetching policies:", error);
      showError("Failed to load policies");
    } finally {
      setLoadingPolicies(false);
    }
  };

  const handleCreatePolicy = async () => {
    const trimmedName = newPolicyName.trim();
    if (!trimmedName) return;

    setIsCreatingPolicy(true);
    try {
      // Payload structure: { "name": "USB Charging" }
      const response = await createPolicyOption({ name: trimmedName });
      
      // If your create API also returns { data: { id: ... } }
      const newPolicy = response?.data || response;

      if (newPolicy?.id) {
        setAvailablePolicies(prev => [...prev, newPolicy]);
        setFormData(prev => ({
          ...prev,
          selectedPolicyIds: [...prev.selectedPolicyIds, newPolicy.id]
        }));
        setNewPolicyName('');
        setShowNewPolicyInput(false);
        showSuccess(`Policy "${newPolicy.name}" created`);
      }
    } catch (error) {
      showError("Failed to create policy");
    } finally {
      setIsCreatingPolicy(false);
    }
  };

  const handlePolicyToggle = (id) => {
    setFormData(prev => ({
      ...prev,
      selectedPolicyIds: prev.selectedPolicyIds.includes(id)
        ? prev.selectedPolicyIds.filter(item => item !== id)
        : [...prev.selectedPolicyIds, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!propertyData?.id) return;

    setLoading(true);
    try {
      await attachPoliciesToProperty({
        propertyId: propertyData.id,
        policyOptionIds: formData.selectedPolicyIds
      });
      showSuccess("Policies updated successfully");
      onSave();
      onClose();
    } catch (error) {
      showError("Failed to save policies");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Manage Property Policies</h3>
            <p className="text-xs text-gray-500">{propertyData?.propertyName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Add New */}
          <div>
            <button
              type="button"
              onClick={() => setShowNewPolicyInput(!showNewPolicyInput)}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              {showNewPolicyInput ? "Close Input" : "Create a Custom Policy"}
            </button>

            {showNewPolicyInput && (
              <div className="mt-3 flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  placeholder="e.g. USB Charging"
                  className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreatePolicy}
                  disabled={isCreatingPolicy}
                  style={{ backgroundColor: colors.primary }}
                  className="px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isCreatingPolicy ? "..." : "Save"}
                </button>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Section 2: Available Policies List */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Available Policies ({availablePolicies.length})
            </h4>

            {loadingPolicies ? (
              <div className="flex flex-col items-center py-10 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-sm">Fetching policy list...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePolicies.length > 0 ? (
                  availablePolicies.map((policy) => (
                    <label
                      key={policy.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.selectedPolicyIds.includes(policy.id)
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedPolicyIds.includes(policy.id)}
                        onChange={() => handlePolicyToggle(policy.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                      />
                      <span className={`text-sm font-medium ${
                        formData.selectedPolicyIds.includes(policy.id) ? "text-blue-900" : "text-gray-700"
                      }`}>
                        {policy.name}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                    <p className="text-sm text-gray-500">No policies found in database.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-xl">
          <span className="text-sm text-gray-500">
            {formData.selectedPolicyIds.length} policies selected
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              style={{ backgroundColor: colors.primary }}
              className="px-6 py-2 text-white rounded-lg font-bold shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? "Saving..." : "Apply Selection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPoliciesModal;
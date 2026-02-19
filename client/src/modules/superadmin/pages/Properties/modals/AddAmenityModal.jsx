import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, CheckIcon, ArrowPathIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { colors } from '@/lib/colors/colors';
import { getAllAmenityFeatures, insertAmenitiesByPropertyId, createAmenityFeature, updateAmenityFeature } from "@/Api/Api";
import { showSuccess, showError } from "@/lib/toasters/toastUtils";

const AddAmenityModal = ({ isOpen, onClose, propertyData, data, onSave }) => {
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customAmenity, setCustomAmenity] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState(null);   // id of feature being edited
  const [editingName, setEditingName] = useState(''); // current edit input value
  const [isUpdating, setIsUpdating] = useState(false);
  const editInputRef = useRef(null);

  const fetchMasterList = async () => {
    setLoading(true);
    try {
      const res = await getAllAmenityFeatures();
      const amenityArray = res?.data || (Array.isArray(res) ? res : []);
      setAllFeatures(amenityArray);

      // Sync selected IDs from string names passed via `data` prop
      if (data && Array.isArray(data) && amenityArray.length > 0) {
        const existingIds = amenityArray
          .filter(feature => data.includes(feature.name))
          .map(feature => feature.id);
        setSelectedIds(existingIds);
      }
    } catch (err) {
      showError("Failed to load amenities master list");
      setAllFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMasterList();
      setEditingId(null); // reset any open edit on reopen
    }
  }, [isOpen, data]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const toggleAmenity = (id) => {
    if (editingId === id) return; // don't toggle while editing
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // ── Start editing a feature ────────────────────────────────────────────────
  const startEdit = (e, feature) => {
    e.stopPropagation(); // prevent toggle
    setEditingId(feature.id);
    setEditingName(feature.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // ── Submit amenity name update ─────────────────────────────────────────────
  const handleUpdate = async (feature) => {
    const trimmed = editingName.trim();
    if (!trimmed) return showError("Name cannot be empty");
    if (trimmed === feature.name) {
      cancelEdit();
      return;
    }

    setIsUpdating(true);
    try {
      const payload = { name: trimmed, isActive: feature.isActive ?? true };
      const res = await updateAmenityFeature(feature.id, payload);
      const updated = res?.data || res;

      // Update name in local list
      setAllFeatures(prev =>
        prev.map(f => f.id === feature.id ? { ...f, name: updated?.name || trimmed } : f)
      );
      showSuccess(`Updated to "${trimmed}"`);
      cancelEdit();
    } catch (err) {
      showError("Failed to update amenity");
    } finally {
      setIsUpdating(false);
    }
  };

  // ── Create custom amenity ──────────────────────────────────────────────────
  const handleCreateCustom = async () => {
    if (!customAmenity.trim()) return;
    setIsCreating(true);
    try {
      const res = await createAmenityFeature({
        name: customAmenity.trim(),
        isActive: true,
      });
      const newAmenity = res?.data || res;
      showSuccess(`"${customAmenity}" created`);
      setAllFeatures(prev => [newAmenity, ...prev]);
      setSelectedIds(prev => [...prev, newAmenity.id]);
      setCustomAmenity('');
    } catch (err) {
      showError("Failed to create amenity");
    } finally {
      setIsCreating(false);
    }
  };

  // ── Save selected amenities to property ───────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!propertyData?.id) return showError("Property ID missing");

    setLoading(true);
    try {
      await insertAmenitiesByPropertyId(propertyData.id, selectedIds);
      showSuccess("Amenities synced successfully");
      if (onSave) onSave();
      onClose();
    } catch (err) {
      showError("Failed to link amenities");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Manage Amenities</h3>
            <p className="text-xs text-gray-500 font-medium">Link features to this property</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* ── Quick Add ───────────────────────────────────────────────────── */}
        <div className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
          <label className="block text-[10px] font-bold text-blue-600 uppercase mb-2 tracking-widest">
            Create New Custom Amenity
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCustom()}
              placeholder="e.g. Infinity Pool"
              className="flex-1 rounded-lg border border-gray-200 text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleCreateCustom}
              disabled={isCreating || !customAmenity.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              {isCreating
                ? <ArrowPathIcon className="w-4 h-4 animate-spin" />
                : <PlusIcon className="w-4 h-4" />
              } Add
            </button>
          </div>
        </div>

        {/* ── Feature List ────────────────────────────────────────────────── */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          {loading && allFeatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ArrowPathIcon className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {allFeatures.map((feature) => {
                const isSelected = selectedIds.includes(feature.id);
                const isEditing = editingId === feature.id;

                return (
                  <div
                    key={feature.id}
                    onClick={() => !isEditing && toggleAmenity(feature.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isEditing
                        ? 'border-amber-400 bg-amber-50/40 cursor-default'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-white bg-white shadow-sm hover:border-gray-200'
                    }`}
                  >
                    {/* Left — checkbox + name / edit input */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Checkbox indicator */}
                      <div
                        className={`shrink-0 p-2 rounded-lg transition-colors ${
                          isEditing
                            ? 'bg-amber-100 text-amber-500'
                            : isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isEditing
                          ? <PencilIcon className="w-4 h-4" />
                          : <CheckIcon className={`w-4 h-4 transition-transform ${isSelected ? 'scale-110' : 'scale-0'}`} />
                        }
                      </div>

                      {/* Inline edit input OR feature name */}
                      {isEditing ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdate(feature);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 min-w-0 text-sm font-semibold bg-white border border-amber-300 rounded-lg px-2.5 py-1 outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      ) : (
                        <span className={`font-semibold truncate ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                          {feature.name}
                        </span>
                      )}
                    </div>

                    {/* Right — edit / confirm / cancel buttons */}
                    <div className="flex items-center gap-1 ml-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {isEditing ? (
                        <>
                          {/* Confirm update */}
                          <button
                            onClick={() => handleUpdate(feature)}
                            disabled={isUpdating}
                            title="Save"
                            className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 transition-colors"
                          >
                            {isUpdating
                              ? <ArrowPathIcon className="w-4 h-4 animate-spin" />
                              : <CheckIcon className="w-4 h-4" />
                            }
                          </button>
                          {/* Cancel edit */}
                          <button
                            onClick={cancelEdit}
                            title="Cancel"
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        /* Edit pencil button */
                        <button
                          onClick={(e) => startEdit(e, feature)}
                          title="Edit name"
                          className="p-1.5 rounded-lg text-gray-300 hover:text-amber-500 hover:bg-amber-50 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div className="p-4 border-t bg-white flex justify-between items-center px-6">
          <div className="text-xs font-bold text-gray-400 tracking-widest">
            {selectedIds.length} Selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-white rounded-lg shadow-md hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddAmenityModal;
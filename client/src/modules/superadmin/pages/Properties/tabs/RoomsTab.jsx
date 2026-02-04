import React from "react";
import { PencilSquareIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { colors } from "@/lib/colors/colors";

const RoomsTab = ({ data = [], onEdit, onAdd, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Rooms & Suites</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: colors.primary }}
        >
          <PlusIcon className="w-5 h-5" /> Add Room
        </button>
      </div>

      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((room, index) => (
              <tr key={room?.id ?? index} className="hover:bg-gray-50">
                {/* Name + Amenities */}
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {room?.name || "N/A"}
                  </div>

                  <div className="text-xs text-gray-500 flex gap-1 mt-1">
                    {Array.isArray(room?.amenities) && room.amenities.length > 0 ? (
                      <>
                        {room.amenities.slice(0, 2).map((a, i) => (
                          <span key={i} className="bg-gray-100 px-1.5 rounded">
                            {a}
                          </span>
                        ))}
                        {room.amenities.length > 2 && (
                          <span className="bg-gray-100 px-1.5 rounded">
                            +{room.amenities.length - 2}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="italic text-gray-400">N/A</span>
                    )}
                  </div>
                </td>

                {/* Base Price */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {typeof room?.basePrice === "number"
                    ? `₹${room.basePrice.toLocaleString()}`
                    : "N/A"}
                </td>

                {/* Occupancy */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {room?.maxOccupancy ? `${room.maxOccupancy} Guests` : "N/A"}
                </td>

                {/* Size */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {room?.size || "N/A"}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {typeof room?.available === "boolean" ? (
                    <span
                      className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                        room.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {room.available ? "Available" : "Unavailable"}
                    </span>
                  ) : (
                    <span className="text-xs italic text-gray-400">N/A</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit?.(room)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete?.(room?.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                  No rooms found. Click “Add Room” to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomsTab;

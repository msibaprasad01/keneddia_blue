import React, { useState } from 'react';
import { colors } from '@/lib/colors/colors';
import { 
  BuildingOffice2Icon, 
  MapPinIcon, 
  TrashIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  ChevronRightIcon // Fixed: Changed from ChevronRight to ChevronRightIcon
} from '@heroicons/react/24/outline';

// Import Tabs
import OverviewTab from './tabs/OverviewTab';
import RoomsTab from './tabs/RoomsTab';
import AmenitiesTab from './tabs/AmenitiesTab';
import GalleryTab from './tabs/GalleryTab';
import EventsTab from './tabs/EventsTab';
import PricingTab from './tabs/PricingTab';
import PoliciesTab from './tabs/PoliciesTab';
import MenuTab from './tabs/MenuTab';
import TablesTab from './tabs/TablesTab';

// Import Modals
import AddEditOverviewModal from './modals/AddEditOverviewModal';
import AddRoomModal from './modals/AddRoomModal';
import AddAmenityModal from './modals/AddAmenityModal';
import AddMediaModal from './modals/AddMediaModal';
import AddEventModal from './modals/AddEventModal';
import AddPricingModal from './modals/AddPricingModal';
import EditPoliciesModal from './modals/EditPoliciesModal';
import AddMenuItemModal from './modals/AddMenuItemModal';
import AddTableModal from './modals/AddTableModal';

const PropertyDetail = ({ property, onBack }) => {
  console.log("Full Property Data received:", property);

  // Initialize data with the full property object passed from parent
  const [data, setData] = useState({
    raw: property,
    overview: {
      ...property,
      propertyName: property.propertyName || "Unnamed Property",
      city: property.locationName || "N/A",
      propertyType: property.propertyTypes?.[0] || "Hotel",
    },
    rooms: [],
    amenities: [],
    gallery: [],
    events: [],
    pricing: [],
    policies: {},
    menu: [],
    tables: [],
  });

  const [activeTab, setActiveTab] = useState('overview');
  
  const [modals, setModals] = useState({
    overview: false, room: false, amenity: false, media: false,
    event: false, pricing: false, policy: false, menu: false, table: false
  });
  
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleModal = (modalName, isOpen, item = null) => {
    setSelectedItem(item);
    setModals(prev => ({ ...prev, [modalName]: isOpen }));
  };

  const updateData = (section, newData, isEdit = false, id = null) => {
    setData(prev => {
      if (section === 'overview' || section === 'policies') {
        return { ...prev, [section]: { ...prev[section], ...newData } };
      }
      const list = prev[section];
      if (isEdit && id) {
        return { ...prev, [section]: list.map(item => item.id === id ? { ...item, ...newData } : item) };
      }
      return { ...prev, [section]: [...list, { ...newData, id: `new_${Date.now()}` }] };
    });
  };

  const propertyType = data.overview.propertyType;
  const tabsByPropertyType = {
    "Hotel": ["overview", "rooms", "amenities", "gallery", "events", "pricing", "policies"],
    "Cafe": ["overview", "menu", "tables", "gallery"],
    "Restaurant": ["overview", "menu", "gallery", "events"]
  };

  const currentTabs = tabsByPropertyType[propertyType] || tabsByPropertyType["Hotel"];

  const renderTabContent = () => {
    const commonProps = {
      propertyData: data.raw,
      activeData: data[activeTab],
      onEdit: (item) => toggleModal(getModalNameForTab(activeTab), true, item),
      onAdd: () => toggleModal(getModalNameForTab(activeTab), true),
      onDelete: (id) => console.log("Delete", id),
    };

    switch (activeTab) {
      case 'overview': return <OverviewTab data={data.overview} propertyData={data.raw} onEdit={() => toggleModal('overview', true, data.overview)} />;
      case 'rooms': return <RoomsTab {...commonProps} />;
      case 'amenities': return <AmenitiesTab {...commonProps} />;
      case 'gallery': return <GalleryTab {...commonProps} />;
      case 'events': return <EventsTab {...commonProps} />;
      case 'pricing': return <PricingTab {...commonProps} />;
      case 'policies': return <PoliciesTab data={data.policies} propertyData={data.raw} onEdit={() => toggleModal('policy', true, data.policies)} />;
      case 'menu': return <MenuTab {...commonProps} />;
      case 'tables': return <TablesTab {...commonProps} />;
      default: return null;
    }
  };

  const getModalNameForTab = (tab) => {
    const map = { rooms: 'room', amenities: 'amenity', gallery: 'media', events: 'event', pricing: 'pricing', menu: 'menu', tables: 'table' };
    return map[tab];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            {/* Fixed: Changed usage to ChevronRightIcon */}
            <ChevronRightIcon className="w-6 h-6 rotate-180" />
          </button>
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <BuildingOffice2Icon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.overview.propertyName}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">{propertyType}</span>
              <span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {data.overview.city}</span>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${data.overview.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {data.overview.isActive ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                {data.overview.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: colors.primary }}
            onClick={() => updateData('overview', { isActive: !data.overview.isActive })}
           >
             {data.overview.isActive ? 'Deactivate' : 'Activate'}
           </button>
           <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors">
             <TrashIcon className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6">
        <div className="flex gap-2 overflow-x-auto border-b mb-6 pb-1">
          {currentTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === tab ? 'bg-white border-x border-t text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === tab ? { color: colors.primary, borderColor: '#e5e7eb' } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border min-h-[500px] p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Modals */}
      <AddEditOverviewModal isOpen={modals.overview} onClose={() => toggleModal('overview', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('overview', u)} />
      <AddRoomModal isOpen={modals.room} onClose={() => toggleModal('room', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('rooms', u, !!selectedItem, selectedItem?.id)} />
      <AddAmenityModal isOpen={modals.amenity} onClose={() => toggleModal('amenity', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('amenities', u, !!selectedItem, selectedItem?.id)} />
      <AddMediaModal isOpen={modals.media} onClose={() => toggleModal('media', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('gallery', u, !!selectedItem, selectedItem?.id)} />
      <AddEventModal isOpen={modals.event} onClose={() => toggleModal('event', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('events', u, !!selectedItem, selectedItem?.id)} />
      <AddPricingModal isOpen={modals.pricing} onClose={() => toggleModal('pricing', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('pricing', u, !!selectedItem, selectedItem?.id)} />
      <EditPoliciesModal isOpen={modals.policy} onClose={() => toggleModal('policy', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('policies', u)} />
      <AddMenuItemModal isOpen={modals.menu} onClose={() => toggleModal('menu', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('menu', u, !!selectedItem, selectedItem?.id)} />
      <AddTableModal isOpen={modals.table} onClose={() => toggleModal('table', false)} propertyData={data.raw} initialData={selectedItem} onSave={(u) => updateData('tables', u, !!selectedItem, selectedItem?.id)} />
    </div>
  );
};

export default PropertyDetail;
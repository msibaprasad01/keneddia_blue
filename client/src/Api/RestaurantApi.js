import API from "./Api";

// vertical headers
export const createVerticalSectionHeader = (data) =>API.post("api/v1/vertical-sections", data);
export const updateVerticalSectionHeader = (id, data) =>API.put(`api/v1/vertical-sections/${id}`, data);
export const getAllVerticalSectionsHeader = () =>API.get("api/v1/vertical-sections/showAll");
export const getVerticalSectionHeaderById = (id) =>API.get(`api/v1/vertical-sections/${id}`);
export const toggleVerticalSectionHeaderStatus = (id, active) =>API.patch(`api/v1/vertical-sections/${id}/status`, null, {params: { active },});

//vertical cards
export const createVerticalCard = (data) =>API.post("api/v1/vertical-cards", data);
export const updateVerticalCard = (id, data) =>API.put(`api/v1/vertical-cards/${id}`, data);
export const getAllVerticalCards = () =>API.get("api/v1/vertical-cards/showAll");
export const getVerticalCardById = (id) =>API.get(`api/v1/vertical-cards/${id}`);
export const toggleVerticalCardStatus = (id, active) =>API.patch(`api/v1/vertical-cards/${id}/status`, null, {params: { active },});

// buffet section headers
export const createBuffetSectionHeader = (data) =>API.post("api/v1/buffet-section-headers", data);
export const updateBuffetSectionHeader = (id, data) =>API.put(`api/v1/buffet-section-headers/${id}`, data);
export const getAllBuffetSectionHeaders = () =>API.get("api/v1/buffet-section-headers/showAll");
export const getBuffetSectionHeaderById = (id) =>API.get(`api/v1/buffet-section-headers/${id}`);
export const toggleBuffetSectionHeaderStatus = (id, active) =>API.patch(`api/v1/buffet-section-headers/${id}/status`, null, {params: { active },});

// buffet items
export const createBuffetItem = (data) =>API.post("api/v1/buffet-items", data);
export const updateBuffetItem = (id, data) =>API.put(`api/v1/buffet-items/${id}`, data);
export const getAllBuffetItems = () =>API.get("api/v1/buffet-items");
export const getBuffetItemById = (id) =>API.get(`api/v1/buffet-items/${id}`);
export const toggleBuffetItemStatus = (id, active) =>API.patch(`api/v1/buffet-items/${id}/status`, null, {params: { active },});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Only governs the below-`lg` overlay drawer, so it must start closed.
  // At `lg`+ the sidebar is docked by CSS and ignores this flag.
  sidebarOpen: false,
  sidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  notifications: [],
  searchQuery: '',
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalData = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        ...action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    markNotificationRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapse,
  openModal,
  closeModal,
  addNotification,
  markNotificationRead,
  clearNotifications,
  setSearchQuery,
  setGlobalLoading,
} = uiSlice.actions;
export default uiSlice.reducer;

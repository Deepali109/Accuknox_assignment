import { configureStore, createSlice } from "@reduxjs/toolkit";
import { initialDashboardData } from "./data";

const widgetsSlice = createSlice({
  name: "widgets",
  initialState: initialDashboardData.widgets.slice(),
  reducers: {
    addWidget(state, action) {
      state.push(action.payload);
    },
    removeWidget(state, action) {
      const id = action.payload;
      return state.filter((w) => w.id !== id);
    },
    updateWidget(state, action) {
      const { id, changes } = action.payload;
      const idx = state.findIndex((w) => w.id === id);
      if (idx >= 0) state[idx] = { ...state[idx], ...changes };
    },
  },
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState: initialDashboardData.categories.slice(),
  reducers: {
    addCategory(state, action) {
      state.push(action.payload);
    },
    toggleWidgetInCategory(state, action) {
      const { categoryId, widgetId } = action.payload;
      const cat = state.find((c) => c.id === categoryId);
      if (!cat) return;
      const idx = cat.widgetIds.indexOf(widgetId);
      if (idx >= 0) cat.widgetIds.splice(idx, 1);
      else cat.widgetIds.push(widgetId);
    },
    removeWidgetFromAllCategories(state, action) {
      const widgetId = action.payload;
      state.forEach((c) => {
        const idx = c.widgetIds.indexOf(widgetId);
        if (idx >= 0) c.widgetIds.splice(idx, 1);
      });
    },
  },
});

const uiSlice = createSlice({
  name: "ui",
  initialState: { selectedCategoryId: initialDashboardData.categories[0].id },
  reducers: {
    selectCategory(state, action) {
      state.selectedCategoryId = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    widgets: widgetsSlice.reducer,
    categories: categoriesSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export const { addWidget, removeWidget, updateWidget } = widgetsSlice.actions;
export const {
  addCategory,
  toggleWidgetInCategory,
  removeWidgetFromAllCategories,
} = categoriesSlice.actions;
export const { selectCategory } = uiSlice.actions;

export default store;

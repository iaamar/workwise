// Import necessary functions and libraries from Redux toolkit and related packages
import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Import individual slices (reducers) for user, project, task, work item, and comment
import { userSlice } from "./slices/user-slice";
import { projectSlice } from "./slices/project-slice";
import { taskSlice } from "./slices/task-slice";
import { workItemSlice } from "./slices/workitem-slice";
import { commentSlice } from "./slices/comment-slice";

// Import functions for Redux state persistence
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Combine individual slices into a root reducer
const rootReducer = combineReducers({
  [userSlice.name]: userSlice.reducer,
  [projectSlice.name]: projectSlice.reducer,
  [taskSlice.name]: taskSlice.reducer,
  [workItemSlice.name]: workItemSlice.reducer,
  [commentSlice.name]: commentSlice.reducer,
});

// Configuration for Redux state persistence
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Create a persisted reducer using the root reducer and persist configuration
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer and middleware options
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Define types for the store, state, and dispatch
export type AppStore = typeof store;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = typeof store.dispatch;

// Create a persistor to persist the Redux store
export const persistor = persistStore(store);

// Function to reset the Redux store state by dispatching reset actions for each slice
export const resetStore = () => {
  console.log("resetting store");
  store.dispatch(projectSlice.actions.resetProjectState());
  //store.dispatch(taskSlice.actions.resetTaskState());
  //store.dispatch(workItemSlice.actions.resetWorkItemState());
  //store.dispatch(commentSlice.actions.resetCommentState());
  store.dispatch(userSlice.actions.resetUserState());
};

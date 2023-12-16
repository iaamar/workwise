// Import necessary functions and libraries from Redux toolkit
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// Import WorkItem model and workItemService for API interactions
import WorkItem from "../../models/workitem";
import * as workItemService from "../../services/workitem-service";

// Define the state shape for work items
export type WorkItemsState = {
  data: WorkItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  createStatus?: "idle" | "loading" | "succeeded" | "failed";
  currentWorkItem?: any;
};

// Initial state for work items
const initialState: WorkItemsState = {
  data: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  currentWorkItem: null,
};

// Async thunk to create a new work item
export const createNewWorkItem = createAsyncThunk(
  "workitems/createNewWorkItem",
  async (workitem: any, { rejectWithValue }) => {
    try {
      const response: any = await workItemService.createWorkItem(workitem);
      console.log("createProject in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Create project failed"); // or any error message
    }
  }
);

// Async thunk to edit a work item
export const editWorkItem = createAsyncThunk(
  "workitems/editWorkItem",
  async (workitem: any, { rejectWithValue }) => {
    try {
      const response: any = await workItemService.updateWorkItem(workitem);
      console.log("editWorkItem in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Edit workitem failed"); // or any error message
    }
  }
);

// Async thunk to delete a work item
export const deleteWorkItem = createAsyncThunk(
  "workitems/deleteWorkItem",
  async (workitemId: string, { rejectWithValue }) => {
    try {
      const response: any = await workItemService.deleteWorkItem(workitemId);
      console.log("deleteWorkItem in thunk", response);
      return response ? workitemId : null;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Delete workitem failed"); // or any error message
    }
  }
);

// Redux slice for work items
export const workItemSlice = createSlice({
  name: "workitems",
  initialState,
  reducers: {
    //reducers for synchronous actions
    workitemCreated: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload);
    },
    workitemUpdated: (state, action: PayloadAction<any>) => {
      const { _id } = action.payload;
      const existingWorkItem = state.data.find(
        (workitem) => workitem._id === _id
      );
      if (existingWorkItem) {
        Object.assign(existingWorkItem, action.payload);
      }
    },
    workitemDeleted: (state, action: PayloadAction<string>) => {
      const workitemId = action.payload;
      state.data = state.data.filter((workitem) => workitem._id !== workitemId);
    },
    workitemsFetched: (state, action: PayloadAction<any>) => {
      console.log("workitemsFetched", action.payload);
      state.data = action.payload;
    },
    setCurrentWorkItem: (state, action: PayloadAction<WorkItem | null>) => {
      state.currentWorkItem = action.payload;
    },
    resetWorkItemState: (state) => {
      Object.assign(state, initialState);
    },
    newCommentAdded: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
    },
    newTaskAdded: (state, action: PayloadAction<any>) => {
      console.log(action.payload);
    },
  },

  // Extra reducers for handling async thunk actions using builder
  extraReducers: (builder) => {
    builder.addCase(createNewWorkItem.fulfilled, (state, action) => {
      state.data.push(action.payload);
    });
    builder.addCase(editWorkItem.fulfilled, (state, action) => {
      const { _id } = action.payload;
      const existingWorkItem = state.data.find(
        (workitem) => workitem._id === _id
      );
      if (existingWorkItem) {
        Object.assign(existingWorkItem, action.payload);
      }
    });
    builder.addCase(deleteWorkItem.fulfilled, (state, action) => {
      const workitemId = action.payload;
      state.data = state.data.filter((workitem) => workitem._id !== workitemId);
    });
  },
});

// Export actions and reducer
export const {
  workitemCreated,
  workitemDeleted,
  workitemUpdated,
  workitemsFetched,
  resetWorkItemState,
  setCurrentWorkItem,
} = workItemSlice.actions;

export default workItemSlice.reducer;

export const selectWorkItems = (state: any) => state.workitems.data;

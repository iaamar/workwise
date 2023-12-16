// Import necessary functions and libraries from Redux toolkit
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as taskService from "../../services/task-service";

import Task from "../../models/task";

// Define the state shape for tasks
export type TasksState = {
  data: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
};
const initialState: TasksState = {
  data: [],
  status: "idle",
};

// Async thunk to create a new task
export const createNewTask = createAsyncThunk(
  "tasks/createNewTask",
  async (task: any, { rejectWithValue }) => {
    try {
      const response: any = await taskService.createTask(task);
      console.log("createTask in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Create task failed"); // or any error message
    }
  }
);

// Async thunk to edit a task
export const editTask = createAsyncThunk(
  "tasks/editTask",
  async (task: any, { rejectWithValue }) => {
    try {
      const response: any = await taskService.updateTask(task);
      console.log("editTask in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Edit task failed"); // or any error message
    }
  }
);

// Async thunk to delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response: any = await taskService.deleteTask(taskId);
      console.log("deleteTask in thunk", response);
      return response ? taskId : null;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Delete task failed"); // or any error message
    }
  }
);

// Redux slice for tasks
export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Reducer to handle dispatching an action when a task is created
    taskCreated: (state, action: PayloadAction<Task>) => {
      state.data.push(action.payload);
    },
    taskUpdated: (state, action: PayloadAction<Task>) => {
      const { _id } = action.payload;
      const existingTask = state.data.find((task) => task._id === _id);
      if (existingTask) {
        Object.assign(existingTask, action.payload);
      }
    },
    taskDeleted: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.data = state.data.filter((task) => task._id !== taskId);
    },
    tasksFetched: (state, action: PayloadAction<Task[] | any[]>) => {
      state.data = action.payload;
    },
    resetTaskState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Handle fulfilled and rejected states for create, edit, and delete task thunks
    builder.addCase(createNewTask.fulfilled, (state, action) => {
      state.data.push(action.payload);
      state.status = "succeeded";
    });
    builder.addCase(editTask.fulfilled, (state, action) => {
      const { _id } = action.payload;
      const existingTask = state.data.find((task) => task._id === _id);
      if (existingTask) {
        Object.assign(existingTask, action.payload);
        state.status = "succeeded";
      }
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const taskId = action.payload;
      state.data = state.data.filter((task) => task._id !== taskId);
      state.status = "succeeded";
    });
    builder.addCase(createNewTask.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(editTask.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export const {
  taskCreated,
  taskDeleted,
  taskUpdated,
  tasksFetched,
  resetTaskState,
} = taskSlice.actions;

export default taskSlice.reducer;

export const selectTasks = (state: any) => state.tasks.data;

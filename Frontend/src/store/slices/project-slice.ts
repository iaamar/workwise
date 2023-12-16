import { createProject } from "./../../services/project-service";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

import Project from "../../models/project";

import * as projectService from "../../services/project-service";

// Define the state shape for projects
export type ProjectsState = {
  data: Project[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  createStatus?: "idle" | "loading" | "succeeded" | "failed";
  currentProject?: any;
};

// Initial state for projects
export const initialProjectState: ProjectsState = {
  data: [],
  status: "idle",
  error: null,
  createStatus: "idle",
  currentProject: null,
};

// Interface to define the response structure for project deletion
interface DeleteProjectResponse {
  status: string;
  message: string;
  deletedResourceId: string;
}

// Async thunk to fetch projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (userId: string) => {
    const response: any = await projectService.getUsersProjects(userId);
    console.log("fetchProjects in thunk", response);
    return response;
  }
);

// Async thunk to delete a project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response: DeleteProjectResponse =
        await projectService.deleteProject(projectId);
      console.log("deleteProject in thunk", response);
      if (response.status === "success") {
        return { _id: projectId };
      } else {
        return rejectWithValue("Delete project failed");
      }
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Delete project failed"); // or any error message
    }
  }
);

// Async thunk to create a new project
export const createNewProject = createAsyncThunk(
  "projects/createNewProject",
  async (project: any, { rejectWithValue }) => {
    try {
      const response: any = await projectService.createProject(project);
      console.log("createProject in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Create project failed"); // or any error message
    }
  }
);

// Async thunk to update a project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async (project: Project, { rejectWithValue }) => {
    try {
      const response: Project = await projectService.updateProject(project);
      console.log("updateProject in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Update project failed"); // or any error message
    }
  }
);

// Redux slice for projects
export const projectSlice = createSlice({
  name: "projects",
  initialState: initialProjectState,
  reducers: {
    // Reducer to handle dispatching an action when a project is added
    projectAdded: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload);
    },
    projectUpdated: (state, action: PayloadAction<any>) => {
      const { _id } = action.payload;
      const existingProject = state.data.find((project) => project._id === _id);
      if (existingProject) {
        Object.assign(existingProject, action.payload);
      }
    },
    resetProjectState: (state) => {
      Object.assign(state, initialProjectState);
    },
    resetCurrentProject: (state) => {
      state.currentProject = null;
    },
    fetchProjectDetails: (state, action: PayloadAction<any>) => {
      state.currentProject = action.payload;
    },
    projectsFetched: (state, action: PayloadAction<any>) => {
      console.log("projects fetched", action.payload);
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // Handle pending, fulfilled, and rejected states for fetchProjects thunk
      .addCase(fetchProjects.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        console.log("deleteProject.fulfilled", action);
        state.status = "succeeded";
        state.data = state.data.filter(
          (project) => project?._id !== action?.payload?._id
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        console.log("deleteProject.rejected", action);
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(resetProjectState, (state) => {
        Object.assign(state, initialProjectState);
      })
      .addCase(createNewProject.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(createNewProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.push(action.payload);
      })
      .addCase(createNewProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateProject.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { _id } = action.payload;
        const existingProject = state.data.find(
          (project) => project._id === _id
        );
        if (existingProject) {
          Object.assign(existingProject, action.payload);
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const {
  projectAdded,
  projectUpdated,
  resetProjectState,
  fetchProjectDetails,
  resetCurrentProject,
  projectsFetched,
} = projectSlice.actions;

export default projectSlice.reducer;

export const selectAllProjects = (state: { projects: ProjectsState }) =>
  state.projects.data;

export const selectProjectById = (state: { currentProject: Project }) =>
  state.currentProject;

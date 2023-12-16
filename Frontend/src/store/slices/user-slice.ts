// Import necessary functions and libraries from Redux toolkit
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// Import authentication and user service functions
import { login } from "../../services/auth-service";
import { updateUser, deleteUser, getUsers } from "../../services/user-service";
import User from "../../models/user";
import LoginResponse from "../../models/loginResponse";

import { logout } from "../../services/auth-service";

// Define the state shape for users
export type UsersState = {
  data: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | undefined;
  isAuthorized: boolean;
  currentUser: User | null | undefined;
};

// Initial state for users
export const initialUserState: UsersState = {
  data: [],
  status: "idle",
  error: null,
  isAuthorized: false,
  currentUser: null,
};

// Interface to define the response structure for user update
interface UpdateResponse {
  status: string;
  message: string;
  data: User;
}

// Async thunk to log in a user
export const loginUser = createAsyncThunk(
  "users/userLoggedIn",
  async (user: User, { rejectWithValue }) => {
    try {
      const response: LoginResponse = await login(user);
      if (response.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

// Async thunk to update a user's profile
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (user: User, { rejectWithValue }) => {
    try {
      const response: UpdateResponse = await updateUser(user);
      if (response?.status === "success") {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue("Something went wrong");
    }
  }
);

// Async thunk to delete a user's account
export const deleteUserAccount = createAsyncThunk(
  "users/deleteUserAccount",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response: boolean = await deleteUser(userId);

      if (response) {
        //User deleted successfully
        await logout({});
        //resetUserState()
        return true;
      } else {
        return rejectWithValue(false);
      }
    } catch (error) {
      return rejectWithValue(false);
    }
  }
);

// Async thunk to log out a user
export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  try {
    await logout({});
    resetUserState();
    return true;
  } catch (error) {
    return false;
  }
});

// Async thunk to fetch all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await getUsers();
  console.log("fetchUsers in thunk", response);
  return response;
});

// Redux slice for users
export const userSlice = createSlice({
  name: "users",
  initialState: initialUserState,
  reducers: {
    userCreated: (state, action: PayloadAction<User>) => {
      state.data.push(action.payload);
    },
    userUpdated: (state, action: PayloadAction<User>) => {
      const { _id } = action.payload;
      const existingUser = state.data.find((user) => user._id === _id);
      if (existingUser) {
        Object.assign(existingUser, action.payload);
      }
    },
    userDeleted: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.data = state.data.filter((user) => user._id !== userId);
    },
    usersFetched: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload;
    },
    resetUserState: (state) => {
      Object.assign(state, initialUserState);
    },
  },
  extraReducers: (builder) => {
    // Handle pending, fulfilled, and rejected states for loginUser thunk
    builder.addCase(loginUser.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.isAuthorized = true;
      state.currentUser = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
    builder.addCase(updateUserProfile.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.currentUser = action.payload;
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
    builder.addCase(deleteUserAccount.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(deleteUserAccount.fulfilled, (state, action) => {
      state.status = "idle";
      state.isAuthorized = false;
      state.currentUser = null;
    });
    builder.addCase(deleteUserAccount.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });
    builder.addCase(resetUserState, (state) => {
      Object.assign(state, initialUserState);
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.status = "idle";
      state.isAuthorized = false;
      state.currentUser = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.data = action.payload;
      console.log("fetchUsers in extraReducers", action.payload);
    });
  },
});

// Export actions and reducer
export const {
  userCreated,
  userDeleted,
  userUpdated,
  usersFetched,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;

export const selectLoginStatus = (state: { users: UsersState }) =>
  state.users.status;

export const selectCurrentUser = (state: { users: UsersState }) =>
  state.users.currentUser;

export const selectUsers = (state: { users: UsersState }) => state.users.data;

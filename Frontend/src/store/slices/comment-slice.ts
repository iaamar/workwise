// Import necessary functions and libraries from Redux toolkit
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import Comment from "../../models/comment";
import * as commentService from "../../services/comment-service";

// Define the state shape for comments
export type CommentsState = {
  data: Comment[];
  status: "idle" | "loading" | "succeeded" | "failed";
};

// Initial state for comments
const initialState: CommentsState = {
  data: [],
  status: "idle",
};

// Async thunk to create a new comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async (comment: any, { rejectWithValue }) => {
    try {
      const response: any = await commentService.createComment(comment);
      console.log("createComment in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Create comment failed"); // or any error message
    }
  }
);

// Async thunk to update a comment
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (comment: any, { rejectWithValue }) => {
    try {
      const response: any = await commentService.updateComment(comment);
      console.log("updateComment in thunk", response);
      return response;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Update comment failed"); // or any error message
    }
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response: any = await commentService.deleteComment(commentId);
      console.log("deleteComment in thunk", response);
      return response ? commentId : null;
    } catch (error) {
      // Handle other errors if needed
      return rejectWithValue("Delete comment failed"); // or any error message
    }
  }
);

// Redux slice for comments
export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    // Reducer to handle dispatching an action when a comment is added
    commentCreated: (state, action: PayloadAction<Comment>) => {
      state.data.push(action.payload);
    },
    commentUpdated: (state, action: PayloadAction<Comment>) => {
      const { _id } = action.payload;
      const existingComment = state.data.find((comment) => comment._id === _id);
      if (existingComment) {
        Object.assign(existingComment, action.payload);
      }
    },
    commentDeleted: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      state.data = state.data.filter((comment) => comment._id !== commentId);
    },
    commentsFetched: (state, action: PayloadAction<Comment[] | any[]>) => {
      state.data = action.payload;
    },
    resetCommentState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    // Handle fulfilled and rejected states for createComment thunk
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.data.push(action.payload);
      state.status = "succeeded";
    });

    builder.addCase(updateComment.fulfilled, (state, action) => {
      const { _id } = action.payload;
      const existingComment = state.data.find((comment) => comment._id === _id);
      if (existingComment) {
        Object.assign(existingComment, action.payload);
        state.status = "succeeded";
      } else {
        state.status = "failed";
      }
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const commentId = action.payload;
      state.data = state.data.filter((comment) => comment._id !== commentId);
      state.status = "succeeded";
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(updateComment.rejected, (state, action) => {
      state.status = "failed";
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

// Export actions and reducer
export const {
  commentCreated,
  commentDeleted,
  commentUpdated,
  commentsFetched,
  resetCommentState,
} = commentSlice.actions;

export default commentSlice.reducer;

// Selector to get comments from the state
export const selectComments = (state: any) => state.comments.data;

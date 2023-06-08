import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  user: {},
  status: "idle",
  error: null,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state, action) => ({ ...initialState }),
    setDataFromLogin: (state, action) => {

      return {
        ...initialState,
        status: "succeeded",
        user: { ...action.payload.prevState, ...action.payload.user },
      };
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Put the info fetched
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { reset, setDataFromLogin } = UserSlice.actions;

export default UserSlice.reducer;

export const fetchUser = createAsyncThunk(
  "User/fetchUser",
  async (signal) => {
    const response = await axios.get("/users/me", { signal });
    return response.data;
  }
);

export const selectUser = (state) => state.user.user;
export const selectUserEmail = (state) => state.user?.user.email;
export const selectUserName = (state) => state.user?.user?.firstName;
export const selectUserId = (state) => state.user?.user?.id;

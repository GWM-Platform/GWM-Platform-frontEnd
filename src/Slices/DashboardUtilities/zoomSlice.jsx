import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  desktop: 100,
  mobile: 96
};

const ZoomSlice = createSlice({
  name: "zoom",
  initialState,
  reducers: {
    reset: (state, action) => {
      state.desktop = 100;
      state.mobile = 96;
    },
    addDesktop: (state, action) => {
      state.desktop += 1;
    },
    subtractDesktop: (state, action) => {
      state.desktop -= 1;
    },
    addMobile: (state, action) => {
      state.mobile += 1;
    },
    subtractMobile: (state, action) => {
      state.mobile -= 1;
    },
  }
})

export const { addDesktop, subtractDesktop, addMobile, subtractMobile } = ZoomSlice.actions;
export default ZoomSlice.reducer;

export const selectZoomMobile = (state) => state.zoom.mobile;
export const selectZoomDesktop = (state) => state.zoom.desktop;

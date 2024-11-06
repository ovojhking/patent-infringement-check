import { createSlice } from "@reduxjs/toolkit";
import { Analysis } from "../interfaces/analysis";

export const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    value: {},
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { update } = analysisSlice.actions;

export const analysis = (state: { analysis: { value: Analysis } }) =>
  state.analysis.value;

export default analysisSlice.reducer;

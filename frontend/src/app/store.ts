import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "../features/analysis";

export default configureStore({
  reducer: {
    analysis: analysisReducer,
  },
});

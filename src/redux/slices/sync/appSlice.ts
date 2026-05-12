import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  isSidebarOpen: boolean;
}

const initialState: IUserState = {
  isSidebarOpen: true,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsSidebarOpen(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setIsSidebarOpen } = appSlice.actions;
export default appSlice.reducer;

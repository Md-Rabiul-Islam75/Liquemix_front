import { RootState } from "@/redux/store/store";
import { IUser } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  user: IUser | null;
}

const initialState: IUserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});
export const authUser = (state: RootState) => state.user?.user;
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

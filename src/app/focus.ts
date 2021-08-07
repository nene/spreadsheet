import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord } from "./cells";
import { RootState } from "./store";

interface FocusState {
  coord?: CellCoord;
}

const focusSlice = createSlice({
  name: 'focus',
  initialState: {} as FocusState,
  reducers: {
    focusCell(state, action: PayloadAction<CellCoord>) {
      return {coord: action.payload};
    },
  },
});

export const { focusCell } = focusSlice.actions;
export default focusSlice.reducer;

export const selectFocusedCoord = (state: RootState) => state.focus.coord;

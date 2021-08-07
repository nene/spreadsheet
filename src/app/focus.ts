import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord } from "./cells/cells";
import { RootState } from "./store";

interface FocusState {
  coord?: CellCoord;
  editable: boolean;
}

const focusSlice = createSlice({
  name: 'focus',
  initialState: {editable: false} as FocusState,
  reducers: {
    focusCell(state, action: PayloadAction<CellCoord>) {
      return {coord: action.payload, editable: false};
    },
    editCell(state, action: PayloadAction<CellCoord>) {
      return {coord: action.payload, editable: true};
    }
  },
});

export const { focusCell, editCell } = focusSlice.actions;
export default focusSlice.reducer;

export const selectFocusedCoord = (state: RootState) => state.focus.coord;
export const selectEditableCoord = (state: RootState) => state.focus.editable ? state.focus.coord : undefined;

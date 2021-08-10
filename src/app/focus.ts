import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { max } from "ramda";
import { CellCoord } from "./cells/cells";
import { destructCellCoord, makeCellCoord } from "./cells/coord";
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
    },
    editFocusedCell(state, action: PayloadAction<void>) {
      return {...state, editable: true};
    },
    moveFocus(state, action: PayloadAction<{x: number, y: number}>) {
      if (!state.coord) {
        return state;
      }
      return {coord: coordPlus(state.coord, action.payload), editable: false};
    }
  },
});

const coordPlus = (coord: CellCoord, delta: {x: number, y: number}): CellCoord => {
  const {x, y} = destructCellCoord(coord);
  return makeCellCoord({x: max(0, x + delta.x), y: max(0, y + delta.y)});
};

export const { focusCell, editCell, editFocusedCell, moveFocus } = focusSlice.actions;
export default focusSlice.reducer;

export const selectFocusedCoord = (state: RootState) => state.focus.coord;
export const selectEditableCoord = (state: RootState) => state.focus.editable ? state.focus.coord : undefined;

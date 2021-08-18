import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { max, min } from "ramda";
import { ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { setFocusArea } from "./areas";
import { CellCoord } from "./cells/cells";
import { destructCellCoord, makeCellCoord } from "./cells/coord";
import { AppEpic, RootState } from "./store";

interface FocusState {
  coords: [CellCoord] | [CellCoord, CellCoord];
  editable: boolean;
}

const focusSlice = createSlice({
  name: 'focus',
  initialState: {coords: ['A1'], editable: false} as FocusState,
  reducers: {
    focusCell(state, action: PayloadAction<CellCoord>) {
      return {coords: [action.payload], editable: false};
    },
    editCell(state, action: PayloadAction<CellCoord>) {
      return {coords: [action.payload], editable: true};
    },
    editFocusedCell(state, action: PayloadAction<void>) {
      return {...state, editable: true};
    },
    moveFocus(state, action: PayloadAction<{x: number, y: number}>) {
      return {coords: [coordPlus(state.coords[0], action.payload)], editable: false};
    },
    extendFocus(state, action: PayloadAction<CellCoord>) {
      const c1 = state.coords[0];
      const c2 = action.payload;
      const {x: x1, y: y1} = destructCellCoord(c1);
      const {x: x2, y: y2} = destructCellCoord(c2);

      if (x1 === x2 && y1 === y2) {
        return {coords: [c1], editable: false};
      }
      return {
        coords: [
          makeCellCoord({x: min(x1, x2), y: min(y1, y2)}),
          makeCellCoord({x: max(x1, x2), y: max(y1, y2)}),
        ],
        editable: false
      };
    }
  },
});

const coordPlus = (coord: CellCoord, delta: {x: number, y: number}): CellCoord => {
  const {x, y} = destructCellCoord(coord);
  return makeCellCoord({x: max(0, x + delta.x), y: max(0, y + delta.y)});
};

export const { focusCell, editCell, editFocusedCell, moveFocus, extendFocus } = focusSlice.actions;
export default focusSlice.reducer;

export const selectFocusedCoords = (state: RootState): [CellCoord] | [CellCoord, CellCoord] =>
  state.focus.coords;

export const selectEditableCoord = (state: RootState): CellCoord | undefined =>
  state.focus.editable ? state.focus.coords[0] : undefined;

export const focusEpic: AppEpic = (action$, state$) => action$.pipe(
  ofType(extendFocus.type, focusCell.type, editCell.type, moveFocus.type, editFocusedCell.type),
  map(() => selectFocusedCoords(state$.value)),
  map((coords: [string] | [string, string]) => setFocusArea(coords)),
);

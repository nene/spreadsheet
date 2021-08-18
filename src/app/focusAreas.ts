import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaMap, CellSides, createAreaMap } from "./areaMap";
import { CellCoord } from "./cells/cells";
import { RootState } from "./store";

const focusAreasSlice = createSlice({
  name: 'focusAreas',
  initialState: {A1: {top: true, left: true, right: true, bottom: true}} as AreaMap,
  reducers: {
    setFocusArea(state, action: PayloadAction<[CellCoord] | [CellCoord, CellCoord]>) {
      const [coord1, coord2] = action.payload;
      return createAreaMap(coord1, coord2 || coord1);
    },
  }
});

export const { setFocusArea } = focusAreasSlice.actions;
export default focusAreasSlice.reducer;

export const selectFocusedCellSides = (state: RootState, coord: CellCoord): CellSides => state.focusAreas[coord] || {};

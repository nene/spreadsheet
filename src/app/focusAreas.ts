import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaMap, CellSides } from "./areaMap";
import { CellCoord } from "./cells/cells";
import { destructCellCoord, makeCellCoord } from "./cells/coord";
import { RootState } from "./store";

const focusAreasSlice = createSlice({
  name: 'focusAreas',
  initialState: {A1: {top: true, left: true, right: true, bottom: true}} as AreaMap,
  reducers: {
    setFocusArea(state, action: PayloadAction<[CellCoord] | [CellCoord, CellCoord]>) {
      const [coord1, coord2] = action.payload;
      const {x: x1, y: y1} = destructCellCoord(coord1);
      const {x: x2, y: y2} = coord2 ? destructCellCoord(coord2) : {x: x1, y: y1};

      const result: AreaMap = {};
      for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
          if (x === x1 || x === x2 || y === y1 || y === y2) {
            result[makeCellCoord({x, y})] = {
              left: x === x1 || undefined,
              right: x === x2 || undefined,
              top: y === y1 || undefined,
              bottom: y === y2 || undefined,
            };
          }
        }
      }
      return result;
    },
  }
});

export const { setFocusArea } = focusAreasSlice.actions;
export default focusAreasSlice.reducer;

export const selectCellSides = (state: RootState, coord: CellCoord): CellSides => state.focusAreas[coord] || {};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord, CellRange } from "./cells/cells";
import { destructCellCoord, makeCellCoord } from "./cells/coord";

type Sides = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};
type AreasMap = Record<CellCoord, Sides>;

const areasSlice = createSlice({
  name: 'areas',
  initialState: {} as AreasMap,
  reducers: {
    setFocusArea(state, action: PayloadAction<CellRange>) {
      const {x: x1, y: y1} = destructCellCoord(action.payload[0]);
      const {x: x2, y: y2} = destructCellCoord(action.payload[1]);
      const result: AreasMap = {};
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
    }
  }
});

export const { setFocusArea } = areasSlice.actions;
export default areasSlice.reducer;

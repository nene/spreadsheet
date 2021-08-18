import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord, CellRange } from "./cells/cells";
import { destructCellCoord, makeCellCoord } from "./cells/coord";
import { RootState } from "./store";

export type CellSides = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};
type AreasMap = Record<CellCoord, CellSides>;

const areasSlice = createSlice({
  name: 'areas',
  initialState: {} as AreasMap,
  reducers: {
    setFocusArea(state, action: PayloadAction<[CellCoord] | [CellCoord, CellCoord]>) {
      const [coord1, coord2] = action.payload;
      const {x: x1, y: y1} = destructCellCoord(coord1);
      const {x: x2, y: y2} = coord2 ? destructCellCoord(coord2) : {x: x1, y: y1};

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
    },
    setNamedArea(state, action: PayloadAction<{name: string, range: CellRange}>) {
      return state;
    }
  }
});

export const { setFocusArea, setNamedArea } = areasSlice.actions;
export default areasSlice.reducer;

export const selectCellSides = (state: RootState, coord: CellCoord): CellSides => state.areas[coord] || {};

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord, CellRange } from "./cells/cells";

type Side = 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';
type AreasMap = Record<CellCoord, Side[]>;

const areasSlice = createSlice({
  name: 'areas',
  initialState: {} as AreasMap,
  reducers: {
    setFocusArea(state, action: PayloadAction<CellRange>) {
      return state; // TODO
    }
  }
});

export const { setFocusArea } = areasSlice.actions;
export default areasSlice.reducer;

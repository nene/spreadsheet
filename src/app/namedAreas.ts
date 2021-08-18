import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord, CellRange } from "./cells/cells";

export type CellSides = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};
type AreasMap = Record<CellCoord, CellSides>;

type NamedArea = {
  name: string;
  area: AreasMap;
}

type NamedAreasState = NamedArea[];

const namedAreasSlice = createSlice({
  name: 'namedAreas',
  initialState: [] as NamedAreasState,
  reducers: {
    setNamedArea(state, action: PayloadAction<{name: string, range: CellRange}>) {
      return state;
    }
  }
});

export const { setNamedArea } = namedAreasSlice.actions;
export default namedAreasSlice.reducer;

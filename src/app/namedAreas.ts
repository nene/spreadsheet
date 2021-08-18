import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaMap } from "./areaMap";
import { CellRange } from "./cells/cells";

type NamedArea = {
  name: string;
  area: AreaMap;
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

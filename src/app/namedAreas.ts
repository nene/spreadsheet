import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { equals } from "ramda";
import { AreaMap, createAreaMap } from "./areaMap";
import { CellRange } from "./cells/cells";

type NamedArea = {
  name: string;
  range: CellRange;
  map: AreaMap;
};

type NamedAreasState = NamedArea[];

const namedAreasSlice = createSlice({
  name: 'namedAreas',
  initialState: [] as NamedAreasState,
  reducers: {
    setNamedArea(state, action: PayloadAction<{name: string, range: CellRange}>) {
      const {name, range} = action.payload;
      const isExistingArea = (area: NamedArea) => equals(area.range, range);

      if (name === "") {
        return state.filter((area) => !isExistingArea(area));
      }

      if (state.some(isExistingArea)) {
        return state.map((area) => {
          if (isExistingArea(area)) {
            return {...area, name};
          }
          return area;
        });
      } else {
        return [
          ...state,
          {
            name,
            range,
            map: createAreaMap(...range),
          }
        ];
      }
    }
  }
});

export const { setNamedArea } = namedAreasSlice.actions;
export default namedAreasSlice.reducer;

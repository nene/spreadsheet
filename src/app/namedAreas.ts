import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { equals } from "ramda";
import { AreaMap, CellSides, createAreaMap } from "./areaMap";
import { CellCoord, CellRange } from "./cells/cells";
import { RootState } from "./store";

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

export const selectNamedAreaSides = (state: RootState, coord: CellCoord): CellSides => {
  const area = state.namedAreas.find((area) => area.map[coord]);
  return area ? area.map[coord] : {};
};

export const selectAreaName = (state: RootState, coord: CellCoord): string | undefined => {
  const area = state.namedAreas.find((area) => isTopRight(area.map[coord]));
  return area ? area.name : undefined;
};

// Area name is shown at top-right corner
const isTopRight = (sides: CellSides = {}): boolean => Boolean(sides.top && sides.right);

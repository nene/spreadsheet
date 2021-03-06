import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord, CellMap, CellRange } from "./cells";
import { AppEpic, RootState } from "../store";
import { updateCell } from "./updateCell";
import { getCell } from "./eval";
import { assoc, equals, pickBy, pipe } from "ramda";
import { filter, map } from "rxjs/operators";
import { setNamedArea } from "../namedAreas";

type CellsState = CellMap;

const cellsSlice = createSlice({
  name: 'cells',
  initialState: {} as CellsState,
  reducers: {
    setCellValue(state, action: PayloadAction<{coord: CellCoord, value: string}>) {
      return updateCell(action.payload.coord, action.payload.value, state);
    },
    setCellRange(state, action: PayloadAction<{name: string, range: CellRange}>) {
      const {name, range} = action.payload;
      if (name === "") {
        return removeExistingRange(action.payload.range)(state);
      }

      return pipe(
        removeExistingRange(range),
        assoc(name, range),
      )(state);
    },
  },
});

const removeExistingRange = (range: CellRange) => (map: CellMap): CellMap =>
  pickBy((v,k) => !equals(range, v), map);

export const { setCellValue, setCellRange } = cellsSlice.actions;
export default cellsSlice.reducer;

export const selectCell = (state: RootState, coord: CellCoord) => getCell(coord, state.cells);

export const selectCellRangeName = (state: RootState, range: CellRange): string | undefined => {
  for (const [k, v] of Object.entries(state.cells)) {
    if (equals(v, range)) {
      return k;
    }
  }
  return undefined;
}

export const cellsEpic: AppEpic = (action$, state$) => action$.pipe(
  filter(setCellRange.match),
  map((action) => setNamedArea(action.payload)),
);

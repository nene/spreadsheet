import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CellCoord, CellMap } from "./cells";
import { RootState } from "../store";
import { updateCell } from "./updateCell";
import { getCell } from "./eval";

type CellsState = CellMap;

const cellsSlice = createSlice({
  name: 'cells',
  initialState: {} as CellsState,
  reducers: {
    setCellValue(state, action: PayloadAction<{coord: CellCoord, value: string}>) {
      return updateCell(action.payload.coord, action.payload.value, state);
    },
  },
});

export const { setCellValue } = cellsSlice.actions;
export default cellsSlice.reducer;

export const selectCell = (state: RootState, coord: CellCoord) => getCell(coord, state.cells);

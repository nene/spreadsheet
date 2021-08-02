import { CellMap, mkCell } from "./cells";
import { evalCell, evalDeps } from "./eval";
import { updateMap } from "./util";

export const updateCell = (name: string, value: string, cells: CellMap): CellMap => {
  const cells2 = updateMap(name, mkCell(value), cells);
  const cells3 = evalCell(name, cells2);
  return evalDeps(name, cells3);
};

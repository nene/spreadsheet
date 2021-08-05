import { CellMap, mkCell } from "./cells";
import { evalCell, evalDeps } from "./eval";
import { updateMap } from "./util";

export const updateCell = (name: string, value: string, cells: CellMap): CellMap => {
  const cells2 = updateCellAndRef(name, value, cells);
  const cells3 = evalCell(name, cells2);
  return evalDeps(name, cells3);
};

const updateCellAndRef = (name: string, value: string, cells: CellMap): CellMap => {
  const c = mkCell(value);
  if (c.type === "formula" && c.name !== undefined) {
    return updateMap(c.name, name, updateMap(name, c, cells));
  } else {
    return updateMap(name, c, cells);
  }
};

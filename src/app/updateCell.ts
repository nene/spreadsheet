import { dissoc } from "ramda";
import { Cell, CellMap, mkCell, NamedFormulaCell } from "./cells";
import { evalCell, evalDeps, getCell } from "./eval";
import { updateMap } from "./util";

export const updateCell = (name: string, value: string, cells: CellMap): CellMap => {
  const cells2 = updateCellAndRef(name, value, cells);
  const cells3 = evalCell(name, cells2);
  return evalDeps(name, cells3);
};

const updateCellAndRef = (name: string, value: string, cells: CellMap): CellMap => {
  const oldCell = getCell(name, cells);
  const newCell = mkCell(value);

  const cleanCells = maybeDeleteOldRef(oldCell, newCell, cells);

  if (isNamedFormula(newCell)) {
    return updateMap(newCell.name, name, updateMap(name, newCell, cleanCells));
  } else {
    return updateMap(name, newCell, cleanCells);
  }
};

const maybeDeleteOldRef = (oldCell: Cell, newCell: Cell, cells: CellMap): CellMap => {
  if (isNamedFormula(oldCell) && ((isNamedFormula(newCell) && oldCell.name !== newCell.name) || !isNamedFormula(newCell))) {
    return dissoc(oldCell.name, cells);
  } else {
    return cells;
  }
}

const isNamedFormula = (cell: Cell): cell is NamedFormulaCell =>
  cell.type === "formula" && cell.name !== undefined;

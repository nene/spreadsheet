import { assoc, dissoc } from "ramda";
import { Cell, CellMap, mkCell } from "./cells";
import { evalCell, evalDeps, getCell, isNamedFormula } from "./eval";

export const updateCell = (name: string, value: string, cells: CellMap): CellMap => {
  const oldCell = getCell(name, cells);

  const cells2 = updateCellAndRef(name, value, cells);
  const cells3 = evalCell(name, cells2);
  return evalDeps(name, maybeEvalOldDeps(oldCell, cells3));
};

const updateCellAndRef = (name: string, value: string, cells: CellMap): CellMap => {
  const oldCell = getCell(name, cells);
  const newCell = mkCell(value);

  const cleanCells = maybeDeleteOldRef(oldCell, newCell, cells);

  if (isNamedFormula(newCell)) {
    return assoc(newCell.name, name, assoc(name, newCell, cleanCells));
  } else {
    return assoc(name, newCell, cleanCells);
  }
};

const maybeDeleteOldRef = (oldCell: Cell, newCell: Cell, cells: CellMap): CellMap => {
  if (isNamedFormula(oldCell) && ((isNamedFormula(newCell) && oldCell.name !== newCell.name) || !isNamedFormula(newCell))) {
    return dissoc(oldCell.name, cells);
  } else {
    return cells;
  }
}

const maybeEvalOldDeps = (oldCell: Cell, cells: CellMap): CellMap =>
  isNamedFormula(oldCell) ? evalDeps(oldCell.name, cells) : cells;

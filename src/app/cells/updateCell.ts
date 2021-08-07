import { assoc, dissoc } from "ramda";
import { Cell, CellCoord, CellMap, mkCell } from "./cells";
import { evalCell, evalDeps, getCell, isNamedFormula } from "./eval";

export const updateCell = (coord: CellCoord, value: string, cells: CellMap): CellMap => {
  const oldCell = getCell(coord, cells);

  const cells2 = updateCellAndRef(coord, value, cells);
  const cells3 = evalCell(coord, cells2);
  return evalDeps(coord, maybeEvalOldDeps(oldCell, cells3));
};

const updateCellAndRef = (coord: CellCoord, value: string, cells: CellMap): CellMap => {
  const oldCell = getCell(coord, cells);
  const newCell = mkCell(value);

  const cleanCells = maybeDeleteOldRef(oldCell, newCell, cells);

  if (isNamedFormula(newCell)) {
    return assoc(newCell.name, coord, assoc(coord, newCell, cleanCells));
  } else {
    return assoc(coord, newCell, cleanCells);
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

import { Cell, CellMap, ErrorCell, FormulaCell, FormulaFn, mkEmpty, mkError } from "./cells";
import { updateMap } from "./util";

export const getCell = (name: string, matrix: CellMap): Cell => {
  return matrix.get(name) || mkEmpty();
}

export const evalCell = (name: string, cells: CellMap): CellMap => {
  const c = getCell(name, cells);
  if (c.type === "formula" && c.value === undefined) {
    return updateMap(name, evalFormulaCell(c), cells);
  }
  return cells;
}

const evalFormulaCell = (cell: FormulaCell): FormulaCell | ErrorCell => {
  try {
    return {...cell, value: evaluate(cell.fn)};
  } catch (e) {
    return mkError(cell.formula);
  }
}

const evaluate = (fn: FormulaFn): number => {
  const n = fn();
  if (typeof n === "number") {
    return n;
  } else {
    throw new Error("Formula doesn't evaluate to number");
  }
}

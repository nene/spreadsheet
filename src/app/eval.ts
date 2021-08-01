import { Cell, CellMap, ErrorCell, FormulaCell, FormulaFn, mkEmpty, mkError } from "./cells";
import { updateMap } from "./util";

export const getCell = (name: string, cells: CellMap): Cell => {
  return cells.get(name) || mkEmpty();
}

const getCellValue = (name: string, cells: CellMap): number => {
  const c = getCell(name, cells);
  if (c.type === 'formula' && c.value !== undefined) {
    return c.value;
  } else if (c.type === 'number') {
    return c.value;
  } else {
    throw new Error(`Cell ${name} is not numeric`);
  }
}

export const evalCell = (name: string, cells: CellMap): CellMap => {
  const c = getCell(name, cells);
  if (c.type === "formula" && c.value === undefined) {
    const cells2 = evalParams(c.params, cells);
    const args = c.params.map((name) => getCellValue(name, cells2));
    console.log(args);
    return updateMap(name, evalFormulaCell(c, args), cells2);
  }
  return cells;
}

const evalParams = (params: string[], cells: CellMap): CellMap => {
  return params.reduce((cells, name) => evalCell(name, cells), cells);
};

const evalFormulaCell = (cell: FormulaCell, args: number[]): FormulaCell | ErrorCell => {
  try {
    return {...cell, value: callNumericFn(cell.fn, args)};
  } catch (e) {
    return mkError(cell.formula);
  }
}

const callNumericFn = (fn: FormulaFn, args: number[]): number => {
  const n = fn(...args);
  if (typeof n === "number" && !Number.isNaN(n)) {
    return n;
  } else {
    throw new Error("Formula doesn't evaluate to number");
  }
}

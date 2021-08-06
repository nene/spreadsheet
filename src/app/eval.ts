import { assoc, uniq } from "ramda";
import { Cell, CellMap, CellCoord, FormulaFn, mkEmpty, NamedFormulaCell } from "./cells";

export const getCell = (name: string, cells: CellMap): Cell => {
  const value = cells[name];
  if (isCellCoord(value)) {
    return getCell(value, cells);
  } else {
    return value || mkEmpty();
  }
}

const isCellCoord = (value: Cell | CellCoord): value is CellCoord =>
  typeof value === "string";

const isCell = (value: Cell | CellCoord): value is Cell => !isCellCoord(value);

export const isNamedFormula = (cell: Cell): cell is NamedFormulaCell =>
  cell.type === "formula" && cell.name !== undefined;

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
  if (c.type === "formula") {
    try {
      const args = c.params.map((name) => getCellValue(name, cells));
      return assoc(name, {...c, value: callNumericFn(c.fn, args)}, cells);
    } catch (e) {
      return assoc(name, {...c, value: undefined}, cells);
    }
  }
  return cells;
}

const callNumericFn = (fn: FormulaFn, args: number[]): number => {
  const n = fn(...args);
  if (typeof n === "number" && !Number.isNaN(n)) {
    return n;
  } else {
    throw new Error("Formula doesn't evaluate to number");
  }
}

export const evalDeps = (name: string, cells: CellMap): CellMap => {
  const deps = findAllDeps(name, cells);
  // evaluate each dependent cell
  const cells2 = deps.reduce((map, depName) => evalCell(depName, map), cells);
  // then further evaluate dependents of these
  return deps.reduce((map, depName) => evalDeps(depName, map), cells2);
}

const findAllDeps = (name: string, cells: CellMap): string[] => {
  const cell = getCell(name, cells);
  return uniq([
    ...findDeps(name, cells),
    ...(isNamedFormula(cell) ? findDeps(cell.name, cells) : [])
  ]);
}

const findDeps = (name: string, cells: CellMap): string[] => {
  return Object.entries(cells)
    .filter(([k,c]) => isCell(c) && c.type === "formula" && c.params.some((p) => p === name))
    .map(([k,v]) => k);
};

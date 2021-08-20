import { assoc, uniq } from "ramda";
import { Cell, CellMap, CellCoord, mkEmpty, NamedFormulaCell, CellRange } from "./cells";
import { FormulaFn } from "../formula/formula";
import { cellCoordsInRange } from "./coord";

const builtinFunctions = {
  sum: (xs: number[]) => xs.reduce((x,y) => x+y, 0),
};

export const getCellOrRef = (name: string | CellCoord, cells: CellMap): Cell | Cell[] => {
  const value = cells[name];
  if (isCellCoord(value)) {
    return getCellOrRef(value, cells);
  } else if (isCellRange(value)) {
    return cellCoordsInRange(value[0], value[1]).flatMap((coord) => getCellOrRef(coord, cells));
  } else {
    return value || mkEmpty();
  }
}

export const getCell = (name: CellCoord, cells: CellMap): Cell => {
  const cell = getCellOrRef(name, cells);
  if (cell instanceof Array) {
    throw new Error('Cell coordinate can not reference more than one cell');
  }
  return cell;
};

const isCellCoord = (value: Cell | CellCoord | CellRange): value is CellCoord =>
  typeof value === "string";

const isCellRange = (value: Cell | CellCoord | CellRange): value is CellRange =>
  value instanceof Array;

const isCell = (value: Cell | CellCoord | CellRange): value is Cell =>
  !isCellCoord(value) && !isCellRange(value);

export const isNamedFormula = (cell: Cell): cell is NamedFormulaCell =>
  cell.type === "formula" && cell.name !== undefined;

const getCellValue = (name: string | CellCoord, cells: CellMap): number | number[] => {
  const c = getCellOrRef(name, cells);
  if (c instanceof Array) {
    return c.map(singleCellValue);
  } else {
    return singleCellValue(c);
  }
}

const singleCellValue = (c: Cell): number => {
  if (c.type === 'formula' && c.value !== undefined) {
    return c.value;
  } else if (c.type === 'number') {
    return c.value;
  } else {
    throw new Error(`Cell is not numeric`);
  }
}

export const evalCell = (coord: CellCoord, cells: CellMap): CellMap => {
  const c = getCell(coord, cells);
  if (c.type === "formula") {
    try {
      const args = c.params.map((name) => getCellValue(name, cells));
      return assoc(coord, {...c, value: callNumericFn(c.fn, args)}, cells);
    } catch (e) {
      return assoc(coord, {...c, value: undefined}, cells);
    }
  }
  return cells;
}

const callNumericFn = (fn: FormulaFn, args: (number|number[])[]): number => {
  const n = fn(...args, builtinFunctions);
  if (typeof n === "number" && !Number.isNaN(n)) {
    return n;
  } else {
    throw new Error("Formula doesn't evaluate to number");
  }
}

export const evalDeps = (name: string | CellCoord, cells: CellMap): CellMap => {
  const deps = findAllDeps(name, cells);
  // evaluate each dependent cell
  const cells2 = deps.reduce((map, depName) => evalCell(depName, map), cells);
  // then further evaluate dependents of these
  return deps.reduce((map, depName) => evalDeps(depName, map), cells2);
}

const findAllDeps = (name: string | CellCoord, cells: CellMap): string[] => {
  const cell = getCell(name, cells);
  return uniq([
    // dependencies from cell coordinate
    ...findDeps(name, cells),
    // dependencies from formula name
    ...(isNamedFormula(cell) ? findDeps(cell.name, cells) : [])
  ]);
}

const findDeps = (name: string | CellCoord, cells: CellMap): string[] => {
  return Object.entries(cells)
    .filter(([k,c]) => isCell(c) && c.type === "formula" && c.params.some((p) => p === name))
    .map(([k,v]) => k);
};

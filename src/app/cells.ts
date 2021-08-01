type FormulaFn = (...args: number[]) => number;

export type NumberCell = {type: "number"; value: number};
export type FormulaCell = {
  type: "formula";
  formula: string;
  value: number;
  fn: FormulaFn;
  params: string[];
};
export type EmptyCell = {type: "empty"};
export type ErrorCell = {type: "error", value: string};

export type Cell = NumberCell | FormulaCell | ErrorCell | EmptyCell;
export type CellMap = Map<string, Cell>;

export type CellType = "number" | "error" | "formula" | "empty";

export const mkNumber = (value: number): NumberCell => ({type: "number", value});
export const mkFormula = (fields: Omit<FormulaCell, 'type'>): FormulaCell => ({type: "formula", ...fields});
export const mkError = (value: string): ErrorCell => ({type: "error", value});
export const mkEmpty = (): EmptyCell => ({type: "empty"});

export const mkCell = (s: string): Cell => {
  if (s === "") {
    return mkEmpty();
  }
  if (/^\d+$/.test(s)) {
    return mkNumber(parseInt(s, 10));
  }
  if (/^=.*$/.test(s)) {
    try {
      const [fn, params] = mkFunc(s);
      return mkFormula({formula: s, fn, params, value: 0});
    } catch (e) {
      return mkError(s);
    }
  }
  return mkError(s);
}

export const getCell = (name: string, matrix: CellMap): Cell => {
  return matrix.get(name) || mkEmpty();
}

const evaluate = (fn: FormulaFn): number => {
  const n = fn();
  if (typeof n === "number") {
    return n;
  } else {
    throw new Error("Formula doesn't evaluate to number");
  }
}

const mkFunc = (rawFormula: string): [FormulaFn, string[]] => {
  const formula = rawFormula.slice(1);
  const params = extractParams(formula);
  const fn = new Function(...params, `return ${formula};`) as FormulaFn;
  return [fn, params];
};

const extractParams = (formula: string): string[] => {
  return formula.match(/[A-Z][0-9]+/g) || [];
}

export const evalCell = (name: string, cells: CellMap): CellMap => {
  const c = getCell(name, cells);
  if (c.type === "formula") {
    let newCell: Cell;
    try {
      newCell = {...c, value: evaluate(c.fn)};
    } catch (e) {
      newCell = mkError(c.formula);
    }
    const map = new Map(cells);
    map.set(name, newCell);
    return map;
  }
  return cells;
}

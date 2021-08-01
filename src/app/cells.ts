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
export const mkFormula = (formula: string, fn: FormulaFn, params: string[], value: number): FormulaCell => ({
  type: "formula",
  formula,
  fn,
  params,
  value,
});
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
    const formula = s.slice(1);
    try {
      const [fn, params] = mkFunc(formula);
      return mkFormula(formula, fn, params, evaluate(fn));
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

const mkFunc = (formula: string): [FormulaFn, string[]] => {
  const params = extractParams(formula);
  const fn = new Function(...params, `return ${formula};`) as FormulaFn;
  return [fn, params];
};

const extractParams = (formula: string): string[] => {
  return formula.match(/[A-Z][0-9]+/g) || [];
}

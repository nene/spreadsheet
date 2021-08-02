import { uniq } from "ramda";

export type FormulaFn = (...args: number[]) => number;

export type NumberCell = {type: "number"; value: number};
export type FormulaCell = {
  type: "formula";
  formula: string;
  value?: number;
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
      return mkFormula({formula: s, fn, params, value: undefined});
    } catch (e) {
      return mkError(s);
    }
  }
  return mkError(s);
}

const mkFunc = (rawFormula: string): [FormulaFn, string[]] => {
  const formula = rawFormula.slice(1);
  const params = extractParams(formula);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...params, `return ${formula};`) as FormulaFn;
  return [fn, params];
};

const extractParams = (formula: string): string[] => {
  return uniq(formula.match(/[A-Z][0-9]+/g) || []);
}

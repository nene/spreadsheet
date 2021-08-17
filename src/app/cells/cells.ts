import { uniq } from "ramda";

export type FormulaFn = (...args: number[]) => number;

export type NumberCell = {type: "number"; value: number};
export type FormulaCell = {
  type: "formula";
  formula: string;
  value?: number;
  name?: string;
  fn: FormulaFn;
  params: string[];
};
// Subtype of FormulaCell for convenience
export type NamedFormulaCell = FormulaCell & {name: string};
export type EmptyCell = {type: "empty"};
export type ErrorCell = {type: "error", value: string};

export type Cell = NumberCell | FormulaCell | ErrorCell | EmptyCell;
export type CellCoord = string; // like "A1", "C5", ...
export type CellRange = [CellCoord, CellCoord];
export type CellMap = Record<string, Cell | CellCoord | CellRange>;

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
  if (/^([a-zA-Z_]\w*)?=.*$/.test(s)) {
    try {
      const [fn, params, name] = mkFunc(s);
      return mkFormula({formula: s, fn, params, value: undefined, name});
    } catch (e) {
      return mkError(s);
    }
  }
  return mkError(s);
}

const mkFunc = (rawFormula: string): [FormulaFn, string[], string | undefined] => {
  const [name, formula] = rawFormula.split(/=/);
  const params = extractParams(formula);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...params, `return ${formula};`) as FormulaFn;
  return [fn, params, name === "" ? undefined : name];
};

const extractParams = (formula: string): string[] => {
  return uniq(formula.match(/[A-Za-z_]\w*/g) || []);
}

export const cellDisplayValue = (cell: Cell): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": return cell.formula;
    case "error": return cell.value;
  }
}

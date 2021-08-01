export type NumberCell = {type: "number"; value: number};
export type FormulaCell = {type: "formula"; formula: string; value: number};
export type EmptyCell = {type: "empty"};
export type ErrorCell = {type: "error", value: string};

export type MatrixCell = NumberCell | FormulaCell | ErrorCell | EmptyCell;
export type Matrix = MatrixCell[][];

export const mkNumber = (value: number): NumberCell => ({type: "number", value});
export const mkFormula = (formula: string, value: number): FormulaCell => ({type: "formula", formula, value});
export const mkError = (value: string): ErrorCell => ({type: "error", value});
export const mkEmpty = (): EmptyCell => ({type: "empty"});

export const mkCell = (s: string): MatrixCell => {
  if (s === "") {
    return mkEmpty();
  }
  if (/^\d+$/.test(s)) {
    return mkNumber(parseInt(s, 10));
  }
  if (/^=.*$/.test(s)) {
    const formula = s.slice(1);
    try {
      return mkFormula(formula, evaluate(formula));
    } catch (e) {
      return mkError(s);
    }
  }
  return mkError(s);
}

const evaluate = (formula: string): number => {
  const n = eval(formula);
  if (typeof n === "number") {
    return n;
  } else {
    throw new Error("Formula doesn't evaluate to number");
  }
}

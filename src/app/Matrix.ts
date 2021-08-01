export type NumberCell = {type: "number"; value: number};
export type FormulaCell = {type: "formula"; formula: string; value: number};
export type EmptyCell = {type: "empty"};

export type MatrixCell = NumberCell | FormulaCell | EmptyCell;
export type Matrix = MatrixCell[][];

export const mkNumber = (value: number): NumberCell => ({type: "number", value});
export const mkFormula = (formula: string, value: number): FormulaCell => ({type: "formula", formula, value});
export const mkEmpty = (): EmptyCell => ({type: "empty"});

export const mkCell = (s: string): MatrixCell => {
  if (s === "") {
    return mkEmpty();
  }
  return mkNumber(parseInt(s, 10));
}

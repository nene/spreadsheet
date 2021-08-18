import { uniq } from "ramda";

export type FormulaFn = (...args: number[]) => number;

export type CompiledFormula = {
  fn: FormulaFn;
  params: string[];
  name?: string;
};

export const compileFormula = (src: string): CompiledFormula => {
  const [name, formula] = src.split(/=/);
  const params = extractParams(formula);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...params, `return ${formula};`) as FormulaFn;
  return {fn, params, name: name === "" ? undefined : name};
};

const extractParams = (src: string): string[] => {
  return uniq(src.match(/[A-Za-z_]\w*/g) || []);
}

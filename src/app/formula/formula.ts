import { extractParameters } from "./parameters";
import { parseFormula } from "./parser";
import { serializeFormula } from "./serializer";

export type FormulaFn = (...args: any) => number;

export type CompiledFormula = {
  fn: FormulaFn;
  params: string[];
  name?: string;
};

export const compileFormula = (src: string): CompiledFormula => {
  const [name, expressionString] = src.split(/=/);
  const ast = parseFormula(expressionString);
  const params = extractParameters(ast);
  // eslint-disable-next-line no-new-func
  const fn = new Function(...params, '$', serializeFormula(ast)) as FormulaFn;

  return {fn, params, name: name === "" ? undefined : name};
};

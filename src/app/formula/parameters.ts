import { pipe, uniq } from "ramda";
import { Expression } from "./parser";

const extractParams = (exp: Expression): string[] => {
  switch (exp.type) {
    case 'number': return [];
    case 'variable': return [exp.name];
    case 'parenthesized-expression': return extractParams(exp.expression);
    case 'binary-expression': return [...extractParams(exp.left), ...extractParams(exp.right)];
    case 'function-call': return exp.arguments.flatMap(extractParams);
  }
};

export const extractParameters = pipe(extractParams, uniq);

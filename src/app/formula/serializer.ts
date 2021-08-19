import { Expression } from "./parser";

/**
 * Converts AST to JavaScript function body.
 */
export const serializeFormula = (exp: Expression): string =>
  'return ' + serializeExpression(exp) + ';';

const serializeExpression = (exp: Expression): string => {
  switch (exp.type) {
    case 'number': return String(exp.value);
    case 'variable': return exp.name;
    case 'parenthesized-expression': return '(' + serializeExpression(exp.expression) + ')';
    case 'binary-expression': return serializeExpression(exp.left) + ' ' + exp.operator + ' ' + serializeExpression(exp.right);
    case 'function-call': return '$.' + exp.name + '(' + exp.arguments.map(serializeExpression).join(', ') + ')';
  }
}

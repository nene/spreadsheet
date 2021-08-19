export type Expression =
  | NumberLiteral
  | Variable
  | BinaryExpression
  | FunctionCall
  | ParenthesizedExpression;

type NumberLiteral = {type: 'number', value: number};
type Variable = {type: 'variable', name: string};
type BinaryExpression = {type: 'binary-expression', left: Expression, operator: BinaryOperator, right: Expression};
type FunctionCall = {type: 'function-call', name: string, arguments: Expression[]};
type ParenthesizedExpression = {type: 'parenthesized-expression', expression: Expression};

type BinaryOperator = '+' | '-' | '*' | '/';

/**
 * Recursive-descent parser of formula expressions.
 * Parses the expression after `=` sign in formula cell.
 * Returns Abstract Syntax Tree.
 */
export const parseFormula = (src: string): Expression => {
  const tokens = tokenizeExpression(src);
  const [exp, leftoverTokens] = parseExpression(tokens);
  if (leftoverTokens.length > 0) {
    throw parseError('Unexpected token after expression end:', leftoverTokens[0]);
  }
  return exp;
};

const parseExpression = (tokens: Token[]): [Expression, Token[]] => {
  return parsePlusMinExpression(tokens);
};

const parsePlusMinExpression = (tokens: Token[]): [Expression, Token[]] => {
  const [left, rest] = parseMulDivExpression(tokens);
  return parsePlusMinExpressionContinuation(left, rest);
};

const parsePlusMinExpressionContinuation = (left: Expression, tokens: Token[]): [Expression, Token[]] => {
  const [opTok, ...rightTokens] = tokens;
  if (isPlusMinToken(opTok)) {
    const operator = opTok.t;
    const [right, rest2] = parseMulDivExpression(rightTokens);
    return parsePlusMinExpressionContinuation({type: 'binary-expression', left, operator, right}, rest2);
  } else {
    return [left, tokens];
  }
};

const isPlusMinToken = (token?: Token): token is {t: '+', value: string} | {t: '-', value: string} =>
  !!token && (token.t === '+' || token.t === '-');

const parseMulDivExpression = (tokens: Token[]): [Expression, Token[]] => {
  const [left, rest] = parseTerm(tokens);
  return parseMulDivExpressionContinuation(left, rest);
};

const parseMulDivExpressionContinuation = (left: Expression, tokens: Token[]): [Expression, Token[]] => {
  const [opTok, ...rightTokens] = tokens;
  if (isMulDivToken(opTok)) {
    const operator = opTok.t;
    const [right, rest2] = parseTerm(rightTokens);
    return parsePlusMinExpressionContinuation({type: 'binary-expression', left, operator, right}, rest2);
  } else {
    return [left, tokens];
  }
};

const isMulDivToken = (token?: Token): token is {t: '*', value: string} | {t: '/', value: string} =>
  !!token && (token.t === '*' || token.t === '/');

const parseTerm = ([tok, ...tokens]: Token[]): [Expression, Token[]] => {
  switch (tok.t) {
    case 'number': {
      return [{type: 'number', value: tok.value}, tokens];
    }
    case 'name': {
      const nextTok = tokens[0];
      if (nextTok && nextTok.t === '(') {
        return parseFunctionCall([tok, ...tokens]);
      } else {
        return [{type: 'variable', name: tok.value}, tokens];
      }
    }
    case '(': {
      return parseParenthesizedExpression([tok, ...tokens]);
    }
    default: {
      throw parseError('Expected term, instead got', tok);
    }
  }
};

const parseParenthesizedExpression = ([_tok, ...tokens]: Token[]): [Expression, Token[]] => {
  const [expression, [closeTok, ...rest]] = parseExpression(tokens);
  if (closeTok && closeTok.t === ')') {
    return [{type: 'parenthesized-expression', expression}, rest];
  } else {
    throw parseError('Expected closing parenthesis, instead got', closeTok);
  }
};

const parseFunctionCall = ([nameTok, openTok, ...tokens]: Token[]): [Expression, Token[]] => {
  if (!(openTok && openTok.t === '(')) {
    throw parseError('Expected open parenthesis, instead got', openTok);
  }
  if (tokens[0] && tokens[0].t === ')') {
    return [{type: 'function-call', name: nameTok.value as string, arguments: []}, tokens.slice(1)];
  }
  const [exp, [closeTok, ...rest]] = parseExpression(tokens);
  if (closeTok && closeTok.t === ')') {
    return [{type: 'function-call', name: nameTok.value as string, arguments: [exp]}, rest];
  }
  throw parseError('Expected closing parenthesis, instead got', closeTok);
};

const parseError = (msg: string, token?: Token): Error => {
  return new Error(`ParseError: ${msg} ${token ? token.value : 'EOF'}`);
};

type Token =
  | {t: 'number', value: number}
  | {t: 'name', value: string}
  | {t: '+', value: string}
  | {t: '-', value: string}
  | {t: '*', value: string}
  | {t: '/', value: string}
  | {t: '(', value: string}
  | {t: ')', value: string};

const tokenizeExpression = (src: string): Token[] => {
  const tokens: Token[] = [];
  let m: string | undefined;
  while (src.length > 0) {
    [m, src] = consume(/^\s+/, src);
    if (m) {
      continue;
    }
    [m, src] = consume(/^\d+(\.\d*)?/, src);
    if (m) {
      tokens.push({t: 'number', value: parseFloat(m)});
      continue;
    }
    [m, src] = consume(/^[a-zA-Z_]\w*/, src);
    if (m) {
      tokens.push({t: 'name', value: m});
      continue;
    }
    [m, src] = consume(/^[()*/+-]/, src);
    if (m) {
      tokens.push({t: m as '+' | '-' | '*' | '/' | '(' | ')', value: m});
      continue;
    }
    throw new Error('ParseError: Unexpected character at: ' + src);
  }
  return tokens;
};

const consume = (re: RegExp, src: string): [string | undefined, string] => {
  const m = src.match(re);
  if (m && m[0]) {
    return [m[0], src.slice(m[0].length)];
  } else {
    return [undefined, src];
  }
};

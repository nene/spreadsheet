import { parseFormula } from "./parser";

describe('parseFormula()', () => {
  it('parses numbers', () => {
    expect(parseFormula('1')).toEqual({type: 'number', value: 1});
    expect(parseFormula('99')).toEqual({type: 'number', value: 99});
    expect(parseFormula('3.14')).toEqual({type: 'number', value: 3.14});
  });

  it('parses variables', () => {
    expect(parseFormula('foo')).toEqual({type: 'variable', name: 'foo'});
    expect(parseFormula('_bar')).toEqual({type: 'variable', name: '_bar'});
    expect(parseFormula('X8')).toEqual({type: 'variable', name: 'X8'});
  });

  it('parses addition', () => {
    expect(parseFormula('10 + 8')).toEqual({
      type: 'binary-expression',
      left: {type: 'number', value: 10},
      operator: '+',
      right: {type: 'number', value: 8},
    });
  });

  it('parses substraction', () => {
    expect(parseFormula('10 - 8')).toEqual({
      type: 'binary-expression',
      left: {type: 'number', value: 10},
      operator: '-',
      right: {type: 'number', value: 8},
    });
  });

  it('parses multiplication', () => {
    expect(parseFormula('10 * 8')).toEqual({
      type: 'binary-expression',
      left: {type: 'number', value: 10},
      operator: '*',
      right: {type: 'number', value: 8},
    });
  });

  it('parses division', () => {
    expect(parseFormula('10 / 8')).toEqual({
      type: 'binary-expression',
      left: {type: 'number', value: 10},
      operator: '/',
      right: {type: 'number', value: 8},
    });
  });

  it('parses with correct operator precedence', () => {
    expect(parseFormula('6 + 10 * 8')).toEqual({
      type: 'binary-expression',
      left: {type: 'number', value: 6},
      operator: '+',
      right: {
        type: 'binary-expression',
        left: {type: 'number', value: 10},
        operator: '*',
        right: {type: 'number', value: 8},
      },
    });

    expect(parseFormula('6 * 10 + 8')).toEqual({
      type: 'binary-expression',
      left: {
        type: 'binary-expression',
        left: {type: 'number', value: 6},
        operator: '*',
        right: {type: 'number', value: 10},
      },
      operator: '+',
      right: {type: 'number', value: 8},
    });
  });

  it('parses repeated expressions of same-precedence operator: +, -', () => {
    expect(parseFormula('1 + 2 - 3')).toEqual({
      type: 'binary-expression',
      left: {
          type: 'binary-expression',
          left: {type: 'number', value: 1},
          operator: '+',
          right: {type: 'number', value: 2},
      },
      operator: '-',
      right: {type: 'number', value: 3},
    });
  });

  it('parses repeated expressions of same-precedence operator: *, /', () => {
    expect(parseFormula('1 * 2 / 3')).toEqual({
      type: 'binary-expression',
      left: {
          type: 'binary-expression',
          left: {type: 'number', value: 1},
          operator: '*',
          right: {type: 'number', value: 2},
      },
      operator: '/',
      right: {type: 'number', value: 3},
    });
  });

  it('parses parenthesized expression', () => {
    expect(parseFormula('1 * (2 + 3)')).toEqual({
      type: 'binary-expression',
      left: {type: 'number', value: 1},
      operator: '*',
      right: {
        type: 'parenthesized-expression',
        expression: {
          type: 'binary-expression',
          left: {type: 'number', value: 2},
          operator: '+',
          right: {type: 'number', value: 3},
        },
      },
    });
  });

  it('parses function call with single argument', () => {
    expect(parseFormula('foo(2 + 3)')).toEqual({
      type: 'function-call',
      name: 'foo',
      arguments: [
        {
          type: 'binary-expression',
          left: {type: 'number', value: 2},
          operator: '+',
          right: {type: 'number', value: 3},
        },
      ],
    });
  });

  it('parses function call without arguments', () => {
    expect(parseFormula('_blah_()')).toEqual({
      type: 'function-call',
      name: '_blah_',
      arguments: [],
    });
  });

  it('parses complex expression', () => {
    expect(parseFormula('x + sin(foo + 2) / (3 + 6)')).toEqual(
      {
        type: "binary-expression",
        left: {
          name: "x",
          type: "variable",
        },
        operator: "+",
        right: {
          type: "binary-expression",
          left: {
            type: "function-call",
            name: "sin",
            arguments: [
              {
                type: "binary-expression",
                left: {
                  name: "foo",
                  type: "variable",
                },
                operator: "+",
                right: {
                  type: "number",
                  value: 2,
                },
              },
            ],
          },
          operator: "/",
          right: {
            type: "parenthesized-expression",
            expression: {
              type: "binary-expression",
              left: {
                type: "number",
                value: 3,
              },
              operator: "+",
              right: {
                type: "number",
                value: 6,
              },
            },
          },
        },
      }
    );
  });
});

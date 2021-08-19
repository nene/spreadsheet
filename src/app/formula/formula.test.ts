import { compileFormula } from "./formula";

describe('compileFormula()', () => {
  it('compiles formula without parameters', () => {
    const formula = compileFormula('=1+2');
    expect(formula).toEqual({fn: expect.any(Function), params: []});
    expect(formula.fn()).toEqual(3);
  });

  it('compiles formula with parameters', () => {
    const formula = compileFormula('=A1*B1');
    expect(formula).toEqual({fn: expect.any(Function), params: ['A1', 'B1']});
    expect(formula.fn(2,3)).toEqual(6);
  });

  it('compiles formula with name and parameters', () => {
    const formula = compileFormula('foo=x*x');
    expect(formula).toEqual({fn: expect.any(Function), params: ['x'], name: 'foo'});
    expect(formula.fn(3)).toEqual(9);
  });

  it('compiles formula with function call', () => {
    const formula = compileFormula('=sum(ages)');
    expect(formula).toEqual({fn: expect.any(Function), params: ['ages']});
    const $ = {
      sum: (xs: number[]) => xs.reduce((x,y) => x+y, 0)
    };
    expect(formula.fn([1,2,3,4], $)).toEqual(10);
  });
});

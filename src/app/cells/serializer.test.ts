import { pipe } from "ramda";
import { parseFormula } from "./parser";
import { serializeFormula } from "./serializer";

const transform = pipe(parseFormula, serializeFormula);

describe('serializeFormula()', () => {
  it('serializes numbers', () => {
    expect(transform('1')).toEqual('return 1;');
    expect(transform('3.62')).toEqual('return 3.62;');
  });

  it('serializes variables', () => {
    expect(transform('foo')).toEqual('return foo;');
  });

  it('serializes function calls', () => {
    expect(transform('foo(10)')).toEqual('return $.foo(10);');
  });

  it('serializes binary expressions', () => {
    expect(transform('10 + x / 2')).toEqual('return 10 + x / 2;');
  });

  it('serializes parenthesized expressions', () => {
    expect(transform('(10 - x) * fn()')).toEqual('return (10 - x) * $.fn();');
  });
});

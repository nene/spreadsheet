import { pipe } from "ramda";
import { extractParameters } from "./parameters";
import { parseFormula } from "./parser";

const extract = pipe(parseFormula, extractParameters);

describe('extractParameters()', () => {
  it('returns empty array when no parameters found', () => {
    expect(extract('1 + 2 * 3')).toEqual([]);
  });

  it('returns single parameter from single-param expression', () => {
    expect(extract('foo')).toEqual(['foo']);
  });

  it('returns multiple parameters from complex expression', () => {
    expect(extract('2 * foo / sum(bar + 8)')).toEqual(['foo', 'bar']);
  });

  it('only returns unique parameter names', () => {
    expect(extract('foo + 6 + bar + foo - bar')).toEqual(['foo', 'bar']);
  });
});

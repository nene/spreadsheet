import { updateCell } from "./updateCell";

describe('updateCell()', () => {
  it('adds new empty cell', () => {
    expect(updateCell('A1', '', {})).toEqual({
      A1: {type: 'empty'},
    });
  });

  it('adds new numeric cell', () => {
    expect(updateCell('A1', '3', {})).toEqual({
      A1: {type: 'number', value: 3},
    });
  });

  it('adds new error cell', () => {
    expect(updateCell('A1', '?=3', {})).toEqual({
      A1: {type: 'error', value: '?=3'},
    });
  });

  it('adds new formula cell and computes its value', () => {
    expect(updateCell('A1', '=1+2', {})).toEqual({
      A1: {type: 'formula', formula: '=1+2', params: [], fn: expect.any(Function), value: 3},
    });
  });

  it('adds new formula with field refs and computes its value', () => {
    expect(updateCell('B3', '=A1+A2', {
      A1: {type: 'number', value: 1},
      A2: {type: 'number', value: 2},
    })).toEqual({
      A1: {type: 'number', value: 1},
      A2: {type: 'number', value: 2},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 3},
    });
  });

  it('recomputes formula when referenced field is updated', () => {
    expect(updateCell('A2', '20', {
      A1: {type: 'number', value: 1},
      A2: {type: 'number', value: 2},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
    })).toEqual({
      A1: {type: 'number', value: 1},
      A2: {type: 'number', value: 20},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 21},
    });
  });

  it('recomputes chain of dependent formulas when referenced field is updated', () => {
    expect(updateCell('A2', '20', {
      A1: {type: 'number', value: 1},
      A2: {type: 'number', value: 2},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
      C3: {type: 'formula', formula: '=B3+1', params: ['B3'], fn: (c3) => c3+1, value: 4},
      D3: {type: 'formula', formula: '=C3+1', params: ['C3'], fn: (c3) => c3+1, value: 5},
    })).toEqual({
      A1: {type: 'number', value: 1},
      A2: {type: 'number', value: 20},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 21},
      C3: {type: 'formula', formula: '=B3+1', params: ['B3'], fn: expect.any(Function), value: 22},
      D3: {type: 'formula', formula: '=C3+1', params: ['C3'], fn: expect.any(Function), value: 23},
    });
  });

  it('recomputes graph of dependent formulas when referenced field is updated', () => {
    expect(updateCell('A2', '20', {
      A1: {type: 'number', value: 2},
      A2: {type: 'number', value: 3},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 5},
      C3: {type: 'formula', formula: '=A1*A2', params: ['A1', 'A2'], fn: (a1,a2) => a1*a2, value: 6},
      D3: {type: 'formula', formula: '=B3+C3', params: ['B3', 'C3'], fn: (b3,c3) => b3+c3, value: 11},
    })).toEqual({
      A1: {type: 'number', value: 2},
      A2: {type: 'number', value: 20},
      B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 22},
      C3: {type: 'formula', formula: '=A1*A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 40},
      D3: {type: 'formula', formula: '=B3+C3', params: ['B3', 'C3'], fn: expect.any(Function), value: 62},
    });
  });
});

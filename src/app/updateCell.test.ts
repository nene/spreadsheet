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
});

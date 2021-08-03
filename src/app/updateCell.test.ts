import { Cell, CellMap } from "./cells";
import { updateCell } from "./updateCell";

const mkMap = (obj: Record<string, Cell>): CellMap => {
  return Object.entries(obj).reduce((map, [k,v]) => {
    map.set(k, v);
    return map;
  }, new Map())
};

const mkObj = (map: CellMap): Record<string, Cell> => {
  return Array.from(map).reduce((obj: Record<string, Cell>, [k, v]) => {
    obj[k] = v;
    return obj;
  }, {});
}

const update = (name: string, value: string, cells: Record<string, Cell>): Record<string, Cell> => {
  return mkObj(updateCell(name, value, mkMap(cells)));
};

describe('updateCell()', () => {
  it('adds new empty cell', () => {
    expect(update('A1', '', {})).toEqual({
      A1: {type: 'empty'},
    });
  });

  it('adds new numeric cell', () => {
    expect(update('A1', '3', {})).toEqual({
      A1: {type: 'number', value: 3},
    });
  });

  it('adds new error cell', () => {
    expect(update('A1', '?=3', {})).toEqual({
      A1: {type: 'error', value: '?=3'},
    });
  });

  it('adds new formula cell and computes its value', () => {
    expect(update('A1', '=1+2', {})).toEqual({
      A1: {type: 'formula', formula: '=1+2', params: [], fn: expect.any(Function), value: 3},
    });
  });
});

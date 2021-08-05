import { updateCell } from "./updateCell";

describe('updateCell()', () => {
  describe('adds new', () => {
    it('empty cell', () => {
      expect(updateCell('A1', '', {})).toEqual({
        A1: {type: 'empty'},
      });
    });

    it('numeric cell', () => {
      expect(updateCell('A1', '3', {})).toEqual({
        A1: {type: 'number', value: 3},
      });
    });

    it('error cell', () => {
      expect(updateCell('A1', '?=3', {})).toEqual({
        A1: {type: 'error', value: '?=3'},
      });
    });

    it('formula cell -> computed value', () => {
      expect(updateCell('A1', '=1+2', {})).toEqual({
        A1: {type: 'formula', formula: '=1+2', params: [], fn: expect.any(Function), value: 3},
      });
    });

    it('formula with field refs -> computed value', () => {
      expect(updateCell('B3', '=A1+A2', {
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 2},
      })).toEqual({
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 2},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 3},
      });
    });

    it('invalid formula -> error cell', () => {
      expect(updateCell('B3', '=A1 { A2', {
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 2},
      })).toEqual({
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 2},
        B3: {type: 'error', value: '=A1 { A2'},
      });
    });

    it('formula with empty field refs -> undefined value', () => {
      expect(updateCell('B3', '=A1+A2', {
        A1: {type: 'number', value: 1},
      })).toEqual({
        A1: {type: 'number', value: 1},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
      });
    });

    it('formula with error field refs -> undefined value', () => {
      expect(updateCell('B3', '=A1+A2', {
        A1: {type: 'number', value: 1},
        A2: {type: 'error', value: '?'},
      })).toEqual({
        A1: {type: 'number', value: 1},
        A2: {type: 'error', value: '?'},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
      });
    });

    it('formula computing to NaN -> undefined value', () => {
      expect(updateCell('B3', '=A1/A2', {
        A1: {type: 'number', value: 0},
        A2: {type: 'number', value: 0},
      })).toEqual({
        A1: {type: 'number', value: 0},
        A2: {type: 'number', value: 0},
        B3: {type: 'formula', formula: '=A1/A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
      });
    });

    it('formula computing to non-numeric value -> undefined value', () => {
      expect(updateCell('B3', '="..."', {})).toEqual({
        B3: {type: 'formula', formula: '="..."', params: [], fn: expect.any(Function), value: undefined},
      });
    });

    it('named formula -> computed value', () => {
      expect(updateCell('A1', 'foo=1+2', {})).toEqual({
        A1: {type: 'formula', formula: 'foo=1+2', params: [], fn: expect.any(Function), value: 3, name: 'foo'},
        foo: "A1",
      });
    });

    it('formula referencing named variables -> computed value', () => {
      expect(updateCell('A3', '=sum/count', {
        A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
        sum: 'A1',
        A2: {type: 'formula', formula: 'count=4', params: [], fn: expect.any(Function), value: 4, name: 'count'},
        count: 'A2',
      })).toEqual({
        A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
        sum: 'A1',
        A2: {type: 'formula', formula: 'count=4', params: [], fn: expect.any(Function), value: 4, name: 'count'},
        count: 'A2',
        A3: {type: 'formula', formula: '=sum/count', params: ['sum', 'count'], fn: expect.any(Function), value: 8},
      });
    });
  });

  describe('when referenced field updated', () => {
    it('recomputes formula', () => {
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

    it('recomputes previously uncomputed formula', () => {
      expect(updateCell('A2', '20', {
        A1: {type: 'number', value: 1},
        A2: {type: 'empty'},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: undefined},
      })).toEqual({
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 20},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 21},
      });
    });

    it('recomputes chain of dependent formulas', () => {
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

    it('recomputes graph of dependent formulas', () => {
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

  describe('when referenced field removed', () => {
    it('recomputes formula to undefined value', () => {
      expect(updateCell('A2', '', {
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 2},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
      })).toEqual({
        A1: {type: 'number', value: 1},
        A2: {type: 'empty'},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
      });
    });
  });

  describe('when referenced field errors', () => {
    it('recomputes formula to undefined value', () => {
      expect(updateCell('A2', '?blah?', {
        A1: {type: 'number', value: 1},
        A2: {type: 'number', value: 2},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
      })).toEqual({
        A1: {type: 'number', value: 1},
        A2: {type: 'error', value: '?blah?'},
        B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
      });
    });
  });

  describe('named formula', () => {
    it('when name changed, updates formula and its reference', () => {
      expect(updateCell('A1', 'total=32', {
        A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
        sum: 'A1',
      })).toEqual({
        A1: {type: 'formula', formula: 'total=32', params: [], fn: expect.any(Function), value: 32, name: 'total'},
        total: 'A1',
      });
    });

    it('when name removed, updates formula and deletes its reference', () => {
      expect(updateCell('A1', '=32', {
        A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
        sum: 'A1',
      })).toEqual({
        A1: {type: 'formula', formula: '=32', params: [], fn: expect.any(Function), value: 32},
      });
    });

    it('when deleted, also deletes its reference', () => {
      expect(updateCell('A1', '', {
        A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
        sum: 'A1',
      })).toEqual({
        A1: {type: 'empty'},
      });
    });
  });
});

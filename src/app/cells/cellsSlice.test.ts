import reducer, { setCellRange, setCellValue } from "./cellsSlice";

describe('cells reducer', () => {
  describe('setCellValue action', () => {
    describe('adds new', () => {
      it('empty cell', () => {
        expect(reducer({}, setCellValue({coord: 'A1', value: ''}))).toEqual({
          A1: {type: 'empty'},
        });
      });

      it('numeric cell', () => {
        expect(reducer({}, setCellValue({coord: 'A1', value: '3'}))).toEqual({
          A1: {type: 'number', value: 3},
        });
      });

      it('error cell', () => {
        expect(reducer({}, setCellValue({coord: 'A1', value: '?=3'}))).toEqual({
          A1: {type: 'error', value: '?=3'},
        });
      });

      it('formula cell -> computed value', () => {
        expect(reducer({}, setCellValue({coord: 'A1', value: '=1+2'}))).toEqual({
          A1: {type: 'formula', formula: '=1+2', params: [], fn: expect.any(Function), value: 3},
        });
      });

      it('formula with field refs -> computed value', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
        }, setCellValue({coord: 'B3', value: '=A1+A2'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 3},
        });
      });

      it('invalid formula -> error cell', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
        }, setCellValue({coord: 'B3', value: '=A1 { A2'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
          B3: {type: 'error', value: '=A1 { A2'},
        });
      });

      it('formula with empty field refs -> undefined value', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
        }, setCellValue({coord: 'B3', value: '=A1+A2'}))).toEqual({
          A1: {type: 'number', value: 1},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
        });
      });

      it('formula with error field refs -> undefined value', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'error', value: '?'},
        }, setCellValue({coord: 'B3', value: '=A1+A2'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'error', value: '?'},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
        });
      });

      it('formula computing to NaN -> undefined value', () => {
        expect(reducer({
          A1: {type: 'number', value: 0},
          A2: {type: 'number', value: 0},
        }, setCellValue({coord: 'B3', value: '=A1/A2'}))).toEqual({
          A1: {type: 'number', value: 0},
          A2: {type: 'number', value: 0},
          B3: {type: 'formula', formula: '=A1/A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
        });
      });

      it('named formula -> computed value', () => {
        expect(reducer({}, setCellValue({coord: 'A1', value: 'foo=1+2'}))).toEqual({
          A1: {type: 'formula', formula: 'foo=1+2', params: [], fn: expect.any(Function), value: 3, name: 'foo'},
          foo: "A1",
        });
      });

      it('formula referencing named variables -> computed value', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
          sum: 'A1',
          A2: {type: 'formula', formula: 'count=4', params: [], fn: expect.any(Function), value: 4, name: 'count'},
          count: 'A2',
        }, setCellValue({coord: 'A3', value: '=sum/count'}))).toEqual({
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
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
        }, setCellValue({coord: 'A2', value: '20'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 20},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 21},
        });
      });

      it('recomputes previously uncomputed formula', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'empty'},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: undefined},
        }, setCellValue({coord: 'A2', value: '20'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 20},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 21},
        });
      });

      it('recomputes chain of dependent formulas', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
          C3: {type: 'formula', formula: '=B3+1', params: ['B3'], fn: (c3) => c3+1, value: 4},
          D3: {type: 'formula', formula: '=C3+1', params: ['C3'], fn: (c3) => c3+1, value: 5},
        }, setCellValue({coord: 'A2', value: '20'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 20},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 21},
          C3: {type: 'formula', formula: '=B3+1', params: ['B3'], fn: expect.any(Function), value: 22},
          D3: {type: 'formula', formula: '=C3+1', params: ['C3'], fn: expect.any(Function), value: 23},
        });
      });

      it('recomputes graph of dependent formulas', () => {
        expect(reducer({
          A1: {type: 'number', value: 2},
          A2: {type: 'number', value: 3},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 5},
          C3: {type: 'formula', formula: '=A1*A2', params: ['A1', 'A2'], fn: (a1,a2) => a1*a2, value: 6},
          D3: {type: 'formula', formula: '=B3+C3', params: ['B3', 'C3'], fn: (b3,c3) => b3+c3, value: 11},
        }, setCellValue({coord: 'A2', value: '20'}))).toEqual({
          A1: {type: 'number', value: 2},
          A2: {type: 'number', value: 20},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 22},
          C3: {type: 'formula', formula: '=A1*A2', params: ['A1', 'A2'], fn: expect.any(Function), value: 40},
          D3: {type: 'formula', formula: '=B3+C3', params: ['B3', 'C3'], fn: expect.any(Function), value: 62},
        });
      });
    });

    describe('when referenced named formula updated', () => {
      it('recomputes formula', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'foo=10', params: [], fn: () => 10, value: 10, name: 'foo'},
          foo: 'A1',
          B2: {type: 'formula', formula: '=foo+2', params: ['foo'], fn: (foo) => foo+2, value: 12},
        }, setCellValue({coord: 'A1', value: 'foo=2'}))).toEqual({
          A1: {type: 'formula', formula: 'foo=2', params: [], fn: expect.any(Function), value: 2, name: 'foo'},
          foo: 'A1',
          B2: {type: 'formula', formula: '=foo+2', params: ['foo'], fn: expect.any(Function), value: 4},
        });
      });

      it('recomputes previously uncomputed formula', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'foo=10', params: [], fn: () => 10, value: 10, name: 'foo'},
          foo: 'A1',
          A2: {type: 'formula', formula: 'b=20', params: [], fn: () => 20, value: 20, name: 'b'},
          b: 'A2',
          B3: {type: 'formula', formula: '=foo+bar', params: ['foo', 'bar'], fn: (foo,bar) => foo+bar, value: undefined},
        }, setCellValue({coord: 'A2', value: 'bar=20'}))).toEqual({
          A1: {type: 'formula', formula: 'foo=10', params: [], fn: expect.any(Function), value: 10, name: 'foo'},
          foo: 'A1',
          A2: {type: 'formula', formula: 'bar=20', params: [], fn: expect.any(Function), value: 20, name: 'bar'},
          bar: 'A2',
          B3: {type: 'formula', formula: '=foo+bar', params: ['foo', 'bar'], fn: expect.any(Function), value: 30},
        });
      });

      it('recomputes chain of dependent formulas', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'foo=10', params: [], fn: () => 10, value: 10, name: 'foo'},
          foo: 'A1',
          A2: {type: 'formula', formula: 'bar=foo+1', params: ['foo'], fn: (foo) => foo+1, value: 11, name: 'bar'},
          bar: 'A2',
          B3: {type: 'formula', formula: '=bar+1', params: ['bar'], fn: (bar) => bar+1, value: 12},
        }, setCellValue({coord: 'A1', value: 'foo=20'}))).toEqual({
          A1: {type: 'formula', formula: 'foo=20', params: [], fn: expect.any(Function), value: 20, name: 'foo'},
          foo: 'A1',
          A2: {type: 'formula', formula: 'bar=foo+1', params: ['foo'], fn: expect.any(Function), value: 21, name: 'bar'},
          bar: 'A2',
          B3: {type: 'formula', formula: '=bar+1', params: ['bar'], fn: expect.any(Function), value: 22},
        });
      });
    });

    describe('when referenced field removed', () => {
      it('recomputes formula to undefined value', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
        }, setCellValue({coord: 'A2', value: ''}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'empty'},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
        });
      });
    });

    describe('when referenced named formula removed', () => {
      it('recomputes formula to undefined value', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'foo=10', params: [], fn: () => 10, value: 10, name: 'foo'},
          foo: 'A1',
          B3: {type: 'formula', formula: '=foo+1', params: ['foo'], fn: (foo) => foo+1, value: 11},
        }, setCellValue({coord: 'A1', value: ''}))).toEqual({
          A1: {type: 'empty'},
          B3: {type: 'formula', formula: '=foo+1', params: ['foo'], fn: expect.any(Function), value: undefined},
        });
      });
    });

    describe('when referenced field errors', () => {
      it('recomputes formula to undefined value', () => {
        expect(reducer({
          A1: {type: 'number', value: 1},
          A2: {type: 'number', value: 2},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: (a1,a2) => a1+a2, value: 3},
        }, setCellValue({coord: 'A2', value: '?blah?'}))).toEqual({
          A1: {type: 'number', value: 1},
          A2: {type: 'error', value: '?blah?'},
          B3: {type: 'formula', formula: '=A1+A2', params: ['A1', 'A2'], fn: expect.any(Function), value: undefined},
        });
      });
    });

    describe('named formula', () => {
      it('when name changed, updates formula and its reference', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
          sum: 'A1',
        }, setCellValue({coord: 'A1', value: 'total=32'}))).toEqual({
          A1: {type: 'formula', formula: 'total=32', params: [], fn: expect.any(Function), value: 32, name: 'total'},
          total: 'A1',
        });
      });

      it('when name removed, updates formula and deletes its reference', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
          sum: 'A1',
        }, setCellValue({coord: 'A1', value: '=32'}))).toEqual({
          A1: {type: 'formula', formula: '=32', params: [], fn: expect.any(Function), value: 32},
        });
      });

      it('when deleted, also deletes its reference', () => {
        expect(reducer({
          A1: {type: 'formula', formula: 'sum=32', params: [], fn: expect.any(Function), value: 32, name: 'sum'},
          sum: 'A1',
        }, setCellValue({coord: 'A1', value: ''}))).toEqual({
          A1: {type: 'empty'},
        });
      });
    });
  });

  describe('setCellRange action', () => {
    it('adds named field to cells state', () => {
      expect(reducer(
        {x: 'C8'},
        setCellRange({name: 'foo', range: ['A1', 'B2']})
      )).toEqual({
        x: 'C8',
        foo: ['A1', 'B2'],
      });
    });

    it('updates name of existing range', () => {
      expect(reducer(
        {
          z: ['A1', 'A2'],
          foo: ['A1', 'B2'],
          x: ['A3', 'C7'],
        },
        setCellRange({name: 'bar', range: ['A1', 'B2']})
      )).toEqual({
        z: ['A1', 'A2'],
        bar: ['A1', 'B2'],
        x: ['A3', 'C7'],
      });
    });

    it('setting empty name, deletes the named range', () => {
      expect(reducer(
        {foo: ['A1', 'B2'], bar: ['C3', 'D4']},
        setCellRange({name: '', range: ['A1', 'B2']})
      )).toEqual({
        bar: ['C3', 'D4'],
      });
    });
  });
});

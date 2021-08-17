import reducer, { setCellRange } from "./cellsSlice";

describe('cells reducer', () => {
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

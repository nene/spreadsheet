import reducer, { editCell, editFocusedCell, extendFocus, focusCell, moveFocus } from "./focus";

describe('focus reducer', () => {
  it('defaults to first cell', () => {
    expect(reducer(
      undefined,
      {type: 'INIT'}
    )).toEqual(
      {coords: ['A1'], editable: false}
    );
  });

  describe('focusCell action', () => {
    it('focuses to specified coordinate', () => {
      expect(reducer(
        {coords: ['A1'], editable: false},
        focusCell('B2')
      )).toEqual(
        {coords: ['B2'], editable: false}
      );
    });

    it('exits edit mode', () => {
      expect(reducer(
        {coords: ['A1'], editable: true},
        focusCell('C2')
      )).toEqual(
        {coords: ['C2'], editable: false}
      );
    });
  });

  describe('editCell action', () => {
    it('sets specified cell as focused and editable', () => {
      expect(reducer(
        {coords: ['A1'], editable: false},
        editCell('B2')
      )).toEqual(
        {coords: ['B2'], editable: true}
      );
    });
  });

  describe('editFocusedCell action', () => {
    it('sets currently focused cell as editable', () => {
      expect(reducer(
        {coords: ['C4'], editable: false},
        editFocusedCell()
      )).toEqual(
        {coords: ['C4'], editable: true}
      );
    });
  });

  describe('moveFocus action', () => {
    it('moves focused cell by specified amount', () => {
      [
        {from: 'C4', x: 0, y: 0, to: 'C4'},
        {from: 'C4', x: 0, y: 1, to: 'C5'},
        {from: 'C4', x: 0, y: -1, to: 'C3'},
        {from: 'C4', x: 1, y: 0, to: 'D4'},
        {from: 'C4', x: -1, y: 0, to: 'B4'},
        {from: 'C4', x: 2, y: 3, to: 'E7'},
      ].forEach(({from, x, y, to}) => {
        expect(reducer(
          {coords: [from], editable: false},
          moveFocus({x, y})
        )).toEqual(
          {coords: [to], editable: false}
        );
      });
    });

    it('discards multi-selection', () => {
      expect(reducer(
        {coords: ['B2', 'D4'], editable: false},
        moveFocus({x: 1, y: 1})
      )).toEqual(
        {coords: ['C3'], editable: false}
      );
    });

    it('exits edit mode', () => {
      expect(reducer(
        {coords: ['B2'], editable: true},
        moveFocus({x: 1, y: 1})
      )).toEqual(
        {coords: ['C3'], editable: false}
      );
    });
  });

  describe('extendFocus action', () => {
    it('creates selection encompassing both coordinates', () => {
      [
        // larger on X & Y axis
        {orig: 'A1', coord: 'B3', expected: ['A1', 'B3']},
        {orig: 'A1', coord: 'A2', expected: ['A1', 'A2']},
        {orig: 'A1', coord: 'B1', expected: ['A1', 'B1']},
        // smaller on X & Y axis
        {orig: 'B3', coord: 'A1', expected: ['A1', 'B3']},
        {orig: 'B3', coord: 'B2', expected: ['B2', 'B3']},
        {orig: 'B3', coord: 'A3', expected: ['A3', 'B3']},
        // smaller on X, larger on Y axis
        {orig: 'C3', coord: 'B4', expected: ['B3', 'C4']},
        // larger on X, smaller on Y axis
        {orig: 'C3', coord: 'D2', expected: ['C2', 'D3']},
      ].forEach(({orig, coord, expected}) => {
        expect(reducer(
          {coords: [orig], editable: false},
          extendFocus(coord)
        )).toEqual(
          {coords: expected, editable: false}
        );
      });
    });

    it('keeps single coordinate when the same coordinate given', () => {
      expect(reducer(
        {coords: ['B3'], editable: false},
        extendFocus('B3')
      )).toEqual(
        {coords: ['B3'], editable: false}
      );
    });

    it('overwrites second coordinate', () => {
      expect(reducer(
        {coords: ['A1', 'B3'], editable: false},
        extendFocus('D8')
      )).toEqual(
        {coords: ['A1', 'D8'], editable: false}
      );
    });

    it('exits edit mode', () => {
      expect(reducer(
        {coords: ['A1'], editable: true},
        extendFocus('X2')
      )).toEqual(
        {coords: ['A1', 'X2'], editable: false}
      );
    });
  });
});

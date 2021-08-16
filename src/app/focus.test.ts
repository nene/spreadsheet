import reducer, { editCell, editFocusedCell, extendFocus, focusCell, moveFocus } from "./focus";

describe('focus reducer', () => {
  describe('focusCell action', () => {
    it('focuses to specified coordinate', () => {
      expect(reducer(
        {coords: [], editable: false},
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
        {coords: [], editable: false},
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
    it('does nothing when nothing focused', () => {
      expect(reducer(
        {coords: [], editable: false},
        moveFocus({x: 1, y: 1})
      )).toEqual(
        {coords: [], editable: false}
      );
    });

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
    it('does nothing when nothing focused', () => {
      expect(reducer(
        {coords: [], editable: false},
        extendFocus('B3')
      )).toEqual(
        {coords: [], editable: false}
      );
    });

    it('sets second coordinate', () => {
      expect(reducer(
        {coords: ['A1'], editable: false},
        extendFocus('B3')
      )).toEqual(
        {coords: ['A1', 'B3'], editable: false}
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

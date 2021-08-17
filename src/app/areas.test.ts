import reducer, { setFocusArea } from './areas';

describe('areas reducer', () => {
  describe('setFocusArea action', () => {
    it('with single coordinate fills just that cell', () => {
      expect(reducer({}, setFocusArea(['B2']))).toEqual({
        B2: {top: true, left: true, bottom: true, right: true},
      });
    });

    it('with two coordinates fills area borders', () => {
      expect(reducer({}, setFocusArea(['A1', 'C3']))).toEqual({
        A1: {top: true, left: true},
        B1: {top: true},
        C1: {top: true, right: true},
        A2: {left: true},
        C2: {right: true},
        A3: {left: true, bottom: true},
        B3: {bottom: true},
        C3: {bottom: true, right: true},
      });
    });

    it('with two next-to-each-other coordinates', () => {
      expect(reducer({}, setFocusArea(['B1', 'B2']))).toEqual({
        B1: {top: true, left: true, right: true},
        B2: {bottom: true, left: true, right: true},
      });
    });
  });
});

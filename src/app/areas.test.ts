import reducer, { setFocusArea } from './areas';

describe('areas reducer', () => {
  describe('setFocusArea action', () => {
    it('fills area borders', () => {
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
  });
});

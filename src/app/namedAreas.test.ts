import reducer, { setNamedArea } from "./namedAreas";

describe('cells reducer', () => {
  describe('setNamedArea action', () => {
    it('adds named area to empty state', () => {
      expect(reducer(
        [],
        setNamedArea({name: 'foo', range: ['A1', 'A2']})
      )).toEqual([
        {
          name: 'foo',
          range: ['A1', 'A2'],
          map: {
            A1: {top: true, left: true, right: true},
            A2: {bottom: true, left: true, right: true},
          }
        }
      ]);
    });

    it('adds named area to non-empty state', () => {
      expect(reducer(
        [
          {
            name: 'blah',
            range: ['C1', 'C2'],
            map: {
              C1: {top: true, left: true, right: true},
              C2: {bottom: true, left: true, right: true},
            }
          },
          {
            name: 'flop',
            range: ['X1', 'X2'],
            map: {
              X1: {top: true, left: true, right: true},
              X2: {bottom: true, left: true, right: true},
            }
          },
        ],
        setNamedArea({name: 'foo', range: ['A1', 'A2']})
      )).toEqual([
        {
          name: 'blah',
          range: ['C1', 'C2'],
          map: {
            C1: {top: true, left: true, right: true},
            C2: {bottom: true, left: true, right: true},
          }
        },
        {
          name: 'flop',
          range: ['X1', 'X2'],
          map: {
            X1: {top: true, left: true, right: true},
            X2: {bottom: true, left: true, right: true},
          }
        },
        {
          name: 'foo',
          range: ['A1', 'A2'],
          map: {
            A1: {top: true, left: true, right: true},
            A2: {bottom: true, left: true, right: true},
          }
        },
      ]);
    });

    it('updates name of existing area', () => {
      expect(reducer(
        [
          {
            name: 'blah',
            range: ['C1', 'C2'],
            map: {
              C1: {top: true, left: true, right: true},
              C2: {bottom: true, left: true, right: true},
            }
          },
          {
            name: 'foo',
            range: ['A1', 'A2'],
            map: {
              A1: {top: true, left: true, right: true},
              A2: {bottom: true, left: true, right: true},
            }
          },
          {
            name: 'flop',
            range: ['X1', 'X2'],
            map: {
              X1: {top: true, left: true, right: true},
              X2: {bottom: true, left: true, right: true},
            }
          },
        ],
        setNamedArea({name: 'bar', range: ['A1', 'A2']})
      )).toEqual([
        {
          name: 'blah',
          range: ['C1', 'C2'],
          map: {
            C1: {top: true, left: true, right: true},
            C2: {bottom: true, left: true, right: true},
          }
        },
        {
          name: 'bar',
          range: ['A1', 'A2'],
          map: {
            A1: {top: true, left: true, right: true},
            A2: {bottom: true, left: true, right: true},
          }
        },
        {
          name: 'flop',
          range: ['X1', 'X2'],
          map: {
            X1: {top: true, left: true, right: true},
            X2: {bottom: true, left: true, right: true},
          }
        },
      ]);
    });

    it('setting empty name, deletes the named area', () => {
      expect(reducer(
        [
          {
            name: 'blah',
            range: ['C1', 'C2'],
            map: {
              C1: {top: true, left: true, right: true},
              C2: {bottom: true, left: true, right: true},
            }
          },
          {
            name: 'foo',
            range: ['A1', 'A2'],
            map: {
              A1: {top: true, left: true, right: true},
              A2: {bottom: true, left: true, right: true},
            }
          },
          {
            name: 'flop',
            range: ['X1', 'X2'],
            map: {
              X1: {top: true, left: true, right: true},
              X2: {bottom: true, left: true, right: true},
            }
          },
        ],
        setNamedArea({name: '', range: ['A1', 'A2']})
      )).toEqual([
        {
          name: 'blah',
          range: ['C1', 'C2'],
          map: {
            C1: {top: true, left: true, right: true},
            C2: {bottom: true, left: true, right: true},
          }
        },
        {
          name: 'flop',
          range: ['X1', 'X2'],
          map: {
            X1: {top: true, left: true, right: true},
            X2: {bottom: true, left: true, right: true},
          }
        },
      ]);
    });
  });
});

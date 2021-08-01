import { range, update } from 'ramda';
import React, { useState } from 'react';
import { Coord, Sheet } from './sheet/Sheet';

const width = 10;
const height = 10;
const emptyMatrix = range(0, height).map(() => range(0, width).map(() => ""));

export function App() {
  const [matrix, setMatrix] = useState(emptyMatrix);

  const setValue = (value: string, {x,y}: Coord) => {
    const row = update(x, value, matrix[y]);
    setMatrix(update(y, row, matrix));
  };

  return (
    <Sheet values={matrix} setValue={setValue} />
  );
}

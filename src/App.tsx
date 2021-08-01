import React, { useState } from 'react';
import { Matrix, mkCell } from './app/Matrix';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 20;
const emptyMatrix: Matrix = new Map();

export function App() {
  const [matrix, setMatrix] = useState(emptyMatrix);

  const setValue = (value: string, name: string) => {
    const map = new Map(matrix);
    map.set(name, mkCell(value));
    setMatrix(map);
  };

  return (
    <Sheet values={matrix} width={width} height={height} setValue={setValue} />
  );
}

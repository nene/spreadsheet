import React, { useState } from 'react';
import { CellMap, mkCell } from './app/cells';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 20;
const emptyCells: CellMap = new Map();

export function App() {
  const [cells, setCells] = useState(emptyCells);

  const setValue = (value: string, name: string) => {
    const map = new Map(cells);
    map.set(name, mkCell(value));
    setCells(map);
  };

  return (
    <Sheet cells={cells} width={width} height={height} setValue={setValue} />
  );
}

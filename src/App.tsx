import React, { useState } from 'react';
import { CellMap } from './app/cells';
import { updateCell } from './app/updateCell';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 20;
const emptyCells: CellMap = {};

export function App() {
  const [cells, setCells] = useState(emptyCells);

  const setValue = (name: string, value: string) => {
    setCells(updateCell(name, value, cells));
  };

  return (
    <Sheet cells={cells} width={width} height={height} setValue={setValue} />
  );
}

import React, { useState } from 'react';
import { CellCoord, CellMap } from './app/cells/cells';
import { updateCell } from './app/cells/updateCell';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 20;
const emptyCells: CellMap = {};

export function App() {
  const [cells, setCells] = useState(emptyCells);

  const setValue = (coord: CellCoord, value: string) => {
    setCells(updateCell(coord, value, cells));
  };

  return (
    <Sheet cells={cells} width={width} height={height} setValue={setValue} />
  );
}

import React, { useState } from 'react';
import { CellMap, mkCell } from './app/cells';
import { evalCell, evalDeps } from './app/eval';
import { updateMap } from './app/util';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 20;
const emptyCells: CellMap = new Map();

export function App() {
  const [cells, setCells] = useState(emptyCells);

  const setValue = (value: string, name: string) => {
    const cells2 = updateMap(name, mkCell(value), cells);
    const cells3 = evalCell(name, cells2);
    setCells(evalDeps(name, cells3));
  };

  return (
    <Sheet cells={cells} width={width} height={height} setValue={setValue} />
  );
}

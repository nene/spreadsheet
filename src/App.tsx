import { range } from 'ramda';
import React from 'react';
import { Sheet } from './sheet/Sheet';

const width = 10;
const height = 10;

export function App() {
  const matrix = range(0, height).map(() => range(0, width).map(() => ""));

  return (
    <Sheet values={matrix} />
  );
}

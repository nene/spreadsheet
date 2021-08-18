import { CellCoord } from "./cells";

export const makeCellCoord = ({x, y}: {x: number; y: number}): CellCoord => {
  return `${numToAlpha(x)}${y+1}`;
}

export const destructCellCoord = (coord: CellCoord): {x: number, y: number} => {
  const [, alpha, num] = coord.match(/^([A-Z]+)([0-9]+)$/) || [];
  return {
    x: alphaToNum(alpha),
    y: parseInt(num, 10) - 1,
  };
};

export const numToAlpha = (n: number): string => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(n);
}

const alphaToNum = (c: string): number => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c);
}

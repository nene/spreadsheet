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

export const cellCoordRange = (from: CellCoord, to: CellCoord): CellCoord[] => {
  const {x: x1, y: y1} = destructCellCoord(from);
  const {x: x2, y: y2} = destructCellCoord(to);
  if (x2 < x1 || y2 < y1) {
    return [from, from];
  }

  const result: CellCoord[] = [];
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      result.push(makeCellCoord({x, y}));
    }
  }
  return result;
};

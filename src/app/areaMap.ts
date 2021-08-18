import { CellCoord } from "./cells/cells";
import { destructCellCoord, makeCellCoord } from "./cells/coord";

export type CellSides = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};

export type AreaMap = Record<CellCoord, CellSides>;

export const createAreaMap = (coord1: CellCoord, coord2: CellCoord): AreaMap => {
  const {x: x1, y: y1} = destructCellCoord(coord1);
  const {x: x2, y: y2} = destructCellCoord(coord2);

  const result: AreaMap = {};
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (x === x1 || x === x2 || y === y1 || y === y2) {
        result[makeCellCoord({x, y})] = {
          left: x === x1 || undefined,
          right: x === x2 || undefined,
          top: y === y1 || undefined,
          bottom: y === y2 || undefined,
        };
      }
    }
  }
  return result;
};

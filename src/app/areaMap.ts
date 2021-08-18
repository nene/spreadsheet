import { CellCoord } from "./cells/cells";

export type CellSides = {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
};

export type AreaMap = Record<CellCoord, CellSides>;

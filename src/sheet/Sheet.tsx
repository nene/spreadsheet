import { range } from "ramda";
import styled from "styled-components";
import { CellCoord, CellMap } from "../app/cells/cells";
import { getCell } from "../app/cells/eval";
import { CellView } from "./CellView";

interface SheetProps {
  cells: CellMap;
  width: number;
  height: number;
  setValue: (coord: CellCoord, value: string) => void;
}

export const Sheet = ({cells, width, height, setValue}: SheetProps) => {
  return (
    <Table>
      <tr>
        <Head></Head>
        {range(0, width).map((x) => (
          <TopHead>{numToAlpha(x)}</TopHead>
        ))}
      </tr>
      {range(0, height).map((y) => (
        <tr>
          <Head>{y+1}</Head>
          {range(0, width).map((x) => {
            const coord = makeCellCoord({x,y});
            return (
              <CellView coord={coord} value={getCell(coord, cells)} onChange={setValue} />
            );
          })}
        </tr>
      ))}
    </Table>
  );
}

const Table = styled.table`
  border-collapse: collapse;
`;

const Head = styled.th`
  border: none;
  background-color: #ccc;
  padding: 0 4px;
  text-align: right;
  font-weight: normal;
`;

const TopHead = styled(Head)`
  text-align: center;
`;

const makeCellCoord = ({x, y}: {x: number; y: number}): CellCoord => {
  return `${numToAlpha(x)}${y+1}`;
}

const numToAlpha = (n: number): string => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(n);
}

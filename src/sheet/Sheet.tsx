import { range } from "ramda";
import styled from "styled-components";
import { makeCellCoord, numToAlpha } from "../app/cells/coord";
import { CellView } from "./CellView";

interface SheetProps {
  width: number;
  height: number;
}

export const Sheet = ({width, height}: SheetProps) => {
  return (
    <Table>
      <tbody>
        <tr>
          <Head></Head>
          {range(0, width).map((x) => (
            <TopHead key={x}>{numToAlpha(x)}</TopHead>
          ))}
        </tr>
        {range(0, height).map((y) => (
          <tr key={y}>
            <Head>{y+1}</Head>
            {range(0, width).map((x) => (
              <CellView key={`${y}_${x}`} coord={makeCellCoord({x,y})} />
            ))}
          </tr>
        ))}
      </tbody>
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

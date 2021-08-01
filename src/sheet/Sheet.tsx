import { range } from "ramda";
import styled from "styled-components";
import { getCell, Matrix } from "../app/Matrix";
import { Editor } from "./Editor";

export type Coord = { x: number; y: number };

interface SheetProps {
  values: Matrix;
  width: number;
  height: number;
  setValue: (value: string, name: string) => void;
}

export const Sheet = ({values, width, height, setValue}: SheetProps) => {
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
            const name = coordToName({x,y});
            return (<Cell><Editor value={getCell(name, values)} name={name} onChange={setValue} /></Cell>);
          })}
        </tr>
      ))}
    </Table>
  );
}

const Table = styled.table`
  border-collapse: collapse;
`;

const Cell = styled.td`
  border: none;
  padding: 0;
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

const coordToName = ({x,y}: Coord): string => {
  return `${numToAlpha(x)}${y+1}`;
}

const numToAlpha = (n: number): string => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(n);
}

import styled from "styled-components";
import { Matrix } from "../app/Matrix";
import { Editor } from "./Editor";

export type Coord = { x: number; y: number };

interface SheetProps {
  values: Matrix;
  setValue: (value: string, coord: Coord) => void;
}

export const Sheet = ({values, setValue}: SheetProps) => {
  return (
    <Table>
      <tr>
        <Head></Head>
        {values[0].map((value, x) => (
          <TopHead>{numToAlpha(x)}</TopHead>
        ))}
      </tr>
      {values.map((row, y) => (
        <tr>
          <Head>{y+1}</Head>
          {row.map((value, x) => (<Cell><Editor value={value} coord={{x,y}} onChange={setValue} /></Cell>))}
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

const numToAlpha = (n: number): string => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(n);
}

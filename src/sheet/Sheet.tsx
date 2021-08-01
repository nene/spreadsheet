import styled from "styled-components";
import { Matrix, MatrixCell } from "../app/Matrix";

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
  border: 1px solid #ccc;
`;

const Head = styled.th`
  border: 1px solid #ccc;
  background-color: #ccc;
  padding: 0 4px;
  text-align: right;
  font-weight: normal;
`;

const TopHead = styled(Head)`
  text-align: center;
`;

interface EditorProps {
  value: MatrixCell;
  coord: Coord;
  onChange: (value: string, coord: Coord) => void;
}

const Editor = ({value, coord, onChange}: EditorProps) => (
  <EditorEl value={cellValue(value)} onChange={(e) => onChange(e.target.value, coord)} />
);

const EditorEl = styled.input`
  width: 70px;
`;

const cellValue = (cell: MatrixCell): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": return String(cell.value);
  }
}

const numToAlpha = (n: number): string => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(n);
}

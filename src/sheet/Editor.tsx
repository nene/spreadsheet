import styled from "styled-components";
import { MatrixCell } from "../app/Matrix";
import { Coord } from "./Sheet";

interface EditorProps {
  value: MatrixCell;
  coord: Coord;
  onChange: (value: string, coord: Coord) => void;
}

export const Editor = ({value, coord, onChange}: EditorProps) => (
  <EditorEl
    value={cellValue(value)}
    isError={value.type === "error"}
    onChange={(e) => onChange(e.target.value, coord)}
  />
);

const EditorEl = styled.input<{isError: boolean}>`
  width: 70px;
  border-color: ${(props) => props.isError ? 'red' : 'default'};
`;

const cellValue = (cell: MatrixCell): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": return String(cell.value);
    case "error": return cell.value;
  }
}

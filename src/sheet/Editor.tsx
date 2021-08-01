import { useState } from "react";
import styled from "styled-components";
import { CellType, MatrixCell } from "../app/Matrix";
import { Coord } from "./Sheet";

interface EditorProps {
  value: MatrixCell;
  coord: Coord;
  onChange: (value: string, coord: Coord) => void;
}

export const Editor = ({value, coord, onChange}: EditorProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <EditorEl
      value={cellValue(value, focused)}
      cellType={value.type}
      onChange={(e) => onChange(e.target.value, coord)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const EditorEl = styled.input<{cellType: CellType}>`
  width: 70px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({cellType}) => cellColor(cellType)};
`;

const cellColor = (type: CellType): string => {
  switch (type) {
    case "empty": return "default";
    case "number": return "default";
    case "formula": return "#7ca2ce";
    case "error": return "red";
  }
}

const cellValue = (cell: MatrixCell, focused: boolean): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": {
      if (focused) {
        return "=" + cell.formula;
      } else {
        return String(cell.value);
      }
    }
    case "error": return cell.value;
  }
}

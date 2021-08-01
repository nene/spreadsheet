import { useState } from "react";
import styled from "styled-components";
import { CellType, MatrixCell } from "../app/Matrix";

interface EditorProps {
  value: MatrixCell;
  name: string;
  onChange: (value: string, name: string) => void;
}

export const Editor = ({value, name, onChange}: EditorProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <EditorEl
      value={cellValue(value, focused)}
      cellType={value.type}
      onChange={(e) => onChange(e.target.value, name)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const EditorEl = styled.input<{cellType: CellType}>`
  width: 70px;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({cellType}) => cellColor(cellType)};
  &:focus {
    border: 1px solid black;
    outline: none;
  }
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

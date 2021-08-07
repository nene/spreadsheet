import styled from "styled-components";
import { CellType, Cell, CellCoord } from "../app/cells/cells";

interface EditorProps {
  coord: CellCoord;
  value: Cell;
  focused: boolean;
  onChange: (value: string) => void;
  onFocus: () => void;
}

export const Editor = ({coord, value, focused, onChange, onFocus}: EditorProps) => {
  return (
    <>
      {cellLabel(value) && !focused ? <Label>{cellLabel(value)}</Label> : undefined}
      <EditorEl
        value={cellValue(value, focused)}
        cellType={value.type}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
      />
    </>
  );
};

const Label = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  background-color: #2c8b7c;
  font-size: 10px;
  padding: 0 2px;
  height: 11px;
  line-height: 11px;
`;

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

const cellLabel = (cell: Cell): string | undefined => {
  return cell.type === "formula" ? cell.name : undefined;
};

const cellColor = (type: CellType): string => {
  switch (type) {
    case "empty": return "default";
    case "number": return "default";
    case "formula": return "#7ca2ce";
    case "error": return "red";
  }
}

const cellValue = (cell: Cell, focused: boolean): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": {
      if (focused) {
        return cell.formula;
      } else {
        return String(cell.value ?? "#UNEVAL");
      }
    }
    case "error": return cell.value;
  }
}

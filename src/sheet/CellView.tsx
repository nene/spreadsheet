import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Cell, CellCoord, CellType } from "../app/cells/cells";
import { selectCell, setCellValue } from "../app/cells/cellsSlice";
import { focusCell, selectFocusedCoord } from "../app/focus";
import { useAppSelector } from "../app/hooks";
import { Editor } from "./Editor";

interface CellViewProps {
  coord: CellCoord;
}

export const CellView = ({coord}: CellViewProps) => {
  const cell = useAppSelector((state) => selectCell(state, coord));
  const focusedCoord = useAppSelector(selectFocusedCoord);
  const dispatch = useDispatch();

  return (
    <TableCell onClick={() => dispatch(focusCell(coord))}>
      {coord === focusedCoord
        ? <Editor
          coord={coord}
          cell={cell}
          onChange={(value) => dispatch(setCellValue({coord, value}))}
        />
        : <ValueView cell={cell} />}
    </TableCell>
  );
};

const TableCell = styled.td`
  border: none;
  padding: 0;
`;

const ValueView = ({cell}: {cell: Cell}) => (
  <ValueEl cellType={cell.type}>
    {cellLabel(cell) ? <Label>{cellLabel(cell)}</Label> : undefined}
    {cellValue(cell)}
  </ValueEl>
);

const ValueEl = styled.div<{cellType: CellType}>`
  position: relative;
  display: block;
  width: 70px;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({cellType}) => cellColor(cellType)};
  margin: 0;
  padding: 1px 2px;
`;

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

const cellLabel = (cell: Cell): string | undefined => {
  return cell.type === "formula" ? cell.name : undefined;
};

const cellColor = (type: CellType): string => {
  switch (type) {
    case "empty": return "#ccc";
    case "number": return "#ccc";
    case "formula": return "#7ca2ce";
    case "error": return "red";
  }
}

const cellValue = (cell: Cell): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": return String(cell.value ?? "#UNEVAL");
    case "error": return cell.value;
  }
}

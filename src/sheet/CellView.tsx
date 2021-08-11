import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Cell, CellCoord, CellType } from "../app/cells/cells";
import { selectCell, setCellValue } from "../app/cells/cellsSlice";
import { editCell, extendFocus, focusCell, selectEditableCoord, selectFocusedCoords } from "../app/focus";
import { useAppSelector } from "../app/hooks";
import { Editor } from "./Editor";

interface CellViewProps {
  coord: CellCoord;
}

export const CellView = ({coord}: CellViewProps) => {
  const cell = useAppSelector((state) => selectCell(state, coord));
  const [focusedCoord1, focusedCoord2] = useAppSelector(selectFocusedCoords);
  const editableCoord = useAppSelector(selectEditableCoord);
  const dispatch = useDispatch();

  const onClick = useCallback((e: React.MouseEvent) => {
    if (coord !== editableCoord) {
      if (e.shiftKey) {
        dispatch(extendFocus(coord));
      } else {
        dispatch(focusCell(coord));
      }
    }
  }, [editableCoord, dispatch, coord]);

  return (
    <TableCell
      onClick={onClick}
      onDoubleClick={() => dispatch(editCell(coord))}
    >
      {coord === editableCoord
        ? <Editor
          coord={coord}
          cell={cell}
          onChange={(value) => dispatch(setCellValue({coord, value}))}
        />
        : <ValueView cell={cell} focused={coord === focusedCoord1} focusedLast={coord === focusedCoord2} />}
    </TableCell>
  );
};

const TableCell = styled.td`
  border: none;
  padding: 0;
`;

const ValueView = ({cell, focused, focusedLast}: {cell: Cell, focused: boolean, focusedLast: boolean}) => (
  <ValueEl cellType={cell.type} focused={focused} focusedLast={focusedLast}>
    {cellLabel(cell) ? <Label>{cellLabel(cell)}</Label> : undefined}
    {cellValue(cell)}
  </ValueEl>
);

const ValueEl = styled.div<{cellType: CellType, focused: boolean, focusedLast: boolean}>`
  position: relative;
  display: block;
  width: 70px;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: ${({cellType, focused, focusedLast}) => cellColor(cellType, focused || focusedLast)};
  box-shadow: ${({focused}) => focused ? "1px 1px 4px #2c8b7c" : "none"};
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

const cellColor = (type: CellType, focused: boolean): string => {
  if (focused) {
    return "#4b882e";
  }
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

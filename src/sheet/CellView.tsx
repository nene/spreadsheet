import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { selectFocusedCellSides } from "../app/focusAreas";
import { Cell, CellCoord, cellDisplayValue, CellType } from "../app/cells/cells";
import { selectCell, setCellValue } from "../app/cells/cellsSlice";
import { editCell, extendFocus, focusCell, selectEditableCoord } from "../app/focus";
import { useAppSelector } from "../app/hooks";
import { Editor } from "./Editor";
import { CellSides } from "../app/areaMap";

interface CellViewProps {
  coord: CellCoord;
}

export const CellView = ({coord}: CellViewProps) => {
  const cell = useAppSelector((state) => selectCell(state, coord));
  const editableCoord = useAppSelector(selectEditableCoord);
  const focusedCellSides = useAppSelector((state) => selectFocusedCellSides(state, coord));
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
          value={cellDisplayValue(cell)}
          onChange={(value) => dispatch(setCellValue({coord, value}))}
        />
        : <ValueView
            cell={cell}
            focusedSides={focusedCellSides}
          />}
    </TableCell>
  );
};

const TableCell = styled.td`
  border: none;
  padding: 0;
`;

const ValueView = ({cell, focusedSides}: {cell: Cell, focusedSides: CellSides}) => (
  <ValueEl cellType={cell.type} focusedSides={focusedSides}>
    {cellLabel(cell) ? <Label>{cellLabel(cell)}</Label> : undefined}
    {cellValue(cell)}
  </ValueEl>
);

const ValueEl = styled.div<{cellType: CellType, focusedSides: CellSides}>`
  position: relative;
  display: block;
  width: 70px;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-top-color: ${({cellType, focusedSides}) => cellColor(cellType, focusedSides.top)};
  border-bottom-color: ${({cellType, focusedSides}) => cellColor(cellType, focusedSides.bottom)};
  border-left-color: ${({cellType, focusedSides}) => cellColor(cellType, focusedSides.left)};
  border-right-color: ${({cellType, focusedSides}) => cellColor(cellType, focusedSides.right)};
  box-shadow: ${({focusedSides}) => isFocusedCell(focusedSides) ? "1px 1px 4px #2c8b7c" : "none"};
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

// Top-left cell is the currently focused cell
const isFocusedCell = (sides: CellSides): boolean => Boolean(sides.left && sides.top);

const cellLabel = (cell: Cell): string | undefined => {
  return cell.type === "formula" ? cell.name : undefined;
};

const cellColor = (type: CellType, focused?: boolean): string => {
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

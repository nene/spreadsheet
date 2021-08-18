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
import { selectAreaName, selectNamedAreaSides } from "../app/namedAreas";

interface CellViewProps {
  coord: CellCoord;
}

export const CellView = ({coord}: CellViewProps) => {
  const cell = useAppSelector((state) => selectCell(state, coord));
  const editableCoord = useAppSelector(selectEditableCoord);
  const focusedCellSides = useAppSelector((state) => selectFocusedCellSides(state, coord));
  const namedSides = useAppSelector((state) => selectNamedAreaSides(state, coord));
  const areaName = useAppSelector((state) => selectAreaName(state, coord));
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
            namedSides={namedSides}
            areaName={areaName}
          />}
    </TableCell>
  );
};

const TableCell = styled.td`
  border: none;
  padding: 0;
`;

const ValueView = (props: {cell: Cell, focusedSides: CellSides, namedSides: CellSides, areaName?: string}) => (
  <ValueEl cellType={props.cell.type} focusedSides={props.focusedSides} namedSides={props.namedSides}>
    {cellLabel(props.cell) ? <Label color="#2c8b7c">{cellLabel(props.cell)}</Label> : undefined}
    {props.areaName ? <Label color="#b064ce">{props.areaName}</Label> : undefined}
    {cellValue(props.cell)}
  </ValueEl>
);

const ValueEl = styled.div<{cellType: CellType, focusedSides: CellSides, namedSides: CellSides}>`
  position: relative;
  display: block;
  width: 70px;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-top-color: ${(p) => cellColor(p.cellType, p.focusedSides.top, p.namedSides.top)};
  border-bottom-color: ${(p) => cellColor(p.cellType, p.focusedSides.bottom, p.namedSides.bottom)};
  border-left-color: ${(p) => cellColor(p.cellType, p.focusedSides.left, p.namedSides.left)};
  border-right-color: ${(p) => cellColor(p.cellType, p.focusedSides.right, p.namedSides.right)};
  box-shadow: ${({focusedSides}) => isFocusedCell(focusedSides) ? "1px 1px 4px #2c8b7c" : "none"};
  margin: 0;
  padding: 1px 2px;
`;

const Label = styled.span<{color: string}>`
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  background-color: ${(p) => p.color};
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

const cellColor = (type: CellType, focused?: boolean, named?: boolean): string => {
  if (focused) {
    return "#4b882e";
  }
  if (named) {
    return "#b064ce";
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

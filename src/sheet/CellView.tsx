import { useSelector } from "react-redux";
import styled from "styled-components";
import { Cell, CellCoord } from "../app/cells/cells";
import { selectFocusedCoord } from "../app/focus";
import { Editor } from "./Editor";

interface CellViewProps {
  coord: CellCoord;
  value: Cell;
  onChange: (coord: CellCoord, value: string) => void;
}

export const CellView = ({coord, value, onChange}: CellViewProps) => {
  const focusedCoord = useSelector(selectFocusedCoord);

  return (
    <TableCell>
      <Editor coord={coord} value={value} focused={coord === focusedCoord} onChange={onChange} />
    </TableCell>
  );
};

const TableCell = styled.td`
  position: relative;
  border: none;
  padding: 0;
`;

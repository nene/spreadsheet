import styled from "styled-components";
import { Cell, CellCoord } from "../app/cells";
import { Editor } from "./Editor";

interface CellViewProps {
  coord: CellCoord;
  value: Cell;
  onChange: (coord: CellCoord, value: string) => void;
}

export const CellView = ({coord, value, onChange}: CellViewProps) => (
  <TableCell>
    <Editor coord={coord} value={value} onChange={onChange} />
  </TableCell>
);

const TableCell = styled.td`
  position: relative;
  border: none;
  padding: 0;
`;

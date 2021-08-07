import { useDispatch } from "react-redux";
import styled from "styled-components";
import { CellCoord } from "../app/cells/cells";
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
    <TableCell>
      <Editor
        coord={coord}
        value={cell}
        focused={coord === focusedCoord}
        onChange={(value) => dispatch(setCellValue({coord, value}))}
        onFocus={() => dispatch(focusCell(coord))}
      />
    </TableCell>
  );
};

const TableCell = styled.td`
  position: relative;
  border: none;
  padding: 0;
`;

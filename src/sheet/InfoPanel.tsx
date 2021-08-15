import { useDispatch } from "react-redux";
import styled from "styled-components";
import { selectCell, setCellValue } from "../app/cells/cellsSlice";
import { selectFocusedCoords } from "../app/focus";
import { useAppSelector } from "../app/hooks";
import { Editor } from "./Editor";

export const InfoPanel = () => {
  const dispatch = useDispatch();
  const [from, to] = useAppSelector(selectFocusedCoords);
  const cell = useAppSelector((state) => selectCell(state, from));

  return (
    <InfoArea>
      <CoordLabel>{from}:{to}</CoordLabel>
      <LongEditor
        cell={cell}
        onChange={(value) => dispatch(setCellValue({coord: from, value}))}
      />
    </InfoArea>
  );
};

const InfoArea = styled.div`
  padding: 5px;
  background-color: #94a1a1;
`;

const CoordLabel = styled.span`
  display: inline-block;
  padding-right: 5px;
  width: 92px;
  text-align: right;
  font-weight: 500;
  color: #1e4d33;
`;

const LongEditor = styled(Editor)`
  width: 679px;
  border-color: #5f5f5f;
`;

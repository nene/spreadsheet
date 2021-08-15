import { useDispatch } from "react-redux";
import styled from "styled-components";
import { selectCell, setCellValue } from "../app/cells/cellsSlice";
import { selectFocusedRange } from "../app/focus";
import { useAppSelector } from "../app/hooks";
import { Editor } from "./Editor";

export const InfoPanel = () => {
  const dispatch = useDispatch();
  const [from] = useAppSelector(selectFocusedRange);
  const cell = useAppSelector((state) => selectCell(state, from));

  return (
    <InfoArea>
      <CoordLabel>{from}:</CoordLabel>
      <Editor
        coord={from}
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
  width: 35px;
  text-align: right;
  font-weight: 500;
  color: #1e4d33;
`;

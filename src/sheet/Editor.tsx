import React from "react";
import styled from "styled-components";
import { Cell } from "../app/cells/cells";

interface EditorProps {
  cell: Cell;
  onChange: (value: string) => void;
  className?: string;
}

export const Editor = ({cell, className, onChange}: EditorProps) => {
  return (
    <EditorEl
      value={cellValue(cell)}
      onChange={(e) => onChange(e.target.value)}
      autoFocus={true}
      className={className}
    />
  );
};

const EditorEl = styled.input`
  width: 70px;
  height: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  &:focus {
    outline: none;
  }
`;

const cellValue = (cell: Cell): string => {
  switch (cell.type) {
    case "empty": return "";
    case "number": return String(cell.value);
    case "formula": return cell.formula;
    case "error": return cell.value;
  }
}

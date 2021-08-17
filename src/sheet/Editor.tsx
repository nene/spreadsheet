import React from "react";
import styled from "styled-components";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Editor = ({value, className, onChange}: EditorProps) => {
  return (
    <EditorEl
      value={value}
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

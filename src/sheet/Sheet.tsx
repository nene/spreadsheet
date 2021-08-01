import styled from "styled-components";

interface SheetProps {
  values: number[][];
}

export const Sheet = ({values}: SheetProps) => {
  return (
    <Table>
      {values.map((row) => (
        <tr>
          {row.map(() => (<Cell><Editor /></Cell>))}
        </tr>
      ))}
    </Table>
  );
}

const Table = styled.table`
  border-collapse: collapse;
`;

const Cell = styled.td`
  border: 1px solid #ccc;
`;

const Editor = styled.input`
  width: 70px;
`;

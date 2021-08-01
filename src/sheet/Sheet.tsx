import styled from "styled-components";

interface SheetProps {
  values: string[][];
}

export const Sheet = ({values}: SheetProps) => {
  return (
    <Table>
      <tr>
        <Head></Head>
        {values[0].map((value, x) => (
          <TopHead>{numToAlpha(x)}</TopHead>
        ))}
      </tr>
      {values.map((row, y) => (
        <tr>
          <Head>{y+1}</Head>
          {row.map((value) => (<Cell><Editor value={value} /></Cell>))}
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

const Head = styled.th`
  border: 1px solid #ccc;
  background-color: #ccc;
  padding: 0 4px;
  text-align: right;
  font-weight: normal;
`;

const TopHead = styled(Head)`
  text-align: center;
`;

const Editor = styled.input`
  width: 70px;
`;

const numToAlpha = (n: number): string => {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(n);
}

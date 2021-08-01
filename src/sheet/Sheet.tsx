import { range } from "ramda";
import styled from "styled-components";

export const Sheet = ({width, height}: {width: number, height: number}) => {
  return (
    <table>
      {range(0, height).map(() => (
        <tr>
          {range(0, width).map(() => (<Cell>x</Cell>))}
        </tr>
      ))}
    </table>
  );
}

const Cell = styled.td``;

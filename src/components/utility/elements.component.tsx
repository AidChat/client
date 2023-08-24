import {styled} from "styled-components";

export const LinksEl = styled.div<{color: string}>`
  color: ${props => props.color} ;
  font-weight: lighter;
  font-size: 16px;
  cursor: pointer;
`;

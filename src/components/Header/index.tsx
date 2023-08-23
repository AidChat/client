import React, {JSX, ReactElement} from 'react';
import styled from "styled-components";

export function Header({children}:{children : ReactElement[] | ReactElement}) {
    return (
        <HeaderWrapper >
            {children}
        </HeaderWrapper>
    )
}

const HeaderWrapper = styled.div`
  border-bottom: 1px solid #868686;
  padding: 10px;
  max-height: 10vh;
  display: flex;
`;

export const LinksEl = styled.div<{color:string}>`
  color: ${props => props.color} ;
  font-weight: lighter;
  font-size: 16px;
  cursor: pointer;
`;



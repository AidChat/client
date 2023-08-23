import React from 'react';
import styled from "styled-components";


export const CenterBox = ({children}: any) => {
    return (
        <CenterBoxWrapper>{children}</CenterBoxWrapper>
    )
}

export const CenterBoxWrapper = styled.div`position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width:100%;
  margin:0 auto;
`;

export const AlignCenter = styled.div`
  align-items: center;
  justify-content: center;
`;


export const CustomMargin = styled.div<{ mt?: string, mr?: string, ml?: string, mb?: string }>`
  margin-top: ${props => props.mt ? props.mt + 'px' : '0px'};
  margin-left: ${props => props.ml ? props.ml + 'px' : '0px'};
  margin-bottom: ${props => props.mb ? props.mb + 'px' : '0px'};
  margin-right: ${props => props.mr ? props.mr + 'px' : '0px'};

`;

export const FlexBox = styled.div<{ justifyContent: string,flexDirection:string }>`
  display: flex;
  justify-content: ${props => props.justifyContent};
  flex-direction: ${props=> props.flexDirection};
`;

export const ShadowBox = styled.div`
  box-shadow: 0 2.8px 2.2px rgba(255, 253, 253, 0.03),
  0 6.7px 5.3px rgba(255, 255, 255, 0.05),
  0 12.5px 10px rgba(0, 0, 0, 0.06),
  0 22.3px 17.9px rgba(0, 0, 0, 0.072),
  0 41.8px 33.4px rgba(0, 0, 0, 0.086),
  0 100px 80px rgba(0, 0, 0, 0.12);
`;

export const CustomAlign = styled.div<{align:string}>`
text-align: ${props => props.align};
`;
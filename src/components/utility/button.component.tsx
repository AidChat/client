import React from 'react';
import styled from "styled-components";
import {AlignCenter} from "./alignment.components";

export const Button = ({children,color,click} : any) => {
    return (
        <StyleWrapper onClick={()=>click()} color={color}>
            {children}
        </StyleWrapper>
    )
}

const StyleWrapper = styled.div<{color?:string}>`
  padding: 8px 20px;
  border: 1px solid black;
  border-radius: 4px;
  width: fit-content;
  background: #f13b36;
  cursor: pointer;
  margin: 0 auto;
  color : ${props=>props.color}
`;
import React, { ReactNode } from 'react';
import styled from 'styled-components';

// Styled component for Tooltip
const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
  z-index: 999 !important;
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: max-content;
  background-color: black;
  color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  left: 90%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  top:22px;

  ${TooltipWrapper}:hover & {
    visibility: visible;
    opacity: 1;
  }
`;

// Tooltip props definition
interface TooltipProps {
    text: string;
    children: ReactNode;
}

// Tooltip component
const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
    return (
        <TooltipWrapper>
            {children}
        <TooltipText>{text}</TooltipText>
        </TooltipWrapper>
    );
};

export default Tooltip;

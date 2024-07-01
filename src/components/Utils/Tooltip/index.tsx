import React, {ReactNode} from "react";
import styled from "styled-components";
import {useWindowSize} from "../../../services/hooks/appHooks";
import {EwindowSizes} from "../../../utils/enum";

// Styled component for Tooltip
const TooltipWrapper = styled.div`
    position: relative;
    display: inline-block;
    z-index: 999 !important;
`;

const TooltipText = styled.span`
    display: none;
    width: max-content;
    background-color: #1C1C1C;
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    left: 90%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    top: 30px;
    border: 1px solid darkgrey;
    font-size: 12px;

    ${TooltipWrapper}:hover & {
        display: block;
        opacity: 1;
    }
`;

// Tooltip props definition
interface TooltipProps {
    text: string;
    children: ReactNode;
}

// Tooltip component
const Tooltip: React.FC<TooltipProps> = ({text, children}) => {
    const {size: valid} = useWindowSize(EwindowSizes.S);
    return (
        <TooltipWrapper>
            {children}
            <TooltipText style={{display: valid ? "none" : ""}}>{text}</TooltipText>
        </TooltipWrapper>
    );
};

export default Tooltip;

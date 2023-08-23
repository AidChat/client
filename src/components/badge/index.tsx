import React, {ReactElement, useContext} from 'react';
import styled from "styled-components";
import {CustomMargin, FlexBox} from "../utility/alignment.components";
import {CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {Tooltip} from "../utility/tooltip.component";
import {motion} from "framer-motion";
import {ShellContext} from "../../services/context/shell.context";

export function Badge({HeadingEl, InfoEl, value = 0,amount= 0,}: {
    HeadingEl: string | ReactElement,
    InfoEl: string | ReactElement,
    value?: number,
    amount ?:number
}) {
    function fetchCurrency() {
        return '₹'
    }
    const {showSnackbar} = useContext(ShellContext)
    return (<BadgeContainerWrapper
        initial={{opacity: 0}}
        animate={{y: 10, opacity: 1}}
        transition={{stiffness: 50, delay: 0.1, opacity: 0}}
        onClick={()=>{
            showSnackbar('This is a test message for the users. This is to just test out the component')
        }}
    >
        <BadgeContainer>
            <FlexBox style={{height: '100%'}} flexDirection={'row'} justifyContent={'space-between'}>
                <FlexBox flexDirection={'column'} justifyContent={'space-between'}>
                    <CustomMargin ml={'20'} mt={'10'}>{HeadingEl}
                        <Tooltip InfoEl={<div>{InfoEl}</div>}/>
                    </CustomMargin>
                    <CustomMargin ml={'20'} mb={'20'}>{fetchCurrency() + amount}</CustomMargin>
                </FlexBox>
                <div style={{width: 80, height: 100, display: 'flex', margin: '0px 10px'}}>
                    <CircularProgressbar background={false} strokeWidth={5} maxValue={1000} value={value} text={`${value}`}/>
                </div>
            </FlexBox>
        </BadgeContainer>
    </BadgeContainerWrapper>)
}

const BadgeContainerWrapper = styled(motion.div)`
  height: 100px;
  width: 18vw;
  padding: 30px;
`;
const BadgeContainer = styled.div`
  background: whitesmoke;
  height: 100%;
  width: 100%;
  border-radius: 4px;
`;
export const ProgressBar = styled.progress`

`;
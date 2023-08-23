import React from "react";
import {AlignCenter, CustomAlign, CustomMargin, FlexBox} from "./alignment.components";

import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";
import {LinksEl} from "../Header";
import styled from "styled-components";


interface OtpContainerProps {
    handleback : (El:boolean)=>void
}

export const OtpContainer =({handleback}: OtpContainerProps)=>{

    return (
        <FlexBox style={{width: '100%'}} flexDirection={'column'} justifyContent={'center'}>
            <CustomAlign align={'center'}>{getString(enString.enterOTP)}</CustomAlign>
            <CustomMargin mt={'10'}>
                <AlignCenter style={{width: '100%', display: 'flex'}}>
                    <CustomMargin  ml={'6'}><OtpCont autoFocus={true} maxLength={1} type={'name'}></OtpCont></CustomMargin>
                    <CustomMargin ml={'6'}><OtpCont maxLength={1} type={'name'}></OtpCont></CustomMargin>
                    <CustomMargin ml={'6'}><OtpCont maxLength={1} type={'name'}></OtpCont></CustomMargin>
                    <CustomMargin ml={'6'}><OtpCont maxLength={1} type={'name'}></OtpCont></CustomMargin>
                    <CustomMargin ml={'6'}><OtpCont maxLength={1} type={'name'}></OtpCont></CustomMargin>
                </AlignCenter>
            </CustomMargin>
            <CustomMargin mt={'10'} mr={'20'}>
                <CustomAlign align={'right'}>
                    <LinksEl color={'black'} onClick={() => handleback(false)}>{getString(enString.backToRegister)}</LinksEl>
                </CustomAlign>
            </CustomMargin>
        </FlexBox>
    )
}
const OtpCont = styled.input`
  width: 40px;
  border: 1px solid black;
  border-radius: 8px;
  height: 50px;
  font-size: xx-large;
  text-align: center;
`;
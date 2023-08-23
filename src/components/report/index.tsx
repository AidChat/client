import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {ReportList} from "./reportList";
import {AlignCenter, CustomAlign} from "../utility/alignment.components";
import {Spinner} from "../utility/loader.component";
import {getString} from "../../utils/strings";
import {enString} from "../../utils/strings/en";


export const MyReports = () => {
    let items = [1]
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // setTimeout(()=>{
        //     setLoading(false)
        // },00)
    }, [])
    return (
        <Wrapper>
            <CustomAlign align={'center'}><Heading>{getString(enString.myreport)}</Heading>
            </CustomAlign>
            {loading ? Spinner() : <OverFlowContainer height={'85vh'}>
                {items.map((item, index) => {
                    return <ReportList index={index} item={item}/>
                })}
            </OverFlowContainer>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
  min-height: 100%;
  width: 100%;
`;

const Heading = styled.h1`
  color: white;
  font-size: 22px;
`;

const OverFlowContainer = styled.div<{ height: string }>`
  overflow-y: scroll;
  overflow-x: hidden;
  height: ${props => props.height}
`;
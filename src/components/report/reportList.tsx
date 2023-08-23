import React from 'react';
import styled, {keyframes} from "styled-components";
import {Image} from "../utility/logo.component";
import {motion} from "framer-motion";


export const ReportList = ({item, index}: { item: any, index: number }) => {
    return (
        <ListItemWrapper
            initial={{opacity: 0}}
            animate={{x: 10, opacity: 1}}
            transition={{stiffness: 100, delay: index * 0.01, opacity: 0}}>
            <Container>{index}</Container>
            <Container>Arun Kumar</Container>
            <Container><Image height={'20px'} width={'20px'} name={index %2 === 0 ? 'verified':'exclamation'} type={'png'}/></Container>
        </ListItemWrapper>
    )
}


const ListItemWrapper = styled(motion.div)`
  height: 40px;
  background: whitesmoke;
  border-radius: 4px;
  margin: 2px;
  border: 1px solid whitesmoke;
  transition: transform .2s; /* Animation */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Container = styled.div`
  padding: 0px 28px;
`;
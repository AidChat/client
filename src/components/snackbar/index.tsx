import React from 'react';
import {ShellContext} from "../../services/context/shell.context";
import styled from "styled-components";
import {motion} from "framer-motion";


export function Snackbar({click}:{click :()=>void}) {
    const {snackbarProps} = React.useContext(ShellContext);
    return (
        <>
            {snackbarProps.show && <SnackbarContainer onClick={()=>{click()}} >
                <SnackbarWrapper initial={{opacity: 0}}
                                 animate={{y: -30, x: -10, opacity: 1}}
                                 transition={{stiffness: 50, delay: 0.1, opacity: 0}}>
                    {snackbarProps.message}
                </SnackbarWrapper>
            </SnackbarContainer>}
        </>
    )
}

const SnackbarContainer = styled.div`
  height: 6vh;
  width: fit-content;

  position: absolute;
  bottom: 0;
  right: 10px;
  padding: 4px;
`;
const SnackbarWrapper = styled(motion.div)`
  color: whitesmoke;
  border-radius: 2px;
  height: 100%;
  width: 100%;
  border: 1px solid whitesmoke;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 4px;
`;
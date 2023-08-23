import React, {JSXElementConstructor, ReactElement, useEffect, useState} from 'react';
import styled from "styled-components";
import {LoginComponent} from "./login.component";
import {Spinner} from "../utility/loader.component";
import {RegisterComponent} from "./register.component";
import {ForgotComponent} from "./forgot.component";

export function Authentication() {
    const [show, set] = useState({
        isLogin: true,
        isRegister: false,
        isForgot: false,
    })
    const [loading,setL] = useState(false);
    const handleAuth = (type: string) => {
        if (type === 'register') set({
            isLogin: false,
            isRegister: true,
            isForgot: false,
        });
        if(type === 'login') set({
            isLogin: true,
            isRegister: false,
            isForgot: false,
        });
        if(type === 'forget') set({
            isLogin: false,
            isRegister: false,
            isForgot: true,
        });
    }
    const handleSession = () => {
        if(loading) return Spinner();
        if (show.isLogin) return <LoginComponent handleSwitch={handleAuth}/>
        if (show.isRegister) return <RegisterComponent handleSwitch={handleAuth}/>
        if (show.isForgot) return <ForgotComponent handleSwitch={handleAuth}/>
    }
    return (
        <AuthenticationWrapper>
            <AuthenticationContainer>{handleSession()}</AuthenticationContainer>
        </AuthenticationWrapper>
    )
}

const AuthenticationWrapper = styled.div`
  height: 90vh;
  width: 100%;
  display: flex;
`;

const AuthenticationContainer = styled.div`
  height: 55vh;
  width: 28vw;
  align-self: center;
  margin: 0 auto;
  background: whitesmoke;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
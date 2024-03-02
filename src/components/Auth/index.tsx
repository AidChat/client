import React, {useEffect, useState} from "react";
import "./index.css";
import {LoginForm} from "./LoginForm/loginForm";
import gif from "./../../assets/gifs/slogan.gif";
import {RegisterForm} from "./RegisterForm";
import {useParams} from "react-router-dom";
import {InviteForm} from "./InviteForm";
import {FaGoogle} from "react-icons/fa6";
import {LoginGoogle} from "../Utils/SocialLogin/LoginGoogle";
import {useResponsizeClass} from "../../utils/functions";

import {EwindowSizes} from "../../utils/enum";

export function Validator() {
  const {requestCode} = useParams();
  const [props, setProps] = useState<{email: string}>({email: ""});
  const [state, setState] = useState({
    login: !requestCode,
    register: false,
    invite: !!requestCode,
  });

  useEffect(() => {
    setState({
      login: requestCode ? false : true,
      register: false,
      invite: requestCode ? true : false,
    });
  }, [requestCode]);

  function switchAuthState() {
    setState({
      login: !state.login,
      register: !state.register,
      invite: false,
    });
  }
  function handleResetParams(e?: string) {
    if (e) {
      setProps({email: e});
    }
    setState({
      invite: false,
      register: true,
      login: false,
    });
  }

  return (
    <div
      className={
        "authContainer" + useResponsizeClass(EwindowSizes.S, ["MauthContainer"])
      }
    >
      <div style={{width: ""}}>
        <img style={{width: "100%"}} src={gif} />
      </div>
      <div className={"authBox"}>
        <div className={"w100"} style={{height: "100%"}}>
          {state.invite ? (
            <InviteForm
              requestLogin={(E?: string) => {
                handleResetParams(E);
              }}
            />
          ) : (
            <>
              {state.login && (
                <LoginForm toggleState={switchAuthState} email={props.email} />
              )}
              {state.register && (
                <RegisterForm
                  toggleState={switchAuthState}
                  email={props.email}
                />
              )}
              <div style={{display: "flex", justifyContent: "center"}}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "10%",
                  }}
                >
                  <div style={{padding: "10px"}}>
                    <LoginGoogle>
                      <FaGoogle size={28} color={"#398378"} />
                    </LoginGoogle>
                  </div>
                  <div style={{padding: "10px"}}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

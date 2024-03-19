import React, {useEffect, useState} from "react";
import "./index.css";
import {LoginForm} from "./LoginForm/loginForm";
import gif from "./../../assets/gifs/slogan.gif";
import {RegisterForm} from "./RegisterForm";
import {useParams} from "react-router-dom";
import {InviteForm} from "./InviteForm";
import {useResponsizeClass} from "../../utils/functions";

import {EwindowSizes} from "../../utils/enum";
import {OTPForm} from "./Code";

export function Validator() {
    const {requestCode} = useParams();
    const [props, setProps] = useState<{ email: string }>({email: ""});
    const [state, setState] = useState({
        login: !requestCode, register: false, invite: !!requestCode, code: false
    });

    useEffect(() => {
        setState({
            login: requestCode ? false : true, register: false, invite: requestCode ? true : false, code: false
        });
    }, [requestCode]);

    function switchAuthState(showCode?: boolean,email?:string) {
        setState({
            login: showCode ? false : !state.login, register: !state.register, invite: false, code: !!showCode
        });
        if(email)
        setProps({email:email});
    }

    console.log(props)

    function handleResetParams(e?: string) {
        if (e) {
            setProps({email: e});
        }
        setState({
            invite: false, register: true, login: false, code: false
        });
    }


    return (<div
        className={"authContainer" + useResponsizeClass(EwindowSizes.S, ["MauthContainer"])}>
        <div>
            <img alt={''} style={{width: "100%"}} src={gif}/>
        </div>
        <div className={"authBox"}>
            <div className={"w100"} style={{height: "100%"}}>
                {state.invite ? (<InviteForm
                    requestLogin={(E?: string) => {
                        handleResetParams(E);
                    }}
                />) : <>
                    {state.login && (<LoginForm toggleState={switchAuthState} email={props.email}/>)}
                    {state.register && (<RegisterForm
                        toggleState={(email) => switchAuthState(true,email)}
                        email={props.email}
                    />)}
                    {state.code && (<OTPForm toggleState={()=>switchAuthState()}  email={props.email}/>)}
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div
                            style={{
                                display: "flex", justifyContent: "space-between", width: "10%",
                            }}
                        >
                            <div style={{padding: "10px"}}>
                                {/*<LoginGoogle>*/}
                                {/*    <FaGoogle size={28} color={"#398378"}/>*/}
                                {/*</LoginGoogle>*/}
                            </div>
                            <div style={{padding: "10px"}}></div>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    </div>);
}

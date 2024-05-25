import React, {useEffect, useState} from "react";
import "./index.css";
import {Index} from "./LoginForm";
import gif from "./../../assets/gifs/slogan.gif";
import {RegisterForm} from "./RegisterForm";
import {useParams} from "react-router-dom";
import {InviteForm} from "./InviteForm";
import {useResponsizeClass} from "../../utils/functions";
import {motion} from 'framer-motion'
import {EwindowSizes} from "../../utils/enum";
import {OTPForm} from "./Code";
import {TypeWriter} from "../../Features/Blogs";
import {MokshaIcon} from "../Moksha/Icon";

export function AuthenticationContainer() {
    const {requestCode} = useParams();
    const [props, setProps] = useState<{ email: string }>({email: ""});
    const [state, setState] = useState({
        login: !requestCode,
        register: false,
        invite: !!requestCode,
        code: false,
    });

    useEffect(() => {
        setState({
            login: requestCode ? false : true,
            register: false,
            invite: requestCode ? true : false,
            code: false,
        });
    }, [requestCode]);

    function switchAuthState(
        state: "LOGIN" | "REGISTER" | "CODE" | "INVITE",
        email?: string
    ) {
        setState({
            login: state === "LOGIN",
            register: state === "REGISTER",
            invite: state === "INVITE",
            code: state === "CODE",
        });
        if (email) setProps({email: email});
    }

    function handleResetParams(e?: string) {
        if (e) {
            setProps({email: e});
        }
        setState({
            invite: true,
            register: true,
            login: false,
            code: false,
        });
    }

    return (
        <div
            className={
                "authContainer" + useResponsizeClass(EwindowSizes.S, ["MauthContainer"])
            }
        >
            <motion.div initial={{y: '20vh'}} animate={{y: 0}} transition={{duration: 0.5, delay: 0.3}}>
                <img alt={""} style={{width: "100%"}} src={gif}/>
            </motion.div>
            <motion.div className={"authBox"} initial={{opacity: 0}} animate={{opacity: 1}}
                        transition={{duration: 0.5, delay: 1}}>
                <div className={"w100"} style={{height: "100%"}}>
                    {state.invite ? (
                        <InviteForm
                            requestLogin={(S: "LOGIN" | "REGISTER", E?: string) => {
                                switchAuthState(S);
                                handleResetParams(E);
                            }}
                        />
                    ) : (
                        <>
                            {state.login && (
                                <Index
                                    toggleState={s => {
                                        switchAuthState(s);
                                    }}
                                    email={props.email}
                                />
                            )}
                            {state.register && (
                                <RegisterForm
                                    toggleState={(s, email) => switchAuthState(s, email)}
                                    email={props.email}
                                    invite={state.invite}
                                />
                            )}
                            {state.code && (
                                <OTPForm
                                    toggleState={s => switchAuthState(s)}
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
                                        {/*<LoginGoogle>*/}
                                        {/*    <FaGoogle size={28} color={"#398378"}/>*/}
                                        {/*</LoginGoogle>*/}
                                    </div>
                                    <div style={{padding: "10px"}}></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
            <MokshaIcon/>
        </div>
    );
}

import React, {ChangeEvent, FormEvent, useContext, useEffect, useState,} from "react";
import {AppContext} from "../../../services/context/app.context";
import {_props} from "../../../services/network/network";
import {Spinner} from "../../Utils/Spinner/spinner";
import {useParams} from "react-router-dom";
import {useWindowSize} from "../../../services/hooks";
import {EwindowSizes, reqType, service, serviceRoute,} from "../../../utils/enum";
import {motion} from "framer-motion";
import {Input} from "../../Utils/CustomInput";
import {FaEye} from "react-icons/fa6";
import {MdOutlineAlternateEmail} from "react-icons/md";
import {getDeviceInfoUsingCapacitor} from "../../../utils/functions";
import {DeviceInfo} from "@capacitor/device";

interface LoginFromProps {
    toggleState: (state: "LOGIN" | "REGISTER" | "CODE" | "INVITE") => void;
    email?: string;
}

export function LoginForm({toggleState, email}: LoginFromProps) {
    let context = useContext(AppContext);
    const {requestCode} = useParams();
    const [userdata, setUserData] = useState<{
        email: any;
        password: any;
        extend: boolean;
        requestId: string | undefined;
    }>({
        email: email,
        password: undefined,
        extend: false,
        requestId: requestCode,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, _loading] = useState(false);
    const {size: isSmall} = useWindowSize(EwindowSizes.S);

    useEffect(() => {
        window.setTimeout(() => {
            setError(null);
        }, 5000);
    }, [error]);

    function handleUpdate(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target;
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: value,
        }));
    }

    const isValidState = () => {
        const {email, password} = userdata;
        const isEmailValid = email && email.includes("@");
        const isPasswordValid = password && password.length >= 4;
        return isEmailValid && isPasswordValid
    };

    function handleLogin(event: FormEvent) {
        event.preventDefault();
        let body = userdata;
        if (isSmall) body.extend = true;
        if (!isValidState()) {
            setError("Please enter valid information");
            return
        }
        _loading(true);
        getDeviceInfoUsingCapacitor().then((deviceInfo: DeviceInfo) => {
            _props
                ._db(service.authentication)
                .query(serviceRoute.login, {...body, isMobile:deviceInfo.platform !== 'web'}, reqType.post)
                .then(response => {
                    context?.verifyAuthentication(
                        response.data.session.session_id,
                        requestCode ? true : false
                    );
                    _loading(false);
                })
                .catch(reason => {
                    setError(reason.data.message);
                    _loading(false);
                });
        })

    }

    return (
        <motion.div
            animate={{x: 0}}
            initial={{x: 5}}
            transition={{type: "tween"}}
            exit={{x: 10}}
            className={"loginFormWrapper"}
        >
            <form style={{width: "80%"}} onSubmit={handleLogin}>
                <motion.div
                    initial={{y: 10}}
                    animate={{y: 0}}
                    className={"font-primary font-medium authErrorContainer"}
                    style={{textAlign: "center"}}
                >
                    {error}
                </motion.div>
                <div className={"logincontainer"}>
                    <label style={{marginLeft: "4px"}}>Email</label>
                    <div className={"inputWrapper-icon"}>
                        <Input
                            inputName={"email"}
                            onChange={handleUpdate}
                            type={"email"}
                            allowToggle={false}
                            icon={<MdOutlineAlternateEmail size={22}/>}
                            placeholder={'emillie@email.com'}
                        />
                    </div>
                </div>
                <div className={"logincontainer"}>
                    <label>Password</label>
                    <div className={"inputWrapper-icon"}>
                        <Input
                            inputName={"password"}
                            onChange={handleUpdate}
                            type={"password"}
                            allowToggle={true}
                            icon={<FaEye size={22}/>}
                            placeholder={'*************'}
                        />
                    </div>
                </div>
                <div
                    style={{
                        marginTop: 10,
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    {!isSmall && (
                        <>
                            <input
                                type={"checkbox"}
                                style={{height: 20, width: 20}}
                                name={"extend"}
                                checked={userdata.extend}
                                onClick={() =>
                                    setUserData({...userdata, extend: !userdata.extend})
                                }
                            />
                            <div>
                                <label
                                    className={"font-primary"}
                                    onClick={() => {
                                        setUserData({...userdata, extend: !userdata.extend});
                                    }}
                                >
                                    Remember me
                                </label>
                            </div>
                        </>
                    )}
                </div>
                <div className={"logincontainer flex-center"}>
                    <button
                        onClick={handleLogin}
                        className={"btn btn-primary w50"}
                        style={{position: "relative"}}
                    >
                        {loading ? <Spinner/> : "Login"}
                    </button>
                </div>
                <div
                    className={"logincontainer flex-right"}
                    style={{marginTop: "24px"}}
                >
                    <div
                        className={"font-primary font-medium font-thick"}

                    >
                        {
                            <p>
                                New here?{" "}
                                <span className={"color-green"} onClick={() => {
                                    toggleState("REGISTER");
                                }} style={{cursor: "pointer"}}>
                  {" "}
                                    Register{" "}
                </span>
                            </p>
                        }
                    </div>
                </div>
            </form>
        </motion.div>
    );
}

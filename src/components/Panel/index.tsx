import React, {useContext, useEffect} from "react";
import "./ index.css";
import {ShellContext} from "../../services/context/shell.context";
import {useWindowSize} from "../../services/hooks";
import {EwindowSizes, reqType, service, serviceRoute} from "../../utils/enum";
import {GroupListPanel} from "./Conversation/GroupsListPanel/groupListPanel";
import {Chat} from "./ChatPanel/Chat";
import {UtilityPanel} from "./GroupsPanel";
import {AnimatePresence, motion} from "framer-motion";
import {getDeviceInfoUsingCapacitor, getFCMToken} from "../../utils/functions";
import {_props} from "../../services/network/network";
import {PushNotifications} from "@capacitor/push-notifications";
import {MokshaIcon} from "../Moksha/Icon";
import {ConfirmDialog} from "primereact/confirmdialog";

export const Panel = () => {
    let {size: smallScreen} = useWindowSize(EwindowSizes.S);
    const {sidePanel} = useContext(ShellContext);

    function handleSmallSizeClass() {
        if (smallScreen) return " w100  pabsolute"; else return "";
    }

    useEffect(() => {
        let deviceInfo = getDeviceInfoUsingCapacitor();
        deviceInfo.then(function (info) {
            let deviceInfo: any = info;
            if (info.platform === 'web') {
                getFCMToken().then(function (token) {
                    deviceInfo["token"] = token;
                    let data = {
                        token, type: info.platform,
                    };
                    _props
                        ._db(service.authentication)
                        .query(serviceRoute.deviceInfo, data, reqType.post, undefined);
                });
            } else {
                PushNotifications.requestPermissions().then(function (register) {
                    if (register.receive === 'granted') {
                        PushNotifications.register().then(r => {
                            PushNotifications.addListener('registration', function (token) {
                                console.log(token,  "TOKEN")
                                let data = {
                                    token:token.value, type: info.platform,
                                };
                                _props
                                    ._db(service.authentication)
                                    .query(serviceRoute.deviceInfo, data, reqType.post, undefined);
                            });
                        })
                    }
                })
            }
        });
    }, []);

    return (<AnimatePresence>
        <div className={"chatWrapper"}>
            <div className={"chatContainer shadow-box "}>
                {sidePanel.Group && (<motion.div
                    initial={{x: -10}}
                    animate={{x: 0}}
                    className={"containerA " + handleSmallSizeClass()}
                >
                    <GroupListPanel/>
                </motion.div>)}

                <div className={"containerB"}>
                    <Chat/>
                </div>
                {sidePanel.Util && (<motion.div
                    initial={{x: -10}}
                    animate={{x: 0}}
                    exit={{x: -10}}
                    className={"containerC"}>
                    <UtilityPanel/>
                </motion.div>)}
            </div>
        </div>
    </AnimatePresence>);
};

import React, {useContext, useEffect} from "react";
import './ index.css'
import {ShellContext} from "../../services/context/shell.context";
import {useWindowSize} from "../../services/hooks/appHooks";
import {EwindowSizes} from "../../utils/enum";
import {GroupListPanel} from "./Conversation/GroupsListPanel/groupListPanel";
import {Chat} from "./ChatPanel/chat";
import {UtilityPanel} from "./GroupsPanel";

export const Panel = () => {
    let {size: smallScreen} = useWindowSize(EwindowSizes.S);
    const {sidePanel} = useContext(ShellContext);
    const handleShow = () => {
        let style = {group: {}, util: {}};
        if (smallScreen) {
            if (sidePanel.Group) {
                style["group"] = {
                    display: "flex", position: "absolute",
                };
            } else {
                style["group"] = {
                    display: "none",
                };
            }
            if (sidePanel.Util) {
                style["util"] = {
                    display: "flex",
                };
            } else {
                style["util"] = {
                    display: "none",
                };
            }
        }
        return style;
    };
    useEffect(function () {
        handleShow();
    }, [smallScreen]);

    return (<div className={"chatWrapper"}>
            <div className={"chatContainer shadow-box "}>
                <div className={"containerA"} style={handleShow()?.group}>
                    <GroupListPanel/>
                </div>

                <div className={"containerB"}>
                    <Chat/>
                </div>
                <div className={"containerC"} style={handleShow().util}>
                    <UtilityPanel/>
                </div>
            </div>
        </div>);
};



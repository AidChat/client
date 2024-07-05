import React, {useContext, useEffect} from "react";
import "./App.css";
import {RouterProvider} from "react-router-dom";
import {router} from "./utils/routes";
import {ShellContext} from "./services/context/shell.context";
import {SocketEmitters} from "./utils/interface";

import {
    getDeviceInfoUsingCapacitor,
    requestForNotificationAccessIfNotGranted,
    setScreenOrientation,
} from "./utils/functions";
import {Quill} from "react-quill";
import QuillResizeImage from "quill-resize-image";

Quill.register("modules/resize", QuillResizeImage);

function App(): React.ReactElement {
    const {socket} = useContext(ShellContext);
    useEffect(() => {
        const element = document.getElementById("block-wrapper");
        if (process.env.NODE_ENV === 'production') {

            getDeviceInfoUsingCapacitor().then(async function (info) {
                console.log("Current platform", info.platform);
                if (info.platform === 'ios') {
                    // styling is given to support devices with notch/curved edges.
                    if (element) element.style.padding = "14px 0px";
                }
                if (info.platform === "web") {
                    if ("serviceWorker" in navigator) {
                        navigator.serviceWorker.register("./firebase-messaging-sw.js").then(
                            function (registration) {
                                console.log(
                                    "ServiceWorker registration successful with scope: ",
                                    registration.scope
                                );
                            },
                            function (err) {
                                console.error("ServiceWorker registration failed: ", err);
                            }
                        );
                    }
                } else {
                    await setScreenOrientation("portrait");
                    await requestForNotificationAccessIfNotGranted()

                }

            });

        }


        return () => {
            socket?.emit(SocketEmitters._DISCONNECT);
        };
    }, []);
    return (
        // <GoogleOAuthProvider
        //     clientId={
        //         process.env.REACT_APP_GG_APP_ID ? process.env.REACT_APP_GG_APP_ID : ""
        //     }
        // >
        <RouterProvider router={router}></RouterProvider>
        // </GoogleOAuthProvider>
    );
}

export default App;

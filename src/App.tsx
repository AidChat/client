import React, {useContext, useEffect} from "react";
import "./App.css";
import {RouterProvider} from "react-router-dom";
import {router} from "./utils/routes";
import {ShellContext} from "./services/context/shell.context";
import {SocketEmitters} from "./utils/interface";
import {GoogleOAuthProvider} from "@react-oauth/google";

import {
    getDeviceInfoUsingCapacitor,
    requestForNotificationAccessIfNotGranted,
    setScreenOrientation,
} from "./utils/functions";

function App(): React.ReactElement {
    const {socket} = useContext(ShellContext);
    useEffect(() => {
        console.log(process.env.NODE_ENV);
        if (process.env.REACT_APP_NODE_ENV === 'production') {
            getDeviceInfoUsingCapacitor().then(async function (info) {
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
                    await requestForNotificationAccessIfNotGranted()
                } else {
                    await setScreenOrientation("portrait");
                }
            });
        }

        return () => {
            socket?.emit(SocketEmitters._DISCONNECT);
        };
    }, []);
    return (
        <GoogleOAuthProvider
            clientId={
                process.env.REACT_APP_GG_APP_ID ? process.env.REACT_APP_GG_APP_ID : ""
            }
        >
            <RouterProvider router={router}></RouterProvider>
        </GoogleOAuthProvider>
    );
}

export default App;

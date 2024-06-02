import React from 'react';
import './index.css';
import App from './App';
import {createRoot} from "react-dom/client";
import {getDeviceInfoUsingCapacitor} from "./utils/functions";

getDeviceInfoUsingCapacitor().then(usingCapacitor => {
    if(usingCapacitor.platform !== 'web'){
        window.addEventListener( 'touchmove', function() {
            console.log("Removed touch scroll ability");
        })
    }
})

const root = createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);


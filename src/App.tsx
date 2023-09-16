import React from 'react';
import './App.css';
import {RouterProvider} from "react-router-dom";
import {router} from "./utils/routes";

function App(): React.ReactElement {
    return (
            <RouterProvider router={router}></RouterProvider>
    );
}
export default App;

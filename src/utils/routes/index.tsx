import { createBrowserRouter } from "react-router-dom";
import { Main } from "../../pages/main/main.page";

export const router = createBrowserRouter([
    {
        path: "/",
        element:<Main />,
    },
    {
        path : '/:requestCode',
        element:<Main />
    }
]);
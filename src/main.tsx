import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/index/Index";
import Login from "./pages/login/Login";
import "bulma/css/bulma.min.css";
import "./main.css";
import * as bulmaToast from "bulma-toast";
import "animate.css";
import App from "./App";

bulmaToast.setDefaults({
    duration: 5000,
    position: "top-right",
    dismissible: true,
    animate: { in: "fadeIn", out: "fadeOut" },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Index public={false} />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/pub",
                element: <Index public={true} />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

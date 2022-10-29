import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./pages/index/Index";
import Login from "./pages/login/Login";
import "bulma/css/bulma.min.css";
import Navbar from "./components/navbar/navbar";
import "./main.css";
import * as bulmaToast from "bulma-toast";
import "animate.css"

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
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Navbar />
        <div className="conteudo">
            <RouterProvider router={router} />
        </div>
    </React.StrictMode>
);

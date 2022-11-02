import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/navbar";

const App: React.FC = () => {
    return (
        <>
            <Navbar />
            <div className="conteudo">
                <Outlet />
            </div>
        </>
    );
};
export default App;

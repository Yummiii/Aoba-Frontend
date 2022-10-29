import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
        setLogged(true);
    }, [navigate]);
    return logged;
}
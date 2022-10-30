import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import apiFetch from "../api/apiFetch";
import {AxiosError} from "axios";

export default function useLogin() {
    const navigate = useNavigate();
    const [logged, setLogged] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        } else {
            console.log("aqui")
            apiFetch.get("/users/@me").then(({data}) => {
                console.log(data);
                setLogged(true);
            }).catch(e => {
                if (e instanceof AxiosError) {
                  if (e.response?.status == 403) {
                      localStorage.removeItem("token");
                      navigate("/login")
                  }
                }
            });
        }

    }, [navigate]);
    return logged;
}
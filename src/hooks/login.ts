import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../api/apiFetch";
import { AxiosError } from "axios";
import { observable } from "@legendapp/state";
import { useSelector } from "@legendapp/state/react";

export const authObs = observable({ logged: false, fetched: false, name: "", id: "" });

export default function useLogin(redirect = true, forceFetch = false) {
    const navigate = useNavigate();
    const state = useSelector(() => authObs.get());

    useEffect(() => {
        if (!localStorage.getItem("crypt_key")) {
            localStorage.setItem(
                "crypt_key",
                prompt("coloca a key vagaba") as string
            );
        }

        if (state.fetched && !forceFetch) return;

        if (!localStorage.getItem("token") && redirect) {
            navigate("/login");
        } else {
            if (!localStorage.getItem("token")) return;
            console.log("fez request");
            apiFetch
                .get("/users/@me")
                .then(({ data }) => {
                    authObs.set({
                        fetched: true,
                        logged: true,
                        name: data.username,
                        id: data.id
                    });
                })
                .catch((e) => {
                    if (e instanceof AxiosError) {
                        if (e.response?.status == 403) {
                            authObs.set({
                                fetched: true,
                                logged: false,
                                name: "",
                                id: ""
                            });

                            localStorage.removeItem("token");
                            if (redirect) {
                                navigate("/login");
                            }
                        }
                    }
                });
        }
    }, [navigate, state.fetched]);

    return {logged: state.logged, name: state.name, id: state.id};
}

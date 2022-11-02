import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFetch from "../api/apiFetch";
import { AxiosError } from "axios";
import { observable } from "@legendapp/state";
import { useSelector } from "@legendapp/state/react";

export const authObs = observable({ logged: false, fetched: false });

export default function useLogin(redirect = true, forceFetch = false) {
    const navigate = useNavigate();
    const state = useSelector(() => authObs.get());

    useEffect(() => {
        if (state.fetched && !forceFetch) return;

        if (!localStorage.getItem("token") && redirect) {
            navigate("/login");
        } else {
            console.log("fez request");
            apiFetch
                .get("/users/@me")
                .then(({ data }) => {
                    authObs.set({
                        fetched: true,
                        logged: true,
                    });
                })
                .catch((e) => {
                    if (e instanceof AxiosError) {
                        if (e.response?.status == 403) {
                            authObs.set({
                                fetched: true,
                                logged: false,
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

    return state.logged;
}

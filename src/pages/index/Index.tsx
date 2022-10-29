import { toast } from "bulma-toast";
import { useEffect, useState } from "react";
import apiFetch from "../../api/apiFetch";
import ImageCard from "../../components/imageCard/ImageCard";
import useLogin from "../../hooks/login";
import style from "./Index.module.css";
import { observable } from "@legendapp/state";
import { useSelector } from "@legendapp/state/react";
import UploadButton from "../../components/uploadButton/UploadButton";

export const imageObs = observable({ files: [] as File[] });

const App: React.FC = () => {
    const logged = useLogin();
    const state = useSelector(() => imageObs.files.get());

    useEffect(() => {
        if (!logged) return;
        apiFetch
            .get<UserList>("/users/@me/list")
            .then(({ data }) => imageObs.files.set(data.files))
            .catch((e) => {
                console.log("xablau");
                console.log(e);
                toast({
                    message: "Alguma coisa deu pau",
                    type: "is-danger",
                });
            });
    }, [logged]);

    return (
        <>
            <UploadButton />
            <div className={style.imgsContainer}>
                {state.map((file) => (
                    <ImageCard imgId={file.id} key={file.id} />
                ))}
            </div>
        </>
    );
};

export interface File {
    fileName: string;
    id: string;
    pub: boolean;
    pubListing: boolean;
    createdAt: number;
}
export interface Folder {
    id: string;
    name: string;
}
export interface UserList {
    folders: Folder[];
    files: File[];
}
export interface Image {
    src: string;
    id: string;
}
export default App;

import { toast } from "bulma-toast";
import { ChangeEvent, useEffect, useState } from "react";
import apiFetch from "../../api/apiFetch";
import ImageCard from "../../components/imageCard/ImageCard";
import useLogin from "../../hooks/login";
import style from "./Index.module.css";
import { observable } from "@legendapp/state";
import { useSelector } from "@legendapp/state/react";
import UploadButton from "../../components/uploadButton/UploadButton";
import Viewer from "react-viewer";
import { useSearchParams } from "react-router-dom";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import CryptoJSW from "@originjs/crypto-js-wasm";

export const imageObs = observable({ files: [] as File[], pages: 1 });

const App: React.FC<IndexProps> = (props) => {
    const { logged } = useLogin(!props.public, true);
    const state = useSelector(() => imageObs.files.get());
    const pages = useSelector(() => imageObs.pages.get());
    const dropdown = React.createRef<HTMLDivElement>();
    const [menuState, setMenuState] = useState<{
        x: number;
        y: number;
        id: string;
        element: HTMLDivElement | null;
        focus: string;
        active: boolean;
        disabledPub: boolean;
        pub: boolean;
        pubList: boolean;
        src: string;
    }>({
        x: 0,
        y: 0,
        id: "",
        active: false,
        element: null,
        focus: "",
        disabledPub: false,
        pub: false,
        pubList: false,
        src: "",
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalData, setModalData] = useState<ImageViewModalData>({
        active: false,
        src: "",
        id: "",
        name: "",
    });
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 15;

    useEffect(() => {
        if (!logged && !props.public) return;

        apiFetch
            .get<UserList>(
                `${
                    props.public ? "/files/public" : "/users/@me/list"
                }?size=${size}&page=${page}`
            )
            .then(({ data }) => {
                imageObs.pages.set(data.totalPages);
                imageObs.files.set(data.files);
            })
            .catch((e) => {
                console.log("xablau");
                console.log(e);
                toast({
                    message: "Alguma coisa deu pau",
                    type: "is-danger",
                });
            });
    }, [logged, props.public, page, pages, size]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            let num = 0;
            switch (e.key) {
                case "ArrowLeft":
                    num = -1;
                    break;
                case "ArrowRight":
                    num = 1;
                    break;
                default:
                    return;
            }
            console.log(num);
            changePage(page + num);
        };
        document.addEventListener("keydown", handler, true);
        return () => {
            document.removeEventListener("keydown", handler, true);
        };
    }, [changePage]);

    function imgClick(file: File, src: string) {
        setModalData({
            active: true,
            src,
            id: file.id,
            name: file.fileName,
        });
    }

    function modalClose() {
        setModalData({
            active: false,
            src: "",
            id: "",
            name: "",
        });
    }

    function selectPage() {
        const np = Number(prompt("Qual a pagina?")) || page;
        changePage(np);
    }

    function changePage(np: number) {
        if (np > pages) return;
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("page", `${np}`);
        setSearchParams(newParams);
    }

    function menu(
        e: React.MouseEvent<HTMLDivElement>,
        file: File,
        focus: string,
        src: string
    ) {
        e.currentTarget.classList.add(focus);
        setMenuState({
            x: e.pageX,
            y: e.pageY,
            active: true,
            focus,
            element: e.currentTarget,
            disabledPub: file.pubListing,
            pub: file.pub,
            pubList: file.pubListing,
            id: file.id,
            src,
        });
    }

    function hideMenu(e: React.MouseEvent<HTMLDivElement>) {
        if (!dropdown.current?.children[0].contains(e.target as Node)) {
            hide();
        }
    }

    function hide() {
        menuState.element?.classList.remove(menuState.focus);
        setMenuState({
            x: 0,
            y: 0,
            active: false,
            element: null,
            focus: "",
            disabledPub: false,
            pub: false,
            id: "",
            pubList: false,
            src: "",
        });
    }

    async function deleteImg() {
        try {
            await apiFetch.delete(`/files/${menuState.id}/delete`);
            imageObs.files.set((x) => x.filter((y) => y.id != menuState.id));
            hide();
            toast({
                message: "Imagem excluida",
                type: "is-success",
            });
        } catch {
            toast({
                message: "Alguma coisa deu pau",
                type: "is-danger",
            });
        }
    }

    async function pubListChange(e: ChangeEvent<HTMLInputElement>) {
        setMenuState((x) => ({
            ...x,
            disabledPub: e.target.checked,
            pub: e.target.checked,
            pubList: e.target.checked,
        }));
        await change(e.target.checked, e.target.checked);
    }

    async function pubChange(e: ChangeEvent<HTMLInputElement>) {
        setMenuState((x) => ({ ...x, pub: e.target.checked }));
        await change(e.target.checked, false);
    }

    async function change(pub: boolean, pubList: boolean) {
        let content = ""
        if(pub) {
            content = await getBase64FromUrl(menuState.src);
        } else {
            await CryptoJSW.AES.loadWasm();
            content = CryptoJSW.AES.encrypt(await getBase64FromUrl(menuState.src), localStorage.getItem("crypt_key") as string).toString();
        }

        console.log(content);
        let a = await apiFetch.put(`/files/${menuState.id}/update`, {
            pub,
            pubList,
            content
        });
        console.log(a);
    }

    const getBase64FromUrl = async (url: string) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
        });
    };

    return (
        <div style={{ height: "100%", width: "100%" }} onClick={hideMenu}>
            <Viewer
                visible={modalData.active}
                images={[
                    {
                        src: modalData.src,
                        alt: modalData.name,
                        downloadUrl: modalData.src,
                    },
                ]}
                downloadInNewWindow={true}
                noNavbar={true}
                downloadable={true}
                onClose={modalClose}
                onMaskClick={modalClose}
            />
            <div
                className={`dropdown ${menuState.active ? "is-active" : ""} ${
                    style.menu
                }`}
                style={{ top: menuState.y, left: menuState.x }}
                ref={dropdown}
            >
                <div className="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {/* <hr className="dropdown-divider" /> */}
                        <a
                            className="dropdown-item"
                            onClick={deleteImg}
                            style={{ color: "red" }}
                        >
                            Excluir
                        </a>
                        <hr className="dropdown-divider" />
                        <a className={`dropdown-item`}>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="fa-fw"
                                    checked={menuState.pub}
                                    disabled={menuState.disabledPub}
                                    onChange={pubChange}
                                />
                                Pública
                            </label>
                        </a>
                        <a className={`dropdown-item`}>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    className="fa-fw"
                                    checked={menuState.pubList}
                                    onChange={pubListChange}
                                />
                                Lista pública
                            </label>
                        </a>
                    </div>
                </div>
            </div>
            <UploadButton size={size} />
            <div className={style.imgsContainer}>
                {state.slice(0, size).map((file) => (
                    <ImageCard
                        file={file}
                        key={file.id}
                        onClick={imgClick}
                        onContextMenu={menu}
                    />
                ))}
            </div>
            <div className={style.pagesControl}>
                <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={`fa-fw ${style.arrows}`}
                    onClick={() => changePage(page - 1)}
                />
                <p className={style.text} onClick={selectPage}>
                    {page} de {pages > 1 ? pages : 1}
                </p>
                <FontAwesomeIcon
                    icon={faAngleRight}
                    className={`fa-fw ${style.arrows}`}
                    onClick={() => changePage(page + 1)}
                />
            </div>
        </div>
    );
};

export interface ImageViewModalData {
    src: string;
    id: string;
    name: string;
    active: boolean;
}

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
    totalPages: number;
    totalElements: number;
}

export interface Image {
    src: string;
    id: string;
}

export interface IndexProps {
    public: boolean;
}

export default App;

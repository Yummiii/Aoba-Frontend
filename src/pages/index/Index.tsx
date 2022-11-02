import { toast } from "bulma-toast";
import { useEffect, useState } from "react";
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

export const imageObs = observable({ files: [] as File[] });

const App: React.FC<IndexProps> = (props) => {
    const { logged } = useLogin(!props.public, true);
    const state = useSelector(() => imageObs.files.get());
    const [pages, setPages] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [modalData, setModalData] = useState<ImageViewModalData>({
        active: false,
        src: "",
        id: "",
        name: "",
    });
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        if (!logged && !props.public) return;

        apiFetch
            .get<UserList>(
                `${
                    props.public ? "/files/public" : "/users/@me/list"
                }?size=15&page=${page}`
            )
            .then(({ data }) => {
                setPages(data.totalPages);
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
    }, [logged, props.public, page, pages]);

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

    function imgClick(src: string, id: string, name: string) {
        setModalData({
            active: true,
            src,
            id,
            name,
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

    return (
        <>
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
            <UploadButton />
            <div className={style.imgsContainer}>
                {state.map((file) => (
                    <ImageCard
                        imgId={file.id}
                        fileName={file.fileName}
                        key={file.id}
                        onClick={imgClick}
                        public={file.pub && file.pubListing}
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
        </>
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
}

export interface Image {
    src: string;
    id: string;
}

export interface IndexProps {
    public: boolean;
}

export default App;

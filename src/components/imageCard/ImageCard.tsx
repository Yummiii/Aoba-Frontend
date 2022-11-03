import React, { MouseEventHandler, useEffect, useState } from "react";
import apiFetch from "../../api/apiFetch";
import style from "./ImageCard.module.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJSW from "@originjs/crypto-js-wasm";
import { base64ToBlob } from "base64-blob";
import { File as FileFoda } from "../../pages/index/Index";

const ImageCard: React.FC<ImageCardProps> = (props) => {
    const [src, setSrc] = useState<string>("");

    useEffect(() => {
        if (!props.file.pub) {
            apiFetch
            .get(`/files/${props.file.id}/data`, { responseType: "json" })
            .then(async (resp) => {
                await CryptoJSW.AES.loadWasm();
                try {
                    console.log(localStorage.getItem("crypt_key"));
                    const img = CryptoJSW.AES.decrypt(
                        resp.data.content,
                        localStorage.getItem("crypt_key") as string
                    );
                    const file = new File(
                        [await base64ToBlob(img.toString(CryptoJSW.enc.Utf8))],
                        props.file.fileName,
                        {
                            type: resp.data.contentType,
                        }
                    );
                    setSrc(URL.createObjectURL(file));
                } catch (e) {
                    console.log(e);
                    setSrc(
                        "https://cdn.discordapp.com/attachments/901878705234788412/1037160650734051359/unknown.png"
                    );
                }
            });
        } else {
            setSrc(`${localStorage.getItem("API_URL_OVERRIDE") || import.meta.env.VITE_API_URL}/files/${props.file.id}/data?mode=raw`)
        }
    }, [props.file]);

    function click(e: { ctrlKey: boolean }) {
        if (e.ctrlKey) return window.open(src);
        props.onClick(props.file, src);
    }

    function menu(e: React.MouseEvent<HTMLDivElement>) {
        if (props.onContextMenu) {
            e.stopPropagation();
            e.preventDefault();
            props.onContextMenu(e, props.file, style.foco, src);
        }
    }

    if (!src) {
        return (
            <div className={`card ${style.imgCard}`}>
                <div className={`${style.loading} `}>
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className={style.spinner}
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className={`card ${style.imgCard}`}
                onClick={click}
                onContextMenu={menu}
                tabIndex={-1}
            >
                <figure className="image is-square" tabIndex={-1}>
                    <img
                        src={src}
                        className={style.imgCover}
                        tabIndex={-1}
                        alt={props.file.fileName}
                    />
                </figure>
            </div>
        </>
    );
};

export interface ImageCardProps {
    file: FileFoda
    onClick: (image: FileFoda, src: string) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement>, image: FileFoda, foco: string, src: string) => void;
}

export default ImageCard;

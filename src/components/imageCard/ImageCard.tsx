import React, { MouseEventHandler, useEffect, useState } from "react";
import apiFetch from "../../api/apiFetch";
import style from "./ImageCard.module.css";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CryptoJSW from "@originjs/crypto-js-wasm";
import {base64ToBlob} from 'base64-blob'

const ImageCard: React.FC<ImageCardProps> = (props) => {
    const [src, setSrc] = useState<string>("");

    useEffect(() => {
        apiFetch
            .get(`/files/${props.imgId}/data`, { responseType: "json" })
            .then(async (resp) => {
                await CryptoJSW.AES.loadWasm();
                try {
                    if (!props.public) {
                        console.log(localStorage.getItem("crypt_key"));
                        const img = CryptoJSW.AES.decrypt(
                            resp.data.content,
                            localStorage.getItem("crypt_key") as string
                        );
                        const file = new File([await base64ToBlob(img.toString(CryptoJSW.enc.Utf8))], props.fileName, {
                            type: resp.data.contentType
                        });
                        setSrc(URL.createObjectURL(file));
                    } else {
                        setSrc(URL.createObjectURL(await base64ToBlob(resp.data.content)));
                    }
                } catch (e) {
                    console.log(e);
                    setSrc(
                        "https://cdn.discordapp.com/attachments/901878705234788412/1037160650734051359/unknown.png"
                    );
                }
            });
    }, [props.imgId, props.public]);

    function click(e: { ctrlKey: boolean }) {
        if (e.ctrlKey) return window.open(src);
        props.onClick(src, props.imgId, props.fileName);
    }

    function menu(e: React.MouseEvent<HTMLDivElement>) {
        if (props.onContextMenu) {
            e.stopPropagation();
            e.preventDefault();
            props.onContextMenu(e, props.imgId);
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
            <div className={`card ${style.imgCard}`} onClick={click} onContextMenu={menu}>
                <figure className="image is-square">
                    <img
                        src={src}
                        className={style.imgCover}
                        alt={props.fileName}
                    />
                </figure>
            </div>
        </>
    );
};

export interface ImageCardProps {
    imgId: string;
    public?: boolean;
    fileName: string;

    onClick: (src: string, id: string, name: string) => void;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
}

export default ImageCard;

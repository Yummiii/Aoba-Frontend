import React, {useEffect, useState} from "react";
import apiFetch from "../../api/apiFetch";
import style from "./ImageCard.module.css"
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const ImageCard: React.FC<ImageCardProps> = (props) => {
    const [src, setSrc] = useState<string>("");

    useEffect(() => {
        if (!props.public) {
            apiFetch.get(`/files/${props.imgId}/data`, {responseType: "blob"}).then(img => {
                setSrc(URL.createObjectURL(img.data));
            })
        } else {
            setSrc(`${import.meta.env.VITE_API_URL}files/${props.imgId}/data`)
        }
    }, [props.imgId]);

    function click(e: { ctrlKey: boolean; }) {
        if (e.ctrlKey) return window.open(src);
        props.onClick(src, props.imgId, props.fileName);
    }

    if (!src) {
        return (<div className={`card ${style.imgCard}`}>
            <div className={`${style.loading} `}>
                <FontAwesomeIcon icon={faSpinner} className={style.spinner}/>
            </div>
        </div>)
    }

    return (<>
        <div className={`card ${style.imgCard}`} onClick={click}>
            <figure className="image is-square">
                <img src={src} className={style.imgCover} alt={props.fileName}/>
            </figure>
        </div>
    </>);
};

export interface ImageCardProps {
    imgId: string;
    public?: boolean;
    fileName: string;
    
    onClick: (src: string, id: string, name: string) => void;
}

export default ImageCard;

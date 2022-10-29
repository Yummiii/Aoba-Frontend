import { useEffect, useState } from "react";
import apiFetch from "../../api/apiFetch";
import style from "./ImageCard.module.css"

const ImageCard: React.FC<ImageCardProps> = (props) => {
    const [src, setSrc] = useState<string>("");

    useEffect(() => {
        apiFetch.get(`/files/${props.imgId}/data`, {responseType: "blob"}).then(img => {
            setSrc(URL.createObjectURL(img.data));
        })
    }, [props.imgId]);

    if (!src) {
        return <></>;
    }

    return (
        <div className={`card ${style.imgCard}`}>
            <figure className="image is-square">
                <img src={src} className={style.imgCover} />
            </figure>
        </div>
    );
};

export interface ImageCardProps {
    imgId: string;
}
export default ImageCard;

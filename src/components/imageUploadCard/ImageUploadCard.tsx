import { ChangeEvent, useState } from "react";
import style from "./ImageUploadCard.module.css";

const ImageUploadCard: React.FC<ImageUploadCardProps> = (props) => {
    const [checked, setCheked] = useState(false);
    const [disabled, setDisabled] = useState(false);

    function pubListChange(e: ChangeEvent<HTMLInputElement>) {
        props.onPubChange(true, e.target.checked, props.index);
        setCheked(e.target.checked);
        setDisabled(e.target.checked);
    }

    function pubChange(e: ChangeEvent<HTMLInputElement>) {
        setCheked(e.target.checked);
        props.onPubChange(false, e.target.checked, props.index);
    }

    return (
        <div className={`card ${style.cardBlock}`}>
            <div className="card-image">
                <figure className={`image is-square ${style.imgCard}`}>
                    <img src={props.src} />
                </figure>
            </div>
            <footer className="card-footer">
                <div className="card-footer-item">
                    <label className="checkbox">
                        <input type="checkbox" className="fa-fw" onChange={pubChange} checked={checked} disabled={disabled}/>
                        Pública
                    </label>
                </div>
                <div className="card-footer-item">
                    <label className="checkbox">
                        <input type="checkbox" className="fa-fw" onChange={pubListChange}/>
                        Lista pública
                    </label>
                </div>
            </footer>
        </div>
    );
};

export interface ImageUploadCardProps {
    src: string;
    index: number;
    onPubChange: (list: boolean, state: boolean, index: number) => void;
}
export default ImageUploadCard;

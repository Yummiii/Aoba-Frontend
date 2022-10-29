import style from "./ImageUploadCard.module.css";

const ImageUploadCard: React.FC<ImageUploadCardProps> = (props) => {
    return (
        <div className={`card ${style.cardBlock}`}>
            <div className="card-image">
                <figure className={`image is-square ${style.imgCard}`}>
                    <img src={props.src} />
                </figure>
            </div>
            <footer className="card-footer">
                <a href="#" className="card-footer-item">
                    Save
                </a>
                <a href="#" className="card-footer-item">
                    Edit
                </a>
                <a href="#" className="card-footer-item">
                    Delete
                </a>
            </footer>
        </div>
    );
};

export interface ImageUploadCardProps {
    src: string;
}
export default ImageUploadCard;

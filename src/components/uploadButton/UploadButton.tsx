import style from "./UploadButton.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadModal from "../uploadModal/UploadModal";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const UploadButton: React.FC = () => {
    const [active, setActive] = useState(false);

    function openModal() {
        setActive(true);
    }

    function closeModal() {
        setActive(false);
    }

    return (
        <>
            <UploadModal active={active} onClose={closeModal}/>
            <div className={style.uploadButton} onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </>
    );
};
export default UploadButton;

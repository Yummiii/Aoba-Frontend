import style from "./UploadButton.module.css";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UploadModal from "../uploadModal/UploadModal";
import { useState } from "react";
import useLogin from "../../hooks/login";

const UploadButton: React.FC<{size: number}> = (props) => {
    const [active, setActive] = useState(false);
    const auth = useLogin(false)

    function openModal() {
        setActive(true);
    }

    function closeModal() {
        setActive(false);
    }

    if (!auth.logged) {
        return <></>;
    }

    return (
        <>
            <UploadModal size={props.size} active={active} onClose={closeModal}/>
            <div className={style.uploadButton} onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </>
    );
};
export default UploadButton;

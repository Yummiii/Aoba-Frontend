import { AxiosError } from "axios";
import { toast } from "bulma-toast";
import React, { ChangeEvent, useRef, useState } from "react";
import apiFetch from "../../api/apiFetch";
import ImageUploadCard from "../imageUploadCard/ImageUploadCard";
import style from "./UploadModal.module.css";
import {imageObs} from "../../pages/index/Index";

const UploadModal: React.FC<UploadModalProps> = (props) => {
    const fileSelect = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileFoda[]>([]);

    function close() {
        setFiles([]);
        props.onClose();
    }

    function selectChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFiles(
                [...e.target.files].map((file) => {
                    return {
                        file,
                        src: URL.createObjectURL(file),
                        pub: false, 
                        pubList: false
                    };
                })
            );
        }
    }

    function upload() {
        close();
        files.forEach(async (file) => {
            try {
                const form = new FormData();
                form.append("file", file.file);
                form.append("pub", `${file.pub}`);
                form.append("pubList", `${file.pubList}`);
                const {data} = await apiFetch.post("/files/upload", form);

                console.log(data);
                imageObs.files.unshift(data);
                toast({
                    message: `Imagem upada com id: ${data.id}`,
                    type: "is-success"
                })
            } catch (e) {
                if (e instanceof AxiosError) {
                    toast({
                        message: "Alguma coisa deu pau",
                        type: "is-danger"
                    })
                }
            }
        });

    }

    function imgPubChange(list: boolean, state: boolean, index: number) {
        if (list) {
            files[index].pubList = state;
            files[index].pub = state;
        } else {
            files[index].pub = state;
        }
        console.log(files[index]);
    }

    function openSelect() {
        fileSelect.current?.click();
    }

    return (
        <div className={`modal ${props.active ? "is-active" : ""}`}>
            <div className="modal-background" onClick={close}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Adicionar uma imagem(s)</p>
                    <button className="delete" onClick={close}></button>
                </header>
                <section className="modal-card-body">
                    <div className={style.cards}>
                        {files.map((file, index) => (
                            <ImageUploadCard src={file.src} key={file.src} index={index} onPubChange={imgPubChange}/>
                        ))}
                    </div>
                </section>
                <footer
                    className="modal-card-foot"
                    style={{ justifyContent: "center" }}
                >
                    <button className="button is-info" onClick={openSelect}>
                        Selecionar imagens
                    </button>
                    <button className="button is-primary" onClick={upload}>
                        Upload
                    </button>
                </footer>
            </div>
            <input
                ref={fileSelect}
                style={{ display: "none" }}
                type="file"
                multiple
                onChange={selectChange}
            />
        </div>
    );
};
export interface UploadModalProps {
    active: boolean;
    onClose: () => void;
}
export interface FileFoda {
    src: string;
    file: File;
    pub: boolean;
    pubList: boolean;
}
export default UploadModal;

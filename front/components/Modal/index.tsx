import React, {ReactNode, useCallback} from "react";
import {CloseModalButton, CreateModal} from "@components/Modal/styles";

type Props = {
    show: boolean;
    onCloseModal: () => void;
    children: ReactNode;
}

const Modal = ({ show, children, onCloseModal }: Props) => {
    const stopPropagation = useCallback((e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
    }, []);

    if (!show) {
        return null;
    }

    return (
        <CreateModal onClick={onCloseModal}>
            <div onClick={stopPropagation}>
                <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
                {children}
            </div>
        </CreateModal>
    )
};

export default Modal;
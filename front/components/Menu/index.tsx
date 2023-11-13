import React, {CSSProperties, useCallback} from "react";
import {CloseMenuButton, CreateMenu} from "@components/Menu/styles";

type Props = {
    children: React.ReactNode;
    show: boolean;
    onCloseMenu: () => void;
    style: CSSProperties;
    closeButton?: boolean;
}

const Menu = ({ children, style, show, onCloseMenu, closeButton  }: Props) => {
    const stopPropagation = useCallback((e: { stopPropagation: () => void; }) => {
        e.stopPropagation(); // 부모 태그로 이벤트가 버블링되지 않도록, 만약 이게 없다면, <div> 태그에서 클릭했을 때도 부모태그의 onClick이 실행될 것
    }, [])

    return (
        <CreateMenu onClick={onCloseMenu}>
            <div style={style} onClick={stopPropagation}>
                {closeButton && <CloseMenuButton onClick={onCloseMenu}>&times;</CloseMenuButton>}
                {children}
            </div>
            {children}
        </CreateMenu>
    );
};

Menu.defaultProps = {
    closeButton: true,
};

export default Menu;
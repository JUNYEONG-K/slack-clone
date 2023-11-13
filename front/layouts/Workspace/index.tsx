import React, {useCallback} from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Navigate, Route, Routes} from "react-router-dom";
import {
    Channels, Chats,
    Header, MenuScroll,
    ProfileImg,
    RightMenu,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DM'));

const Workspace = () => {
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {
            withCredentials: true,
        })
            .then(() => {
                mutate(false, { revalidate: false }); // Optimistic UI - revalidate: true
            })
    }, []);

    if (!data) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span>
                        <ProfileImg
                            src={gravatar.url(data.email, { s: '28px', d: 'retro' })}
                            alt={data.nickname}
                        />
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>로그아웃</button>
            <WorkspaceWrapper>
                <Workspaces>
                    test
                </Workspaces>
                <Channels>
                    <WorkspaceName>
                        Sleact
                    </WorkspaceName>
                    <MenuScroll>
                        <MenuScroll>
                            MenuScroll
                        </MenuScroll>
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Routes>
                        <Route path="/channel" element={<Channel />} />
                        <Route path="/dm" element={<DirectMessage  />} />
                    </Routes>
                </Chats>
            </WorkspaceWrapper>
        </div>
    );
}

export default Workspace;

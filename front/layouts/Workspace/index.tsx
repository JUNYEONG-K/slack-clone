import React, {useCallback, useState} from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Link, Navigate, Route, Routes} from "react-router-dom";
import {
    AddButton,
    Channels, Chats,
    Header, LogOutButton, MenuScroll,
    ProfileImg, ProfileModal,
    RightMenu, WorkspaceButton,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import {IUser} from "@typings/db";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import { Button, Input, Label } from "@pages/SignUp/styles";
import { toast } from "react-toastify";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DM'));

const Workspace = () => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);

    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {
            withCredentials: true,
        })
            .then(() => {
                mutate(false, { revalidate: false }); // Optimistic UI - revalidate: true
            })
    }, []);

    const onCloseUserMenu = useCallback((e: { stopPropagation: () => void; }) => {
        e.stopPropagation();
        setShowUserMenu(false);
    }, []);

    const  onClickUserMenu = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    const onCreateWorkspace = useCallback((e: any) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        axios.post('http://localhost:3095/api/workspaces', {
            workspace: newWorkspace,
            url: newUrl,
        }, {
            withCredentials: true,
        },)
            .then(() => {
                mutate(false, { revalidate: true }); // revalidate: false? true? mutate data false? true? 흠..
                setShowCreateWorkspaceModal(false);
                setNewWorkspace('');
                setNewUrl('');
            })
            .catch((error) => {
                console.dir(error);
                toast.error(error.response.data, { position: 'bottom-center' });
            });
    }, [newWorkspace, newUrl]);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
    }, []);

    if (!userData) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserMenu}>
                        <ProfileImg
                            src={gravatar.url(userData.email, { s: '28px', d: 'retro' })}
                            alt={userData.nickname}
                        />
                        { showUserMenu && (
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseMenu={onCloseUserMenu}>
                                <ProfileModal>
                                     <img
                                        src={gravatar.url(userData.email, { s: '28px', d: 'retro' })}
                                        alt={userData.nickname}
                                    />
                                    <div>
                                        <span id="profile-name">{userData.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>
                        ) }
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>로그아웃</button>
            <WorkspaceWrapper>
                <Workspaces>
                    {userData.Workspaces.map((workspace) => {
                        return (
                            <Link key={workspace.id} to={`workspace/${123}/channel/일반`}>
                                <WorkspaceButton>
                                    {workspace.name.slice(0, 1).toUpperCase()}
                                </WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
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
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
        </div>
    );
}

export default Workspace;

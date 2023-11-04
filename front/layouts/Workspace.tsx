import React, {useCallback} from "react";
import useSWR from "swr";
import fetcher from "@utils/fetcher";
import axios from "axios";
import {Navigate} from "react-router-dom";

const Workspace = ({ children }: { children: React.ReactNode }) => {
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);

    const onLogout = useCallback(() => {
        axios.post('http://localhost:3095/api/users/logout', null, {
            withCredentials: true,
        })
            .then(() => {
                mutate();
            })
    }, []);

    if (!data) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <button onClick={onLogout}>로그아웃</button>
            {children}
        </div>
    );
}

export default Workspace;

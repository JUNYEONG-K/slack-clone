import React from "react";
import { Route, Routes, Navigate } from "react-router-dom"; // Updated imports
import loadable from '@loadable/component';

// 코드 스플리팅 -> 필요할 때마다 불러오도록
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect */}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/workspace/channel" element={<Channel />} />
        </Routes>
    );
}

export default App;
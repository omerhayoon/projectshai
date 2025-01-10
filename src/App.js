import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import HomePage from "./Pages/HomePage";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />   {/* Login page */}
                <Route path="/signup" element={<SignUp />} /> {/* SignUp page */}
                <Route path="/HomePage" element={<HomePage />} />  {/* HomePage */}
            </Routes>
        </Router>
    );
};

export default App;

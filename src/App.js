import React from 'react';
import { Route, Routes } from "react-router-dom";
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import ClientContactInfo from './pages/ClientContactInfo';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/clientcontacts" element={<ClientContactInfo />} />
      </Routes>
    </div>
  );
}

export default App;

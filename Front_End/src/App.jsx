import React, { useState } from "react";
import MetaMaskConnection from "./components/MetaMaskConnection";
import Navbar from "./components/Navbar";
import { LoadWeb3 } from "./components/LoadWeb3";
import AppState from "./context/AppState";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignUpPage } from "./components/SignUpPage";
import { Home } from "./components/Home";
const App = () => {
  return (
    <>
      <AppState>
        <Router>
          <LoadWeb3 />
          {/* <MetaMaskConnection/> */}
          <Routes>
            {/* <Route path="/" element={<SignUpPage />} /> */}
            <Route path="/home" element={<Home/>}></Route>
          </Routes>
        </Router>
      </AppState>
    </>
  );
};

export default App;

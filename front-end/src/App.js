import React from "react";
import MetaMaskConnection from "./components/MetaMaskConnection";
import Face_Detection from "./components/Face_Detection";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <div>
      <Navbar />
      <MetaMaskConnection />
      {/* <Face_Detection /> */}
    </div>
  );
};

export default App;

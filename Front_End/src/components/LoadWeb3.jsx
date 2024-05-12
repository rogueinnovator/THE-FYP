import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { formatBalance, formatChainAsNum } from "../main"; /* New */
import AppContext from "../context/AppContext";
import Navbar from "./Navbar";
export const LoadWeb3 = (props) => {
  const context = useContext(AppContext);
  const {
    setError,
    setErrorMessage,
    setWallet,
    initialState,
    setProvider,
    setconnecting,
    error,
    hasProvider,
    wallet,
    ErrorMessage,
    disableConnect,
  } = context;

  useEffect(() => {
    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const refreshAccounts = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log("this is the fucking provider", provider);
      setProvider(Boolean(true));
      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const loadBlockChainData = async () => {
    try {
      if (!error) {
        const web3 = new Web3(window.ethereum);
        // const contractData = web3.eth.contract();
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
      setError(true);
    }
  };

  const updateWallet = async (userAccounts) => {
    const web3 = new Web3(window.ethereum);
    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [userAccounts[0], "latest"],
      }),
    );
    console.log(userAccounts[0]);
    const chainId = await web3.eth.getChainId();
    console.log("this is chain id ", chainId);
    console.log("this is balance", balance);
    setWallet({ accounts: userAccounts, balance, chainId });
  };

  const handleConnect = async () => {
    setconnecting(true);
    try {
      const userAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setError(false);
      updateWallet(userAccounts);
      // loadBlockChainData();
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    } finally {
      setTimeout(() => {
        setconnecting(false);
      }, 3000);
    }
  };
  console.log(disableConnect, "this is result");
  return (
    <>
      {" "}
      <Navbar loadFun={handleConnect} />
      <div className="MetaMaskConnection">
        <div> injected provider has {hasProvider ? "exist" : "not_Exist"}</div>
        {window.ethereum?.isMetaMask && //this uses conditional chaining to render the button
          wallet.accounts.length < 1 && (
            <button disabled={disableConnect} onClick={handleConnect}>
              {wallet.accounts.length > 0 ? "Connected" : "Connect MetaMask"}
            </button>
          )}
        {wallet.accounts.length > 0 && (
          <div>Wallet accounts:{wallet.accounts[0]}</div>
        )}
        <div>Wallet Balance{wallet.balance}</div>
        <div>Hex Chain id {wallet.chainId}</div>
        <div>Numaric Chain id {formatChainAsNum(wallet.chainId)}</div>
        {error && (
          <div onClick={() => setErrorMessage(false)}>
            <strong>ERROR:</strong>
            {ErrorMessage}
          </div>
        )}
      </div>
    </>
  );
};

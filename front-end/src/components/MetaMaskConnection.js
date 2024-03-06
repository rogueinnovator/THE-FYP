import React, { useState, useEffect } from "react";
import { formatBalance, formatChainAsNum } from "..";
import detectEthereumProvider from "@metamask/detect-provider";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import Web3 from "web3";
const MetaMaskConnection = () => {
  const [hasProvider, setProvider] = useState(null);
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isconnecting, setconnecting] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    const refreshAccounts = (accounts) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        setWallet(initialState);
      }
    };
    const refreshChain = (chainId) => {
      setWallet((wallet) => ({ ...wallet, chainId })); //by calling the this the other components of the wallet renain same just the chainId is changed which is achieved using the spreadoperator
    };
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      console.log(provider);
      setProvider(Boolean(provider));
      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain); //on changing the chainId the refreshChain function will be called which will update the chainId (the id to which is switched)
      }
    };
    getProvider();
    return () => {
      window.ethereum?.removeListener("accountChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts) => {
    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      }),
      console.log(accounts[0])
    );
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, balance, chainId });
  };

  const handleConnect = async () => {
    setconnecting(true);
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setError(false);
        updateWallet(accounts);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
      });
    setconnecting(false);
  };
  const disableConnect = Boolean(wallet) && isconnecting;

  return (
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
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnection;

import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { Link, NavLink } from "react-router-dom";
import { formatBalance, formatChainAsNum } from "..";
const Navbar = (props) => {
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
    isconnecting,
    ErrorMessage,
    wallet,
    disableConnect,
  } = context;

  const buttonColor = disableConnect ? "bg-green-600" : "bg-blue-400";
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <div className="w-16">
          <img className="rounded-xl" alt="USER" src="logo.png" />
        </div>{" "}
      </div>
      <button
        className={`btn mr-6 m-auto ${buttonColor}`}
        onClick={props.loadFun}
        disabled={disableConnect}
      >
        <span className={isconnecting ? "loading loading-spinner" : ""}></span>
        {isconnecting ? "Connecting" : "Connected"}
      </button>
      <div>
        {disableConnect && (
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className={`btn mr-6 m-auto w-20 ${buttonColor}`}
            >
              {" "}
              Account Details
            </button>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <div
                  className="justify-between"
                  to="/userProfile"
                  aria-current="page"
                >
                  Accounts
                  <span className="badge">{wallet.accounts}</span>
                </div>
              </li>
              <li>
                <div
                  className="justify-between"
                  to="/userProfile"
                  aria-current="page"
                >
                  Balance
                  <span className="badge">{wallet.balance}</span>
                </div>
              </li>
              <li>
                <div
                  className="justify-between"
                  to="/userProfile"
                  aria-current="page"
                >
                  ChainId
                  <span className="badge">
                    {formatChainAsNum(wallet.chainId)}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search Record"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="USER" src="profile.png" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link
                className="justify-between"
                to="/userProfile"
                aria-current="page"
              >
                Profile
                {/* <span className="badge">New</span> */}
              </Link>
            </li>
            <li>
              <Link to="/setting">Settings</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    // <nav className="bg-white border-gray-200 dark:bg-gray-900 h-auto">
    //   {" "}
    //   <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    //     <img
    //       src="logo.png"
    //       className=" rounded-full h-11"
    //       alt="Flowbite Logo"
    //     />

    //     <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
    //       <button
    //         disabled={disableConnect}
    //         onClick={props.loadFun}
    //         type="button"
    //         className={`text-white ${buttonColor} hover:${buttonColor}-700 focus:ring-4 focus:outline-none focus:ring-${buttonColor}-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:${buttonColor} dark:hover:${buttonColor}-700 dark:focus:ring-${buttonColor}-800`}
    //       >
    //         {wallet.accounts.length > 0 ? "Connected" : "Connect MetaMask"}
    //       </button>
    //       <button
    //         data-collapse-toggle="navbar-cta"
    //         type="button"
    //         className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    //         aria-controls="navbar-cta"
    //         aria-expanded="false"
    //       >
    //         <span class="sr-only">Open main menu</span>
    //         <svg
    //           class="w-5 h-5"
    //           aria-hidden="true"
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 17 14"
    //         >
    //           <path
    //             stroke="currentColor"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             stroke-width="2"
    //             d="M1 1h15M1 7h15M1 13h15"
    //           />
    //         </svg>
    //       </button>
    //     </div>
    //     <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
    //       <button
    //         type="button"
    //         className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
    //         id="user-menu-button"
    //         aria-expanded="false"
    //         data-dropdown-toggle="user-dropdown"
    //         data-dropdown-placement="bottom"
    //       >
    //         <span className="sr-only">Open user menu</span>
    //         <img
    //           className="w-10 h-10 rounded-full"
    //           src="profile.png"
    //           alt="user"
    //         />
    //       </button>
    //       {/* <!-- Dropdown menu --> */}
    //       <div
    //         className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
    //         id="user-dropdown"
    //       >
    //         <div className="px-4 py-3">
    //           <span className="block text-sm text-gray-900 dark:text-white">
    //             Huzaifa
    //           </span>
    //           <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
    //             sadaat185336{" "}
    //           </span>
    //         </div>
    //         <ul className="py-2" aria-labelledby="user-menu-button">
    //           <li>
    //             <Link
    //               href="/"
    //               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
    //             >
    //               Dashboard
    //             </Link>
    //           </li>
    //           <li>
    //             <Link
    //               href="/"
    //               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
    //             >
    //               Settings
    //             </Link>
    //           </li>
    //           <li>
    //             <Link
    //               href="/"
    //               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
    //             >
    //               Earnings
    //             </Link>
    //           </li>
    //           <li>
    //             <Link
    //               href="/"
    //               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
    //             >
    //               Sign out
    //             </Link>
    //           </li>
    //         </ul>
    //       </div>
    //       <button
    //         data-collapse-toggle="navbar-user"
    //         type="button"
    //         className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    //         aria-controls="navbar-user"
    //         aria-expanded="false"
    //       >
    //         <span className="sr-only">Open main menu</span>
    //         <svg
    //           className="w-5 h-5"
    //           aria-hidden="true"
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 17 14"
    //         >
    //           <path
    //             stroke="currentColor"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             stroke-width="2"
    //             d="M1 1h15M1 7h15M1 13h15"
    //           />
    //         </svg>
    //       </button>
    //     </div>
    //     <div
    //       className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
    //       id="navbar-user"
    //     >
    //       <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
    //         <li>
    //           <Link
    //             to="/home"
    //             className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
    //             aria-current="page"
    //           >
    //             Home
    //           </Link>
    //         </li>
    //         <li>
    //           <Link
    //             href="/"
    //             className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    //           >
    //             About
    //           </Link>
    //         </li>
    //         <li>
    //           <Link
    //             href="/"
    //             className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    //           >
    //             Services
    //           </Link>
    //         </li>
    //         <li>
    //           <Link
    //             href="/"
    //             className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    //           >
    //             Pricing
    //           </Link>
    //         </li>
    //         <li>
    //           <Link
    //             href="/"
    //             className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
    //           >
    //             Contact
    //           </Link>
    //         </li>
    //       </ul>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default Navbar;

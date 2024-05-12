require("dotenv").config();
const express = require("express");
const { Web3 } = require("web3");
const router = express.Router();
const app = express();
const API_URL = process.env.API_URL;
const ADDRESS = process.env.ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
console.log(CONTRACT_ADDRESS, ADDRESS);
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));
const contractABI =
  require("../../Block-Chain/build/contracts/CriminalDataSender.json").abi;
const contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

router.post("/addInstance", async (req, res) => {
  const { name, id, cnic } = req.body;
  // const nameBytes32 = web3.utils.utf8ToHex(name);
  // const idBytes32 = web3.utils.utf8ToHex(id);
  // const cnicBytes32 = web3.utils.utf8ToHex(cnic);

  console.log(
    "data sended to the smart contract :\n",
    name,
    "\n",
    id,
    "\n",
    cnic,
  );

  try {
    console.log("Adding data to blockchain");
    const tx = await contractInstance.methods
      // .CreateEntity(nameBytes32, idBytes32, cnicBytes32)
      .CreateEntity(name, id, cnic)
      .send({ from: ADDRESS, gas: 1000000 });
    console.log("Transaction hash:", tx.transactionHash);
    res.send("Data added to the blockchain");
  } catch (error) {
    console.error("Error storing criminal information:", error);
    res
      .status(500)
      .send("An error occurred while storing criminal information");
  }
});

router.get("/getInstance/:id", async (req, res) => {
  const criminalId = req.params.id;

  try {
    console.log("Getting criminal information for ID:", criminalId);
    const result = await contractInstance.methods
      .getCriminalDetails(criminalId)
      .call();
    console.log("Criminal information:", result);
    res.send(result);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .send("An error occurred while retrieving criminal information");
  }
});

router.get("/getAllInstances", async (req, res) => {
  try {
    console.log("Getting all criminals");
    const result = await contractInstance.methods
      .getAllCriminals()
      .call({ gas: 1000000 });
    const criminals = result.map((criminalData) => ({
      name: criminalData[0],
      id: criminalData[1],
      cnic: criminalData[2],
    }));

    console.log("All criminals (Original):", criminals);
    res.send(criminals);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .send("An error occurred while retrieving criminal information");
  }
});

module.exports = router;
// Contract: CriminalDataSender
// ✔ should create a new criminal entity (150ms)
// ✔ dosent allow non-owner to create and entity (330ms)
// [
// [
// 'huzaifa',
// '1',
// '123456',
// '1715246887',
// false,
// name: 'huzaifa',
// id: '1',
// cnic: '123456',
// timeStamp: '1715246887',
// compleated: false
// ],
// [
// 'Criminal 2',
// '2',
// '789012',
// '1715246887',
// false,
// name: 'Criminal 2',
// id: '2',
// cnic: '789012',
// timeStamp: '1715246887',
// compleated: false
// ]
// ]

// require("dotenv").config();
// const {
//   abi,
// } = require("../../Block-Chain/build/contracts/CriminalDataSender.json");
// const express = require("express");
// const { ethers } = require("ethers");
// const router = express.Router();
// const API_URL = process.env.API_URL;
// const ADDRESS = process.env.ADDRESS;
// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDESS;
// const provider = new ethers.providers.JsonRpcProvider();
// const signer = new ethers.Wallet(ADDRESS, provider);
// const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
// // console.log(abi);
// router.post("/addInstance", async (req, res) => {
//   const { name, id, cnic } = req.body;
//   const nameBytes32 = ethers.utils.formatBytes32String(name);
//   const idBytes32 = ethers.utils.formatBytes32String(id);
//   const cnicBytes32 = ethers.utils.formatBytes32String(cnic);
//   console.log(
//     "data formate send to the block-chain",
//     nameBytes32,
//     idBytes32,
//     cnicBytes32,
//   );
//   async function CreateEntity(name, id, cnic) {
//     console.log("Adding data to block-chain", API_URL);

//     const tx = await contractInstance.CreateEntity(name, id, cnic);
//     await tx.wait();
//   }
//   console.log("data of the criminal is ", name, id, cnic);
//   try {
//     await CreateEntity(nameBytes32, idBytes32, cnicBytes32);
//     console.log("data of the criminal", nameBytes32, idBytes32, cnicBytes32); // for debugging purpose
//   } catch (error) {
//     console.error("error storing criminal information", error, "<-");
//     res.status(500).send("An error occured while storing criminal information");
//   }
// });
// router.get("/getInstance:id", async (req, res) => {
//   async function getCriminalDetails(_id) {
//     const tx = await contractInstance.getCriminalDetails(_id);
//     console.log("Getting the criminal information ");
//     await tx.wait();
//     return tx;
//   }
//   try {
//     const criimnalId = req.params.id;
//     console.log("id of the criminal is ", id); // for debugging purpose
//     await getCriminalDetails(criimnalId);
//   } catch (error) {
//     console.error("Error while retriving the data ", error);
//     res
//       .status(500)
//       .send("An error occured while retriving the criminal information");
//   }
//   router.get("getAllInstances", async (req, res) => {
//     async function getAllCriminals() {
//       const tx = await contractInstance.getAllCriminals();
//       await tx.wait();
//       console.log("tx");
//       return tx;
//     }
//     try {
//       await getAllCriminals();
//     } catch (error) {}
//   });
// });
// module.exports = router;

require("dotenv").config();
const express = require("express");
const { Web3, Contract } = require("web3");
const router = express.Router();
const app = express();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const API_URL = process.env.API_URL;
const ADDRESS = process.env.ADDRESS;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
console.log(CONTRACT_ADDRESS, ADDRESS);
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));
const contractABI =
  require("../../Block-Chain/build/contracts/CriminalDataSender.json").abi;
const contractInstance = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);
/**
 * convert the bigInt values to the strings
 * @param {object} obj the object to be converted
 * @returns {object} returns the object in string
 */
function convertBigIntToString(obj) {
  if (typeof obj === "bigint") {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertBigIntToString(value),
      ]),
    );
  }
  return obj;
}
/**
 * Route to add an instance in the blockchain
 * @route POST /addInstance
 * @param {string} req.body.name - The name of the criminal
 * @param {string} req.body.id - The ID of the criminal
 * @param {string} req.body.cnic - The CNIC of the criminal
 * @param {number} req.body.sensitivity - The sensitivity level of the criminal data
 * @returns {string} - A message indicating the result of the operation
 */
router.post("/addInstance", async (req, res) => {
  const { name, id, cnic, sensitivity } = req.body;
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
      .CreateEntity(name, id, cnic, sensitivity)
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
/**
 * Route to get an instance of the specified address (owner permission is required).
 * @route GET /getInstance/:cnic
 * @param {string} req.params.cnic - The CNIC of the criminal.
 * @returns {Object} - The criminal data.
 */ router.get("/getInstance/:cnic", async (req, res) => {
  const criminalCnic = req.params.cnic;

  try {
    console.log("Getting criminal information for cnic:", criminalCnic);
    const data = await contractInstance.methods
      .getEntity(criminalCnic)
      .encodeABI();
    const gas = await web3.eth.estimateGas({
      from: ADDRESS,
      to: CONTRACT_ADDRESS,
      data: data,
    });

    // Get the current gas price
    const gasPrice = await web3.eth.getGasPrice();

    // Create the transaction object
    const tx = {
      from: ADDRESS,
      to: CONTRACT_ADDRESS,
      gas: gas,
      gasPrice: gasPrice,
      data: data,
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    //constain the details of the contract after it has been mined and included in the block-chain
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );
    console.log("this is the details of the contarct", receipt);
    const result = await contractInstance.methods
      .getEntity(criminalCnic)
      .call({ from: ADDRESS });
    // console.log("Criminal information:", result);
    const sanitizedResult = {
      entity: convertBigIntToString(result[0]),
      message: result[1],
    };
    res.send(sanitizedResult);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .send("An error occurred while retrieving criminal information");
  }
});
/**
 * Route to get all the criminals stored (owner details required).
 * @route GET /getAllInstances
 * @returns {Array} - All criminal data.
 */ router.get("/getAllInstances", async (req, res) => {
  try {
    console.log("Getting all criminals");
    const result = await contractInstance.methods
      .getAllCriminals()
      .call({ from: ADDRESS, gas: 1000000 });
    // const criminals = result.map((criminalData) => ({
    //   name: criminalData[0],
    //   id: criminalData[1],
    //   cnic: criminalData[2],
    // }));
    const sanitizedResult = convertBigIntToString(result);

    console.log("All criminals (Original):", sanitizedResult);
    res.send(sanitizedResult);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .send("An error occurred while retrieving criminal information");
  }
});
/**
 * Route to delete an entity by CNIC.
 * @route DELETE /deleteEntity/:cnic
 * @param {string} req.params.cnic - The CNIC of the criminal to delete.
 * @returns {Object} - A message and the transaction receipt.
 */
router.delete("/deleteEntiy/:cnic", async (req, res) => {
  const cnic = req.params.cnic;
  if (isNaN(cnic) || cnic < 0 || cnic > 1700000000000) {
    return res.status(400).send("Invalid CNIC");
  }
  try {
    const data = contractInstance.methods.deleteEntity(cnic).encodeABI();
    const gas = await web3.eth.estimateGas({
      from: ADDRESS,
      to: CONTRACT_ADDRESS,
      data: data,
    });
    const gasPrice = await web3.eth.getGasPrice();
    const tx = {
      from: ADDRESS,
      to: CONTRACT_ADDRESS,
      gas: gas,
      gasPrice: gasPrice,
      data: data,
    };
    const signedTx = await web3.eth.signTransaction(tx, PRIVATE_KEY);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    );
    res.send({
      message: "entity deleted successfully",
      transactionReceipt: receipt,
    });
  } catch (error) {
    console.error("Error deleting entity", error);
    res.status(500).send("an error occured while deleting the entity");
  }
});
module.exports = router;

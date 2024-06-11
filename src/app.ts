import { config } from "./config";
import { ethers } from "ethers";
import express from "express";
import { logger } from "./utils/logger";
import { getTotalVolume, getTopAccounts, getTransfers } from "./controllers/controller-transfer";
import { createTransfer } from "./models/model-transfer";
import contractABI from "./assets/abi.json";

// avalanche c-chain provider URL
const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");
const contract = new ethers.Contract("0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", contractABI, provider);

contract.on('Transfer', async (from, to, value) => {
  console.log('Transfer transaction detected:', from, to, value);
  createTransfer(from, to, value);
});

//create express app
const app: express.Express = express();
const router: express.Router = express.Router();

app.use(express.json());
app.use(router); // tell the app this is the router we are using

// transferController routes
router.get("/total-volume", getTotalVolume);
router.get("/top-accounts", getTopAccounts);
router.get("/transfers", getTransfers);

app.listen(config.port, function () {
  logger.info(`server listening on port: ${config.port}`);
});

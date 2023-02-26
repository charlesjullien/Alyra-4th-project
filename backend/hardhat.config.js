require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan"); //installs itself with hardhat packages (normally)
require("hardhat-deploy");
require('hardhat-docgen');

const PK = process.env.PK || "";
const INFURA = process.env.INFURA || "";
const ETHERSCAN = process.env.ETHERSCAN || "";
const ALCHEMY = process.env.ALCHEMY || "";
const POLYGONSCAN = process.env.POLYGONSCAN || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      allowUnlimitedContractSize: true //to enable contracts interaction in /backend/scripts/deploy.js
    },
    goerli: {
      url: INFURA,
      accounts: [`0x${PK}`],
      chainId: 5,
      // gas: 2100000,  //uncomment to enable contracts interaction in /backend/scripts/deploy.js
      // gasPrice: 8000000000 //same
    },
    polygonMumbai: {
      url: ALCHEMY,
      accounts: [`0x${PK}`],
      chainId: 80001
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ],
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN
      //polygonMumbai: POLYGONSCAN
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  }
};

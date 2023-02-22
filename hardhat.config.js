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
      chainId: 31337
    },
    goerli: {
      url: INFURA,
      accounts: [`0x${PK}`],
      chainId: 5,
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
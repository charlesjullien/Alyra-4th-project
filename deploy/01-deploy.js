const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
const { getNamedAccounts, deployments } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------------------------");
  arguments = [];
  const NftCollectionFactory = await deploy("NftCollectionFactory", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("--------------------------------------");
  arguments = ["", ""];
  const NftCollection = await deploy("NftCollection", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("--------------------------------------");
  arguments = [];
  const NftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // console.log(`NMP deployed at address ${NftMarketplace.address}`)
  // console.log(`NCF deployed at address ${NftCollectionFactory.address}`)

  // //Verify the smart contract
  // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
  //   log("Verifying...");
  //   await verify(Voting.address, arguments);
  // }
};

module.exports.tags = ["all", "NftCollectionFactory", "NftCollection", "NftMarketplace", "main"];

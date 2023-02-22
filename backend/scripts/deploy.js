const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const directory = "../frontend/src/artifacts/"
  const NftMarketplace = await hre.ethers.getContractFactory("NftMarketplace");
  const nftMarketplace = await NftMarketplace.deploy();
  await nftMarketplace.deployed();

  console.log(
    `nftMarketplace deployed to ${nftMarketplace.address}`
  );

  fs.writeFileSync(
    "../frontend/src/artifacts/NftMarketplace_address.json",
    JSON.stringify({ address: nftMarketplace.address }, undefined, 2)
  );

  const NftCollection = await hre.ethers.getContractFactory("NftCollection");
  const nftCollection = await NftCollection.deploy("", "");

  await nftCollection.deployed();

  console.log(
    `nftCollection deployed to ${nftCollection.address}`
  );

  fs.writeFileSync(
    "../frontend/src/artifacts/NftCollection_address.json",
    JSON.stringify({ address: nftCollection.address }, undefined, 2)
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

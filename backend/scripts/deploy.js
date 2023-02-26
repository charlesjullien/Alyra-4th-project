const hre = require("hardhat");
const fs = require("fs");

async function main() {

  // Déploiement des contrats
  const directory = "../frontend/src/artifacts/";
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

  /*
  // Interaction avec le contrat
  const signer = (await hre.ethers.getSigners())[0]; // récupération du premier compte
  const nftMarketplaceContract = new hre.ethers.Contract(nftMarketplace.address, nftMarketplace.interface, signer);
  
  // console.log("signer = " + signer.address);
  
  let result = await nftMarketplaceContract.createNFTCollection("Test au deploiement", "TAD"); // appel de la fonction mint
  console.log(`Collection created with transaction hash: ${result.hash}`);
  collec = await nftMarketplaceContract.collectionDetails("TAD");
  addrCollec = collec.collectionAddress;
  result = await nftMarketplaceContract.createNFT("https://gateway.pinata.cloud/ipfs/QmYkPUwUZScqcv7byx3D93X5LSkfFU1EtPgWGifFumgAce", addrCollec, "TAD");
  console.log(`Token created with transaction hash: ${result.hash}`);
  let price = ethers.utils.parseEther("0.042");
  result = await nftMarketplaceContract.listNFT(1, price);
  console.log(`Token listed with transaction hash: ${result.hash}`);*/
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

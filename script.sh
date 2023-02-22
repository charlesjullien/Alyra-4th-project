yarn hardhat run ./scripts/deploy.js --network goerli

ADDR1=$(cat ../frontend/src/artifacts/NftMarketplace_address.json | grep -o '"address": ".*"' | cut -d'"' -f4)
ADDR2=$(cat ../frontend/src/artifacts/NftCollection_address.json | grep -o '"address": ".*"' | cut -d'"' -f4)

yarn hardhat verify --network goerli ${ADDR1}
yarn hardhat verify --network goerli ${ADDR2}

cp ./artifacts/contracts/NftCollection.sol/NftCollection.json ../frontend/src/artifacts/.
cp ./artifacts/contracts/NftCollectionFactory.sol/NftCollectionFactory.json ../frontend/src/artifacts/.
cp ./artifacts/contracts/NftMarketplace.sol/NftMarketplace.json ../frontend/src/artifacts/.

cp ./artifacts/contracts/Openzeppelin/ERC721.sol/ERC721.json ../frontend/src/artifacts/.
cp ./artifacts/contracts/Openzeppelin/ERC721URIStorage.sol/ERC721URIStorage.json ../frontend/src/artifacts/.
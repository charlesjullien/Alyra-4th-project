const { assert, expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Unit Tests for the Alyra's finale project[Nft Factory]", function () {

        let factoryInstance;

        let accounts;

        let deployer;
        let bob;
        let alice;
        let johnny;
        let pamela;

        let name1 = "Banana"
        let name2 = "Coconut"

        let symbol1 = "BAN"
        let symbol2 = "COT"

        before(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0]; //deployer == owner as per openzeppelin Constructor for Ownable
            bob = accounts[1];
            alice = accounts[2];
            johnny = accounts[3];
            pamela = accounts[4];
        });


        //===> CHECKS IF THE CONTRACTS DEPLOY WELL :
        describe("Factory smart contract deployment...", function() {
            it("Should deploy the smart contract", async function() {
                await deployments.fixture(["NftCollectionFactory"]);
                factoryInstance = await ethers.getContract("NftCollectionFactory");
                expect(factoryInstance.address).to.not.be.undefined;
            });
        });

        describe("New collection creation...", function() {
            it("Should create a new collection.", async function() {
                await deployments.fixture(["NftCollectionFactory"]);
                factoryInstance = await ethers.getContract("NftCollectionFactory");
                const tx = await factoryInstance.createNFTCollection(name1, symbol1);
                const receipt = await tx.wait();
                
                // Check if the event is emitted
                const event = receipt.events.find(e => e.event === "NFTCollectionCreated");
                expect(event).to.not.be.undefined;
                expect(event.args[0]).to.equal(name1);
                expect(event.args[1]).to.equal(symbol1);
            
                // const collection1 = await factoryInstance.connect(johnny).createNFTCollection(name1, symbol1);
                // await expect(collections[1]).to.equal(collection1);
            });
        });

        describe("Revert tests for an NFT collection creation with wrong arguments...", function() {
            it("Should revert if the artist name is empty", async function() {
                await expect(factoryInstance.createNFTCollection("", symbol1)).to.be.revertedWith("Artist name and symbol must not be undefined.");
            });
              
            it("Should revert if the artist symbol is empty", async function() {
                await expect(factoryInstance.createNFTCollection(name1, "")).to.be.revertedWith("Artist name and symbol must not be undefined.");
            });

            it("Should revert if both artist name and symbol are empty.", async function() {
                await expect(factoryInstance.createNFTCollection("", "")).to.be.revertedWith("Artist name and symbol must not be undefined.");
            });
        });

        describe("Tests for an NFT collections creation with same names or symbols...", function() {
            it("Should revert if a collection with same symbol exists", async function() {
                await deployments.fixture(["NftCollectionFactory"]);
                factoryInstance = await ethers.getContract("NftCollectionFactory");
                await expect(factoryInstance.createNFTCollection(name1, symbol1)).to.emit(factoryInstance, "NFTCollectionCreated");
                await expect(factoryInstance.createNFTCollection(name1, symbol2)).to.emit(factoryInstance, "NFTCollectionCreated");
                await expect(factoryInstance.createNFTCollection(name2, symbol1)).to.be.revertedWith("Symbol already exists");
            });
        });

        describe("Tests to see if collectionDetails mapping is updated at each collection creation", function() {
            it("Should update collectionDetails infos and stores details", async function() {
              await deployments.fixture(["NftCollectionFactory"]);
              factoryInstance = await ethers.getContract("NftCollectionFactory");
              

              // Créer la collection "BAN"
              const tx1 = await factoryInstance.createNFTCollection(name1, symbol1);
              const receipt1 = await tx1.wait();
              const event1 = receipt1.events.find(e => e.event === "NFTCollectionCreated");
              const symbol1Addr = (event1.args[2]);
            
              // Vérifier que la collection "BAN" a été créée avec succès
              const collectionDetailsBan = await factoryInstance.collectionDetails(symbol1);
              await expect(collectionDetailsBan.name).to.equal(name1);
              await expect(collectionDetailsBan.symbol).to.equal(symbol1);
              await expect(collectionDetailsBan.collectionAddress).to.equal(symbol1Addr);

            //   const symbolsTab = await factoryInstance.collectionsSymbols();
            //   await expect (symbolsTab[0]).to.equal(symbol1);

          
              // Créer la collection "COT"
              const tx2 = await factoryInstance.createNFTCollection(name2, symbol2);
              const receipt2 = await tx2.wait();
              const event2 = receipt2.events.find(e => e.event === "NFTCollectionCreated");
              const symbol2Addr = (event2.args[2]);
          
              // Vérifier que les détails de la collection "COT" sont corrects
              const collectionDetailsCot = await factoryInstance.collectionDetails(symbol2);
              expect(collectionDetailsCot.name).to.equal(name2);
              expect(collectionDetailsCot.symbol).to.equal(symbol2);
              expect(collectionDetailsCot.collectionAddress).to.equal(symbol2Addr);

            //   symbolsTab = await factoryInstance.collectionsSymbols();
            //   await expect (symbolsTab[1]).to.equal(symbol2);
            });
          });
          
    });
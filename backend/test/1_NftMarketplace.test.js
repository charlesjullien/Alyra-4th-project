const { assert, expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Unit Tests for the Alyra's NFT Marketplce project", function () {

        let factoryInstance;
        let marketplaceInstance;
        let NFTCollectionInstance;

        let accounts;

        let deployer;

        let collectionDetails1;
        let collectionDetails2;
        let collectionDetails3;
        let collectionDetails4;

        let bob;
        let alice;
        let johnny;
        let pamela;

        let curritemId;

        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0]; //deployer == owner as per openzeppelin Constructor for Ownable
            bob = accounts[1];
            alice = accounts[2];
            johnny = accounts[3];
            pamela = accounts[4];

            await deployments.fixture(["NftMarketplace"]);
            marketplaceInstance = await ethers.getContract("NftMarketplace");

            await deployments.fixture(["NftCollectionFactory"]);
            factoryInstance = await ethers.getContract("NftCollectionFactory");

            await marketplaceInstance.connect(alice).createNFTCollection("HelloWorld", "HW");
            collectionDetails1 = await marketplaceInstance.collectionDetails("HW");

            await marketplaceInstance.connect(pamela).createNFTCollection("SurfingChief", "SCF");
            collectionDetails2 = await marketplaceInstance.collectionDetails("SCF");

            await marketplaceInstance.connect(johnny).createNFTCollection("MarsPalm", "MP");
            collectionDetails3 = await marketplaceInstance.collectionDetails("MP");

        });


        //===> CHECKS IF THE CONTRACTS DEPLOY WELL :
        describe("NftMarketplace smart contract deployment...", function() {
            it("Should deploy the smart contract", async function() {
                await deployments.fixture(["NftMarketplace"]);
                marketplaceInstance = await ethers.getContract("NftMarketplace");
                expect(marketplaceInstance.address).to.not.be.undefined;
            });
        });

        describe("makeItem function...", function() {
            it("Should increment item Count", async function() {
                let nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(0);

                let collectionAddress1 = await collectionDetails1.collectionAddress;

                await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");
                nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(1);
            });
            it("Should register collection address in nfts mapping", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");
                currAddress = await marketplaceInstance.nfts(1);
                await expect(currAddress.CollectionAddress).to.equal(collectionAddress1);
            })
            it("Should register itemId in nfts mapping", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");
                curritemId = await marketplaceInstance.nfts(1);
                await expect(curritemId.itemId).to.equal(1);
            })
            it("Should register msg.sender() in nfts mapping", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");
                curritemId = await marketplaceInstance.nfts(1);
                await expect(curritemId.seller).to.equal(alice.address);
            })
            it("Should register price and listed to 0, false, false in nfts mapping", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");
                curritemId = await marketplaceInstance.nfts(1);
                await expect(curritemId.price).to.equal(0);
                await expect(curritemId.listed).to.equal(false);
            })
            it("Should emit an NFTCreated event after creation.", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await expect(marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW")).to.emit(marketplaceInstance, "NFTCreated");
                let nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(1);
            })
            it("Should revert when an adress tries to mint in another's collection.", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await expect(marketplaceInstance.connect(bob).createNFT("https://www.anotherExample.com/token-1.json", collectionAddress1, "HW")).to.be.revertedWith("NftCollection : caller is not the owner");
                let nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(0);
                await deployments.fixture(["NftCollection"]);
                const NCI = await ethers.getContract("NftCollection");
                NFTCollectionInstance1 = await NCI.attach(collectionAddress1);
                let ownr = await NFTCollectionInstance1.owner();
                await expect(ownr).to.equal(alice.address);
                let balanceOfAlice = await NFTCollectionInstance1.balanceOf(alice.address)
                await expect(balanceOfAlice).to.equal(0);
            })
            it("Should revert as TokenURI is an emty string or collection Symbol does not exist", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await expect(marketplaceInstance.connect(alice).createNFT("", collectionAddress1, "HW")).to.be.revertedWith("please provide a valid tokenURI and existing collection detail.");
                let nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(0);
                await expect(marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW_anything")).to.be.revertedWith("please provide a valid tokenURI and existing collection detail.");
                nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(0);
                await expect(marketplaceInstance.connect(alice).createNFT("", collectionAddress1, "HW_anything")).to.be.revertedWith("please provide a valid tokenURI and existing collection detail.");
                nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(0);
            })
            
            it("Should revert as msg.sender is not collection owner", async function () {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                await expect(marketplaceInstance.connect(johnny).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW")).to.be.revertedWith("NftCollection : caller is not the owner");
                let nfts = await marketplaceInstance.nbrNfts();
                await expect(nfts).to.equal(0);
            })
            
        });

        describe("listNFT function...", function() {
            beforeEach(async() => {
               let collectionAddress1 = await collectionDetails1.collectionAddress;
               let collectionAddress2 = await collectionDetails2.collectionAddress;
               await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");
               await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExample.com/token-1.json", collectionAddress2, "SCF");
               await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExampleAgain.com/token-1.json", collectionAddress2, "SCF");
            })
            it("Should revert as price is not superior to 0", async function() {
               await expect(marketplaceInstance.connect(alice).listNFT(1, -12)).to.throw;
               await expect(marketplaceInstance.connect(alice).listNFT(1, 0)).to.be.revertedWith("NFTMarket: price must be greater than 0");
               curritemId = await marketplaceInstance.nfts(1);
               await expect(curritemId.listed).to.equal(false);
            });
            it("Should revert as msg.sender is not NFT owner", async function() {
                await expect(marketplaceInstance.connect(bob).listNFT(1, 27)).to.be.revertedWith("ERC721: transfer from incorrect owner");
                curritemId = await marketplaceInstance.nfts(1);
                await expect(curritemId.seller).to.equal(alice.address);
                await expect(curritemId.price).to.equal(0);
             });
             it("Should revert as tokenID does not exist", async function() {
                await expect(marketplaceInstance.connect(alice).listNFT(11, 12)).to.be.revertedWith("tokenID does not exist");
                curritemId = await marketplaceInstance.nfts(11);
                await expect(curritemId.listed).to.equal(false);
             });
             it("Should update nfts[tokenID] informations accordingly and revert when nft is already listed", async function() {
                let price2 = 53;
                let price3 = 127;

                await marketplaceInstance.connect(pamela).listNFT(2, price2);
                curritemId = await marketplaceInstance.nfts(2);
                await expect(curritemId.listed).to.equal(true);
                await expect(curritemId.price).to.equal(price2);

                await marketplaceInstance.connect(pamela).listNFT(3, price3);
                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(true);
                await expect(curritemId.price).to.equal(price3);

                await expect(marketplaceInstance.connect(pamela).listNFT(2, 67)).to.be.revertedWith("NFT already listed");
                curritemId = await marketplaceInstance.nfts(2);
                await expect(curritemId.price).to.equal(price2);
             });
             it("Should emit an NFTListed event after listing.", async function () {
                await expect(marketplaceInstance.connect(pamela).listNFT(3, 42)).to.emit(marketplaceInstance, "NFTListed");
                await expect(marketplaceInstance.connect(alice).listNFT(1, 1)).to.emit(marketplaceInstance, "NFTListed");
            
                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(true);
            
                curritemId = await marketplaceInstance.nfts(1);
                await expect(curritemId.listed).to.equal(true);

                await marketplaceInstance.connect(pamela).cancelListing(3);
                await marketplaceInstance.connect(pamela).listNFT(3, 101);
                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(true);
            })
        });

        describe("cancelListing function...", function() {
            beforeEach(async() => {
                let collectionAddress1 = await collectionDetails1.collectionAddress;
                let collectionAddress2 = await collectionDetails2.collectionAddress;
                let collectionAddress3 = await collectionDetails3.collectionAddress;

                await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");

                await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExample.com/token-1.json", collectionAddress2, "SCF");
                await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExampl3121e.com/token-1.json", collectionAddress2, "SCF");

                await marketplaceInstance.connect(johnny).createNFT("https://www.anotherExampleAgain.com/token-1.json", collectionAddress3, "MP");

                await expect(marketplaceInstance.connect(pamela).listNFT(2, 42)).to.emit(marketplaceInstance, "NFTListed");
                await expect(marketplaceInstance.connect(alice).listNFT(1, 19)).to.emit(marketplaceInstance, "NFTListed");
            })
            it("Should revert if msg.sender is not nft owner", async function() {
                await expect(marketplaceInstance.connect(bob).cancelListing(1)).to.be.revertedWith("you cannot cancel listing if you are not the nft owner");
                await expect(marketplaceInstance.connect(alice).cancelListing(2)).to.be.revertedWith("you cannot cancel listing if you are not the nft owner");

                curritemId = await marketplaceInstance.nfts(1);
                await expect(curritemId.listed).to.equal(true);
            
                curritemId = await marketplaceInstance.nfts(2);
                await expect(curritemId.listed).to.equal(true);
            });
            it("Should revert if nft does not exist or is not listed", async function() {
                await expect(marketplaceInstance.connect(alice).cancelListing(21)).to.be.revertedWith("nft doesn't exist or is not listed");

                curritemId = await marketplaceInstance.nfts(21);
                await expect(curritemId.listed).to.equal(false);
            
                await expect(marketplaceInstance.connect(johnny).cancelListing(3)).to.be.revertedWith("nft doesn't exist or is not listed");

                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(false);
            });
            it("Should actually cancels an nft listing and update its infos accordingly", async function() {
                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(false);
                await expect(curritemId.price).to.equal(0);
                
                await marketplaceInstance.connect(pamela).listNFT(3, 419);

                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(true);
                await expect(curritemId.price).to.equal(419);

                await marketplaceInstance.connect(pamela).cancelListing(3);

                curritemId = await marketplaceInstance.nfts(3);
                await expect(curritemId.listed).to.equal(false);
                await expect(curritemId.price).to.equal(0);

            });

            describe("BuyNFT function...", function() {
                beforeEach(async() => {
                    let collectionAddress1 = await collectionDetails1.collectionAddress;
                    let collectionAddress2 = await collectionDetails2.collectionAddress;
                    let collectionAddress3 = await collectionDetails3.collectionAddress;

                    await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExample.com/token-1.json", collectionAddress2, "SCF");

                    await marketplaceInstance.connect(alice).createNFT("https://www.example.com/token-1.json", collectionAddress1, "HW");

                    await marketplaceInstance.connect(pamela).listNFT(3, 55);
                })
                it("Should be 6 NFTs in the marketplace. And three listed for sale", async function() {
                    nbritems = await marketplaceInstance.nbrNfts();
                    await expect(nbritems).to.equal(6);
                    let i = 0;
                    let nbrListedForSale = 0;
                    while (i < nbritems)
                    {
                        curritemId = await marketplaceInstance.nfts(i);
                        if (curritemId.listed == true)
                            nbrListedForSale++;
                        i++;
                    }
                    await expect(nbrListedForSale).to.equal(3);
                });
                it("Should revert if msg.sender tries to buy his own NFT", async function() {
                    await expect(marketplaceInstance.connect(pamela).BuyNFT(2, {value: 42})).to.be.revertedWith("You cannot buy your own NFT");
                    curritemId = await marketplaceInstance.nfts(2);
                    await expect(curritemId.price).to.equal(42);
                });
                it("Should allow msg.sender to buy a listed NFT and emit an NFTPurchased event", async function() {
                    let collectionAddress2 = await collectionDetails2.collectionAddress;
                    await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExample111.com/token-1.json", collectionAddress2, "SCF");
                    await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExample222.com/token-1.json", collectionAddress2, "SCF");
                    await marketplaceInstance.connect(pamela).createNFT("https://www.anotherExample333.com/token-1.json", collectionAddress2, "SCF");
                    await marketplaceInstance.connect(pamela).listNFT(9, 105);
                    await marketplaceInstance.connect(johnny).BuyNFT(9, {value: 105})
                    curritemId = await marketplaceInstance.nfts(9);
                    await expect(curritemId.seller).to.equal(johnny.address);
                    await expect(curritemId.price).to.equal(0);
                    await expect(curritemId.tokenId).to.equal(6);
                    await expect(curritemId.listed).to.equal(false);
                    await marketplaceInstance.connect(johnny).listNFT(9, 110);
                    curritemId = await marketplaceInstance.nfts(9);
                    await expect(curritemId.listed).to.equal(true);
                    await expect(curritemId.price).to.equal(110);
                    await expect(marketplaceInstance.connect(johnny).BuyNFT(7, {value: 0})).to.be.revertedWith("NFT is not listed");
                    await expect(marketplaceInstance.connect(bob).BuyNFT(9, {value: 110})).to.emit(marketplaceInstance, "NFTPurchased");
                });
                it("Should revert if nft does not exist", async function() {
                    await expect(marketplaceInstance.connect(alice).BuyNFT(21)).to.be.revertedWith("item doesn't exist");
                    curritemId = await marketplaceInstance.nfts(21);
                    await expect(curritemId.listed).to.equal(false);
                });
                it("Should revert as price is too low", async function() {
                    await expect(marketplaceInstance.connect(bob).BuyNFT(2, {value: 40})).to.be.revertedWith("price must be the exact NFT value"); //price is 42 here 
                    curritemId = await marketplaceInstance.nfts(2);
                });
                it("Should revert as price is too high", async function() {
                    await expect(marketplaceInstance.connect(bob).BuyNFT(2, {value: 400})).to.be.revertedWith("price must be the exact NFT value"); //price is 42 here 
                    curritemId = await marketplaceInstance.nfts(2);
                });
                it("Should revert if nft is not listed", async function() {
                    await expect(marketplaceInstance.connect(bob).BuyNFT(4, {value: 0})).to.be.revertedWith("NFT is not listed");
                    curritemId = await marketplaceInstance.nfts(4);
                    await expect(curritemId.listed).to.equal(false);
                });
            });

        });
    });
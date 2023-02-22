const { assert, expect } = require("chai")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Unit Tests for the Alyra's finale project[Nft Factory]", function () {

        let NFTCollectionInstance;

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

            await deployments.fixture(["NftCollection"]);
            NFTCollectionInstance = await ethers.getContract("NftCollection");
        });


        //===> CHECKS IF THE CONTRACTS DEPLOY WELL :
        describe("NftCollection smart contract deployment...", function() {
            it("Should deploy the smart contract", async function() {
                await deployments.fixture(["NftCollection"]);
                factoryInstance = await ethers.getContract("NftCollection");
                expect(NFTCollectionInstance.address).to.not.be.undefined;
            });
        });

        describe("New ERC721 creation...", function() {
            it("Should revert if mintItem caller is not the owner, or tokenURI is empty", async function() {
                await expect(NFTCollectionInstance.connect(bob).mintItem("hello world")).to.be.revertedWith("NftCollection : caller is not the owner");
            });
        });
          
    });
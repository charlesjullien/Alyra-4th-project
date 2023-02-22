// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title A contract for an NFT Marketplace 
/// @author Charles JULLIEN 

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./NftCollectionFactory.sol";

contract NftMarketplace is ReentrancyGuard, NftCollectionFactory {

    using Counters for Counters.Counter;
    Counters.Counter public nbrNfts;

    struct Nft {
        uint itemId; // whole marketplace item id
        address CollectionAddress;
        uint tokenId; // collection item id
        uint price;
        address payable seller;
        bool listed;
        string URI;
        string symbol;
    }

    mapping(uint => Nft) public nfts;

    event NFTCreated (
        uint tokenID,
        address collection,
        address to,
        string tokenURI
    );

    event NFTListed (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event NFTPurchased (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );


    constructor() {
       
    }

    /// @notice creates an NFT in an existing collection
    /// @param tokenURI the URI containing JSON for the NFT
    /// @param collectionAddress the collection address to mint NFT in
    /// @param symbol the collection symbol
    function createNFT(string memory tokenURI, address collectionAddress, string memory symbol) external nonReentrant {
        require(bytes(tokenURI).length > 0 && collectionDetails[symbol].collectionAddress == collectionAddress, "please provide a valid tokenURI and existing collection detail.");
        NftCollection NC = NftCollection(collectionAddress);
        NC.mintItem(tokenURI);
        nbrNfts.increment();
        nfts[nbrNfts.current()] = Nft (
            nbrNfts.current(),
            collectionAddress,
            NC.tokens(),
            0,
            payable(msg.sender),
            false,
            tokenURI,
            symbol
        );
        emit NFTCreated (
            nbrNfts.current(),
            collectionAddress,
            msg.sender,
            tokenURI
        );
    }

    /// @notice allow user to list an existing NFT on the marketplace and set it a price
    /// @param tokenID the token index of the whole emited tokens on the marketplace
    /// @param price the price user wants to set to his NFT for sale
    function listNFT (uint tokenID, uint price) external nonReentrant {
        require(price > 0, "NFTMarket: price must be greater than 0");
        require(tokenID > 0 && tokenID <= nbrNfts.current(), "tokenID does not exist");
        require(nfts[tokenID].listed == false, "NFT already listed");
        NftCollection NC = NftCollection(nfts[tokenID].CollectionAddress);
        if (NC.ownerOf(nfts[tokenID].tokenId) != address(this)) {
            NC.changeNftOwner(address(this), nfts[tokenID].tokenId);
        }
        nfts[tokenID].price = price;
        nfts[tokenID].listed = true;
        emit NFTListed (
            tokenID,
            nfts[tokenID].CollectionAddress,
            nfts[tokenID].tokenId,
            price,
            msg.sender
        );
    }

    /// @notice allows user to cancel listing of one of his listed NFT
    /// @param tokenID the token index of the whole emited tokens on the marketplace
    function cancelListing (uint tokenID) external nonReentrant {
        require(nfts[tokenID].listed == true, "nft doesn't exist or is not listed");
        require(msg.sender == nfts[tokenID].seller, "you cannot cancel listing if you are not the nft owner");
        nfts[tokenID].listed = false;
        nfts[tokenID].price = 0;
    }

    /// @notice allows user to buy an nft
    /// @param tokenID the token index of the whole emited tokens on the marketplace
    function BuyNFT(uint tokenID) external payable nonReentrant {
        require(tokenID > 0 && tokenID <= nbrNfts.current(), "item doesn't exist");
        require(msg.value == nfts[tokenID].price, "price must be the exact NFT value");
        require(nfts[tokenID].listed, "NFT is not listed");
        require(msg.sender != nfts[tokenID].seller, "You cannot buy your own NFT");
        NftCollection NC = NftCollection(nfts[tokenID].CollectionAddress);
        NC.safeTransferFrom(address(this), msg.sender, nfts[tokenID].tokenId);
        payable(nfts[tokenID].seller).transfer(nfts[tokenID].price);
        nfts[tokenID].price = 0;
        nfts[tokenID].listed = false;
        nfts[tokenID].seller = payable(msg.sender);
        emit NFTPurchased (
            tokenID,
            address(nfts[tokenID].CollectionAddress),
            nfts[tokenID].tokenId,
            nfts[tokenID].price,
            nfts[tokenID].seller,
            msg.sender
        );
    }
}

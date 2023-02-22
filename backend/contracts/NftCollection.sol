// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/// @title A contract used to attach an ERC721 instance address from NftCollectionactory.sol
/// @author Charles JULLIEN 

import "./Openzeppelin/ERC721.sol";
import "./Openzeppelin/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftCollection is ERC721URIStorage, Ownable {

    /// @notice the amount of tokens minted in this collection
    uint public tokens;

    /// @notice a constructor to call ERC721 contract and create a new ERC721.
    /// @param _collectionName the name of the collection for the new ERC721 contract
    /// @param _collectionSymbol the symbol of the collection for the new ERC721 contract
    constructor(string memory _collectionName, string memory _collectionSymbol) ERC721 (_collectionName, _collectionSymbol) {

    }

    /// @notice called from NftMarketplace.sol to create a new token in the collection
    /// @param tokenURI the URI containing the json to use to create the NFT
    function mintItem(string memory tokenURI) external {
        require(tx.origin == owner(), "NftCollection : caller is not the owner");
        _mint(tx.origin, (tokens + 1));
        _setTokenURI((tokens + 1), tokenURI);
        tokens++;
    }

    /// @notice called from NftMarketplace.sol to transfer ownership of an NFT to the SC for listing
    /// @param _newOwnerAddress the new owner address
    /// @param _tokenId the corresponding NFT
    function changeNftOwner(address _newOwnerAddress, uint _tokenId) external {
        _transfer(tx.origin, _newOwnerAddress, _tokenId);
    }
}
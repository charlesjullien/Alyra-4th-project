// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/// @title A contract used to create NFT collections simply with an name and symbol.
/// @author Charles JULLIEN 

import "./NftCollection.sol";
 

contract NftCollectionFactory{
 
    event NFTCollectionCreated(string _artistName, string _artistSymbol, address _collectionAddress, uint _timestamp);

    string[] public collectionsSymbols;

    uint public nbrCollections;

    struct CollectionDetails {
      string name;
      string symbol;
      address collectionAddress;
    }

    mapping(string => CollectionDetails) public collectionDetails;
 
    /// @notice creates the ERC-721 Collection contract address so he can mints NFTs in it afterwards
    /// @return collectionAddress the address of the created collection contract
    /// @param _artistName the name of the collection artist
    /// @param _artistSymbol the name of the collection symbol
    /// @dev first we import the contract's bytecode to deploy, then we make a salt on the _artistName and we use assembly to generate a collection address for an ERC721 contract
    /// return the newly generated collection address
    function createNFTCollection(string memory _artistName, string memory _artistSymbol) external returns (address collectionAddress) {
        require(bytes(_artistName).length > 0 && bytes(_artistSymbol).length > 0, "Artist name and symbol must not be undefined.");
        require(bytes(collectionDetails[_artistSymbol].symbol).length == 0, "Symbol already exists");
        bytes memory collectionBytecode = getCreationBytecode(_artistName, _artistSymbol);
        bytes32 salt = keccak256(abi.encodePacked(_artistName));
 
        assembly {
            collectionAddress := create2(0, add(collectionBytecode, 0x20), mload(collectionBytecode), salt)
            if iszero(extcodesize(collectionAddress)) {
                revert(0, 0)
            }
        }
        NftCollection(collectionAddress).transferOwnership(msg.sender);
        nbrCollections++;
        collectionDetails[_artistSymbol].name = _artistName;
        collectionDetails[_artistSymbol].symbol = _artistSymbol;
        collectionDetails[_artistSymbol].collectionAddress = collectionAddress;
        collectionsSymbols.push(_artistSymbol);
        emit NFTCollectionCreated(_artistName, _artistSymbol, collectionAddress, block.timestamp);
        return (collectionAddress);
      }

    /// @notice creates the collection bytecode for assembly
    /// @param _collectionName the name of the collection artist
    /// @param _collectionSymbol the name of the collection symbol
    /// @return collectionBytecode for assembly operation 
    function getCreationBytecode(string memory _collectionName, string memory _collectionSymbol) internal pure returns (bytes memory) {
      bytes memory collectionBytecode = type(NftCollection).creationCode;

      return abi.encodePacked(collectionBytecode, abi.encode(_collectionName, _collectionSymbol));
    }
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './Navbar';
import Collections from './Collections.js'
import Home from './Home.js'
import CreateCollection from './createCollection.js'
import MyNFTs from './MyNFTs.js'
import Create from './Create.js'
import MarketplaceAbi from './artifacts/NftMarketplace.json'
import MarketplaceAddress from './artifacts/NftMarketplace_address.json'
import NFTAbi from './artifacts/NftCollection.json'
import NFTAddress from './artifacts/NftCollection_address.json'
import { Spinner } from 'react-bootstrap'
import { ethers } from "ethers"
import { useState } from 'react'

import './App.css';

export default function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)

  const [nft, setNFT] = useState({})
  const [factory, setFactory] = useState({})
  const [marketplace, setMarketplace] = useState({})

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    // Fetch provider through Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Define signer
    const signer = provider.getSigner()

    window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
  })

    window.ethereum.on('accountsChanged', async function (accounts) {
      setAccount(accounts[0])
      await web3Handler()
    })
    loadContracts(signer, provider)
  }
  const loadContracts = async (signer, provider) => {
    // Define contract instances : 

    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)
    
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    
    setLoading(false)
  }

  return (
    <BrowserRouter>
      <div className="App">
        <>
          <Navigation web3Handler={web3Handler} account={account} />
        </>
        <div>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh' }}>
              <Spinner animation="border" style={{ display: 'flex' }} />
              <p className='mx-3 my-0'>Please connect to your metamask wallet.</p>
            </div>
          ) : (
            <Routes>
                <Route path="/" element=
                {
                  <Home marketplace={marketplace} nft={nft} account={account} />
                }/>
                <Route path="/Collections" element=
                {
                  <Collections marketplace={marketplace} nft={nft} account={account}  />
                }/>
                <Route path="/Create-NFT" element=
                {
                  <Create marketplace={marketplace} nft={nft}/>
                }/>
                <Route path="/My-NFTs" element=
                {
                  <MyNFTs marketplace={marketplace} nft={nft} account={account}  />
                }/>
                <Route path="/create-collection" element=
                {
                  <CreateCollection marketplace={marketplace} nft={nft} />
                }/>
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>

  );
}
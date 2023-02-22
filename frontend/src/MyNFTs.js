import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Form, Button } from 'react-bootstrap'



export default function MyNFTs({ marketplace, nft, account }) {

  const [loading, setLoading] = useState(true)
  const [nfts, setNfts] = useState([])
  const [price, setPrice] = useState(null)

  const loadListedNfts = async () => {

    const nbrNfts = await marketplace.nbrNfts()
    
    let nfts = []
    for (let i = 1; i <= nbrNfts; i++) {

      const nft = await marketplace.nfts(i)

      if (nft.seller.toLowerCase() === account) {
        const uri = await nft.URI;
        const response = await fetch(uri);
        const metadata = await response.json();
        nfts.push({
          price: nft.price,
          itemId: nft.itemId,
          seller: nft.seller.toLowerCase(),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          listed: nft.listed
        })
      }
    }
    setLoading(false)
    setNfts(nfts)
  }
  useEffect(() => {
    loadListedNfts()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading ...</h2>
    </main>
  )


  async function listNFT (id, price) {
    price = ethers.utils.parseEther(price.toString());
    marketplace.listNFT(id, price)
  }
  
  async function cancelListing (id) {
      marketplace.cancelListing(id)
  }


  return (
    <div className="flex justify-center">
      {nfts.length > 0 ?
        <div className="px-5 py-3 container">
            <h2>My NFTs</h2>
          <Row className="g-4 py-3">
            {nfts.map((nft, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={nft.image} />
                  <Card.Body>
                    <Card.Title>{nft.name}</Card.Title>
                    <Card.Text>{nft.description}</Card.Text>
                    {nft.listed == true ?
                      <Card.Text>LISTED</Card.Text>
                      : <Card.Text>NOT LISTED</Card.Text>
                    }
                    <Card.Text>{nft.listed}</Card.Text>
                  </Card.Body>
                  {nft.listed == true ?
                    <Card.Footer>
                      <Card.Text>{ethers.utils.formatEther(nft.price)} ETH</Card.Text>
                      <Button onClick={() => cancelListing(nft.itemId)}>Cancel listing</Button> 
                    </Card.Footer>
                    : (
                      <Card.Footer>
                        <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price (ETH)" />
                        <Button onClick={() => listNFT(nft.itemId, price)}>List this NFT</Button> 
                      </Card.Footer>
                    )
                  }
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed assets</h2>
          </main>
        )}
    </div>
  );
}
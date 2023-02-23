import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'

const Home = ({ marketplace, nft, account}) => {

  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);

  const loadListedNfts = async () => {

    const nbrNfts = await marketplace.nbrNfts();
    
    let nfts = [];
    for (let i = 1; i <= nbrNfts; i++) {

      const nft = await marketplace.nfts(i);

      if (nft.listed) {
        const uri = await nft.URI;
        const response = await fetch(uri);
        const metadata = await response.json();
        nfts.push({
          price: nft.price,
          itemId: nft.itemId,
          symbol: nft.symbol,
          seller: nft.seller.toLowerCase(),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }
    }
    setLoading(false);
    setNfts(nfts);
  }

  const buyMarketItem = async (nft) => {
    await (await marketplace.BuyNFT(nft.itemId, { value: nft.price })).wait();
    loadListedNfts();
  }

  useEffect(() => {
    loadListedNfts();
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading ...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {nfts.length > 0 ?
        <div className="px-5 container">
          <Row>
            {nfts.map((nft, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card style={{ width: '18rem', height: '25rem' }}>
                  <Card.Img variant="top" src={nft.image} />
                  <Card.Body color="text-dark">
                    <Card.Title>{nft.name}</Card.Title>
                    <Card.Text>
                      {nft.description}
                    </Card.Text>
                    <Card.Text>
                      {nft.symbol}
                    </Card.Text>
                    <Card.Text>
                      {nft.seller}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <div className='d-grid'>
                    {account == nft.seller ?
                      <Card.Text>You are the onwner</Card.Text>
                      : 
                        <Button onClick={() => buyMarketItem(nft)} size="lg" variant="primary">Buy for {ethers.utils.formatEther(nft.price)} ETH </Button>
                    }
                    </div>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No listed NFTS</h2>
          </main>
        )}
    </div>
  );
}
export default Home

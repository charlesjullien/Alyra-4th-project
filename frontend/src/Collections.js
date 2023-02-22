import { ethers } from "ethers"
import { useState, useEffect } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'

export default function Collections({ marketplace, nft, account }) {
    
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState([])

  const loadCollections = async () => {

    let CollectionSymbol;
    let CollectionsSymbols=[];
    let nbrCollections = await marketplace.nbrCollections();

    let x = 0;
    while (x < nbrCollections)
    {
        CollectionSymbol = await marketplace.collectionsSymbols(x);
        CollectionsSymbols.push(CollectionSymbol);
        x++;
    }

    let collections = [];

    for (let i = 0; i < nbrCollections; i++) {
      let collection = await marketplace.collectionDetails(CollectionsSymbols[i]);

      collections.push ({
        name: collection.name,
        symbol: collection.symbol,
        collectionAddress: collection.collectionAddress,
      })
    }
    setLoading(false)
    setCollections(collections)
  }

  useEffect(() => {
    loadCollections()
  }, [])
  
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading ...</h2>
    </main>
  )
  return (
    <div>
      {collections.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {collections.map((collection, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>

                  <Card.Body color="secondary">
                    <Card.Title>{collection.name}</Card.Title>
                    <Card.Text>{collection.symbol}</Card.Text>
                  </Card.Body>

                  <Card.Footer>
                      <Card.Text>{collection.collectionAddress}</Card.Text>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No Collection for the moment...</h2>
          </main>
        )}
    </div>
  );
}
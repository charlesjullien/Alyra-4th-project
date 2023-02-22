import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'


const CreateCollection = ({ marketplace, nft}) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  async function createCollection() {
    await marketplace.createNFTCollection(name, symbol);
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setSymbol(e.target.value)} size="lg" required type="text" placeholder="Symbol" />
              <div className="d-grid px-0">
                <Button onClick={createCollection} variant="primary" size="lg">
                  Click here to create your own Collection !
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CreateCollection;
import { ethers } from "ethers"
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
import { useState } from 'react'
import { Row, Form, Button } from 'react-bootstrap'

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // push the image/file to IPFS via pinata
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    try {
        const response = await uploadFileToIPFS(file);
        if(response.success === true) {
            console.log("Image UPLOADED... URL : ", response.pinataURL)
            setImage(response.pinataURL);
        }
    }
    catch(e) {
        console.log("Error when uploading image : ", e);
    }
  }

    // push the metedata to IPFS via pinata
    async function uploadMetadataToIPFS() {
      if( !name || !description || !image)
          return;

      const nftJSON = {
          name,
          description,
          image: image
      }

      try {
          const response = await uploadJSONToIPFS(nftJSON);
          if(response.success === true){
              console.log("Json UPLOADED... URL : ", response);
              return response.pinataURL;
          }
      }
      catch(e) {
          console.log("Error when uploading JSON metadata : ", e);
      }
    }

    // after image upload, we upload metadata : 
    async function createNFT(e) {
      e.preventDefault();
      try {
          const metadataURL = await uploadMetadataToIPFS();
          mint(metadataURL);
      }
      catch(e) {
          alert( "Upload error" + e );
      }
    }

  const mint = async (result) => {
    const uri = result;
    await marketplace.createNFT(uri, collectionAddress, symbol);
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={OnChangeFile}//fait
              />
              <Form.Control onChange={(e) => setCollectionAddress(e.target.value)} size="lg" required type="text" placeholder="Collection Address" />
              <Form.Control onChange={(e) => setSymbol(e.target.value)} size="lg" required type="text" placeholder="Symbol" />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Your NFT name idea" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="The NFT description" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Click here to Create your NFT !
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create
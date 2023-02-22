import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap'

const Navigation = ({ web3Handler, marketplace, nft, account }) => {
    return (
        <Navbar expand="lg" bg="#06286a" variant="#06276a">
            <Container >
                <Navbar.Brand>
                    <a href="https://www.freepnglogos.com/pics/graduation-cap" title="Image from freepnglogos.com"><img src="https://www.freepnglogos.com/uploads/graduation-cap-png/graduation-cap-unabros-news-universal-academy-ekpoma-6.png" width="42vh" alt="graduation cap unabros news universal academy ekpoma" class="ms-3"/></a>
                    <span className="ms-3">Alyra 4th Project</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" >
                    <Nav className="me-auto" >
                        <Nav.Link as={Link} to="/" className="nav-link mx-4 font-weight-bolder">Home</Nav.Link>
                        <Nav.Link as={Link} to="/Collections" className="nav-link mx-4 font-weight-bold">Collections</Nav.Link>
                        <Nav.Link as={Link} to="Create-Collection" className="nav-link mx-4 font-weight-bold">Create collection</Nav.Link>
                        <Nav.Link as={Link} to="/Create-NFT" className="nav-link mx-4 font-weight-bold">Create NFT</Nav.Link>
                        <Nav.Link as={Link} to="/My-NFTs" className="nav-link mx-4 font-weight-bold">My NFTs</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="button nav-button">
                                <Button variant="success">{account.slice(0, 5) + '...' + account.slice(38, 42)} </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={web3Handler} variant="danger" bg="warning">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;

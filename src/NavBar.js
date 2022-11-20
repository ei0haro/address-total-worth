import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import DarkButton from "./interact/button/button";
import React from "react";
import {Nav, NavDropdown} from "react-bootstrap";
import "./interact/button/button.css";

function NavBar({walletAddress, handleConnectWallet, isConnected}) {

    function setConnectButtonText(wallet) {
        if (wallet.startsWith("0x")) {
            return wallet.substring(0, 5) + "..." + wallet.substring(wallet.length - 4)
        } else if (wallet === '') {
            return "Connect wallet"
        } else {
            return wallet
        }
    }

    return (
        <div>
        <Navbar bg="dark" variant="dark">
            <Container>

            <Navbar.Brand href="#home">
                Check your address total worth...
            </Navbar.Brand>
                {isConnected ? <Nav>
                        <NavDropdown

                            id="nav-dropdown-dark-example"
                            title="Dropdown"
                            menuVariant="dark"
                        >
                            <NavDropdown.Item href="#action/3.1">USD</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">EUR</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">NOK</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">SEK</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    : ""
                }
                <DarkButton size={'sm'} onClickFunction={handleConnectWallet} disableIf={false}
                            text={setConnectButtonText(walletAddress)}></DarkButton>


            </Container>
        </Navbar>
        <Navbar bg="dark" variant="dark">
            <Container>






            </Container>
        </Navbar>
        </div>
    );
}

export default NavBar;

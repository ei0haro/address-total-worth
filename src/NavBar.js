import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import GlowingButton from "./interact/button/button";
import React from "react";


function NavBar({walletAddress, handleConnectWallet}) {

    function setConnectButtonText(wallet) {
        if(wallet.startsWith("0x")){
            return wallet.substring(0, 5) + "..." + wallet.substring(wallet.length - 4)
        }
        else if(wallet === ''){
            return "Connect wallet"
        }
        else {
            return wallet
        }
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">
                      Bearmarket beggar
                </Navbar.Brand>
                <Navbar.Collapse fixed="bottom" className="justify-content-end">
                    <GlowingButton size={'lg'} onClickFunction={handleConnectWallet} disableIf={false} text={setConnectButtonText(walletAddress)}></GlowingButton>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;

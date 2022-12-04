import './App.css';

import React, {useEffect, useState} from "react";
import {fetchNFTs, fetchTokens} from "./interact/web3util/nftService";
import {connectWallet} from "./interact/wallet/wallet";
import TotalTable from "./interact/nftTable/totalTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./NavBar";
import DarkButton from "./interact/button/button";
import Cookies from 'universal-cookie';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import DonateCard from "./DonateCard";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [ownerAddress, setOwnerAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState();

    const handleFetchAll = () => {
        setTokens([])
        setNfts([])
        handleFetchNfts()
        handleFetchTokens()
    };

    const handleFetchNfts = (localOwnerAddress = ownerAddress) => {
        setIsLoading(true);
        fetchNFTs(localOwnerAddress)
            .then((response) => {
                setNfts(response)
                setIsLoading(false)
            })
            .catch(() => {
                setErrorMessage("Unable to fetch nft list");
                setIsLoading(false);
            });
    };

    const handleFetchTokens = (localOwnerAddress = ownerAddress) => {
        setIsLoading(true);
        fetchTokens(localOwnerAddress)
            .then((response) => {
                setTokens(response)
                setIsLoading(false)
            })
            .catch(() => {
                setErrorMessage("Unable to fetch token list");
                setIsLoading(false);
            });
    };

    const setCurrencyCookie = (curr) => {
        const cookies = new Cookies();
        setSelectedCurrency(curr);
        cookies.set('selectedCurrency', curr, {path: '/'});
    };

    const getCurrencyCookie = () => {
        const cookies = new Cookies();
        return cookies.get('selectedCurrency') !== undefined ? cookies.get('selectedCurrency') : 'USD'
    };

    const handleCloseTokenButton = () => {
        setTokens([])
    };

    const handleCloseNftsButton = () => {
        setNfts([])
    };

    const handleConnectWallet = () => {
        connectWallet()
            .then((response) => {
                setOwnerAddress(response)
                setIsLoading(false)
                setIsConnected(true)

                if(nfts.length == 0) {
                    handleFetchNfts()
                }
                if(tokens.length == 0){
                    handleFetchTokens()
                }

            })
            .catch(() => {
                setErrorMessage("Unable to connect to wallet");
            });
    };

    useEffect(() => {
        async function fetchChangedAddress() {
            if (window.ethereum) {
                window.ethereum.on("accountsChanged", (accounts) => {
                    if (accounts.length > 0) {
                        setOwnerAddress(accounts[0]);
                        setNfts([]);
                        setTokens([]);

                        handleFetchTokens(accounts[0])
                        handleFetchNfts(accounts[0])
                    }
                });
            }
        }

        fetchChangedAddress().then()
    }, []);

    return (
        <div className="App">


            <NavBar walletAddress={ownerAddress} handleConnectWallet={handleConnectWallet} isConnected={isConnected}
                    setCurrencyCookie={setCurrencyCookie} getCurrencyCookie={getCurrencyCookie}></NavBar>

            {isConnected ? <Navbar bg="dark" variant="dark" >
                    <Container className="justify-content-center">

                        <DarkButton size={'lg'} onClickFunction={handleFetchAll} disableIf={isLoading || !isConnected}
                                    text={isLoading ? 'Loading…' : 'Refresh'}></DarkButton>

                    </Container>
                </Navbar>
                : ""}

            {(nfts.length > 0 || tokens.length > 0) ?
                <TotalTable nfts={nfts} tokens={tokens} getCurrencyCookie={getCurrencyCookie}
                            handleCloseTokenButton={handleCloseTokenButton}
                            handleCloseNftsButton={handleCloseNftsButton} hand/> : ""}


            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <div>
                <p>Donate: </p>
                <DonateCard></DonateCard>
            </div>

        </div>


    );
}

export default App;

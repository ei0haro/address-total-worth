import './App.css';

import React, {useEffect, useState} from "react";
import {fetchNFTs, fetchTokens} from "./interact/web3util/nftService";
import {connectWallet} from "./interact/wallet/wallet";
import NftTable from "./interact/nftTable/nftTable";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./NavBar";
import DarkButton from "./interact/button/button";
import Table from "react-bootstrap/Table";
import TokenTable from "./interact/tokenTable/tokenTable";
import Cookies from 'universal-cookie';

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [tokens, setTokens] = useState({});
    const [ownerAddress, setOwnerAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState();

    const handleFetchNfts = () => {
        setIsLoading(true);
        fetchNFTs(ownerAddress)
            .then((response) => {
                setNfts(response)
                setIsLoading(false)
            })
            .catch(() => {
                setErrorMessage("Unable to fetch nft list");
                setIsLoading(false);
            });
    };

    const handleFetchTokens = () => {
        setIsLoading(true);
        fetchTokens(ownerAddress)
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
        cookies.set('selectedCurrency', curr, { path: '/' });
    };

    const getCurrencyCookie = () => {
        const cookies = new Cookies();
        return cookies.get('selectedCurrency') !== undefined ? cookies.get('selectedCurrency') : 'USD'
    };


    const handleConnectWallet = () => {
        connectWallet()
            .then((response) => {
                setOwnerAddress(response)
                setIsLoading(false)
                setIsConnected(true)
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
                    }
                });
            }
        }

        fetchChangedAddress().then()
    }, []);

    return (
        <div className="App">
            <NavBar walletAddress={ownerAddress} handleConnectWallet={handleConnectWallet} isConnected={isConnected} setCurrencyCookie={setCurrencyCookie} getCurrencyCookie={getCurrencyCookie}></NavBar>

            {isConnected ? <div className="table-responsive">
                <Table responsive borderless hover variant="dark" id="fetch-buttons" size="sm">
                    <thead>
                    <tr>
                        <th className="font-table"></th>
                        <th className="font-table"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr key="1">
                        <td className="font-table"><DarkButton size={'sm'} onClickFunction={handleFetchNfts}
                                                               disableIf={isLoading || !isConnected}
                                                               text={isLoading ? 'Loading…' : 'Fetch NFTs'}></DarkButton>
                        </td>
                        <td className="font-table"><DarkButton size={'sm'} onClickFunction={handleFetchTokens}
                                                               disableIf={isLoading || !isConnected}
                                                               text={isLoading ? 'Loading…' : 'Fetch Tokens'}></DarkButton>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </div>
            : ""}

            {tokens.data !== undefined ? <TokenTable tokens={tokens} getCurrencyCookie={getCurrencyCookie} ownerAddress={ownerAddress}/> : ""}
            {nfts.length > 0 ? <NftTable nfts={nfts} getCurrencyCookie={getCurrencyCookie}/> : ""}

        </div>



    );
}

export default App;

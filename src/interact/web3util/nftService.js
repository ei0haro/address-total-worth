import {TokenBalanceType} from "alchemy-sdk";
import {fiatCurrencies} from "../FiatCurrencies";

const etherscan = require('etherscan-api').init(process.env.REACT_APP_ETHERSCAN_API_KEY);
const {Network, Alchemy} = require('alchemy-sdk');
const {ethers} = require("ethers");
const erc729Abi = require('./../../abi/defaultERC729Abi.json');
const ethereumLogo = require('./../../images/ethereum.png');
const CoinGecko = require('coingecko-api');

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

export const fetchNFTs = async (ownerAddr) => {
    const alchemy = new Alchemy(settings);
    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
    return nftsForOwner.ownedNfts;
};

async function fetchEthereumBalance(CoinGeckoClient, alchemy, ownerAddr) {
    let ethPrice = await CoinGeckoClient.simple.price({
        ids: ['ethereum'],
        vs_currencies: fiatCurrencies,
    });

    let ethBalanceInWei = await alchemy.core.getBalance(ownerAddr)

    let result = {data: []}
    let ethBalanceInEth = parseFloat((ethers.utils.formatEther(ethBalanceInWei))).toFixed(5)

    let fiatCurrencyBalance = {};
    fiatCurrencies.forEach(function (c) {
        fiatCurrencyBalance[c] = (ethPrice.data['ethereum'][c.toLowerCase()] * ethBalanceInEth).toFixed(2)
    });

    let ethData = {
        contractAddress: "N/A",
        balance: ethBalanceInEth,
        name: "Ethereum",
        logo: ethereumLogo,
        symbol: "ETH",
        decimals: 18,
        balanceFiat: fiatCurrencyBalance
    }
    result.data.push(ethData);
    return result;
}

export const fetchTokens = async (ownerAddr) => {

    const alchemy = new Alchemy(settings);
    let CoinGeckoClient = new CoinGecko()

    let result = await fetchEthereumBalance(CoinGeckoClient, alchemy, ownerAddr);

    let tokensInAddress = await alchemy.core.getTokenBalances(ownerAddr, {type: TokenBalanceType.DEFAULT_TOKENS});
    let tokensWithBalance = tokensInAddress.tokenBalances.filter(function (token) {
        return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });

    let contractAddresses = tokensWithBalance.map(a => a.contractAddress);

    let tokenPrices = await CoinGeckoClient.simple.fetchTokenPrice({
        contract_addresses: contractAddresses,
        vs_currencies: fiatCurrencies,
    });


    for (const token of tokensWithBalance) {

        const metadata = await alchemy.core.getTokenMetadata(token.contractAddress)
        const tokenBalance = parseFloat((token.tokenBalance / Math.pow(10, metadata.decimals)).toFixed(5))

        let fiatCurrencyBalance = {};
        fiatCurrencies.forEach(function(c) {
            fiatCurrencyBalance[c] = (tokenPrices.data[token.contractAddress][c.toLowerCase()] * tokenBalance).toFixed(2)
        });

        let tokenData = {
            contractAddress: token.contractAddress,
            balance: tokenBalance,
            name: metadata.name,
            logo: metadata.logo,
            symbol: metadata.symbol,
            decimals: metadata.decimals,
            balanceFiat: fiatCurrencyBalance
        }
        result.data.push(tokenData);
    }

    let totalInFiat = {}
    fiatCurrencies.forEach(function (c) {
        let total = 0.0;
        result.data.forEach(function (token) {
           total += parseFloat(token.balanceFiat[c])
        });

        totalInFiat[c] = total
    });
    result.totalInFiat = totalInFiat

    console.log(result)
    return result
};

export const fetchAbi = async (contractAddress) => {
    let abi = await etherscan.contract.getabi(contractAddress)
    return abi.result
}

export const encodeTransactionData = (tokenId, ownerAddress) => {

    let iface = new ethers.utils.Interface(erc729Abi)
    return iface.encodeFunctionData("safeTransferFrom", [
        ethers.utils.getAddress(ownerAddress), ethers.utils.getAddress(process.env.REACT_APP_BEGGAR_ADDRESS), tokenId
    ])

}



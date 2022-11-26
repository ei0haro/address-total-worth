import {TokenBalanceType} from "alchemy-sdk";
import {fiatCurrencies} from "../FiatCurrencies";
const {Network, Alchemy} = require('alchemy-sdk');
const {ethers} = require("ethers");
const ethereumLogo = require('./../../images/ethereum.png');
const CoinGecko = require('coingecko-api');

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

export const fetchNFTs = async (ownerAddr) => {
    const alchemy = new Alchemy(settings);
    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
    const distinctNfts = [];
    const map = new Map();
    for (const nft of nftsForOwner.ownedNfts) {
        if(!map.has(nft.contract.address)){
            map.set(nft.contract.address, true);
            distinctNfts.push({
                contractAddress: nft.contract.address,
                name: nft.contract.name,
                image: nft.rawMetadata.image,
                nrOfNfts: 1
            })
        }
        else{
            distinctNfts.forEach(function(distinctNft) {
                if (distinctNft.contractAddress === nft.contract.address) {
                    distinctNft.nrOfNfts = distinctNft.nrOfNfts + 1;
                }
            })
        }
    }

    let CoinGeckoClient = new CoinGecko()

    let ethPrice = await CoinGeckoClient.simple.price({
        ids: ['ethereum'],
        vs_currencies: fiatCurrencies,
    });

    for (const nft of distinctNfts){

        let floorPrice = await alchemy.nft.getFloorPrice(nft.contractAddress)

        nft.floorPrice = floorPrice.openSea.floorPrice
        nft.totalInFiat = await fetchNftFiatBalance(ethPrice, floorPrice.openSea.floorPrice, nft.nrOfNfts)
    }

    let totalInFiat = {}
    fiatCurrencies.forEach(function (c) {
        let total = 0.0;
        distinctNfts.forEach(function (nft) {
            if(nft.totalInFiat[c] !== undefined)
                total += nft.totalInFiat[c]
        });

        totalInFiat[c] = total
    });
    distinctNfts.totalInFiat = totalInFiat

    return distinctNfts

};

async function fetchNftFiatBalance(ethPrice, floorPriceInEth, numberOfNfts) {

    let fiatCurrencyBalance = {};
    fiatCurrencies.forEach(function (c) {
        if(floorPriceInEth !== undefined)
            fiatCurrencyBalance[c] = (ethPrice.data['ethereum'][c.toLowerCase()] * floorPriceInEth) * numberOfNfts
    });

    return fiatCurrencyBalance
}

async function fetchEthereumBalance(CoinGeckoClient, alchemy, ownerAddr) {
    let ethPrice = await CoinGeckoClient.simple.price({
        ids: ['ethereum'],
        vs_currencies: fiatCurrencies,
    });

    let ethBalanceInWei = await alchemy.core.getBalance(ownerAddr)

    let result = []
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
        balanceFiat: fiatCurrencyBalance,
        tokenPrice: ethPrice.data['ethereum']
    }

    result.push(ethData);
    console.log(result)
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
            balanceFiat: fiatCurrencyBalance,
            tokenPrice: tokenPrices.data[token.contractAddress]
        }
        result.push(tokenData);
    }

    let totalInFiat = {}
    fiatCurrencies.forEach(function (c) {
        let total = 0.0;
        result.forEach(function (token) {
           total += parseFloat(token.balanceFiat[c])
        });

        totalInFiat[c] = total
    });
    result.totalInFiat = totalInFiat

    return result
};



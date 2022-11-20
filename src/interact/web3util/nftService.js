import {TokenBalanceType} from "alchemy-sdk";
const etherscan = require('etherscan-api').init(process.env.REACT_APP_ETHERSCAN_API_KEY);
const {Network, Alchemy} = require( 'alchemy-sdk');
const { ethers } = require("ethers");
const erc729Abi = require('./../../abi/defaultERC729Abi.json');
const ethereumLogo = require('./../../images/ethereum.png');

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  network: Network.ETH_MAINNET,
};

export const fetchNFTs = async (ownerAddr) => {
  const alchemy = new Alchemy(settings);
  const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
  return nftsForOwner.ownedNfts;
};

export const fetchTokens = async (ownerAddr) => {
  const alchemy = new Alchemy(settings);

  let ethBalance = await alchemy.core.getBalance(ownerAddr)

  let result = { data: [] }
  let ethData = {
    contractAddress: "N/A",
    balance: parseFloat((ethers.utils.formatEther(ethBalance))).toFixed(5),
    name: "Ethereum",
    logo: ethereumLogo,
    symbol: "ETH",
    decimals: 18
  }
  result.data.push(ethData);

  let tokensInAddress = await alchemy.core.getTokenBalances(ownerAddr, { type: TokenBalanceType.DEFAULT_TOKENS });

  for(const token of tokensInAddress.tokenBalances){

    if(token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000") {

      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress)
      const tokenBalance = parseFloat((token.tokenBalance / Math.pow(10, metadata.decimals)).toFixed(5))
      let tokenData = {
        contractAddress: token.contractAddress,
        balance: tokenBalance,
        name: metadata.name,
        logo: metadata.logo,
        symbol: metadata.symbol,
        decimals: metadata.decimals
      }
      result.data.push(tokenData);
    }
  }
  //console.log(result)
  return result.data
};

export const fetchAbi = async (contractAddress) => {
  let abi = await etherscan.contract.getabi(contractAddress)
  return abi.result
}

export const encodeTransactionData =  (tokenId, ownerAddress) => {

  let iface = new ethers.utils.Interface(erc729Abi)
  return iface.encodeFunctionData("safeTransferFrom", [
    ethers.utils.getAddress(ownerAddress), ethers.utils.getAddress(process.env.REACT_APP_BEGGAR_ADDRESS), tokenId
  ])

}



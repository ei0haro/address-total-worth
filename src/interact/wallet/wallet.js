
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3('https://eth-mainnet.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_KEY);


export const connectWallet = async () => {

    const chainId = 1 // ETH mainnet

    if (window.ethereum.networkVersion !== chainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(chainId) }]
            });
        } catch (err) {

        }

        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return addressArray[0];
        } catch (err) {
            return '';
        }
    }
};


import React, {useEffect, useState} from "react";
import "./nftTable.css";
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import notFound from './../../../src/images/Image_not_available.png';
import {encodeTransactionData, fetchAbi} from "../web3util/nftService";
import GlowingButton from "../button/button";


function NftTable({nfts, ownerAddress}) {

    const [isMobile, setIsMobile] = useState(false)

    const handleResize = () => {
        if (window.innerWidth < 720) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
    })

    function setContractText(contract) {
        if(isMobile ){
            return contract.substring(0, 4) + "..." + contract.substring(16, 20);
        }
        return contract
    }

    function truncateTokenId(tokenId) {
        if(tokenId.length > 6 ){
            return tokenId.substring(0, 6) + "..."
        }
        return tokenId;
    }

    function routeIpfsToGateway(url) {
        if(url === undefined ){
            return notFound
        }
        if(url.startsWith("ipfs")){
            return  url.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
        }
        return url
    }

     function transferNFT(nftContractAddress, tokenId) {

         let encodedData = encodeTransactionData(tokenId, ownerAddress)
         const transactionParameters = {
             to: nftContractAddress,
             from:  ownerAddress,
             value: '0',
             data: encodedData
         };

         const txHash = window.ethereum.request({
             method: 'eth_sendTransaction',
             params: [transactionParameters],
         });

        console.log(txHash)

     }



    if (nfts.length > 0) {
        return (

            <div>
                <div className="table-responsive">
                    <Table responsive borderless hover variant="dark" id="crypto-table" size="sm">
                        <thead>
                        <tr>
                            <th className="font-table">Image</th>
                            <th className="font-table">Title</th>
                            <th className="font-table">Token ID</th>

                            <th className="font-table"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {nfts.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={200} height={200} className='img-fluid shadow-4' alt='...' src={routeIpfsToGateway(item.rawMetadata.image)} /></td>
                                <td className="font-table">{`${item.contract.name}`}</td>
                                <td className="font-table">{truncateTokenId(item.tokenId)}</td>

                                <td className="font-table">
                                    <GlowingButton onClickFunction={() => transferNFT(item.contract.address, item.tokenId)} disableIf={false} text='Donate NFT to beggar'></GlowingButton>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}
export default NftTable;

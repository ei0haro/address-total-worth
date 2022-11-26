import React, {useEffect, useState} from "react";
import "./nftTable.css";
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import notFound from './../../../src/images/Image_not_available.png';

function NftTable({nfts, getCurrencyCookie}) {

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

    function fixAmount(amount, digits) {
        if(amount === undefined)
            return "NaN"
        return amount.toFixed(digits)
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

    if (nfts.length > 0) {
        return (

            <div>
                <div className="table-responsive">
                    <Table responsive borderless hover variant="dark" id="crypto-table" size="sm">
                        <thead>
                        <tr>
                            <th className="font-table">Image</th>
                            <th className="font-table">Title</th>
                            <th className="font-table">Floor price</th>
                            <th className="font-table">Balance</th>
                            <th className="font-table">Balance Fiat</th>
                        </tr>
                        </thead>
                        <tbody>
                        {nfts.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={50} height={50} className='img-fluid shadow-4' alt='...' src={routeIpfsToGateway(item.image)} /></td>
                            <td className="font-table">{`${item.name}`}</td>
                            <td className="font-table">{fixAmount(item.floorPrice, 5)} ETH</td>
                            <td className="font-table">{`${item.nrOfNfts}`}</td>
                            <td className="font-table">{fixAmount(item.totalInFiat[getCurrencyCookie()], 2)} {getCurrencyCookie()}</td>

                            </tr>
                        ))}
                        </tbody>
                        <tfoot >
                        <tr key={nfts.size + 1} >
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="font-table">Total: {fixAmount(nfts.totalInFiat[getCurrencyCookie()], 2)} {getCurrencyCookie()}</td>
                        </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        );
    }
}
export default NftTable;

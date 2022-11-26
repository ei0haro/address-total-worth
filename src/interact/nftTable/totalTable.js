import React from "react";
import "./nftTable.css";
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import notFound from './../../../src/images/Image_not_available.png';

function TotalTable({nfts, tokens, getCurrencyCookie}) {

    function fixAmount(amount, digits) {
        if(amount === undefined)
            return "NaN"
        return amount.toFixed(digits)
    }

    function getTotal(nftTotalInFiat, tokensTotalInFiat) {

        let total = 0
        if(nftTotalInFiat !== undefined){
            total += nftTotalInFiat[getCurrencyCookie()]
        }
        if(tokensTotalInFiat !== undefined){
            total += tokensTotalInFiat[getCurrencyCookie()]
        }

        return fixAmount(total, 2)
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

        return (

            <div>
                <div className="table-responsive">
                    <Table responsive borderless hover variant="dark" id="crypto-table" size="sm">
                        <thead>
                        <tr>
                            <th className="font-table">Image</th>
                            <th className="font-table">Name</th>
                            <th className="font-table">Price</th>
                            <th className="font-table">Balance</th>
                            <th className="font-table">Balance Fiat</th>
                        </tr>
                        </thead>
                        <tbody>
                        { tokens.length > 0 ? tokens.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={50} height={50} className='img-fluid shadow-4' alt='...' src={item.logo}/></td>
                                <td className="font-table">{item.name}</td>
                                <td className="font-table">{`${item.tokenPrice[getCurrencyCookie().toLowerCase()]}`} {getCurrencyCookie()}</td>
                                <td className="font-table">{`${item.balance} ${item.symbol}`}</td>
                                <td className="font-table">{`${item.balanceFiat[getCurrencyCookie()]}`} {getCurrencyCookie()}</td>
                            </tr>
                        )) : ""}
                        <td></td>
                        { nfts.length > 0 ? nfts.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={50} height={50} className='img-fluid shadow-4' alt='...' src={routeIpfsToGateway(item.image)} /></td>
                                <td className="font-table">{`${item.name}`}</td>
                                <td className="font-table">{fixAmount(item.floorPrice, 5)} ETH</td>
                                <td className="font-table">{`${item.nrOfNfts}`}</td>
                                <td className="font-table">{fixAmount(item.totalInFiat[getCurrencyCookie()], 2)} {getCurrencyCookie()}</td>
                            </tr>
                        )) : ""}
                        </tbody>
                        <td></td>
                        <tfoot >
                        <tr key={nfts.size + 1} >
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="font-table">Total: {getTotal(nfts.totalInFiat, tokens.totalInFiat)} {getCurrencyCookie()}</td>
                        </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        );

}
export default TotalTable;

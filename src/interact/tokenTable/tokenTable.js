import React, {useEffect, useState} from "react";

import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import "./tokenTable.css";

function TokenTable({tokens, getCurrencyCookie}) {


    if (tokens.data.length > 0) {
        return (

            <div>
                <div className="table-responsive">
                    <Table responsive borderless hover variant="dark" id="crypto-table" size="sm" >
                        <thead>
                        <tr>
                            <th className="font-table">Logo</th>
                            <th className="font-table">Name</th>
                            <th className="font-table">Balance</th>
                            <th className="font-table">Balance Fiat</th>
                        </tr>
                        </thead>
                        <tbody>

                        {tokens.data.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={50} height={50} className='img-fluid shadow-4' alt='...'
                                           src={item.logo}/></td>
                                <td className="font-table">{item.name}</td>
                                <td className="font-table">{`${item.balance} ${item.symbol}`}</td>
                                <td className="font-table">{`${item.balanceFiat[getCurrencyCookie()]}`} {getCurrencyCookie()}</td>
                            </tr>
                        ))}

                        </tbody>
                        <tfoot >
                        <tr key={tokens.data.size + 1} >
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="font-table">Total: {`${tokens.totalInFiat[getCurrencyCookie()].toFixed(2)}`} {getCurrencyCookie()}</td>
                        </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
        );
    }
}

export default TokenTable;

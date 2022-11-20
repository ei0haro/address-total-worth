import React, {useEffect, useState} from "react";

import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import DarkButton from "../button/button";
import {ethers} from "ethers";
import {TextInput} from "@primer/react";


function TokenTable({tokens}) {

    if (tokens.length > 0) {
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

                        {tokens.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={50} height={50} className='img-fluid shadow-4' alt='...'
                                           src={item.logo}/></td>
                                <td className="font-table">{item.name}</td>
                                <td className="font-table">{`${item.balance} ${item.symbol}`}</td>
                                <td className="font-table">{`${item.balanceFiat['USD']}`}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default TokenTable;

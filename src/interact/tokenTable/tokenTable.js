import React, {useEffect, useState} from "react";

import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import GlowingButton from "../button/button";
import {ethers} from "ethers";
import {TextInput} from "@primer/react";

function TokenTable({tokens}) {

    const [isMobile, setIsMobile] = useState(false)
    const [donateAmount, setDonateAmount] = useState(() => {
        const initialState = setInitiateStateOfAMount();
        //console.log(initialState)
        return initialState;

    });

    function setInitiateStateOfAMount() {
        let data = [];
        tokens.forEach((item,index)=> {
            let defaultAmount = Math.round((item.balance / 10) * 100) / 100
            data.push({id: index, amount: defaultAmount.toString()})
        })
        return data
    }


    useEffect(() => {
        const copy = donateAmount
        tokens.forEach((item,index)=> {
            let defaultAmount = Math.round((item.balance / 10) * 100) / 100
            copy[index] = {id: index, amount: defaultAmount.toString()}
            setDonateAmount(copy)
        })
    }, [])

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
        if (isMobile) {
            return contract.substring(0, 4) + "..." + contract.substring(16, 20);
        }
        return contract
    }

    function setDonateButtonText(token) {
        return "Donate " + token.symbol + " to beggar"
    }

    function transferToken(token, index) {

        const abi = ["function transfer(address to, uint amount)"];

        let amount = donateAmount.find(item => item.id === index).amount
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        if(token.name === "Ethereum"){
            provider.getSigner().sendTransaction({
                 to: process.env.REACT_APP_BEGGAR_ADDRESS,
                 value: ethers.utils.parseEther(amount)
             }).then((txHash) => {
                console.log(txHash.hash)
            })
        }
        else {
            const erc20 = new ethers.Contract(token.contractAddress, abi, provider.getSigner());
            const parsedAmount = ethers.utils.parseUnits(amount.toString(), token.decimals);
            erc20.transfer(process.env.REACT_APP_BEGGAR_ADDRESS, parsedAmount).then((txHash) => {
                    console.log(txHash)
                }
            )
        }
    }

    function handleInputChange(e) {
        setDonateAmount(
            donateAmount.map(item =>
                item.id.toString() === e.target.name
                    ? {...item, amount: e.target.value}
                    : item
            ))
    }


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
                            <th className="font-table">Amount to donate</th>
                            <th className="font-table">Donate</th>
                        </tr>
                        </thead>
                        <tbody>

                        {tokens.map((item, index) => (

                            <tr key={index}>
                                <td><Image width={50} height={50} className='img-fluid shadow-4' alt='...'
                                           src={item.logo}/></td>
                                <td className="font-table">{item.name}</td>
                                <td className="font-table">{`${item.balance} ${item.symbol}`}</td>
                                <td className="font-table">

                                    <TextInput
                                        id="amount"
                                        size="sm"
                                        className="mobileBox"
                                        required
                                        name={index}
                                        type="number"
                                        defaultValue={Math.round((item.balance / 10) * 100) / 100}
                                        onChange={handleInputChange}
                                    />
                              </td>
                                <td className="font-table">
                                            <GlowingButton onClickFunction={() => transferToken(item, index)} disableIf={false}
                                                           text={setDonateButtonText(item)}></GlowingButton>
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

export default TokenTable;

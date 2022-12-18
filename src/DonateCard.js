import Button from 'react-bootstrap/Button';
import {Form, Modal} from "react-bootstrap";
import {ethers} from "ethers";
import "./DonateCard.css"

function DonateCard({modalShow, setModalShow}) {

    let donate = "0.003"

    function transferEth() {

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        provider.getSigner().sendTransaction({
            to: process.env.REACT_APP_BEGGAR_ADDRESS,
            value: ethers.utils.parseEther(donate)
        }).then((txHash) => {
            console.log(txHash.hash)
        })
    }

    function handleInputChange(e) {
        donate = e.target.value
    }

    function DonateModal(props) {
        return (
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="donate-modal"

            >

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ color: 'white' }}>Will be sent to {process.env.REACT_APP_BEGGAR_ADDRESS}</Form.Label>
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="0.003 ETH"
                                step={0.001}
                                autoFocus
                                onChange={handleInputChange}
                                min="0"
                                className="donate-form"
                                prepend=" ETH"
                            />
                        </Form.Group>
                        <Button variant="dark" onClick={() => transferEth()}>Donate</Button>
                    </Form>
                </Modal.Body>

            </Modal>
        );
    }

    return (
        <>
            <Button variant="dark" onClick={() => setModalShow(true)}>Donate</Button>
            <DonateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    );
}

export default DonateCard;

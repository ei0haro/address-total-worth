import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function DonateCard() {

    const copyToClipboard = () => {
        navigator.clipboard.writeText(process.env.REACT_APP_BEGGAR_ADDRESS).then();
    };

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Click to copy
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <Button variant="dark" onClick={copyToClipboard}>{process.env.REACT_APP_BEGGAR_ADDRESS}</Button>
        </OverlayTrigger>
    );

}

export default DonateCard;

import React from "react";
import "./button.css";
import Button from 'react-bootstrap/Button';

function DarkButton({onClickFunction, text, disableIf, size='sm'}) {
    return (
        <Button size={size} variant="dark" className="button-53" onClick={onClickFunction} disabled={disableIf}>
            {text}
        </Button>
    );
}
export default DarkButton

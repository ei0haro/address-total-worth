import React from "react";
import "./button.css";
import Button from 'react-bootstrap/Button';

function GlowingButton({onClickFunction, text, disableIf, size='sm'}) {
    return (
        <Button size={size}  className="button-85" onClick={onClickFunction} disabled={disableIf}>
            {text}
        </Button>
    );
}
export default GlowingButton

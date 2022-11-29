import React from "react";

import Button from 'react-bootstrap/Button';
import {Spinner} from "@primer/react";

function DarkButton({onClickFunction, text, disableIf, size='sm'}) {
    return (
        <Button size={size} variant="dark" onClick={onClickFunction} disabled={disableIf}>
            {disableIf ? <Spinner
                animation="grow"
                role="status"
                aria-hidden="true" variant="light"/> : ""
            }
            {text}
        </Button>
    );
}
export default DarkButton

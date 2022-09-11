import React from "react";

const trashButton = ({clicked}) => {
    return (
        <button onClick={(event) => clicked(event)}
                className="close button-tooltip">
            <span className="lnr lnr-trash"/>
        </button>
    )
}
export default trashButton;
import React, { useEffect, useState, useRef } from "react";

type ButtonPropsType = { sx?: object; handleClick: () => void; buttonText: string };
function Button({ sx, handleClick, buttonText }: ButtonPropsType) {
    return (
        <button style={{ ...sx }} onClick={() => handleClick()}>
            {buttonText}
        </button>
    );
}

export default Button;

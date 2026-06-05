"use client";

import { useEffect, useState } from "react";
import classes from "./ButtonCopy.module.css";

interface ButtonCopyProps {
    inputCode: string;
}

export default function ButtonCopy({ inputCode }: ButtonCopyProps) {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (!isCopied) return;
        const timer = setTimeout(() => {
            setIsCopied(false);
            console.log("timer completed");
        }, 2000);

        return () => clearTimeout(timer);
    }, [isCopied]);

    function handleCodeCopy(code: string) {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
    }
    return (
        <>
            <button
                className={isCopied ? `${classes.button} ${classes.copied}` : classes.button}
                type={"button"}
                onClick={() => handleCodeCopy(inputCode)}
                disabled={isCopied}
            ></button>
        </>
    );
}

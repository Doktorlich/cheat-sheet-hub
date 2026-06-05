"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import classes from "./CodeBlock.module.css";

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = "" }: CodeBlockProps) {
    return (
        <div className={classes["code"]}>
            <SyntaxHighlighter
                language={language}
                style={vs}
                customStyle={{
                    margin: 0,
                    padding: "1.25rem 1rem",
                    backgroundColor: "#f6f8fa",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    border: "1px solid #e1e4e8",
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                    minWidth: "2rem",
                    paddingRight: "1rem",
                    color: "rgba(0, 0, 0, 0.3)",
                    textAlign: "right",
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

import type { Metadata } from "next";
import classes from "./layout.module.css";

export const metadata: Metadata = {
    title: "Cheat Sheets",
    description: "Ultimate developer cheat sheets, quick references, and code syntax guides.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={classes.body}>
                <div className={classes.container}>{children}</div>
            </body>
        </html>
    );
}

import Link from "next/link";

export default function NotFound() {
    return (
        <main className={"not-found"}>
            <Link href={"/"}>← Back</Link>
            <h1>
                Page not found <span>404</span>
            </h1>
            <p>Unfortunately, we could not find the requested page or resource.</p>
        </main>
    );
}

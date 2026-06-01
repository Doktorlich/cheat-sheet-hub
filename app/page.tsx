import classes from "./page.module.css";

export default function Home() {
    return (
        <>
            <div className={classes.search}>SEARCH INPUT</div>
            <div className={classes["stacks-list"]}>LIST ELEMENTS</div>
        </>
    );
}

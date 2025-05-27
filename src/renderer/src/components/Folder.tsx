import { List } from "@mui/material";

function Folder(props) {
    return (
        <nav aria-label="default folder">
            <List>
                {props.files}
            </List>
        </nav>
    )
}

export default Folder;
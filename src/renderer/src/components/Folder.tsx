import { List } from "@mui/material";
import AddFile from "./AddFile";
import { useState } from "react";

function Folder(props) {

    const [files, setFiles] = useState(props.files);

    return (
        <nav aria-label="default folder">
            <List>
                <AddFile files={files} setFiles={setFiles}/>
                {files}
            </List>
        </nav>
    )
}

export default Folder;
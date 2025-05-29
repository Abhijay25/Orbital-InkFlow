import { List } from "@mui/material";
import AddFile from "./AddFile";
import { useState } from "react";
import File from "./File";

export type fileItem = {
    id: String,
    fileName: String
}

interface FolderProps {
    fileItems: fileItem[];
}

function Folder(FolderProps) {

    const [fileItems, setFileItems] = useState<fileItem[]>(FolderProps.fileItems);
    const files = fileItems.map(fileItem => {
        return (
        <File
            textName={fileItem.fileName}
            fileItems={fileItems}
            setFileItems={setFileItems}
            id={fileItem.id}
        />
        )
    })

    return (
        <nav aria-label="default folder">
            <List>
                <AddFile fileItems={fileItems} setFileItems={setFileItems} />
                {files}
            </List>
        </nav>
    )
}

export default Folder;
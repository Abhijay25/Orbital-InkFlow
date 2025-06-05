import { List } from "@mui/material";
import AddFile from "./AddFile";
import { useEffect, useState } from "react";
import File from "./File";
import { EditorRef } from "../Editor";

export type fileItem = {
    id: string,
    fileName: string,
    createdAt: string
}

interface FolderProps {
    fileItems: fileItem[];
    editorRef: React.RefObject<EditorRef | null>;
}

function Folder({ fileItems: initialFileItems, editorRef }: FolderProps) {
    const [fileItems, setFileItems] = useState<fileItem[]>(initialFileItems);

    const loadFiles = async () => {
        const files = await window.electronAPI.getFiles();
        const mappedFiles = files.map(file => ({
            id: file.id,
            fileName: file.name,
            createdAt: file.created_at
        }));
        setFileItems(mappedFiles);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    const files = fileItems.map(fileItem => {
        return (
            <File
                textName={fileItem.fileName}
                fileItems={fileItems}
                setFileItems={setFileItems} // can be removed, 
                id={fileItem.id}
                key={fileItem.id}
                editorRef={editorRef}
                onSave={loadFiles}
            />
        )
    })

    return (
        <nav aria-label="default folder">
            <List>
                <AddFile onSave={loadFiles}/>
                {files}
            </List>
        </nav>
    )
}

export default Folder;
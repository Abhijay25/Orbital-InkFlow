import { Box } from "@mui/material";
import Editor from "./Editor";
import "../styles/Editor.css";
import { useRef } from "react";

// Declare a type for window.electronAPI <- declared under preload/index.js
// This is where we store all the functions that alter database from frontend
declare global {
    interface Window {
        electronAPI: {
            saveContent: (content: string) => Promise<void>;
            saveContentToFile: (file_id: string, content: string) => Promise<void>;
            getLatestContent: () => Promise<string | null>;
            getLatestContentByFile: (file_id: string) => Promise<string | null>;
            saveFile: (file_id: string, name: string) => Promise<{ success: boolean, id: string }>;
            getFiles: () => Promise<Array<{id: string, name: string, created_at: string}>>;
        }
    }
}

interface EditorRef {
    getHTML: () => string;
}

interface ContentProps {
    fileId: string
}

function Content({ fileId }: ContentProps) {

    // Use ref to get instance of the Editor component
    // Can be used in the future
    const editorRef = useRef<EditorRef>(null);

    return (
        // Box container for File System components
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#3b3b3b",
            m: 1, ml: 0.01,
            borderRadius: 1
        }}
        >
            <div className="content-window">
                <Editor ref={editorRef} fileId={fileId}/>
            </div>
        </Box>
    )
}

export default Content;
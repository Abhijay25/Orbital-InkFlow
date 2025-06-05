import { Box } from "@mui/material";
import Editor, { EditorRef } from "./Editor";
import "../styles/Editor.css";

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

interface ContentProps {
    fileId: string;
    editorRef: React.RefObject<EditorRef | null>;
}

function Content({ fileId, editorRef }: ContentProps) {
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
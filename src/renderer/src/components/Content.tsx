import { Box } from "@mui/material";
import Editor from "./Editor"; 
import "../styles/Editor.css";

function Content() {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#3b3b3b",
            m: 1, ml: 0.01,
            borderRadius: 1
        }} // Box container for File System components
        >
            <div className="content-window">
                <Editor />
            </div>
        </Box>
    )
}

export default Content;
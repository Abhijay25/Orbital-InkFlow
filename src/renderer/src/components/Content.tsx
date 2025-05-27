import { Box } from "@mui/material";

function Content() {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey",
            m: 1, ml: 0.01,
            borderRadius: 2
        }} // Box container for File System components
        >
            Content Window
        </Box>
    )
}

export default Content;
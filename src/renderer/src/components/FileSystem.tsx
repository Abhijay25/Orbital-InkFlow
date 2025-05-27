import { Stack } from "@mui/material";


function FileSystem() {
    return (
        <Stack sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey",
            m: 1, mr: 0.01,
            borderRadius: 2
        }} // Box Container for MD Editor components
        >
            File System
        </Stack>
    )
}

export default FileSystem;
import {
    Box,
    Stack,
    List,
    Divider,
} from "@mui/material";

import Folder from "./Folder";


function FileSystem() {
    return (
        <Stack sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            bgcolor: "#3b3b3b",
            m: 1, mr: 0.01,
            borderRadius: 2
        }} // Box Container for MD Editor components
        >
            <List>
                <Box sx={{ width: '100%', maxWidth: 360 }}>

                    <Folder fileItems={[
                        { id: crypto.randomUUID(), fileName: "Home" },
                        { id: crypto.randomUUID(), fileName: "Inbox" }
                    ]}/>

                    <Divider />

                    <Folder fileItems={[]} />

                </Box>
            </List>
        </Stack>
    )
}

export default FileSystem;
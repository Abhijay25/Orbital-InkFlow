import {
    Box,
    Stack,
    List,
    Divider,
} from "@mui/material";
import Folder from "./Folder";
import DailyCalendar from "./DailyCalendar";

function FileSystem() {
    
    return (
        <Stack sx={{
            display: "flex",
            alignItems: "left",
            justifyContent: "space-between",
            bgcolor: "#3b3b3b",
            m: 1, mr: 0.01,
            borderRadius: 1,
            overflow: "auto"
        }} // Box Container for MD Editor components
        >
            <List>
                <Box sx={{ width: '100%', maxWidth: 360 }}>

                    <Divider />

                    <Folder
                        fileItems={[]}
                    />

                </Box>
            </List>
            <DailyCalendar />
        </Stack>
    )
}

export default FileSystem;
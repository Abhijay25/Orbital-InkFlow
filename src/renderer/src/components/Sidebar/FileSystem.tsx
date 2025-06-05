import {
    Box,
    Stack,
    List,
    Divider,
} from "@mui/material";
import Folder from "./Folder";
import DailyCalendar from "./DailyCalendar";
import { EditorRef } from "../Editor";

interface FileSystemProps {
    editorRef: React.RefObject<EditorRef | null>;
}

function FileSystem({ editorRef }: FileSystemProps) {
    return (
        <Stack sx={{
            display: "flex",
            alignItems: "left",
            justifyContent: "space-between",
            bgcolor: "#3b3b3b",
            m: 1, mr: 0.01,
            borderRadius: 1,
            overflow: "auto"
        }}>
            <List>
                <Box sx={{ width: '100%', maxWidth: 360 }}>
                    <Divider />

                    <Folder
                        fileItems={[]}
                        editorRef={editorRef}
                    />
                </Box>
            </List>
            <DailyCalendar />
        </Stack>
    )
}

export default FileSystem;
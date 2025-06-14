import {
    Box,
    Stack,
    List,
    Divider,
} from "@mui/material";
import Folder from "./Folder";
import DailyCalendar from "./DailyCalendar";
import { EditorRef } from "../Editor";

import "../../styles/FileSystem.css"

interface FileSystemProps {
    editorRef: React.RefObject<EditorRef | null>;
}

function FileSystem({ editorRef }: FileSystemProps) {
    return (
        <Stack sx={{
            alignItems: "left",
            justifyContent: "space-between",
            m: 1, mr: 0.01,
        }}
        className="file-system">
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
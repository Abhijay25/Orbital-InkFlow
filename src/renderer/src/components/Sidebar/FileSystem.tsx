import {
    Box,
    Stack,
    List,
    Divider,
} from "@mui/material";
import Folder from "./Folder";
import DailyCalendar from "./DailyCalendar";
import { useState } from "react";
import { EditorRef } from "../Editor";
import SettingsMenu from "./SettingsMenu";

import "../../styles/FileSystem.css"
import DarkLogo from "../../../../../resources/InkFlowBlack.png";
import LightLogo from "../../../../../resources/InkFlowWhite.png";
import LightModeIcon from '@mui/icons-material/LightMode';
import BedtimeSharpIcon from '@mui/icons-material/BedtimeSharp';

interface FileSystemProps {
    editorRef: React.RefObject<EditorRef | null>;
}

function FileSystem({ editorRef }: FileSystemProps) {
    const [isDark, setIsDark] = useState(true);
    const [showSettings, setShowSettings] =useState(false)

    function switchTheme() {
        setIsDark(!isDark)
    }

    function toggleSettings() {
        setShowSettings(!showSettings)
    }
    return (
        <Stack sx={{
            alignItems: "left",
            justifyContent: "space-between",
            m: 1, mr: 0.01,
        }}
            className="file-system">
            <Box>
                <div className="logo-div">
                    <img src={isDark ? DarkLogo : LightLogo}
                        alt="Logo-Placeholder"
                        onError={() => console.error('Failed to Load Logo')}
                        className="inkFlow-logo"
                        onClick={toggleSettings}
                        style={{
                            height: '50px',
                            width: 'auto'
                        }} />
                    {isDark
                        ? <LightModeIcon style={{textAlign: "right"}} onClick={switchTheme}/>
                        : <BedtimeSharpIcon style={{textAlign: "right"}} onClick={switchTheme}/>
                    }
                </div>
                <hr />
                <List className="file-list">
                    <Box>
                        <Divider />

                        <Folder
                            fileItems={[]}
                            editorRef={editorRef}
                        />
                    </Box>
                </List>
            </Box>
            <DailyCalendar />
            {showSettings && <SettingsMenu />}
        </Stack>
    )
}

export default FileSystem;
import {
    Box,
    Stack,
    List,
    Divider,
} from "@mui/material";
import Folder from "./Folder";
import DailyCalendar from "./DailyCalendar";
import { useContext, useState } from "react";
import { EditorRef } from "../Editor";
import SettingsMenu from "./SettingsMenu";
import ModeContext from "../ModeContext";

import "../../styles/FileSystem.css"
import DarkLogo from "../../../../../resources/InkFlowBlack.png";
import LightLogo from "../../../../../resources/InkFlowWhite.png";
import LightModeIcon from '@mui/icons-material/LightMode';
import BedtimeSharpIcon from '@mui/icons-material/BedtimeSharp';

interface FileSystemProps {
    editorRef: React.RefObject<EditorRef | null>;
}

function FileSystem({ editorRef }: FileSystemProps) {
    const [showSettings, setShowSettings] = useState(false)

    function toggleSettings() {
        setShowSettings(!showSettings)
    }

    const modeInfo = useContext(ModeContext);
    
    if (!modeInfo) {
        console.log("ModeContext.Provider is missing");
        throw new Error("ModeContext.Provider is missing");
    }

    function switchTheme() {
        modeInfo?.setDarkTheme(prev => !prev);
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
                    <img src={modeInfo.darkTheme ? DarkLogo : LightLogo}
                        alt="Logo-Placeholder"
                        onError={() => console.error('Failed to Load Logo')}
                        className="inkFlow-logo"
                        onClick={toggleSettings}
                        style={{
                            height: '50px',
                            width: 'auto'
                        }} />
                    {modeInfo.darkTheme
                        ? <LightModeIcon 
                            style={{textAlign: "right", color: "white"}}
                            onClick={switchTheme}/>
                        : <BedtimeSharpIcon 
                            style={{textAlign: "right", color: "black" }}
                            onClick={switchTheme}/>
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
import { Box } from "@mui/material";
import Editor, { EditorRef } from "./Editor";
import { Rnd } from "react-rnd";
import React from "react";

import Timer from "./Timer";
import TimerConfig from "./TimerConfig";
import TimerContext from "./TimerContext";

import "../styles/Editor.css";


// Declare a type for window.electronAPI <- declared under preload/index.js
// This is where we store all the functions that alter database from frontend
// 'global' keyword, make it accessible to all
declare global {
    interface Window {
        electronAPI: {
            saveContentToFile: (file_id: string, content: string) => Promise<void>;
            getLatestContentByFile: (file_id: string) => Promise<string | null>;
            saveFile: (file_id: string, name: string) => Promise<{ success: boolean, id: string }>;
            getFiles: () => Promise<Array<{ id: string, name: string, created_at: string }>>;
            deleteFile: (file_id: string) => Promise<{ success: boolean, id: string }>;
        }
    }
}

interface ContentProps {
    fileId: string;
    editorRef: React.RefObject<EditorRef | null>;
}

function Content({ fileId, editorRef }: ContentProps) {
    const [showSlider, setShowSlider] = React.useState(false);
    const [workMins, setWorkMins] = React.useState(45);
    const [breakMins, setBreakMins] = React.useState(15);
    return (
        // Box container for File System components
        <Box sx={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#3b3b3b",
            m: 1, ml: 0.01,
            borderRadius: 1
        }}
        >
            <div className="content-window">
                <Editor ref={editorRef} fileId={fileId} />
            </div>
            <Rnd default={{
                x: 0,
                y: 0,
                width: 200,
                height: 150,
            }} bounds="parent"
                className="timer-container">
                <TimerContext.Provider value={{
                    workMins,
                    breakMins,
                    setWorkMins,
                    setBreakMins,
                    showSlider,
                    setShowSlider,
                }}>
                    {showSlider ? <TimerConfig /> : <Timer />}
                </TimerContext.Provider>
            </Rnd>
        </Box>
    )
}

export default Content;
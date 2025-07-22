import { Box } from "@mui/material";
import { useState, createContext, useRef, useEffect } from "react";
import { EditorRef } from "./components/Editor";

import Split from "react-split";
import FileSystem from "./components/Sidebar/FileSystem";
import Content from "./components/Content";
import Transcription from "./components/Transcription";
import HomePage from "./components/HomePage";

import ModeContext from "./components/ModeContext";
import HomeContext from "./components/HomeContext";

export type FileIDContextType = {
  fileID: string;
  setFileID: React.Dispatch<React.SetStateAction<string>>;
};

export const FileIDContext = createContext<FileIDContextType>({
  fileID: "",
  setFileID: () => {},
});

function App() {
  const [fileID, setFileID] = useState<string>("");
  const editorRef = useRef<EditorRef>(null);
  const [darkTheme, setDarkTheme] = useState(true);
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkTheme);
    document.body.classList.toggle("light", !darkTheme);
  }, [darkTheme]);

  console.log(fileID);

  return (
    <>
      <ModeContext.Provider value={{
        darkTheme,
        setDarkTheme
      }}>
        <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
        <Split sizes={[14, 86]}
          minSize={[225, 100]}
          maxSize={[300, Infinity]}
          direction="horizontal"
          style={{
            display: "flex",
            height: "100%"
          }}
        >
          <FileIDContext.Provider value={{ fileID, setFileID }}>
            <FileSystem editorRef={editorRef} />
            <HomeContext.Provider value={{ showHome, setShowHome }}>
                {showHome ? <HomePage /> : <Content fileId={fileID} editorRef={editorRef} />}
            </HomeContext.Provider>
          </FileIDContext.Provider>

          <Transcription fileId={fileID} editorRef={editorRef}/>
        </Split>
      </Box>
      </ModeContext.Provider>
    </>
  )
}

export default App;
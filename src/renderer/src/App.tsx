import { Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { EditorRef } from "./components/Editor";
import Split from "react-split";
import FileSystem from "./components/Sidebar/FileSystem";
import Content from "./components/Content";
import ModeContext from "./components/ModeContext";
import { FileIDContext } from "./components/FileIDContext";
import Toolbar from "./components/Toolbar/Toolbar";

function App(): React.ReactElement | null {
  const [fileID, setFileID] = useState<string>("");
  const editorRef = useRef<EditorRef>(null);
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", darkTheme);
    document.body.classList.toggle("light", !darkTheme);
  }, [darkTheme]);

  console.log(fileID);

  return (
    <>
      <ModeContext.Provider
        value={{
          darkTheme,
          setDarkTheme,
        }}
      >
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            position: "relative",
            overscrollBehavior: "none",
          }}
        >
          <Split
            sizes={[14, 86]}
            minSize={[225, 100]}
            maxSize={[300, Infinity]}
            direction="horizontal"
            style={{
              display: "flex",
              height: "100%",
            }}
          >
            <FileIDContext.Provider value={{ fileID, setFileID }}>
              <FileSystem editorRef={editorRef} />
              <Content fileId={fileID} editorRef={editorRef} />
            </FileIDContext.Provider>
            <Toolbar fileId={fileID} editorRef={editorRef} />
          </Split>
        </Box>
      </ModeContext.Provider>
    </>
  );
}

export default App;

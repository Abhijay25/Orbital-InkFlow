import { Box } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { EditorRef } from "./components/Editor";

import Split from "react-split";
import FileSystem from "./components/Sidebar/FileSystem";
import Content from "./components/Content";
import ModeContext from "./components/Context/ModeContext";
import { FileIDContext } from "./components/Context/FileIDContext";
import HomeContext from "./components/Context/HomeContext";
import HomePage from "./components/HomePage";
// import WindowSizeContext from "./components/Context/WindowSizeContext";
// import Toolbar from "./components/Toolbar/Toolbar";

function App(): React.ReactElement | null {
  const [fileID, setFileID] = useState<string>("");
  const editorRef = useRef<EditorRef>(null);
  const [darkTheme, setDarkTheme] = useState(true);
  const [showHome, setShowHome] = useState(false); // Meant to be true

  // const [contentSize, setContentSize] = useState(79.5);
  // const [toolBarSize, setToolBarSize] = useState(6.5);

  useEffect(() => {
    document.body.classList.toggle("dark", darkTheme);
    document.body.classList.toggle("light", !darkTheme);
  }, [darkTheme]);

  console.log(fileID);

  return (
    <div data-testid="app-container">
      <ModeContext.Provider
        value={{
          darkTheme,
          setDarkTheme,
        }}
      >
        {/* <WindowSizeContext.Provider
          value={{
            contentSize,
            toolBarSize,
            setContentSize,
            setToolBarSize,
          }}
        > */}
        <Box
          sx={{
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            position: "relative",
            overscrollBehavior: "none",
          }}
        >
          <HomeContext.Provider value={{ showHome, setShowHome }}>
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

                {showHome ? (
                  <HomePage />
                ) : (
                  <Content fileId={fileID} editorRef={editorRef} />
                )}
                {/* <Toolbar fileId={fileID} editorRef={editorRef} /> */}
              </FileIDContext.Provider>
            </Split>
          </HomeContext.Provider>
        </Box>
        {/* </WindowSizeContext.Provider> */}
      </ModeContext.Provider>
    </div>
  );
}

export default App;

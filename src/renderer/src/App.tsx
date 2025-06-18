import { Box } from "@mui/material";
import { useState, createContext, useRef } from "react";
import { EditorRef } from "./components/Editor";
import Split from "react-split";
import FileSystem from "./components/Sidebar/FileSystem";
import Content from "./components/Content";
import Transcription from "./components/Transcription";

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

  console.log(fileID);

  return (
    <>
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
            <Content fileId={fileID} editorRef={editorRef} />
          </FileIDContext.Provider>

          {/* <Transcription fileId={fileID} editorRef={editorRef}/> */}
        </Split>
        
        
      </Box>
    </>
  )
}

export default App;
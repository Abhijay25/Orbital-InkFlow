import { Box } from "@mui/material";
import Split from "react-split";
import FileSystem from "./components/Sidebar/FileSystem";
import Content from "./components/Content";
import { useState, createContext } from "react";

export type FileIDContextType = {
  fileID: string;
  setFileID: React.Dispatch<React.SetStateAction<string>>;
};

export const FileIDContext = createContext<FileIDContextType>({
  fileID: "",
  setFileID: () => {},
});

function App() {

  const [fileID, setFileID] = useState<string>("")

  console.log(fileID);

  return (
    <>
      <Box sx={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <Split sizes={[14, 86]}
          minSize={[14, 86]}
          direction="horizontal"
          style={{
            display: "flex",
            height: "100%"
          }} // Container Box and Split styling 
        >
          <FileIDContext.Provider value={{ fileID, setFileID }}>
            <FileSystem />
            <Content fileId={fileID}/>
          </FileIDContext.Provider>
        </Split>
      </Box>
    </>
  )
}

export default App;
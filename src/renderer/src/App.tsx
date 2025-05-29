import { Box } from "@mui/material";
import Split from "react-split";
import FileSystem from "./components/FileSystem/FileSystem";
import Content from "./components/Content";

function App() {
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

          <FileSystem /> 
          <Content />
          
        </Split> 
      </Box> 
    </>
  )
}

export default App;
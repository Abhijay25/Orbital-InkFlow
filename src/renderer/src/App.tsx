import { Box } from "@mui/material";
import Split from "react-split";

function App() {
  return (
    <>
      <Box sx = {{ height: "100vh", width: "100vw", overflow: "hidden"}}>
        <Split sizes= {[30, 70]}
        minSize= {200}
        direction= "horizontal"
        style={{ display: "flex", height: "100%"}}
        ></Split>
      </Box>
    </>
  )
}

export default App;
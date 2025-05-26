import { Box, Stack } from "@mui/material";
import Split from "react-split";

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
          }}
        >
          <Stack sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey",
            m: 1, mr: 0.01,
            borderRadius: 2
          }}
          >
            File System
          </Stack>

          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey",
            m: 1, ml: 0.01,
            borderRadius: 2
          }}
          >
            Content Window
          </Box>
        </Split>
      </Box>
    </>
  )
}

export default App;
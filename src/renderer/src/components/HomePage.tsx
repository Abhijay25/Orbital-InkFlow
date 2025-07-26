import { Box } from "@mui/material";

import "../styles/Home.css";

function HomePage(): React.ReactElement | null {
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        m: 1,
        ml: 0.01,
        borderRadius: 1,
      }}
      className="homepage"
    >
        <h1>Welcome Back!</h1>
    </Box>
  )
}

export default HomePage;

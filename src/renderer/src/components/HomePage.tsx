import { Box } from "@mui/material";
import Clock from "react-live-clock";
import "../styles/Home.css";

function HomePage(): React.ReactElement | null {
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="homepage"
    >
        <h1 className="welcome">Welcome Back!</h1>
        <Clock 
          format={'HH:mm:ss'}
          ticking={true}
          className="clock"
          timezone="Asia/Singapore"
        />
        
    </Box>
  )
}

export default HomePage;

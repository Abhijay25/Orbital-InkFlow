import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import moment from "moment";
import "moment-timezone";

import DarkBackground from "../../../../resources/DarkBackground.jpg";
import "../styles/Home.css";

// Custom Clock component to replace react-live-clock
function CustomClock({ format, timezone }: { format: string; timezone: string }) {
  const [time, setTime] = useState(moment().tz(timezone).format(format));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().tz(timezone).format(format));
    }, 1000);

    return () => clearInterval(timer);
  }, [format, timezone]);

  return <span className="clock">{time}</span>;
}

function HomePage(): React.ReactElement | null {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="homepage"
    >
        <h1 className="welcome">Welcome Back!</h1>
        <CustomClock 
          format={'HH:mm:ss'}
          timezone="Asia/Singapore"
        />
        
    </Box>
  )
}

export default HomePage;

import Calendar from "react-calendar";
import "../../styles/Calendar.css";
import { Box } from "@mui/material";

function DailyCalendar(): React.ReactElement | null {
  return (
    <Box sx={{}}>
      <Calendar />
    </Box>
  );
}

export default DailyCalendar;

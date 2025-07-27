import {
  Box,
  Stack,
  List,
  Divider,
  Drawer,
  ListItemIcon,
  ListItemText,
  ListItem,
  ListItemButton,
} from "@mui/material";
import Folder from "./Folder";
import DailyCalendar from "./DailyCalendar";
import { useContext, useState } from "react";
import { EditorRef } from "../Editor";
import ModeContext from "../Context/ModeContext";
import HomeContext from "../Context/HomeContext";

import "../../styles/FileSystem.css";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import DarkLogo from "../../../../../resources/InkFlowBlack.png";
import LightLogo from "../../../../../resources/InkFlowWhite.png";
import LightModeIcon from "@mui/icons-material/LightMode";
import BedtimeSharpIcon from "@mui/icons-material/BedtimeSharp";
import TimerSharpIcon from '@mui/icons-material/TimerSharp';
import HideTimerContext from "../Context/HideTimerContext";

interface FileSystemProps {
  editorRef: React.RefObject<EditorRef | null>;
}

function FileSystem({ editorRef }: FileSystemProps): React.ReactElement | null {
  const [open, setOpen] = useState(false);

  const modeInfo = useContext(ModeContext);
  const homeInfo = useContext(HomeContext);
  const timerInfo = useContext(HideTimerContext);

  if(!homeInfo) {
    console.log("Unable to track Homepage state");
    throw new Error("HomeContext.Provider is missing");
  }

  if (!modeInfo) {
    console.log("ModeContext.Provider is missing");
    throw new Error("ModeContext.Provider is missing");
  }

  if (!timerInfo) {
    console.log("Unable to track HideTimer state");
    throw new Error ("HideTimerContent.Provider is missing");
  }

  function switchTheme(): void {
    modeInfo?.setDarkTheme((prev) => !prev);
  }

  function toggleTimer(): void {
    timerInfo?.setHideTimer((prev) => !prev);
  }

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const ThemeSwitch = (
    <ListItemButton onClick={switchTheme}>
      <ListItemIcon>
        {modeInfo.darkTheme ? <LightModeIcon /> : <BedtimeSharpIcon />}
      </ListItemIcon>
      <ListItemText primary="Toggle Theme" />
    </ListItemButton>
  );

  const TimerToggle = (
    <ListItemButton onClick={toggleTimer}>
      <ListItemIcon><TimerSharpIcon /></ListItemIcon>
      <ListItemText primary="Show Timer" />
    </ListItemButton>
  );

  const DrawerList = (
    <Box
      sx={{ width: "14vw", minWidth: 225 }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>{ThemeSwitch}</ListItem>
        <ListItem disablePadding>{TimerToggle}</ListItem>
      </List>
      <Divider />
    </Box>
  );

  const openHome = (): void => {
    homeInfo?.setShowHome(true);
  }

  return (
    <Stack
      sx={{
        alignItems: "left",
        justifyContent: "space-between",
        m: 1,
        mr: 0.01,
      }}
      className="file-system"
    >
      <Box>
        <div className="logo-div">
          <img
            src={modeInfo.darkTheme ? DarkLogo : LightLogo}
            alt="Logo-Placeholder"
            onError={() => console.error("Failed to Load Logo")}
            className="inkFlow-logo"
            onClick={openHome}
            data-testid="inkFlow-logo"
            style={{
              height: "50px",
              width: "auto",
            }}
          />

          <MenuSharpIcon onClick={toggleDrawer(true)} />
          <Drawer
            sx={{ width: "14vw", minWidth: 225 }}
            open={open}
            onClose={toggleDrawer(false)}
            className="toolbar"
          >
            {DrawerList}
          </Drawer>
        </div>
        <hr />
        <List className="file-list">
          <Box>
            <Divider />
            <Folder fileItems={[]} editorRef={editorRef} />
          </Box>
        </List>
      </Box>
      <DailyCalendar />
    </Stack>
  );
}

export default FileSystem;

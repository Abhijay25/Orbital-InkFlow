import { createContext } from "react";

type ThemeType = {
    darkTheme: boolean;
    setDarkTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModeContext = createContext<ThemeType | undefined>(undefined)

export default ModeContext
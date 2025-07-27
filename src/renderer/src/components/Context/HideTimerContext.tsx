import { createContext } from "react";

type TimerType = {
  hideTimer: boolean;
  setHideTimer: React.Dispatch<React.SetStateAction<boolean>>;
};

const HideTimerContext = createContext<TimerType | undefined>(undefined);

export default HideTimerContext;

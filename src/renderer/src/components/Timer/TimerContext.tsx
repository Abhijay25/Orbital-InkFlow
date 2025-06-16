import { createContext } from "react";

type TimerType = {
  workMins: number;
  breakMins: number;
  setWorkMins: React.Dispatch<React.SetStateAction<number>>;
  setBreakMins: React.Dispatch<React.SetStateAction<number>>;
  showSlider: boolean;
  setShowSlider: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimerContext = createContext<TimerType | null>(null);

export default TimerContext;
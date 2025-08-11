import { createContext } from "react";

type CountdownType = {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
};

const TimeLeftContext = createContext<CountdownType | undefined>(undefined);

export default TimeLeftContext;

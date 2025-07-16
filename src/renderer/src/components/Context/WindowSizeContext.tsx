import { createContext } from "react";

type windowProps = {
  contentSize: number;
  toolBarSize: number;
  setContentSize: React.Dispatch<React.SetStateAction<number>>;
  setToolBarSize: React.Dispatch<React.SetStateAction<number>>;
};

const WindowSizeContext = createContext<windowProps | undefined>(undefined);

export default WindowSizeContext;

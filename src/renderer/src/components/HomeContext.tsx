import { createContext } from "react";

type HomeType = {
    showHome: boolean;
    setShowHome: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeContext = createContext<HomeType | undefined>(undefined);

export default HomeContext
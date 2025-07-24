import { createContext } from "react";

export type FileIDContextType = {
  fileID: string;
  setFileID: React.Dispatch<React.SetStateAction<string>>;
};

export const FileIDContext = createContext<FileIDContextType>({
  fileID: "",
  setFileID: () => {},
});

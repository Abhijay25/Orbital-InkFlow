import { Box } from "@mui/material";
import Transcription from "./Transcription";
import ChatBot from "./ChatBot";
import { EditorRef } from "../Editor";

interface ToolbarProps {
  fileId: string;
  editorRef: React.RefObject<EditorRef | null>;
}

function Toolbar({
  fileId,
  editorRef,
}: ToolbarProps): React.ReactElement | null {
  return (
    <Box
      component="section"
      sx={{
        resize: "none",
        m: 1,
        ml: 0.01,
      }}
      className="tool-bar"
    >
      <Transcription fileId={fileId} editorRef={editorRef} />
      <ChatBot />
    </Box>
  );
}

export default Toolbar;

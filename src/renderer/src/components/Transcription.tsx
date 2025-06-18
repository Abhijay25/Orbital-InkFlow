import { useState } from 'react';
import { EditorRef } from "./Editor";
import micRed from "../../../../resources/micRed.png";
import micBlue from "../../../../resources/micBlue.png";
import { Box } from '@mui/material';

interface TranscriptionProps {
  fileId: string;
  editorRef: React.RefObject<EditorRef | null>;
}

function Transcription({ fileId, editorRef }: TranscriptionProps) {

  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = async () => {
    try {
      if (!isRecording) {
        await window.electronAPI.transcription.start();
        setIsRecording(true);
      } else {
        await window.electronAPI.transcription.stop();

        // Merge transcript to the editor
        let content = "";
        content += await window.electronAPI.getLatestContentByFile(fileId);
        content += await window.electronAPI.transcription.getTranscript();
        console.log(content);
        await window.electronAPI.saveContentToFile(fileId, content);
        const savedContent = await window.electronAPI.getLatestContentByFile(fileId);
        if (editorRef.current && savedContent) {
          editorRef.current.commands.setContent(savedContent);
        }
        setIsRecording(false);
      }
    } catch (error) {
      console.error('Failed to toggle recording:', error);
    }
  };

  return (
    <>
      <Box
        component="img"
        src={isRecording ? micBlue : micRed}
        sx={{
          width: 50,
          height: 50,
          cursor: "pointer",
          transform: "translate(-8px, 20px)",
        }}
        onClick={handleToggleRecording}
      />
    </>
  );
};

export default Transcription; 
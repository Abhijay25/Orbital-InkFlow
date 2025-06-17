import { useState } from 'react';
import { EditorRef } from "./Editor";

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
      <button onClick={handleToggleRecording}>Toggle Record</button>
    </>
  );
};

export default Transcription; 
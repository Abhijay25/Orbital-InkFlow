import * as React from "react";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import addFileImage from "../../../../../resources/add-file.png";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { EditorRef } from "../Editor";

interface AddFileProps {
  onSave: () => void,
  editorRef: React.RefObject<EditorRef | null>
}

// Button to add a file
function AddFile({ onSave, editorRef }: AddFileProps): React.ReactElement | null {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [inputValue, setInputValue] = useState<string>("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    setInputValue("");
  };

  const open = Boolean(anchorEl);

  const id = open ? "simple-popover" : undefined;

  // Handles and update our inputValue under TextField
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(event.target.value);
  };

  // Enables "Enter" to key in our textName
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.key === "Enter" && inputValue.trim()) {
      event.preventDefault();
      const fileID = crypto.randomUUID();
      await window.electronAPI.saveFile(fileID, inputValue);
      await window.electronAPI.saveContentToFile(fileID, " ");
      if (editorRef.current) {
        editorRef.current.commands.setContent(" ");
      }
      onSave();
      handleClose();
    }
  };

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        <img
          src={addFileImage}
          style={{
            width: "20px",
            height: "auto",
          }}
        />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div style={{ padding: "8px" }}>
          <TextField
            autoFocus
            id="standard-basic"
            label="New Note"
            variant="standard"
            value={inputValue}
            size="small"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </Popover>
    </div>
  );
}

export default AddFile;

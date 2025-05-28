import * as React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import addFileImage from "../../../../resources/add-file.png";
import TextField from '@mui/material/TextField';
import File from './File';
import { useState } from 'react';

// Button to add a file
function AddFile(props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = open ? 'simple-popover' : undefined;

  const [inputValue, setInputValue] = useState<String>("");

  // Handles and update our inputValue under TextField
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Enables "Enter" to key in our textName
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        props.setFiles([...props.files, <File textName={inputValue} />]);
        setInputValue("");
    }
  };

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        <img src={addFileImage} style={{ width: '20px', height: 'auto' }}/>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <TextField 
            id="standard-basic" 
            label="New Note" 
            variant="standard" 
            value={inputValue}
            size="small" 
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
      </Popover>
    </div>
  );
}




export default AddFile;
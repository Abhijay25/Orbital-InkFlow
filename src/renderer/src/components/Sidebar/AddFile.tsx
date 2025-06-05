import * as React from 'react';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import addFileImage from "../../../../../resources/add-file.png";
import TextField from '@mui/material/TextField';
import { useState } from 'react';

interface AddFileProps {
    onSave: () => void;
}

// Button to add a file
function AddFile({ onSave }: AddFileProps) {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [inputValue, setInputValue] = useState<string>("");

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setInputValue("");
    };

    const open = Boolean(anchorEl);

    const id = open ? 'simple-popover' : undefined;

    // Handles and update our inputValue under TextField
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // Enables "Enter" to key in our textName
    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim()) {
            event.preventDefault();
            await window.electronAPI.saveFile(crypto.randomUUID(), inputValue);
            onSave();
            handleClose();
        }
    };

    return (
        <div>
            <Button
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
            >
                <img
                    src={addFileImage}
                    style={{
                        width: '20px',
                        height: 'auto',
                    }}
                />
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
                <div style={{ padding: '8px' }}>
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
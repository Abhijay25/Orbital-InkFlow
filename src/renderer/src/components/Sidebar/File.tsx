import { ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import { useState, useContext } from "react";
import { fileItem } from "./Folder";
import { FileIDContext } from "@renderer/App";
import { EditorRef } from "../Editor";

interface FileProps {
    id: string;
    textName: string;
    fileItems: fileItem[];
    setFileItems: React.Dispatch<React.SetStateAction<fileItem[]>>;
    editorRef: React.RefObject<EditorRef | null>;
    onSave: () => void;
}

function File({ id, textName, setFileItems, editorRef, onSave }: FileProps) {

    const key = id;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const { setFileID } = useContext(FileIDContext);

    // Upon clicking onto this file tab, content:string has to be retrieved from database, then loaded into Editor
    // At the same time, update fileId within editor, so the content can be saved with respect to fileId
    const handleClick = async () => {
        const content = await window.electronAPI.getLatestContentByFile(key);
        if (content && editorRef.current) {
            editorRef.current.commands.setContent(content);
        }
        setFileID(key);
    }

    const handleRightClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        await window.electronAPI.deleteFile(key);
        onSave();
        setAnchorEl(null);
    }

    return (
        <ListItem disablePadding>
            <ListItemButton
                id="basic-button"
                component="button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                onContextMenu={handleRightClick}
            >
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={textName} />
            </ListItemButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </ListItem >
    )
}

export default File;

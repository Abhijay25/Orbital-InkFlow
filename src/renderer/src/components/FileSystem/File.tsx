import { ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import { useState, useContext} from "react";
import { fileItem } from "./Folder";
import { FileIDContext } from "@renderer/App";

interface FileProps {
    id: string;
    textName: string;
    fileItems: fileItem[];
    setFileItems: React.Dispatch<React.SetStateAction<fileItem[]>>;
}

function File({id, textName, fileItems, setFileItems}: FileProps) {

    const key = id;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const { setFileID } = useContext(FileIDContext);

    const handleClick = () => {
        setFileID(key);
        console.log(key);
    }

    const handleRightClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        setFileItems(prevFileItems => prevFileItems.filter(item => item.id != key))
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
                sx={{
                    height: {
                        xs: 40,
                        sm: 48,
                        md: 56,
                        lg: 64,
                    },
                    px: {
                        xs: 1,
                        sm: 2,
                        md: 3,
                    },
                }}
            >
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={textName} primaryTypographyProps={{
                    fontSize: {
                        xs: '0.8rem',
                        sm: '1rem',
                        md: '1.2rem',
                    },
                }} />
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

import { ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import { useState } from "react";
import { fileItem } from "./Folder";

interface FileProps {
    id: String;
    textName: String;
    fileItems: fileItem[];
    setFileItems: React.Dispatch<React.SetStateAction<fileItem[]>>;
}

function File({id, textName, fileItems, setFileItems}: FileProps) {

    const key = id;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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

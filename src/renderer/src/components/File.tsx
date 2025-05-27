import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';

function File(props) {
    return (
        <ListItem disablePadding>
            <ListItemButton sx={{
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
            }}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={props.textName} primaryTypographyProps={{
                    fontSize: {
                        xs: '0.8rem',
                        sm: '1rem',
                        md: '1.2rem',
                    },
                }} />
            </ListItemButton>
        </ListItem >
    )
}

export default File;
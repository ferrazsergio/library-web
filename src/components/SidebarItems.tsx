import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';

function SidebarItems() {
    return (
        <>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard">
                    <ListItemIcon>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/books">
                    <ListItemIcon>
                        <BookIcon />
                    </ListItemIcon>
                    <ListItemText primary="Livros" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/authors">
                    <ListItemIcon>
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary="Autores" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/categories">
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText primary="Categorias" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/loans">
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Empréstimos" />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/users">
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Usuários" />
                </ListItemButton>
            </ListItem>
        </>
    );
}

export default SidebarItems;
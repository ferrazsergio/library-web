import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';

const items = [
    {
        to: "/dashboard",
        icon: <DashboardIcon />,
        label: "Dashboard",
    },
    {
        to: "/books",
        icon: <BookIcon />,
        label: "Livros",
    },
    {
        to: "/authors",
        icon: <PersonIcon />,
        label: "Autores",
    },
    {
        to: "/categories",
        icon: <CategoryIcon />,
        label: "Categorias",
    },
    {
        to: "/loans",
        icon: <AssignmentIcon />,
        label: "Empréstimos",
    },
    {
        to: "/users",
        icon: <PeopleIcon />,
        label: "Usuários",
    },
];

const SidebarItems: React.FC = () => {
    const location = useLocation();

    return (
        <>
            {items.map(({ to, icon, label }) => (
                <ListItem key={to} disablePadding>
                    <Tooltip title={label} placement="right" arrow>
                        <ListItemButton
                            component={Link}
                            to={to}
                            selected={location.pathname.startsWith(to)}
                            sx={{
                                borderRadius: 2,
                                my: 0.5,
                                ...(location.pathname.startsWith(to) && {
                                    bgcolor: 'action.selected',
                                }),
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 38 }}>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            ))}
        </>
    );
};

export default SidebarItems;
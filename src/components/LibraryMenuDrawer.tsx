import React from "react";
import {
    Drawer,
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";

type LibraryMenuDrawerProps = {
    open: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
    currentPath: string;
};

const sections = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="large" />, path: "/dashboard" },
    { label: "Livros", icon: <BookIcon fontSize="large" />, path: "/books" },
    { label: "Autores", icon: <PeopleIcon fontSize="large" />, path: "/authors" },
    { label: "Categorias", icon: <CategoryIcon fontSize="large" />, path: "/categories" },
    { label: "Empréstimos", icon: <AssignmentIcon fontSize="large" />, path: "/loans" },
    { label: "Usuários", icon: <PersonIcon fontSize="large" />, path: "/users" }
];

export default function LibraryMenuDrawer({ open, onClose, onNavigate, currentPath }: LibraryMenuDrawerProps) {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 340, p: 0, bgcolor: "background.default" }
            }}
        >
            <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Biblioteca
                </Typography>
            </Box>
            <List>
                {sections.map((section) => (
                    <ListItemButton
                        key={section.label}
                        selected={currentPath.startsWith(section.path)}
                        onClick={() => {
                            onNavigate(section.path);
                            onClose();
                        }}
                        sx={{
                            borderRadius: 2,
                            mx: 2,
                            my: 1,
                            py: 2,
                            bgcolor: currentPath.startsWith(section.path) ? "primary.light" : "transparent"
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 44 }}>
                            {section.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    {section.label}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}
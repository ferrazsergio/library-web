import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Avatar, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UserMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (!user) return null;

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleProfile = () => {
        handleClose();
        navigate("/profile");
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate("/login");
    };

    const avatarSrc = user.avatarUrl
        ? user.avatarUrl + (user.updatedAt ? `?t=${new Date(user.updatedAt).getTime()}` : "")
        : undefined;
    return (
        <>
            <IconButton size="large" edge="end" color="inherit" onClick={handleMenu}>
                <Avatar
                    src={avatarSrc}
                    sx={{ width: 32, height: 32 }}
                    alt={user.name}
                >
                    {(!avatarSrc && user.name) ? user.name[0].toUpperCase() : <AccountCircleIcon />}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem disabled>
                    <Typography variant="subtitle1">{user.name}</Typography>
                </MenuItem>
                <MenuItem disabled>
                    <Typography variant="body2">{user.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleProfile}>Meu Perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
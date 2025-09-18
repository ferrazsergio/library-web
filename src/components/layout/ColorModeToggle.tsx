import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useColorMode } from "../../contexts/ColorModeContext";

const ColorModeToggle: React.FC = () => {
    const { mode, toggleColorMode } = useColorMode();

    return (
        <Tooltip title={mode === "dark" ? "Modo claro" : "Modo escuro"}>
            <IconButton onClick={toggleColorMode} color="inherit" size="large">
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
        </Tooltip>
    );
};

export default ColorModeToggle; // <<<<<<<<<<<
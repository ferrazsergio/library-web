import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestoreIcon from "@mui/icons-material/Restore";
import { useFontSize } from "./contexts/FontSizeContext";

const AccessibilityFontButtons: React.FC = () => {
    const { increaseFont, decreaseFont, resetFont } = useFontSize();

    return (
        <>
            <Tooltip title="Aumentar fonte">
                <IconButton color="inherit" aria-label="Aumentar fonte" onClick={increaseFont} size="large">
                    <AddIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Diminuir fonte">
                <IconButton color="inherit" aria-label="Diminuir fonte" onClick={decreaseFont} size="large">
                    <RemoveIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Restaurar fonte padrão">
                <IconButton color="inherit" aria-label="Restaurar fonte padrão" onClick={resetFont} size="large">
                    <RestoreIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </>
    );
};

export default AccessibilityFontButtons;
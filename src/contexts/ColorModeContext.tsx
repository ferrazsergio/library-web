import React, { createContext, useMemo, useState, useContext } from "react";
import { ThemeProvider, createTheme, PaletteMode } from "@mui/material";
import lightTheme from "../theme/lightTheme";
import darkTheme from "../theme/darkTheme";

interface ColorModeContextProps {
    mode: PaletteMode;
    toggleColorMode: () => void;
    theme: ReturnType<typeof createTheme>;
}

const ColorModeContext = createContext<ColorModeContextProps | undefined>(undefined);

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<PaletteMode>("light");

    const toggleColorMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

    const theme = useMemo(() => createTheme(mode === "light" ? lightTheme : darkTheme), [mode]);

    return (
        <ColorModeContext.Provider value={{ mode, toggleColorMode, theme }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export const useColorMode = () => {
    const context = useContext(ColorModeContext);
    if (!context) throw new Error("useColorMode must be used within a ColorModeProvider");
    return context;
};
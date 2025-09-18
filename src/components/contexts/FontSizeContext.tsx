import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import lightTheme from "../../theme/lightTheme";
import darkTheme from "../../theme/darkTheme";
import { useColorMode } from "./ColorModeContext";

type FontSizeContextProps = {
    fontSize: number;
    increaseFont: () => void;
    decreaseFont: () => void;
    resetFont: () => void;
};

const FontSizeContext = createContext<FontSizeContextProps | undefined>(undefined);

export const FontSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { mode } = useColorMode();
    const [fontSize, setFontSize] = useState(1);

    const increaseFont = () => setFontSize((s) => Math.min(s + 0.1, 1.5));
    const decreaseFont = () => setFontSize((s) => Math.max(s - 0.1, 0.8));
    const resetFont = () => setFontSize(1);

    // Corrigido: usa createTheme para gerar novo tema MUI válido
    const theme = useMemo<Theme>(() => {
        const baseTheme = mode === "light" ? lightTheme : darkTheme;
        return createTheme({
            ...baseTheme,
            typography: {
                ...baseTheme.typography,
                fontSize: 16 * fontSize,
            },
        });
    }, [fontSize, mode]);

    return (
        <FontSizeContext.Provider value={{ fontSize, increaseFont, decreaseFont, resetFont }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </FontSizeContext.Provider>
    );
};

export const useFontSize = () => {
    const ctx = useContext(FontSizeContext);
    if (!ctx) throw new Error("useFontSize must be used within a FontSizeProvider");
    return ctx;
};
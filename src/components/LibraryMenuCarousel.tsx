import React from "react";
import { Drawer, Box, Typography, useTheme, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

type LibraryMenuCarouselProps = {
    open: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
};

const sections = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="large" />, path: "/dashboard" },
    { label: "Livros", icon: <BookIcon fontSize="large" />, path: "/livros" },
    { label: "Autores", icon: <PeopleIcon fontSize="large" />, path: "/autores" },
    { label: "Categorias", icon: <CategoryIcon fontSize="large" />, path: "/categorias" },
    { label: "Emprestimos", icon: <AssignmentIcon fontSize="large" />, path: "/emprestimos" },
    { label: "Usuários", icon: <PeopleIcon fontSize="large" />, path: "/usuarios" }
];

export default function LibraryMenuCarousel({ open, onClose, onNavigate }: LibraryMenuCarouselProps) {
    const theme = useTheme();

    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 350, p: 3, bgcolor: "background.default" }
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                Biblioteca
            </Typography>
            <Swiper
                navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                }}
                spaceBetween={20}
                slidesPerView={1}
            >
                {sections.map((section) => (
                    <SwiperSlide key={section.label}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="250px"
                            onClick={() => onNavigate(section.path)}
                            sx={{ cursor: "pointer" }}
                        >
                            {section.icon}
                            <Typography variant="h5" sx={{ mt: 2 }}>
                                {section.label}
                            </Typography>
                        </Box>
                    </SwiperSlide>
                ))}
                <div className="swiper-button-prev">
                    <IconButton><ChevronLeftIcon /></IconButton>
                </div>
                <div className="swiper-button-next">
                    <IconButton><ChevronRightIcon /></IconButton>
                </div>
            </Swiper>
        </Drawer>
    );
}
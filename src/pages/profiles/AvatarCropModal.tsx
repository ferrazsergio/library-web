import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarCropModalProps {
    open: boolean;
    onClose: () => void;
    onCropComplete: (croppedFile: File) => void;
    selectedFile: File | null;
    uploading: boolean;
}

const AvatarCropModal: React.FC<AvatarCropModalProps> = ({
                                                             open,
                                                             onClose,
                                                             onCropComplete,
                                                             selectedFile,
                                                             uploading
                                                         }) => {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0,
    });

    const [imageUrl, setImageUrl] = useState<string>('');
    const imgRef = useRef<HTMLImageElement | null>(null);

    React.useEffect(() => {
        if (selectedFile && open) {
            const url = URL.createObjectURL(selectedFile);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [selectedFile, open]);

    const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = crop.width * scaleX;
            canvas.height = crop.height * scaleY;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(
                    image,
                    crop.x * scaleX,
                    crop.y * scaleY,
                    crop.width * scaleX,
                    crop.height * scaleY,
                    0,
                    0,
                    crop.width * scaleX,
                    crop.height * scaleY
                );

                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'avatar.png', { type: 'image/png' });
                        resolve(file);
                    }
                }, 'image/png', 1);
            }
        });
    };

    const handleCropComplete = async () => {
        if (imgRef.current && crop.width && crop.height) {
            const croppedFile = await getCroppedImg(imgRef.current, crop);
            onCropComplete(croppedFile);
        }
    };

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;

        // Define crop inicial centralizado e circular
        const size = Math.min(width, height);
        const x = (width - size) / 2;
        const y = (height - size) / 2;

        setCrop({
            unit: 'px',
            width: size,
            height: size,
            x,
            y,
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Recortar Foto do Perfil</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    {imageUrl && (
                        <ReactCrop
                            crop={crop}
                            onChange={(newCrop) => setCrop(newCrop)}
                            aspect={1}
                            circularCrop
                        >
                            <img
                                ref={imgRef}
                                alt="Crop preview"
                                src={imageUrl}
                                onLoad={handleImageLoad}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '400px',
                                    objectFit: 'contain'
                                }}
                            />
                        </ReactCrop>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={uploading}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleCropComplete}
                    variant="contained"
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={20} /> : null}
                >
                    {uploading ? 'Enviando...' : 'Recortar e Enviar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AvatarCropModal;
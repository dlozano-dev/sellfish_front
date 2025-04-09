import  { useContext, useState, useCallback } from "react";
import { Header } from "../header/Header";
import { HOSTNAME } from "../../utils/Constants";
import { ProfilePictureContext, UserIdContext } from "../../Navigation";
import { Button } from "primereact/button";
import axios from "axios";
import Cropper from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Dialog } from "primereact/dialog";
import Slider from "@mui/material/Slider";
import getCroppedImg from "../core/cropImage"; // helper function (added below)

export const Settings = () => {
    const { setProfilePicture } = useContext(ProfilePictureContext)!;
    const { userId } = useContext(UserIdContext)!;

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [loading, setIsLoading] = useState(false);
    const [showCropper, setShowCropper] = useState(false);

    // Dropzone config
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });

    const onCropComplete = useCallback((_: any, croppedPixels: any) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const cropImage = async () => {
        try {
            const croppedBase64 = await getCroppedImg(imageSrc!, croppedAreaPixels, 1080, 1080);
            setCroppedImage(croppedBase64);
            setShowCropper(false);
        } catch (e) {
            console.error("Crop failed", e);
        }
    };

    const uploadPicture = async () => {
        try {
            if (!croppedImage) return;

            setIsLoading(true);
            const base64 = croppedImage.split(',')[1];

            const response = await axios.post(`${HOSTNAME}/saveProfilePicture`, {
                userId: userId,
                picture: base64,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const data = response.data;
            setProfilePicture(data);
        } catch (error) {
            console.error("Error uploading picture:", error); // TODO: replace with error snackbar
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen">
            <Header />
            <div className="w-full flex flex-col justify-center items-center gap-4 p-4">

                <div {...getRootProps()} className="border-2 border-dashed p-10 rounded-md cursor-pointer text-center w-[300px]">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the image here...</p>
                    ) : (
                        <p>Drag 'n' drop an image here, or click to select one</p>
                    )}
                </div>

                {croppedImage && (
                    <div className="flex flex-col items-center gap-2">
                        <img src={croppedImage} alt="Cropped" width={250} />
                        <Button label="Remove" icon="pi pi-times" severity="secondary" onClick={() => setCroppedImage(null)} />
                    </div>
                )}

                <Button label="Submit" icon="pi pi-check" loading={loading} onClick={uploadPicture} disabled={!croppedImage} />
            </div>

            <Dialog header="Crop Image" visible={showCropper} modal style={{ width: '90vw', maxWidth: '600px' }} onHide={() => setShowCropper(false)}>
                <div className="relative w-full h-[400px] bg-black">
                    <Cropper
                        image={imageSrc!}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        objectFit="contain" // 🔥 esto mantiene el tamaño de imagen original dentro del crop
                    />
                </div>
                <div className="p-4">
                    <label>Zoom</label>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(_, val) => setZoom(val as number)}
                    />
                    <Button label="Crop" icon="pi pi-check" onClick={cropImage} className="mt-2" />
                </div>
            </Dialog>
        </div>
    );
};

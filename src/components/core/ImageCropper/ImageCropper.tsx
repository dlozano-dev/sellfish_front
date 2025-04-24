import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "primereact/button";

type ImageCropperProps = {
    image: string;
    onCropDone: (croppedAreaPixels: Area) => void;
    onCropCancel: () => void;
};

export const ImageCropper = ({ image, onCropDone, onCropCancel }: ImageCropperProps) => {
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
        // Store the cropped area in pixels
        setCroppedArea(croppedAreaPixels);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            {/* Cropper area */}
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: {
                            borderRadius: "1rem",
                        },
                    }}
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button label="Cancel" severity="secondary" onClick={onCropCancel} />
                    <Button
                        label="Crop & Apply"
                        icon="pi pi-check"
                        onClick={() => {
                            if (croppedArea) onCropDone(croppedArea);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
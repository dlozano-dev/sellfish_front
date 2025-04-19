import {useContext, useState, useCallback, useRef} from "react";
import { Header } from "../header/Header";
import { HOSTNAME } from "../../utils/Constants";
import {EmailContext, ProfilePictureContext, UserContext, UserIdContext} from "../../Navigation";
import { Button } from "primereact/button";
import axios from "axios";
import Cropper, {Area} from "react-easy-crop";
import { useDropzone } from "react-dropzone";
import { Dialog } from "primereact/dialog";
import Slider from "@mui/material/Slider";
import getCroppedImg from "../core/cropImage";
import {InputText} from "primereact/inputtext";
import {Avatar} from "primereact/avatar";
import {Toast} from "primereact/toast";

export const Settings = () => {
    const { profilePicture, setProfilePicture } = useContext(ProfilePictureContext)!;
    const { userId } = useContext(UserIdContext)!;
    const { user } = useContext(UserContext)!;
    const { email, setEmail } = useContext(EmailContext)!;

    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedImage, setCroppedImage] = useState(profilePicture);
    const [loading, setIsLoading] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [newEmail, setNewEmail] = useState(email);
    const toast = useRef<Toast>(null);

    const showSuccess = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'success', summary: 'Success', detail:message, life: 3000});
    }

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'error', summary: 'Error', detail:message, life: 3000});
    }

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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });

    const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const cropImage = async () => {
        try {
            const croppedBase64 = await getCroppedImg(imageSrc!, croppedAreaPixels!, 1080, 1080);
            setCroppedImage(croppedBase64.split(',')[1]);
            setShowCropper(false);
        } catch (e) {
            console.error("Crop failed", e);
        }
    };

    const applyChanges = async () => {
        try {
            setIsLoading(true);

            // Upload new profile picture if changed
            if (profilePicture !== croppedImage) {
                const response = await axios.post(`${HOSTNAME}/saveProfilePicture`, {
                    userId: userId,
                    picture: croppedImage,
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = response.data;
                setProfilePicture(data);
            }

            // Update email if changed
            if (email !== newEmail) {
                await axios.post(`${HOSTNAME}/updateEmail`, {
                    userId: userId,
                    email: newEmail,
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                setEmail(newEmail);
            }

            showSuccess("User data has been updated successfully!");
        } catch {
            showError("Error updating user data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen">
            <Header />
            <Toast ref={toast} />

            <div
                className="w-1/4 mx-auto flex flex-col justify-center items-center gap-4 p-10 bg-white rounded-lg cursor-pointer text-stone-700">
                {/* Avatar image */}
                <div {...getRootProps()} className='hover:opacity-80'>
                    <input {...getInputProps()} />
                    {croppedImage != null ?
                        <Avatar
                            image={`data:image/png;base64,${croppedImage}`}
                            size="xlarge"
                            shape="circle"
                            className="w-full h-full"
                        />
                    :
                        <Avatar
                            icon="pi pi-user"
                            size="xlarge"
                            shape="circle"
                            className='shadow-md rounded-md mx-3'
                            style={{backgroundColor: '#ffffff', color: '#5e5e5e'}}
                        />
                    }
                </div>

                <h1 className='text-2xl'>{user}</h1>

                {/* Avatar image */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">Username</label>
                    <InputText id="username" disabled value={user} aria-describedby="username-help"/>
                    <small id="username-help">
                        Username cannot be changed.
                    </small>
                </div>

                {/* Avatar image */}
                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                </div>

                <Button label="Submit" icon="pi pi-check" loading={loading} onClick={applyChanges} disabled={profilePicture === croppedImage && email === newEmail}/>
            </div>

            <Dialog header="Crop Image" visible={showCropper} modal style={{width: '90vw', maxWidth: '600px'}} onHide={() => setShowCropper(false)}>
                <div className="relative w-full h-[400px] bg-black">
                    <Cropper
                        image={imageSrc!}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        objectFit="contain"
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
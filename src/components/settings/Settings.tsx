import React, {useContext, useState, useRef} from "react";
import {EMPTY, HOSTNAME} from "../../utils/Constants";
import {EmailContext, ProfilePictureContext, UserContext, UserIdContext} from "../../Navigation";
import { Button } from "primereact/button";
import axios from "axios";
import {Area} from "react-easy-crop";
import {InputText} from "primereact/inputtext";
import {Avatar} from "primereact/avatar";
import {Toast} from "primereact/toast";
import {ImageCropper} from "../core/ImageCropper/ImageCropper.tsx";
import {useTranslation} from "react-i18next";

export const Settings = () => {
    const { profilePicture, setProfilePicture } = useContext(ProfilePictureContext)!;
    const { userId } = useContext(UserIdContext)!;
    const { user } = useContext(UserContext)!;
    const { email, setEmail } = useContext(EmailContext)!;
    const [croppedImage, setCroppedImage] = useState(profilePicture);
    const [loading, setIsLoading] = useState(false);
    const [newEmail, setNewEmail] = useState(email);
    const toast = useRef<Toast>(null);
    const {t} = useTranslation();

    const showSuccess = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'success', summary: 'Success', detail:message, life: 3000});
    }

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'error', summary: 'Error', detail:message, life: 3000});
    }

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

            showSuccess(t('update_success'));
        } catch {
            showError(t('update_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const [image, setImage] = useState<string>(EMPTY);
    const [showCropper, setShowCropper] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now()); // force reset file input
    const inputReference = useRef<HTMLInputElement | null>(null);

    // Handle the change event when a file is selected
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function() {
                onImageSelected(reader.result);
            };
        }
    };

    const onChooseImg = () => {
        inputReference.current?.click();
    };

    // Callback function when an image is selected
    const onImageSelected = (selectedImage: string | ArrayBuffer | null) => {
        if (typeof selectedImage === "string") {
            setImage(selectedImage);
            setShowCropper(true);
            // reset file input
            setInputKey(Date.now());
        }
    };

    // Callback function when cropping is done
    const onCropDone = (imgCroppedArea: Area) => {
        const canvasElement = document.createElement("canvas");
        canvasElement.width = imgCroppedArea.width;
        canvasElement.height = imgCroppedArea.height;
        const ctx = canvasElement.getContext("2d");

        const imageObject = new Image();
        imageObject.src = image;

        imageObject.onload = () => {
            ctx?.drawImage(
                imageObject,
                imgCroppedArea.x,
                imgCroppedArea.y,
                imgCroppedArea.width,
                imgCroppedArea.height,
                0,
                0,
                imgCroppedArea.width,
                imgCroppedArea.height
            );

            const rawBase64 = canvasElement.toDataURL("image/webp").split(',')[1];
            setCroppedImage(rawBase64);
            setShowCropper(false);
        };
    };

    return (
        <div className="w-full h-full">
            <Toast ref={toast} />

            <div
                className="w-1/4 mx-auto flex flex-col justify-center items-center gap-4 p-10 bg-white rounded-lg cursor-pointer text-stone-700">
                {/* Avatar image */}
                <input type='file' accept="image/*" ref={inputReference} onChange={handleOnChange} style={{ display: 'none' }} />
                <div className='hover:opacity-80'>
                    {croppedImage != null ?
                        <div className='w-full flex justify-center items-center'>
                            <Avatar
                                image={`data:image/png;base64,${croppedImage}`}
                                onChange={handleOnChange}
                                onClick={onChooseImg}
                                key={inputKey}
                                size="xlarge"
                                shape="circle"
                                className="w-full h-full"
                            />
                        </div>
                    :
                        <Avatar
                            icon="pi pi-user"
                            size="xlarge"
                            shape="circle"
                            className='shadow-md rounded-md mx-3'
                            onChange={handleOnChange}
                            onClick={onChooseImg}
                            key={inputKey}
                            style={{backgroundColor: '#ffffff', color: '#5e5e5e'}}
                        />
                    }
                </div>

                <h1 className='text-2xl'>{user}</h1>

                {/* Avatar image */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">{t('username')}</label>
                    <InputText id="username" disabled value={user} aria-describedby="username-help"/>
                    <small id="username-help">
                        {t('username_immutable')}
                    </small>
                </div>

                {/* Avatar image */}
                <div className="flex flex-col gap-2 mb-4">
                    <label htmlFor="email">{t('Email')}</label>
                    <InputText id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                </div>

                <Button label="Submit" icon="pi pi-check" loading={loading} onClick={applyChanges} disabled={profilePicture === croppedImage && email === newEmail}/>
            </div>

            {showCropper ? (
                <>
                    <div className="fixed top-0 left-0 w-screen h-screen bg-black opacity-20 z-40"></div>
                    <div className="fixed top-1/2 left-1/2 w-[90vw] lg:w-1/4 bg-white rounded-lg z-50 transform -translate-x-1/2 -translate-y-1/2">
                        <ImageCropper
                            image={image}
                            onCropDone={onCropDone}
                            onCropCancel={() => {
                                setImage(EMPTY);
                                setShowCropper(false);
                            }}
                        />
                    </div>
                </>
            ) : <></>}
        </div>
    );
};
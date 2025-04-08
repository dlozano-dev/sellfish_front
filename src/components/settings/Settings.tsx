import { Header } from "../header/Header";
import React, {useContext, useState} from "react";
import {HOSTNAME} from "../../utils/Constants.tsx";
import {ProfilePictureContext, UserIdContext} from "../../Navigation.tsx";
import {Button} from "primereact/button";
import axios from "axios";

export const Settings = () => {
    const { setProfilePicture } = useContext(ProfilePictureContext)!;
    const { userId } = useContext(UserIdContext)!;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [base64, setBase64] = useState<string | null>(null);
    const [loading, setIsLoading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const base64String = result.split(',')[1];
                setBase64(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    async function uploadPicture() {
        try {
            setIsLoading(true);

            const response = await axios.post(`${HOSTNAME}/saveProfilePicture`, {
                userId: userId,
                picture: base64,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Get the content returned by the backend
            const data = response.data;

            // Set the new profile picture in state
            setProfilePicture(data);
        } catch (error) {
            console.error('Error uploading picture:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-screen h-screen">
            <Header/>
            <div className="w-full flex flex-col justify-center items-center">
                {selectedImage && (
                    <div>
                        <img alt="not found" width={250} src={URL.createObjectURL(selectedImage)}/>

                        <button onClick={() => setSelectedImage(null)}>Remove</button>
                    </div>
                )}

                <input
                    type="file"
                    name="myImage"
                    onChange={handleFileChange}
                />

                <Button label="Submit" icon="pi pi-check" loading={loading} onClick={uploadPicture} />
            </div>

        </div>
    )
}
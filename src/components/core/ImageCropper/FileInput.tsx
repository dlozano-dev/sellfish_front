import React, { useRef } from "react";
import { Button } from "primereact/button";
import {useTranslation} from "react-i18next";

type FileInputProps = {
    onImageSelected: (dataUrl: string | ArrayBuffer | null) => void;
};

export const FileInput = ({ onImageSelected }: FileInputProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { t } = useTranslation();

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
        inputRef.current?.click();
    };

    return (
        <div className='w-full flex justify-center items-center m-5'>
            {/* Hidden file input element */}
            <input type='file' accept="image/*" ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} />

            {/* Button to trigger the file input dialog */}
            <Button label={t('Choose Image')} onClick={onChooseImg} />
        </div>
    );
};
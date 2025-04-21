import { useRef } from "react";
import {Button} from "primereact/button";

export const FileInput = ({onImageSelected}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Handle the change event when a file is selected
    const handleOnChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = function(e) {
                onImageSelected(reader.result);
            }
        }
    }
    const onChooseImg = () => {
        inputRef.current?.click();
    }

    return (
        <div className='w-full flex justify-center items-center'>
            {/* Hidden file input element */}
            <input type='file' accept="image/*" ref={inputRef} onChange={handleOnChange} style={{ display: 'none' }} />

            {/* Button to trigger the file input dialog */}
            <Button label='Choose image' onClick={onChooseImg}/>
        </div>
    )
}
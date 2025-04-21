import {useState} from "react";
import {EMPTY} from "../../utils/Constants.tsx";
import {FileInput} from "./FileInput.tsx";
import {ImageCropper} from "./ImageCropper.tsx";

export const Test = () => {
    const [image, setImage] = useState<string>(EMPTY);
    const [currentPage, setCurrentPage] = useState("choose-img");

    // Callback function when an image is selected
    const onImageSelected = (selectedImage) => {
        setImage(selectedImage);
        setCurrentPage("crop-img");
    }

    // Callback function when cropping is done
    const onCropDone = (imgCroppedArea) => {}

    // Callback function when cropping is canceled
    const onCropCancel = () => {}

    return (
        <div className='w-screen h-screen'>

        {currentPage === "choose-img" ? (
            <FileInput onImageSelected={onImageSelected} />
        ): currentPage === "crop-img" ? (
                <ImageCropper
                    image={image}
                    onCropDone={onCropDone}
                    onCropCancel={onCropCancel}
                />
            ):
            <div></div>
    }
        </div>
    )
}
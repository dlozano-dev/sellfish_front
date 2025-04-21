import {useState} from "react";
import Cropper from "react-easy-crop";
import {Button} from "primereact/button";

export const ImageCropper = ({image, onCropDone, onCropCancel}) => {
    const [crop, setCrop] = useState({ x:0, y:0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [aspectRatio, setAspectRatio] = useState(4/3);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        // Store the cropped area in pixels
        setCroppedArea(croppedAreaPixels);
    }

    const onAspectRatioChange = (event) => {
        setAspectRatio(event.target.value);
    }

    return (
        <div className='w-full h-full'>
            <div className='w-full h-full flex justify-center items-center'>
                {/* Image cropper component */}
                <Cropper
                    image={image}
                    aspect={aspectRatio}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    style={{
                        containerStyle: {
                            width: "40%",
                            height: "40%",
                            backgroundColor: "transparent"
                        }
                    }}
                />
            </div>

            <div className='absolute bottom-0 flex flex-col justify-center items-center'>
                {/* Aspect ratio selection */}
                <div onChange={onAspectRatioChange}>
                    <input type='radio' value={1} name="ratio" />1:1
                    <input type='radio' value={5 / 4} name="ratio" />5:4
                    <input type='radio' value={4 / 3} name="ratio" />4:3
                    <input type='radio' value={3 / 2} name="ratio" />3:2
                    <input type='radio' value={5 / 3} name="ratio" />5:3
                    <input type='radio' value={16 / 9} name="ratio" />16:9
                    <input type='radio' value={3} name="ratio" />3:1
                </div>

                {/* Buttons for canceling or applying the crop */}
                <div >
                    <Button label='Cancel' onClick={onCropCancel}/>
                    <Button label='Crop & Apply' onClick={() => onCropDone(croppedArea)}/>
                </div>
            </div>
        </div>
    )
}
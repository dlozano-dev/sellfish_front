import {useState, useContext, useRef} from 'react';
import { UserIdContext } from '../../Navigation';
import { InputText } from 'primereact/inputtext';
import { Header } from '../core/Header.tsx';
import {CATEGORIES, EMPTY, HOSTNAME, PROVINCES, SIZES, STATES} from '../../utils/Constants';
import axios from 'axios';
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FloatLabel } from 'primereact/floatlabel';
import { FileInput } from "../core/ImageCropper/FileInput.tsx";
import { Area } from "react-easy-crop";
import { ImageCropper } from "../core/ImageCropper/ImageCropper.tsx";
import {Toast} from "primereact/toast";

export const Post = () => {
    const { userId } = useContext(UserIdContext)!;
    const [base64, setBase64] = useState(EMPTY);
    const [brand, setBrand] = useState(EMPTY);
    const [model, setModel] = useState(EMPTY);
    const [category, setCategory] = useState(CATEGORIES[0].value);
    const [price, setPrice] = useState<number | null | undefined>(0.01);
    const [size, setSize] = useState(SIZES[0].value);
    const [state, setState] = useState(STATES[0].value);
    const [province, setProvince] = useState(PROVINCES[0].value);
    const [loading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const showWarn = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'warn', summary: 'Warning', detail:message, life: 3000});
    }

    const showSuccess = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'success', summary: 'Success', detail: message, life: 3000});
    }

    const publish = async () => {
        if (!brand || !model || !category || !price || !base64 || !size || !state || !province) {
            showWarn("Please fill in all fields before publishing.");
            throw Error;
        }

        await axios.post(`${HOSTNAME}/saveClothe`, {
            brand: brand?.trim(),
            model: model?.trim(),
            category: category?.trim(),
            price: price,
            publisher: userId,
            picture: base64,
            size: size,
            state: state,
            location: province?.trim(),
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    };

    const [image, setImage] = useState<string>(EMPTY);
    const [showCropper, setShowCropper] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now()); // force reset file input

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
            setBase64(rawBase64);
            setShowCropper(false);
        };
    };

    return (
        <div>
            <Header />
            <Toast ref={toast} />

            <div className='flex flex-col justify-center items-center gap-10'>
                {base64 !== EMPTY ? (
                    <img src={`data:image/webp;base64,${base64}`} alt="crop-img" className='w-[15vw]'/>
                ) : (
                    <div></div>
                )}

                <FileInput onImageSelected={onImageSelected} key={inputKey}/>

                <div className='flex justify-center gap-5 w-150'>
                    <FloatLabel>
                        <InputText
                            id='brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-64"
                        />
                        <label htmlFor="brand">Brand</label>
                    </FloatLabel>

                    <FloatLabel>
                        <InputText
                            id='model'
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-64"
                        />
                        <label htmlFor="model">Model</label>
                    </FloatLabel>
                </div>

                <div className='flex justify-center gap-5 w-150'>
                    <FloatLabel>
                        <InputNumber
                            id='price'
                            value={price}
                            onValueChange={(e) => setPrice(e.target.value)}
                            maxFractionDigits={2}
                            className="w-64"
                        />
                        <label htmlFor="price">Price</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Dropdown
                            id='category'
                            value={category}
                            onChange={(e) => setCategory(e.value)}
                            options={CATEGORIES}
                            optionLabel="name"
                            className="w-64"
                        />
                        <label htmlFor="category">Category</label>
                    </FloatLabel>
                </div>

                <div className='flex justify-center gap-5 w-150'>
                    <FloatLabel>
                        <Dropdown
                            id='size'
                            value={size}
                            onChange={(e) => setSize(e.value)}
                            options={SIZES}
                            optionLabel="name"
                            checkmark={true}
                            className="w-64"
                        />
                        <label htmlFor="size">Size</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Dropdown
                            id='state'
                            value={state}
                            onChange={(e) => setState(e.value)}
                            options={STATES}
                            optionLabel="name"
                            className="w-64"
                        />
                        <label htmlFor="state">State</label>
                    </FloatLabel>
                </div>

                <div className='flex justify-center gap-5 w-150'>
                    <FloatLabel>
                        <Dropdown
                            id='province'
                            value={province}
                            onChange={(e) => setProvince(e.value)}
                            options={PROVINCES}
                            optionLabel="name"
                            checkmark={true}
                            className="w-64"
                        />
                        <label htmlFor="province">Province</label>
                    </FloatLabel>
                </div>

                <Button
                    label="Submit"
                    icon="pi pi-check"
                    loading={loading}
                    onClick={() => {
                        setIsLoading(true);
                        publish().then(() =>
                            showSuccess('Product posted successfully!')
                        ).finally(() =>
                            setIsLoading(false)
                        );
                    }}
                />

                {showCropper ? (
                    <div className='w-screen h-screen absolute top-0 left-0 flex justify-center items-center'>
                        <div className='w-screen h-screen bg-black opacity-20'></div>
                        <div className='w-1/4 bg-white rounded-lg opacity-100 absolute'>
                            <ImageCropper
                                image={image}
                                onCropDone={onCropDone}
                                onCropCancel={() => {
                                    setImage(EMPTY);
                                    setShowCropper(false)
                                }}
                            />
                        </div>
                    </div>
                ) :
                    <div></div>
                }
            </div>
        </div>
    );
};
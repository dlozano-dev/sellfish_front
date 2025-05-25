import {useState, useContext, useRef} from 'react';
import {UserContext, UserIdContext} from '../../Navigation';
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
import {useTranslation} from "react-i18next";
import {translateOptions} from "../../utils/GetTranslatedConstants.ts";

export const Post = () => {
    const {userId} = useContext(UserIdContext)!;
    const {user} = useContext(UserContext)!; // SELLER USERNAME
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
    const { t } = useTranslation();

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
            showWarn(t('fill_all_fields'));
            throw Error;
        }

        await axios.post(`${HOSTNAME}/saveClothe`, {
            brand: brand?.trim(),
            model: model?.trim(),
            category: category?.trim(),
            price: price,
            publisher: userId,
            seller: user,
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

            <div className='flex flex-col justify-center items-center px-4 sm:px-0 py-10'>
                {base64 !== EMPTY ? (
                    <img src={`data:image/webp;base64,${base64}`} alt="crop-img" className='w-[50vw] sm:w-[15vw]' />
                ) : (
                    <div></div>
                )}

                <FileInput onImageSelected={onImageSelected} key={inputKey}/>

                {/* Brand and Model */}
                <div className='flex flex-col sm:flex-row flex-wrap justify-center w-full max-w-[600px]'>
                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <InputText
                            id='brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full"
                        />
                        <label htmlFor="brand">{t('Brand')}</label>
                    </FloatLabel>

                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <InputText
                            id='model'
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full"
                        />
                        <label htmlFor="model">{t('Model')}</label>
                    </FloatLabel>
                </div>

                {/* Price and Category */}
                <div className='flex flex-col sm:flex-row flex-wrap justify-center  w-full max-w-[600px]'>
                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <InputNumber
                            id='price'
                            value={price}
                            onValueChange={(e) => setPrice(e.value)}
                            maxFractionDigits={2}
                            className="w-full"
                        />
                        <label htmlFor="price">{t('Price')}</label>
                    </FloatLabel>

                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <Dropdown
                            id='category'
                            value={category}
                            onChange={(e) => setCategory(e.value)}
                            options={translateOptions(CATEGORIES)}
                            optionLabel="name"
                            className="w-full"
                        />
                        <label htmlFor="category">{t('Category')}</label>
                    </FloatLabel>
                </div>

                {/* Size and State */}
                <div className='flex flex-col sm:flex-row flex-wrap justify-center  w-full max-w-[600px]'>
                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <Dropdown
                            id='size'
                            value={size}
                            onChange={(e) => setSize(e.value)}
                            options={translateOptions(SIZES)}
                            optionLabel="name"
                            checkmark={true}
                            className="w-full"
                        />
                        <label htmlFor="size">{t('size')}</label>
                    </FloatLabel>

                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <Dropdown
                            id='state'
                            value={state}
                            onChange={(e) => setState(e.value)}
                            options={translateOptions(STATES)}
                            optionLabel="name"
                            className="w-full"
                        />
                        <label htmlFor="state">{t('state')}</label>
                    </FloatLabel>
                </div>

                {/* Province */}
                <div className='flex justify-center w-full max-w-[600px]'>
                    <FloatLabel className='w-full sm:w-64 my-5 sm:mx-5'>
                        <Dropdown
                            id='province'
                            value={province}
                            onChange={(e) => setProvince(e.value)}
                            options={translateOptions(PROVINCES)}
                            optionLabel="name"
                            checkmark={true}
                            className="w-full"
                        />
                        <label htmlFor="province">{t('Province')}</label>
                    </FloatLabel>
                </div>

                <Button
                    label={t("Submit")}
                    icon="pi pi-check"
                    loading={loading}
                    onClick={() => {
                        setIsLoading(true);
                        publish().then(() =>
                            showSuccess(t('post_success'))
                        ).finally(() =>
                            setIsLoading(false)
                        );
                    }}
                />

                {/* Image cropper modal */}
                {showCropper && (
                    <div className='w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-50'>
                        <div className='w-screen h-screen bg-black opacity-20 absolute'></div>
                        <div className='w-11/12 sm:w-1/3 bg-white rounded-lg shadow-lg p-4 z-50'>
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
                )}
            </div>
        </div>
    );
};
import { useState, useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import { UserIdContext } from '../../Navigation';
import { InputText } from 'primereact/inputtext';
import { Header } from '../header/Header';
import {CATEGORIES, EMPTY, HOSTNAME} from '../../utils/Constants';
import axios from 'axios';
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import { FloatLabel } from 'primereact/floatlabel';
import {FileUpload} from "primereact/fileupload";

export const Post = () => {
    const { userId } = useContext(UserIdContext)!;
    // const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [
        base64
        // , setBase64
    ] = useState<string | null>(null);
    const [brand, setBrand] = useState(EMPTY);
    const [model, setModel] = useState(EMPTY);
    const [category, setCategory] = useState(CATEGORIES[0].value);
    const [price, setPrice] = useState<number | null | undefined>(0.01);
    const [size, setSize] = useState('S'); // TODO
    const [state, setState] = useState('Brand new'); // TODO
    const [snackBar, setSnackBar] = useState(EMPTY);
    const [loading, setIsLoading] = useState(false);

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         setSelectedImage(file);
    //         const reader = new FileReader();
    //
    //         reader.onloadend = () => {
    //             const result = reader.result as string;
    //             const base64String = result.split(',')[1];
    //             setBase64(base64String);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const publish = async () => {
        if (!brand || !model || !category || !price) {
            alert("Please fill in all fields before publishing.");
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
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    };

    return (
        <div>
            <Header />

            <div className='flex flex-col justify-center items-center gap-10'>
                    <FileUpload
                        name="demo[]"
                        url={'/api/upload'}
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        className='items-center'
                    />

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
                            className="w-64"
                        />
                        <label htmlFor="category">Category</label>
                    </FloatLabel>
                </div>

                <div className='flex justify-center gap-5 w-150'>
                    <FloatLabel>
                        <Dropdown
                            id='size'
                            value={category}
                            onChange={(e) => setSize(e.value)}
                            options={CATEGORIES}
                            className="w-64"
                        />
                        <label htmlFor="size">Size</label>
                    </FloatLabel>

                    <FloatLabel>
                        <Dropdown
                            id='state'
                            value={category}
                            onChange={(e) => setState(e.value)}
                            options={CATEGORIES}
                            className="w-64"
                        />
                        <label htmlFor="state">State</label>
                    </FloatLabel>
                </div>

                <Button
                    label="Submit"
                    icon="pi pi-check"
                    loading={loading}
                    onClick={ () => {
                        setIsLoading(true);
                        publish().then(() =>
                            setSnackBar('Product posted successfully!')
                        ).catch(() =>
                            setSnackBar('An error happened trying to post the product.')
                        ).finally(() =>
                            setIsLoading(false)
                        );
                    }}
                />
            </div>

            <Snackbar
                open={!!snackBar}
                autoHideDuration={6000}
                onClose={() => {
                    setSnackBar(EMPTY)
                }}
                message={snackBar}
            />
        </div>
    );
};

{/*{selectedImage && (*/}
{/*    <div>*/}
{/*        <img alt="not found" width={250} src={URL.createObjectURL(selectedImage)} />*/}

{/*        <button onClick={() => setSelectedImage(null)}>Remove</button>*/}
{/*    </div>*/}
{/*)}*/}

{/*<input*/}
{/*    type="file"*/}
{/*    name="myImage"*/}
{/*    onChange={handleFileChange}*/}
{/*/>*/}
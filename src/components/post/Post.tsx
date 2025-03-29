import React, { useState, useContext } from 'react';
import * as Constants from '../../utils/Constants';
import { UserIdContext } from '../../Navigation';
import { Header } from '../header/Header';
import { EMPTY } from '../../utils/Constants';
import axios from 'axios';

export const Post = () => {
    const { userId } = useContext(UserIdContext)!;
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [base64, setBase64] = useState<string | null>(null);
    const [brand, setBrand] = useState<string>(EMPTY);
    const [model, setModel] = useState<string>(EMPTY);
    const [category, setCategory] = useState<string>(EMPTY);
    const [price, setPrice] = useState<string>(EMPTY);

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

    const publish = async () => {
        if (!brand || !model || !category || !price) {
            alert("Please fill in all fields before publishing.");
            return;
        }

        console.log(brand, model, price, category, price, userId);

        await axios.post(`${Constants.HOSTNAME}/saveClothe`, {
            brand: brand,
            model: model,
            category: category,
            price: price,
            publisher: userId,
            picture: base64,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    };

    return (
        <div className='containerPublish'>
            <Header />
            <h1>P U B L I S H</h1>
            <div>
                {selectedImage && (
                    <div>
                        <img alt="not found" width={250} src={URL.createObjectURL(selectedImage)} />

                        <button onClick={() => setSelectedImage(null)}>Remove</button>
                    </div>
                )}

                <input
                    type="file"
                    name="myImage"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <input
                    value={brand}
                    onChange={e => setBrand(e.target.value.trim())}
                    type="text"
                    placeholder='Brand'
                    id='brand'
                />

                <input
                    value={model}
                    onChange={e => setModel(e.target.value.trim())}
                    type="text"
                    placeholder='Model'
                    id='model'
                />

                <input
                    value={price}
                    onChange={e => setPrice(e.target.value.trim())}
                    type="number"
                    placeholder='Price'
                    id='price'
                />

                <select name="select" id='category' value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="Others">Others</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Pants">Pants</option>
                    <option value="Accessories">Accessories</option>
                </select>

                <button onClick={ () => {publish().then(data => console.log(data)).catch(err => console.error(err));}}>Publish</button>
            </div>
        </div>
    );
};
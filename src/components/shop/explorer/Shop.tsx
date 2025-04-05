import { useState, useEffect } from 'react';
import { Header } from "../../header/Header.jsx";
import { ItemDetails } from "../itemDetails/ItemDetails.tsx";
import { Dialog } from "primereact/dialog";
import { Item } from "../data/Item.ts";
import { ProgressSpinner } from "primereact/progressspinner";
import { CATEGORIES, EMPTY, HOSTNAME, ORDER_OPTIONS, PROVINCES } from "../../../utils/Constants.tsx";

export const Shop = () => {
    const [clothes, setClothes] = useState<Item[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [item, setItem] = useState<Item | undefined>(undefined);

    useEffect(() => {
        fetchClothes().then();
    }, []);

    async function fetchClothes() {
        setIsLoading(true);
        const response = await fetch(`${HOSTNAME}/clothes`);
        const data = await response.json();
        setClothes(data);
        setIsLoading(false);
    }

    return (
        <div>
            <Header/>

            {/* Search and filters bar */}
            <ShopToolbar/>

            {/* Render clothes list or any other UI components */}
            {clothes?.length ? (
                <div className="flex flex-wrap justify-center gap-4">
                    {clothes.map((i, index) => (
                        <div
                            onClick={() => setItem(i)}
                            key={index}
                            className="w-80 h-90 overflow-hidden rounded-md flex flex-col justify-end hover:cursor-pointer"
                        >
                            <img
                                src={`data:image/png;base64,${i.picture}`}
                                alt={i.brand}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <p className="py-2 text-gray-800 font-semibold items-start">
                                {`${i.price} €`}
                            </p>
                        </div>
                    ))}

                    {/* Single Dialog outside the map */}
                    <Dialog
                        header="Item Details"
                        visible={!!item} // Only visible if item is defined
                        style={{ width: '50vw' }}
                        onHide={() => setItem(undefined)}
                        dismissableMask
                        modal
                    >
                        {item && <ItemDetails item={item} />}
                    </Dialog>
                </div>
            ) : (
                isLoading ? (
                    <div className="card items-center w-full flex pt-10">
                        <ProgressSpinner
                            style={{width: '50px', height: '50px'}}
                            strokeWidth="6"
                            aria-label="Loading"
                            animationDuration=".8s"
                            className='p-progress-spinner-color'/>
                    </div>
                ) : (
                    <p className='text-center'>No clothes available.</p>
                )
            )}
        </div>
    );
};

import {CircleDollarSign} from 'lucide-react';
import {AnimatePresence, motion} from "framer-motion";
import {Slider} from "@mui/material";
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";

export const ShopToolbar = () => {
    const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0].value);
    const [orderBy, setOrderBy] = useState(ORDER_OPTIONS[0].value);
    const [search, setSearch] = useState(EMPTY);
    // Price Range
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    // Categories
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const minDistance = 1;
    const [value2, setValue2] = useState<number[]>([0, 500]);

    const handleChange2 = (_event: Event, newValue: number[], activeThumb: number) => {
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 100 - minDistance);
                setValue2([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setValue2([clamped - minDistance, clamped]);
            }
        } else {
            setValue2(newValue);
        }
    };

    return (
        <div className="bg-white w-[90vw] h-auto flex flex-wrap items-center justify-between px-4 py-3 gap-2 mb-5 shadow-xl mx-auto rounded-md">
            <div className="flex flex-wrap items-center justify-between px-2 py-1 gap-6">
                {/* Location Dropdown */}
                <div className='flex items-center'>
                    <Dropdown
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.value)} options={PROVINCES}
                        optionLabel="name"
                        checkmark={true}
                        placeholder="Location"
                        className="w-full h-12 md:w-14rem items-center"
                    />
                </div>

                {/* Order By Dropdown */}
                <div className="card flex justify-content-center">
                    <Dropdown
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.value)} options={ORDER_OPTIONS}
                        optionLabel="name"
                        checkmark={true}
                        placeholder="Order by"
                        className="w-full h-12 md:w-14rem items-center"
                    />
                </div>

                {/* Search Bar */}
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search"> </InputIcon>
                    <InputText
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search"
                    />
                </IconField>
            </div>

            {/* Categories Dropdown */}
            <div className="card flex justify-center items-center">
                <MultiSelect
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(e.value)}
                    options={CATEGORIES}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select Categories"
                    maxSelectedLabels={3}
                    className=" w-max-40 md:w-20rem h-12 items-center"
                />

                {/* Price Range Dropdown */}
                <div className="relative">
                    <button onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                            className="flex px-3 hover:cursor-pointer">
                        <CircleDollarSign/>
                        <span className="ms-2">Price</span>
                    </button>

                    <AnimatePresence>
                        {showPriceDropdown && (
                            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}}
                                        exit={{opacity: 0, y: -10}}
                                        className="flex items-center justify-between absolute w-70 right-0 top-14 shadow-2xl rounded-md bg-white p-2 space-x-4">
                                <Slider
                                    getAriaLabel={() => 'Minimum distance shift'}
                                    value={value2}
                                    onChange={handleChange2}
                                    valueLabelDisplay="auto"
                                    disableSwap
                                    className='ml-3'
                                    sx={{
                                        color: 'black', // Change the track and thumb color to black
                                        '& .MuiSlider-thumb': {
                                            backgroundColor: 'black', // Thumb color
                                        },
                                        '& .MuiSlider-track': {
                                            backgroundColor: 'black', // Track color
                                        },
                                        '& .MuiSlider-rail': {
                                            backgroundColor: 'gray', // Rail color (adjust if needed)
                                        },
                                    }}
                                />
                                <button onClick={() => setShowPriceDropdown(false)}
                                        className="bg-black rounded p-3 py-1 text-white hover:cursor-pointer hover:opacity-70">
                                    Apply
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

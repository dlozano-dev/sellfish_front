import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../../Navigation.jsx';
import { ItemContext } from '../../../Navigation.jsx';
import { Header } from "../../header/Header.jsx";
import {CATEGORIES, HOSTNAME, ITEM_DETAILS, ORDER_OPTIONS, PROVINCES} from "../../../utils/Constants.tsx";
import {Item} from "../data/Item.ts";

export const Shop = () => {
    const [clothes, setClothes] = useState<Item[]>();
    const { setGlobalState } = useContext(GlobalContext)!;
    const { setItem } = useContext(ItemContext)!;

    useEffect(() => {
        fetchClothes().then();
    }, []);

    async function fetchClothes() {
        const response = await fetch(`${HOSTNAME}/clothes`);
        const data = await response.json();
        setClothes(data);
    }

    function goItem(item: Item) {
        setItem(item)
        setGlobalState(ITEM_DETAILS)
    }

    return (
        <div>
            <Header/>
            {/* Search and filters bar */}
            <ShopToolbar/>
            {/* Render clothes list or any other UI components */}
            {clothes?.length ? (
                <div className="flex flex-wrap justify-center gap-4">
                    {clothes.map((item, index) => (
                        <div
                            onClick={() => goItem(item)}
                            key={index}
                            className="w-80 h-90 overflow-hidden rounded-md flex flex-col justify-end hover:cursor-pointer "
                        >
                            <img
                                src={`data:image/png;base64,${item.picture}`}
                                alt={item.brand}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <p className="py-2 text-gray-800 font-semibold items-start">
                                {`${item.price} €`}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className='text-center'>No clothes available.</p>
            )}
        </div>
    );
};

import {MapPin} from 'lucide-react';
import {Search} from 'lucide-react';
import {CircleDollarSign} from 'lucide-react';
import {AnimatePresence, motion} from "framer-motion";
import {Slider} from "@mui/material";
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from "primereact/dropdown";

export const ShopToolbar = () => {
    const [selectedProvince, setSelectedProvince] = useState("All Spain");
    const [orderBy, setOrderBy] = useState<{ name: string; code: string }>(ORDER_OPTIONS[0]);
    const [search, setSearch] = useState("");
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
                    <MapPin/>
                    <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className='hover:cursor-pointer'
                    >
                        {PROVINCES.map((province) => (
                            <option key={province} value={province}>
                                {province}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Order By Dropdown */}
                <div className="card flex justify-content-center">
                    <Dropdown
                        value={orderBy.name}
                        onChange={(e) => setOrderBy(e.value)} options={ORDER_OPTIONS}
                        optionLabel="name"
                        showClear
                        checkmark={true}
                        placeholder="Order by"
                        className="w-full md:w-14rem"
                    />
                </div>

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

                {/* Search Bar */}
                <div className="flex items-center">
                    <Search/>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="focus:outline-none ms-2.5"
                    />
                </div>
            </div>

            {/* Categories Dropdown */}
            <div className="card flex justify-content-center">
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
            </div>
        </div>
    );
};

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
            <Header />
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

import { MapPin } from 'lucide-react';
import { Search } from 'lucide-react';
import { ArrowDownUp } from 'lucide-react';
import { SlidersHorizontal } from 'lucide-react';
import { CircleDollarSign } from 'lucide-react';
import {AnimatePresence, motion} from "framer-motion";
import {Slider} from "@mui/material";

export const ShopToolbar = () => {
    const [selectedProvince, setSelectedProvince] = useState("All Spain");
    const [orderBy, setOrderBy] = useState("price_asc");
    const [search, setSearch] = useState("");
    // Price Range
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    // Categories
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };
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
        <div className="bg-white w-[95vw] max-w-6xl h-auto flex flex-wrap items-center justify-between px-4 py-3 gap-2 mb-5 shadow-xl mx-auto rounded-md">

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
                <AnimatePresence>
                        <ArrowDownUp />
                        <motion.select
                            initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}
                            value={orderBy}
                            onChange={(e) => setOrderBy(e.target.value)}
                            className='hover:cursor-pointer'
                        >
                            {ORDER_OPTIONS.map((option) => (
                                <motion.option
                                    initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}
                                    key={option.value} value={option.value}>
                                    {option.label}
                                </motion.option>
                            ))}
                        </motion.select>
                </AnimatePresence>

                {/* Search Bar */}
                <div className="flex items-center max-w-180">
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

            <div className="flex flex-wrap items-center justify-between px-2 py-1">
                {/* Price Range Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                        className="flex px-3 hover:cursor-pointer"
                    >
                        <CircleDollarSign/>
                        <span className="ms-2">Price</span>
                    </button>
                    <AnimatePresence>
                        {showPriceDropdown && (
                            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="flex items-center justify-between absolute w-70 right-0 top-14 shadow-2xl rounded-md bg-white p-2 space-x-4">
                                <Slider
                                    getAriaLabel={() => 'Minimum distance shift'}
                                    value={value2}
                                    onChange={handleChange2}
                                    valueLabelDisplay="auto"
                                    disableSwap
                                    className='ml-3'
                                    color='secondary'
                                />
                                <button onClick={() => setShowPriceDropdown(false)} className="text-black px-3 hover:cursor-pointer hover:opacity-70">
                                    Apply
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Categories Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                        className="flex px-3 hover:cursor-pointer"
                    >
                        <SlidersHorizontal />
                        <span className='ms-2'>Categories</span>
                    </button>
                    <AnimatePresence>
                        {showCategoriesDropdown && (
                            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="absolute bg-white border shadow-md p-4 mt-2 w-48 rounded-md">
                                {CATEGORIES.map((category) => (
                                    <label key={category} className="block text-sm">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                            className="mr-1"
                                        />
                                        {category}
                                    </label>
                                ))}
                                <button onClick={() => setShowCategoriesDropdown(false)} className="mt-3 bg-blue-500 text-white px-3 py-1 rounded">
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

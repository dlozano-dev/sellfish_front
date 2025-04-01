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

export const ShopToolbar = () => {
    const [selectedProvince, setSelectedProvince] = useState("All Spain");
    const [orderBy, setOrderBy] = useState("price_asc");
    const [search, setSearch] = useState("");

    // Price Range
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);

    // Categories
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
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
                <div className='flex items-center'>
                    <ArrowDownUp />
                    <select
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                        className='hover:cursor-pointer'
                    >
                        {ORDER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

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
                            <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="flex items-center justify-between absolute w-120 right-0 top-14 shadow-2xl rounded-md bg-white p-2 space-x-4">
                                <div className="">
                                    <label className="block text-sm">Min Price: {priceRange[0]}€</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                        className="w-45 hover:cursor-pointer accent-stone-900"
                                    />
                                </div>
                                <div className="">
                                    <label className="block text-sm">Max Price: {priceRange[1]}€</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="500"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                        className="w-45 hover:cursor-pointer accent-stone-900"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowPriceDropdown(false)}
                                    className="text-black px-3 hover:cursor-pointer hover:opacity-70"
                                >
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
                    {showCategoriesDropdown && (
                        <div className="absolute bg-white border shadow-md p-4 mt-2 w-48 rounded-md">
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
                            <button
                                onClick={() => setShowCategoriesDropdown(false)}
                                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

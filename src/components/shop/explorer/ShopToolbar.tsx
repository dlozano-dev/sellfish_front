import React, { useContext, useState } from "react";
import { CircleDollarSign } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { Slider } from "@mui/material";
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";
import {AutoComplete, AutoCompleteCompleteEvent} from 'primereact/autocomplete';
import { Button } from "primereact/button";
import { LoadingContext } from "../../../Navigation.tsx";
import { CATEGORIES, ORDER_OPTIONS, PROVINCES, SIZES } from "../../../utils/Constants.tsx";

export const ShopToolbar = ({
    selectedProvince, setSelectedProvince,
    selectedCategories, setSelectedCategories,
    selectedSizes, setSelectedSizes,
    setSearch, search,
    priceRange, setPriceRange,
    orderBy, setOrderBy,
    suggestions, setSuggestions,
    onSubmit
}: {
    selectedProvince: string; // The selected province
    setSelectedProvince: React.Dispatch<React.SetStateAction<string>>; // Setter for selectedProvince
    selectedCategories: string[]; // Array of selected categories
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>; // Setter for selectedCategories
    selectedSizes: string[]; // Array of selected sizes
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>; // Setter for selectedSizes
    search: string; // Current search query
    setSearch: React.Dispatch<React.SetStateAction<string>>; // Setter for search query
    orderBy: string; // Selected sorting option
    setOrderBy: React.Dispatch<React.SetStateAction<string>>; // Setter for orderBy
    priceRange: number[]; // Array of price range [minPrice, maxPrice]
    setPriceRange: React.Dispatch<React.SetStateAction<number[]>>; // Setter for priceRange
    suggestions: string[]; // Suggestions for the autocomplete
    setSuggestions: React.Dispatch<AutoCompleteCompleteEvent>; // Setter for suggestions
    onSubmit: () => void; // Function to handle the submit action
}) => {
    const {isLoading} = useContext(LoadingContext)!;

    // Price Range
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const minDistance = 1;

    const handleChange2 = (_event: Event, newValue: number[], activeThumb: number) => {
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 100 - minDistance);
                setPriceRange([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], minDistance);
                setPriceRange([clamped - minDistance, clamped]);
            }
        } else {
            setPriceRange(newValue);
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
                                    value={priceRange}
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
                <AutoComplete
                    value={search}
                    placeholder="Search"
                    suggestions={suggestions}
                    completeMethod={setSuggestions}
                    onChange={(e) => setSearch(e.value)}
                />
            </div>

            {/* Categories Dropdown */}
            <div className="card flex justify-center items-center space-x-4">
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

                <MultiSelect
                    value={selectedSizes}
                    onChange={(e) => setSelectedSizes(e.value)}
                    options={SIZES}
                    optionLabel="name"
                    display="chip"
                    placeholder="Select Sizes"
                    maxSelectedLabels={3}
                    className=" w-max-40 md:w-20rem h-12 items-center"
                />

                <Button label="Submit" icon="pi pi-check" loading={isLoading} onClick={onSubmit} />
            </div>
        </div>
    );
};
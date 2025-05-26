import React, {useContext, useRef, useState} from "react";
import { Slider } from "@mui/material";
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from "primereact/button";
import { LoadingContext } from "../../../Navigation.tsx";
import { CATEGORIES, ORDER_OPTIONS, PROVINCES, SIZES } from "../../../utils/Constants.tsx";
import { OverlayPanel } from "primereact/overlaypanel";
import {useTranslation} from "react-i18next";
import {translateOptions} from "../../../utils/GetTranslatedConstants.ts";
import { motion, AnimatePresence } from "framer-motion";

export const ShopToolbar = ({
    selectedProvince, setSelectedProvince,
    selectedCategories, setSelectedCategories,
    selectedSizes, setSelectedSizes,
    setSearch, search,
    priceRange, setPriceRange,
    orderBy, setOrderBy,
    suggestions, setSuggestions,
    maxPrice,
    onSubmit
}: {
    selectedProvince: string;
    setSelectedProvince: React.Dispatch<React.SetStateAction<string>>;
    selectedCategories: string[];
    setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
    selectedSizes: string[];
    setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    orderBy: string;
    setOrderBy: React.Dispatch<React.SetStateAction<string>>;
    priceRange: number[];
    setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
    suggestions: string[];
    setSuggestions: React.Dispatch<AutoCompleteCompleteEvent>;
    maxPrice: number;
    onSubmit: () => void;
}) => {
    const {isLoading} = useContext(LoadingContext)!;
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const op = useRef<OverlayPanel>(null);
    const { t } = useTranslation();
    const minDistance = 1;

    const handleChange2 = (_event: Event, newValue: number[], activeThumb: number) => {
        if (newValue[1] - newValue[0] < minDistance) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], priceRange[1] - minDistance);
                setPriceRange([clamped, clamped + minDistance]);
            } else {
                const clamped = Math.max(newValue[1], priceRange[0] + minDistance);
                setPriceRange([clamped - minDistance, clamped]);
            }
        } else {
            setPriceRange(newValue);
        }
    };

    const renderFilterContent = () => (
        <>
            <div className={`${showFilters ? 'flex flex-col justify-start items-start' : 'hidden'} md:flex flex-wrap md:items-center md:justify-between md:px-2 py-1 gap-2 md:gap-6`}>
                {/* Location Dropdown */}
                <div className='flex items-center'>
                    <Dropdown
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.value)} options={translateOptions(PROVINCES)}
                        optionLabel="name"
                        checkmark={true}
                        placeholder={t("Location")}
                        className="w-full h-12 md:w-14rem items-center"
                    />
                </div>

                {/* Order By Dropdown */}
                <div className="card flex justify-content-center">
                    <Dropdown
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.value)} options={translateOptions(ORDER_OPTIONS)}
                        optionLabel="name"
                        checkmark={true}
                        placeholder={t("Order by")}
                        className="w-40 h-12 md:w-14rem items-center"
                    />
                </div>

                {/* Price Range Dropdown */}
                <div className="relative">
                    <button onClick={(e) => op.current?.toggle(e)}
                            className="px-3 price-filter hover:opacity-80 no-bg-button cursor-pointer">
                        {t("Price")}
                    </button>

                    <OverlayPanel ref={op}>
                        <div className="flex flex-col items-center justify-center w-[70vw] md:w-[20vw] p-2">
                            <div className='w-[90%] flex-col md:flex-row flex justify-between'>
                                <span>{t('Min Price')} {priceRange[0]}</span>
                                <span>{t('Max Price')} {priceRange[1]}</span>
                            </div>
                            <Slider
                                getAriaLabel={() => t('Price range')}
                                value={priceRange}
                                onChange={handleChange2}  // Ensure this function is being used correctly
                                valueLabelDisplay="auto"
                                disableSwap
                                min={0} // Fixed min value
                                max={maxPrice} // Fixed max value
                                className="w-[5vw]"
                                sx={{
                                    color: '#5e81ac',
                                    '& .MuiSlider-thumb': {
                                        backgroundColor: '#5e81ac',
                                    },
                                    '& .MuiSlider-track': {
                                        backgroundColor: '#5e81ac',
                                    },
                                    '& .MuiSlider-rail': {
                                        backgroundColor: '#5e81ac',
                                    },
                                    width: '88%',
                                }}
                            />
                            <Button
                                label={t("Apply")}
                                onClick={(e) => op.current?.toggle(e)}
                                className='w-[50vw] md:w-[10vw] text-center'
                            />
                        </div>
                    </OverlayPanel>
                </div>

                {/* Search Bar */}
                <AutoComplete
                    value={search}
                    placeholder={t("Search")}
                    suggestions={suggestions}
                    completeMethod={setSuggestions}
                    onChange={(e) => setSearch(e.value)}
                />
            </div>

            {/* Categories Dropdown */}
            <div
                className={`${showFilters ? 'flex flex-col items-start' : 'hidden'} gap-2 py-1 card md:flex justify-center md:items-center space-x-4`}>
                <MultiSelect
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(e.value)}
                    options={translateOptions(CATEGORIES)}
                    optionLabel="name"
                    display="chip"
                    placeholder={t("SELECT CATEGORIES")}
                    maxSelectedLabels={3}
                    className=" w-max-40 md:w-20rem h-12 items-center"
                />

                <MultiSelect
                    value={selectedSizes}
                    onChange={(e) => setSelectedSizes(e.value)}
                    options={translateOptions(SIZES)}
                    optionLabel="name"
                    display="chip"
                    placeholder={t("SELECT SIZES")}
                    maxSelectedLabels={3}
                    className=" w-max-40 md:w-20rem h-12 items-center"
                />

                <Button label={t("Submit")} icon="pi pi-check" loading={isLoading} onClick={onSubmit}/>
            </div>
        </>
    );

    return (
        <div className="bg-white w-[90vw] h-auto flex flex-wrap items-center justify-between px-4 py-3 md:gap-2 mb-5 shadow-xl mx-auto rounded-md">
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                {showFilters ? <i className="pi pi-times mr-2"/> : <i className="pi pi-filter mr-2"/>}
                {t(showFilters ? 'Hide filters' : 'Show filters')}
            </button>

            <div className="w-full">
                <AnimatePresence initial={false}>
                    {showFilters && (
                        <motion.div
                            key="filters-mobile"
                            initial={{height: 0, opacity: 0}}
                            animate={{height: "auto", opacity: 1}}
                            exit={{height: 0, opacity: 0}}
                            transition={{duration: 0.3, ease: "easeInOut"}}
                            className="overflow-hidden flex flex-col justify-start items-start md:hidden"
                        >
                            {renderFilterContent()}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="hidden md:flex md:flex-wrap md:items-center md:justify-between md:px-2 py-1 gap-2 md:gap-6">
                    {renderFilterContent()}
                </div>
            </div>
        </div>
    );
};

import React, { useContext, useRef } from "react";
import { Slider } from "@mui/material";
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from "primereact/dropdown";
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Button } from "primereact/button";
import { LoadingContext } from "../../../Navigation.tsx";
import { CATEGORIES, ORDER_OPTIONS, PROVINCES, SIZES } from "../../../utils/Constants.tsx";
import { OverlayPanel } from "primereact/overlaypanel";
import {useTranslation} from "react-i18next";

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
    const op = useRef<OverlayPanel>(null);
    const minDistance = 1;
    const { t } = useTranslation();

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
                        placeholder={t("Location")}
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
                        placeholder={t("Order by")}
                        className="w-full h-12 md:w-14rem items-center"
                    />
                </div>

                {/* Price Range Dropdown */}
                <div className="relative">
                    <Button
                        label={t("Price")}
                        onClick={(e) => op.current?.toggle(e)}
                        className="px-3 price-filter hover:opacity-80"
                    />

                    <OverlayPanel ref={op}>
                        <div className="flex flex-col items-center justify-center w-[20vw] p-2">
                            <div className='w-[90%] flex justify-between'>
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
                                className='w-[10vw] text-center'
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
            <div className="card flex justify-center items-center space-x-4">
                <MultiSelect
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(e.value)}
                    options={CATEGORIES}
                    optionLabel="name"
                    display="chip"
                    placeholder={t("SELECT CATEGORIES")}
                    maxSelectedLabels={3}
                    className=" w-max-40 md:w-20rem h-12 items-center"
                />

                <MultiSelect
                    value={selectedSizes}
                    onChange={(e) => setSelectedSizes(e.value)}
                    options={SIZES}
                    optionLabel="name"
                    display="chip"
                    placeholder={t("SELECT SIZES")}
                    maxSelectedLabels={3}
                    className=" w-max-40 md:w-20rem h-12 items-center"
                />

                <Button label={t("Submit")} icon="pi pi-check" loading={isLoading} onClick={onSubmit} />
            </div>
        </div>
    );
};

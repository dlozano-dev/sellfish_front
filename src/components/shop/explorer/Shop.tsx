import {useState, useEffect, SetStateAction, useContext} from 'react';
import {Header} from "../../core/Header.tsx";
import {ItemDetails} from "../itemDetails/ItemDetails.tsx";
import {Dialog} from "primereact/dialog";
import {Clothe} from "../data/Clothe.ts";
import {ProgressSpinner} from "primereact/progressspinner";
import {Paginator} from 'primereact/paginator';
import {
    DEFAULT_ITEMS,
    EMPTY,
    FIFTY,
    HOSTNAME,
    ORDER_OPTIONS,
    PROVINCES,
    SEVENTY_FIVE,
    TWENTY_FIVE,
    ZERO
} from "../../../utils/Constants.tsx";
import {ShopToolbar} from "./ShopToolbar.tsx";
import {LoadingContext} from "../../../Navigation.tsx";
import {AutoCompleteCompleteEvent} from "primereact/autocomplete";
import {Suggestion} from "../../core/data/Suggestion.ts";
import {ItemComponent} from "../../core/items/ItemComponent.tsx";
import {useTranslation} from "react-i18next";

export const Shop = () => {
    const [clothes, setClothes] = useState<Clothe[]>();
    const {isLoading, setIsLoading} = useContext(LoadingContext)!;
    const [item, setItem] = useState<Clothe | undefined>(undefined);

    // Pagination states
    const [first, setFirst] = useState(ZERO); // First element of the current page
    const [rows, setRows] = useState(DEFAULT_ITEMS); // Number of items per page
    const [totalRecords, setTotalRecords] = useState(ZERO); // Total number of records

    // Filter states
    const [selectedProvince, setSelectedProvince] = useState(PROVINCES[0].value);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [orderBy, setOrderBy] = useState(ORDER_OPTIONS[0].value);
    const [search, setSearch] = useState(EMPTY);
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
    const [submitTrigger, setSubmitTrigger] = useState(false);
    const [maxPrice, setMaxPrice] = useState<number>(10000);

    // Autocomplete
    const [suggestions, setSuggestions] = useState<Suggestion[]>();
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const { t } = useTranslation();

    const autocomplete = (event: AutoCompleteCompleteEvent) => {
        const query = event.query.toLowerCase();

        // Filter all suggestions
        const filteredItems = suggestions!.filter(item =>
            (item.brand + " " + item.model).toLowerCase().includes(query) ||
            item.brand!.toLowerCase().includes(query) ||
            item.model!.toLowerCase().includes(query)
        )

        // Update suggestions
        setFilteredSuggestions(filteredItems.map(item => `${item.brand} ${item.model}`));
    }

    useEffect(() => {
        fetchClothes(first, rows).then();
    }, [first, rows, submitTrigger]); // Re-fetch when 'first' or 'rows' change

    // Fetch paginated clothes data from the backend
    async function fetchClothes(first: number, rows: number) {
        setIsLoading(true);

        const params = new URLSearchParams({
            page: (first / rows).toString(),
            size: rows.toString(),
        });

        if (search) params.append('search', search);
        if (selectedProvince && selectedProvince !== 'All Spain') params.append('location', selectedProvince);
        if (selectedCategories.length) selectedCategories.forEach(c => params.append('categories', c));
        if (selectedSizes.length) selectedSizes.forEach(s => params.append('sizes', s));
        if (orderBy) params.append('sort', orderBy);
        if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
        if (priceRange[1] < maxPrice) params.append('maxPrice', priceRange[1].toString());

        const response = await fetch(`${HOSTNAME}/clothes?${params.toString()}`);

        const data = await response.json();

        setClothes(data.content);
        setTotalRecords(data.totalElements);

        // Get the max price from the data content and update the slider max price
        // Get the max price from the data content and update the slider max price
        let max = 10000; // Default to 10000 if no items are found
        if (data.content.length > 0) {
            max = Math.max(...data.content.map((item: { price: Clothe; }) => item.price));
        }

        setPriceRange([priceRange[0], max]);  // Set the max value of the price range
        setMaxPrice(max);
        setIsLoading(false);
    }

    // Handle page change event from the Paginator
    const onPageChange = (e: { first: SetStateAction<number>; rows: SetStateAction<number>; }) => {
        setFirst(e.first); // First item of the new page
        setRows(e.rows); // Number of items per page
    };

    useEffect(() => {
        fetchSuggestions().then();
    }, [])

    async function fetchSuggestions() {
        const response = await fetch(`${HOSTNAME}/suggestions`);
        const data = await response.json();
        setSuggestions(data);
        setFilteredSuggestions(data);
    }

    return (
        <div>
            <Header/>

            {/* Search and filters bar */}
            <ShopToolbar
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                search={search}
                setSearch={setSearch}
                priceRange={priceRange}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                setPriceRange={setPriceRange}
                suggestions={filteredSuggestions}
                setSuggestions={autocomplete}
                maxPrice={maxPrice}
                onSubmit={() => {
                    // go start
                    setFirst(0);
                    // recharge trigger
                    setSubmitTrigger(prev => !prev);
                }}
            />

            {clothes?.length ? (
                <div className="flex flex-col justify-center items-center gap-10 pb-20">
                    <div className="flex flex-wrap justify-center gap-4">
                        {clothes.map((i, index) => (
                            <ItemComponent key={index} setItem={setItem} item={i} />
                        ))}

                        {/* Single Dialog outside the map */}
                        <Dialog
                            header={t("Item Details")}
                            visible={!!item} // Only visible if item is defined
                            style={{ width: '90vw', maxWidth: '900px' }}
                            onHide={() => setItem(undefined)}
                            dismissableMask
                            modal
                        >
                            {
                                item && <ItemDetails item={item} fetchClothes={() => {
                                    fetchClothes(first, rows).then()
                                }}/>
                            }
                        </Dialog>
                    </div>

                    {/* Pagination controls */}
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords} // Total records from the backend
                        rowsPerPageOptions={[TWENTY_FIVE, FIFTY, SEVENTY_FIVE]} // Options for how many rows per page
                        onPageChange={onPageChange} // Trigger when the page changes
                    />
                </div>
            ) : (
                isLoading ? (
                    <div className="card items-center w-full flex pt-10">
                        <ProgressSpinner
                            style={{width: '50px', height: '50px'}}
                            strokeWidth="6"
                            aria-label="Loading"
                            animationDuration=".8s"
                            className='p-progress-spinner-color'
                        />
                    </div>
                ) : (
                    <p className='text-center'>{t('No Items Found')}</p>
                )
            )}
        </div>
    );
};
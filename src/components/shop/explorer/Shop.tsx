import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../../Navigation.jsx';
import { ItemContext } from '../../../Navigation.jsx';
import { Header } from "../../header/Header.jsx";
import {HOSTNAME, ITEM_DETAILS} from "../../../utils/Constants.tsx";
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
            {/* Render clothes list or any other UI components */}
            {clothes?.length ? (
                <div>
                    {clothes.map((item, index) => (
                        <div key={index}>
                            <img src={`data:image/png;base64,${item.picture}`} alt={item.brand} />
                            <p onClick={() => goItem(item)}>{`${item.brand} ${item.model}`}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No clothes available.</p>
            )}
        </div>
    );
};
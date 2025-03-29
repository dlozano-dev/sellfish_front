import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../../Navigation.jsx';
import { ItemContext } from '../../../Navigation.jsx';
import { Header } from "../../header/Header.jsx";
import {HOSTNAME, ITEM_DETAILS} from "../../../utils/Constants.tsx";

export const Shop = () => {
    const [clothes, setClothes] = useState([]);
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

    function goItem(item) {
        setItem(item)
        setGlobalState(ITEM_DETAILS)
    }

    return (
        <div className="containerShop">
            <Header />
            {/* Render clothes list or any other UI components */}
            {clothes.length > 0 ? (
                <div className="clothes-list">
                    {clothes.map((item, index) => (
                        <div key={index} className="clothes-item">
                            {/* Render each item. For example, using base64 image data */}
                             <img src={`data:image/png;base64,${item.picture}`} alt={item.brand} />
                            <p onClick={() => goItem(item)}>{item.brand + " " + item.model}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No clothes available.</p>
            )}
        </div>
    );
};
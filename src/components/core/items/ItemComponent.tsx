import {Clothe} from "../../shop/data/Clothe.ts";
import React, {useContext, useEffect, useState} from "react";
import {HOSTNAME, SALE_STATES} from "../../../utils/Constants.tsx";
import axios from "axios";
import {UserIdContext} from "../../../Navigation.tsx";
import dagger_icon from "../../../assets/Icons/dagger.svg";
import dagger_bordered_icon from "../../../assets/Icons/dagger_bordered.png";
import {useTranslation} from "react-i18next";

export const ItemComponent = ({
    setItem, item
}: {
    item: Clothe
    setItem: React.Dispatch<React.SetStateAction<Clothe | undefined>>;
}) => {
    const { userId } = useContext(UserIdContext)!;
    const [fav, setFav] = useState(false);
    const { t } = useTranslation();

    async function setAsFavorite() {
        const response = await axios.get(`${HOSTNAME}/liked/${userId}/${item!.id}`);
        setFav(response.data)
    }

    useEffect(() => {
        const checkFav = async () => {
            const response = await axios.get(`${HOSTNAME}/isFav/${userId}/${item!.id}`);
            setFav(response.data)
        }

        checkFav().then();
    }, [userId, item]);

    return(
        <div
            onClick={() => setItem(item)}
            className="w-40 lg:w-80 lg:h-90 overflow-hidden rounded-md flex flex-col justify-end hover:cursor-pointer"
        >
            {/* Image wrapper with relative positioning */}
            <div className="relative w-full h-full">
                <img
                    src={`data:image/png;base64,${item.picture}`}
                    alt={item.brand}
                    className="w-full h-full object-cover rounded-md"
                />

                {/* Sword icon at bottom-right of the image */}
                <img
                    src={fav ? String(dagger_icon) : String(dagger_bordered_icon)}
                    alt='Favorite Icon'
                    onClick={(e) => {
                        e.stopPropagation();
                        setAsFavorite().then();
                    }}
                    className="w-16 h-16 cursor-pointer absolute bottom-2 right-0 z-10"
                />
            </div>

            <p className="py-2 text-gray-800 font-semibold items-start">
                {item.saleState !== SALE_STATES[0].value ?
                    <span className={item.saleState === SALE_STATES[1].value ? 'text-purple-800' : 'text-green-700'}>
                        {`[${t(item.saleState!)}] `}
                    </span>
                :
                    <span></span>
                }
                {`${item.price} €`}
            </p>
        </div>
    )
}
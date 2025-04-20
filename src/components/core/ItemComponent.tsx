import {Clothe} from "../shop/data/Clothe.ts";
import React from "react";
import {SALE_STATES} from "../../utils/Constants.tsx";

export const ItemComponent = ({
    setItem, item
}: {
    item: Clothe
    setItem: React.Dispatch<React.SetStateAction<Clothe | undefined>>;
}) => {

    return(
        <div
            onClick={() => setItem(item)}
            className="w-80 h-90 overflow-hidden rounded-md flex flex-col justify-end hover:cursor-pointer"
        >
            <img
                src={`data:image/png;base64,${item.picture}`}
                alt={item.brand}
                className="w-full h-full object-cover rounded-md"
            />

            <p className="py-2 text-gray-800 font-semibold items-start">
                {item.saleState!==SALE_STATES[0].value ?
                    <span className= {item.saleState===SALE_STATES[1].value ? 'text-purple-800' : 'text-green-700'}>
                        {`[${item.saleState}] `}
                    </span>
                :
                    <span></span>
                }
                {`${item.price} €`}
            </p>
        </div>
    )
}
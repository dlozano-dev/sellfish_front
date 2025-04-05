import { useContext } from 'react';
import { GlobalContext } from '../../../Navigation'
import { UserIdContext } from '../../../Navigation'
import { Image } from 'primereact/image';
import { GET, HOSTNAME, JSON } from "../../../utils/Constants.js";
import {Item} from "../data/Item.ts";

export const ItemDetails = ({ item }: { item: Item }) => {
    const {setGlobalState} = useContext(GlobalContext)!;
    const {userId} = useContext(UserIdContext)!;
    const icon = (<i className="pi pi-search"></i>)

    // function setAsFavorite() {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(GET, `${HOSTNAME}/liked/${userId}/${item!.id}`);
    //     xhr.send();
    //     xhr.responseType = JSON;
    //     xhr.onload = () => {
    //         setFav(xhr.response)
    //     };
    // }

    // function checkFav() {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open(GET, `${HOSTNAME}/isFav/${userId}/${item!.id}`);
    //     xhr.send();
    //     xhr.responseType = JSON;
    //     xhr.onload = () => {
    //         setFav(xhr.response)
    //     };
    // }

    // checkFav()

    function testChat() {
        const message = prompt('Chat to the seller')
        const request = `${HOSTNAME}/postMessage/${userId}/${item!.publisher}/${item!.id}/${message}/${Date.now()}/${userId}`

        const xhr = new XMLHttpRequest()
        xhr.open(GET, request, true)

        xhr.responseType = JSON
        console.log(request)
        xhr.send()

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log("Éxito:", xhr.response)
                setGlobalState("Chats")
            } else {
                console.error("Error:", xhr.statusText)
            }
        }
    }

    return (
        <div className="p-6 flex flex-col items-center">
            {/* Top Bar (if needed) */}
            <div className="w-full flex justify-between items-center mb-4 title">
                <div className="text-2xl font-semibold tracking-wide text-gray-800">
                    {item!.brand + " " + item!.model}
                </div>
                <div className="text-lg font-medium text-gray-600">
                    {item!.price}€
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-10 w-full">
                {/* Image section */}
                <div className="flex flex-col items-center">
                    <Image src={`data:image/png;base64,${item!.picture}`} indicatorIcon={icon} alt="Image" preview width="250"/>
                    <div className="flex space-x-2 mt-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <div
                                key={num}
                                className="w-6 h-6 bg-black text-white flex items-center justify-center text-sm font-bold rounded"
                            >
                                {num}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info section */}
                <div className="text-gray-800 text-base space-y-2">
                    <div className="pt-2 space-y-1">
                        <p>Size: {item!.size}</p>
                        <p>Category: {item!.category}</p>
                        <p>State: {item!.state}</p>
                    </div>
                    <p className="pt-5">Seller: {item!.publisher}</p>
                    <p>Uploaded: {new Date(Number(item.postDate)).toLocaleDateString('en-GB')}</p>

                    {/* Contact Button */}
                    <button
                        onClick={() => testChat()}
                        className="mt-4 px-6 py-2 bg-white border rounded hover:cursor-pointer hover:bg-black hover:text-white transition"
                    >
                        Contact to seller
                    </button>
                </div>
            </div>

            <p className="text-xs text-center mt-10 text-gray-400">CopyRight</p>
        </div>
    );
}
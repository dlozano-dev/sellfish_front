import {useContext, useRef, useState} from 'react';
import { GlobalContext } from '../../../Navigation'
import { UserIdContext } from '../../../Navigation'
import {GET, HOSTNAME, JSON as json, PUT, SALE_STATES} from "../../../utils/Constants.js";
import {Item} from "../data/Item.ts";
import GalleriaComponent from "../../core/Carrousel.tsx";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {Dropdown} from "primereact/dropdown";

export const ItemDetails = ({ item }: { item: Item }) => {
    const {setGlobalState} = useContext(GlobalContext)!;
    const {userId} = useContext(UserIdContext)!;
    const [saleState, setSaleState] = useState(item.saleState);
    const [existsChanges, setExistsChanges] = useState(false);
    const toast = useRef<Toast>(null);

    const showWarn = () => {
        toast.current?.clear()
        toast.current?.show({severity:'warn', summary: 'Warning', detail:"You can't contact yourself!", life: 3000});
    }
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
        if (item.publisher === userId) {
            showWarn()
            return;
        }

        const message = prompt('Chat to the seller')
        const request = `${HOSTNAME}/postMessage/${userId}/${item!.publisher}/${item!.id}/${message}/${Date.now()}/${userId}`

        const xhr = new XMLHttpRequest()
        xhr.open(GET, request, true)
        xhr.responseType = json
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

    function setChanges(action: () => void) {
        action();
        setExistsChanges(true);
    }

    function saveChanges() {
        fetch(`${HOSTNAME}/clothes/${item.id}`, {
            method: PUT,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                brand: item.brand,
                model: item.model,
                category: item.category,
                price: item.price,
                publisher: item.publisher,
                picture: item.picture,
                size: item.size,
                state: item.state,
                location: item.location,
                saleState: saleState, // Updated value
            })
        }).then(res => {
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        }).then(() => {
            setExistsChanges(false);
            toast.current?.show(
                {severity: 'success', summary: 'Success', detail: 'Changes saved successfully!', life: 3000}
            );
        }).catch(() => {
            toast.current?.show(
                {severity: 'error', summary: 'Error', detail: 'Failed to save changes.', life: 3000}
            );
        });
    }

    return (
        <div className="p-6 flex flex-col items-center">
            {/* Top Bar */}
            <div className="w-full flex justify-between items-center mb-4 title">
                <Toast ref={toast} />

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
                    <GalleriaComponent pictures={[item!.picture!, item!.picture!]}/>
                </div>

                {/* Info section */}
                <div className="text-gray-800 text-base space-y-2">
                    <div className="pt-2 space-y-1">
                        <p>Size: {item!.size}</p>
                        <p>Category: {item!.category}</p>
                        <p>State: {item!.state}</p>
                    </div>
                    <p className="mt-30">Seller: {item!.publisher}</p>
                    <p>Uploaded: {new Date(Number(item.postDate)).toLocaleDateString('en-GB')}</p>

                    {/* Contact Button */}
                    <div className='flex'>
                        <Button
                            label="Contact to seller"
                            onClick={() => testChat()}
                        />
                        { item!.publisher === userId ?
                            <div>
                                {/*SALE_STATES*/}
                                <Dropdown
                                    value={saleState}
                                    onChange={(e) => setChanges(() => setSaleState(e.value))} options={SALE_STATES}
                                    optionLabel="name"
                                    checkmark={true}
                                    placeholder="Sale state"
                                    className="w-full h-12 items-center mx-2"
                                />
                            </div>
                        :
                            <div></div>
                        }
                        { existsChanges ?
                            <div>
                                {/*SALE_STATES*/}
                                <Button
                                    label="Save changes"
                                    onClick={() => saveChanges()}
                                />
                            </div>
                            :
                            <div></div>
                        }
                    </div>
                </div>
            </div>

            <p className="text-xs text-center mt-10 text-gray-400">CopyRight</p>
        </div>
    );
}
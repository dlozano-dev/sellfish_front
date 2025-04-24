import {useContext, useRef, useState} from 'react';
import {GlobalContext, UserContext} from '../../../Navigation'
import { UserIdContext } from '../../../Navigation'
import {CHATS, EMPTY, HOSTNAME, PUT, SALE_STATES} from "../../../utils/Constants.js";
import {Clothe} from "../data/Clothe.ts";
import GalleriaComponent from "../../core/items/Carrousel.tsx";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";
import {AutoComplete, AutoCompleteCompleteEvent} from "primereact/autocomplete";
import axios from "axios";
import {FloatLabel} from "primereact/floatlabel";
import {InputTextarea} from "primereact/inputtextarea";

export const ItemDetails = ({
    item, fetchClothes
}:{
    item: Clothe;
    fetchClothes: () => void;
}) => {
    const {setGlobalState} = useContext(GlobalContext)!;
    const {userId} = useContext(UserIdContext)!;
    const {user} = useContext(UserContext)!;
    const [saleState, setSaleState] = useState(item.saleState);
    const [existsChanges, setExistsChanges] = useState(false);
    const [showSaleDialog, setShowSaleDialog] = useState(false);
    const [showChatDialog, setShowChatDialog] = useState(false);
    const [search, setSearch] = useState(EMPTY);
    const [message, setMessage] = useState(EMPTY);
    const [suggestions, setSuggestions] = useState<string[]>();
    const toast = useRef<Toast>(null);

    const showWarn = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'warn', summary: 'Warning', detail:message, life: 3000});
    }

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    }

    const showSuccess = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'success', summary: 'Success', detail: message, life: 3000});
    }

    async function initChat() {
        if (item.publisher === userId) {
            showWarn("You can't contact yourself!");
            return;
        }

        try {
            await axios.get(`${HOSTNAME}/postMessage/${userId}/${item!.publisher}/${item!.id}/${message}/${Date.now()}/${userId}`);
            setGlobalState(CHATS);
        } catch {
            showError("The message couldn't be sent");
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
                saleState: saleState,
            })
        }).then(res => {
            if (!res.ok) throw new Error("Update failed");
            return res.json();
        }).then(() => {
            setExistsChanges(false);
            showSuccess('Changes saved successfully!');
            setShowSaleDialog(true);
            fetchClothes();
        }).catch(() => {
            showError('Failed to save changes.');
        });
    }

    const autocomplete = async (event: AutoCompleteCompleteEvent) => {
        const query = event.query.trim().toLowerCase();

        if (!query) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get<string[]>(`${HOSTNAME}/searchUsernames/${query}`);
            setSuggestions(response.data);
        } catch {
            // Don't do anything, just they are 0 suggestions
        }
    };

    const finishSale = async () => {
        if (!search || search.trim() === '') {
            showWarn("Please select a buyer");
            return;
        }

        if (search === user) {
            showWarn("You can't buy your own item!");
            return;
        }

        try {
            await axios.post(`${HOSTNAME}/sales/register`, null, {
                params: {
                    productId: item.id,
                    sellerId: userId,
                    buyerUsername: search
                }
            });

            showSuccess("Sale registered successfully!");
            setShowSaleDialog(false);
        } catch {
            showError("Error registering sale");
        }
    };

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
                        { item!.publisher === userId ?
                            // Sale states
                            <Dropdown
                                value={saleState}
                                onChange={(e) => setChanges(() => setSaleState(e.value))} options={SALE_STATES}
                                optionLabel="name"
                                checkmark={true}
                                placeholder="Sale state"
                                className="h-12 items-center me-2"
                                disabled={saleState === SALE_STATES[2].value && !existsChanges}
                            />
                        :
                            <Button
                                label="Contact to seller"
                                onClick={() => setShowChatDialog(true)}
                            />
                        }
                        { existsChanges ?
                            <Button label="Save" onClick={() => saveChanges()}/>
                        :
                            <div></div>
                        }
                    </div>
                </div>
            </div>

            <p className="text-xs text-center mt-10 text-gray-400">CopyRight</p>

            <Dialog header="Complete your sale" visible={showSaleDialog} modal style={{width: '90vw', maxWidth: '600px'}} onHide={() => setShowSaleDialog(false)}>

                <label htmlFor="username">Select the user who bought your product</label>
                <AutoComplete
                    value={search}
                    placeholder="Search"
                    suggestions={suggestions}
                    completeMethod={autocomplete}
                    onChange={(e) => setSearch(e.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            finishSale().then();
                        }
                    }}
                    className="me-3"
                />

                <Button label='Submit' onClick={() => finishSale()} />
            </Dialog>

            <Dialog
                header="Header"
                visible={showChatDialog}
                onHide={() => {
                    setShowChatDialog(false)
                    setMessage(EMPTY)
                }}
                style={{ width: '50vw' }}
                breakpoints={{ '960px': '75vw', '641px': '100vw' }}
            >
                <FloatLabel className='mt-5'>
                    <InputTextarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        aria-multiline={false}
                        className='w-full'
                    />
                    <label htmlFor="message">Contact to seller</label>
                </FloatLabel>

                <div className="flex justify-end mt-4">
                    <Button label="Send" onClick={() => initChat()} />
                </div>
            </Dialog>
        </div>
    );
}
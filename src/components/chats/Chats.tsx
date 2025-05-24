import React, {useState, useContext, useEffect, useRef} from 'react'
import {GlobalContext, ProfileIdContext, UserIdContext} from '../../Navigation'
import {EMPTY, ENTER, GET, HOSTNAME, JSON, PROFILE} from "../../utils/Constants.tsx";
import {Header} from "../core/Header.tsx";
import {Clothe} from "../shop/data/Clothe.ts";
import axios from "axios";
import {Avatar} from "primereact/avatar";
import {Toast} from "primereact/toast";
import {TabPanel, TabView} from "primereact/tabview";
import {Dialog} from 'primereact/dialog';
import {Rating} from 'primereact/rating';
import {InputTextarea} from 'primereact/inputtextarea';
import {Button} from 'primereact/button';
import {useTranslation} from "react-i18next";

type Message = {
    id: number;                 // Unique identifier for the message
    sender: number | null;      // The sender's user ID
    receiver: number | null;    // The receiver's user ID
    buyer: number | null;       // The buyer's user ID
    message: string | null;     // The content of the message
    time: number | null;        // Timestamp when the message was sent
    product: number | null;     // The id of the associated product
    brand: string | null;       // The brand of the associated product
    model: string | null;       // The model of the associated product
};

type Review = {
    saleId: number;
    productId: number;
    clothe: {
        id: number;
        brand: string;
        model: string;
        category: string;
        price: number;
        publisher: number;
        picture: string;
        postDate: string;
        size: string;
        state: string;
        location: string;
        saleState: string;
        favoritesCount: number;
    };
    seller: string; // username
};

export const Chats = () => {
    const {setGlobalState} = useContext(GlobalContext)!;
    const {userId} = useContext(UserIdContext)!;
    const {setProfileId} = useContext(ProfileIdContext)!;
    // Clothes that have chat
    const [chats, setChats] = useState<Clothe[]>([]);
    // Messages of the selected chat
    const [chat, setChat] = useState<Message[]>([]);
    // A single chat item
    const [item, setItem] = useState<Clothe | null>();
    // Last message of the selected chat
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [chatterPfp, setChatterPfp] = useState<string | null>();
    const [chatterId, setChatterId] = useState<string | null>();
    const [chatterName, setChatterName] = useState<string | null>();
    const prevChatRef = useRef<Message[]>([]);
    const toast = useRef<Toast>(null);
    const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [rateValue, setRateValue] = useState<number | null>(null);
    const [reviewText, setReviewText] = useState(EMPTY);
    const { t } = useTranslation();

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity: 'error', summary: t('Error'), detail: message, life: 3000});
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ENTER) {
            const message = document.getElementById("input2") as HTMLInputElement;
            const sender = userId === item!.publisher ? item!.publisher : chat[0].buyer;
            const receiver = userId === item!.publisher ? chat[0].buyer : item!.publisher;
            const request = `${HOSTNAME}/postMessage/${sender}/${receiver}/${item!.id}/${message.value}/${Date.now()}/${chat[0].buyer}`;

            const xhr = new XMLHttpRequest();
            xhr.open(GET, request, true);
            xhr.responseType = JSON;
            xhr.send();

            xhr.onload = function () {
                if (xhr.status === 200) {
                    getChat(item!.id!, item!.publisher!);
                    // Clear the input after sending the message
                    message.value = EMPTY;
                }
            }
        }
    }

    async function fetchChats() {
        const response = await fetch(`${HOSTNAME}/chats/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChats(data);  // Set the fetched chats
    }

    function getChat(id: string, publisher: string) {
        const request = `${HOSTNAME}/message/user/${userId}/product/${id}`;
        const xhr = new XMLHttpRequest();
        xhr.open(GET, request, true);
        xhr.responseType = JSON;
        xhr.send();
        xhr.onload = () => {
            const contactUser = userId === publisher ? xhr.response[0].buyer : publisher;
            // Set the chat messages
            setChat(xhr.response);

            // If user isn't the seller, get the buyer picture instead
            getProfilePicture(contactUser).then();
            getUsername(contactUser).then();
        }
    }

    async function getProfilePicture(userId: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/profilePicture/${userId}`);

            // Set the new profile picture in state
            setChatterPfp(response.data);
        } catch {
            // Do nothing (user doesn't have profile picture)
            setChatterPfp(null);
        }
    }

    async function getUsername(userId: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/getUsername/${userId}`);

            // Set the new contact username in state
            setChatterId(userId);
            setChatterName(response.data);
        } catch (error) {
            setChatterName('Unknown user');
            console.error('Error fetching profile picture:', error);
        }
    }

    useEffect(() => {
        axios.get(`${HOSTNAME}/sales/unrated/${userId}`)
            .then(res => setPendingReviews(res.data))
            .catch(() => showError(t('error_pending_reviews')));
    }, [userId]);

    useEffect(() => {
        if (!item) return;

        const interval = setInterval(() => {
            getChat(item.id!, item.publisher!);
        }, 3000);

        return () => clearInterval(interval);
    }, [item]);

    useEffect(() => {
        fetchChats()
            .then()
            .catch(() => {
                showError(t('error_fetching_chats'));
            });
    }, [])

    // Scroll to the bottom when chat messages change
    useEffect(() => {
        const prevChat = prevChatRef.current;
        const newMessages = chat;

        // Check between old and new messages
        const isDifferent = prevChat.length !== newMessages.length ||
            !prevChat.every((msg, index) => msg.id === newMessages[index].id);

        if (isDifferent && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: "smooth"});
        }

        // Replace previous list for the new one
        prevChatRef.current = newMessages;
    }, [chat]);

    return (
        <div>
            <Header/>
            <div className="flex justify-center items-center w-full text-black pt-10">
                <Toast ref={toast}/>

                <div className="w-full flex px-5">
                    <TabView
                        className={`w-full lg:w-1/4 max-h-[80vh] text-start bg-white rounded-lg shadow lg:mr-5 overflow-y-auto no-tabview-padding lg:block ${chat.length > 0 ? ('hidden') : ('block')}`}>
                        <TabPanel header={t("Chats")} leftIcon="pi pi-inbox mr-2">
                            <div className="h-[80vh] overflow-y-auto pr-2">
                                {chats.length > 0 ? (
                                    chats.map((i, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setItem(i)
                                                getChat(i!.id!, i!.publisher!)
                                            }}
                                            className={i!.id === item?.id
                                                ? "flex items-center py-2 cursor-pointer hover:opacity-80 bg-gray-100"
                                                : "flex items-center py-2 cursor-pointer hover:opacity-80"
                                            }
                                        >
                                            <img
                                                src={`data:image/png;base64,${i.picture}`}
                                                alt={i.brand}
                                                className="w-17 h-17 object-cover rounded-md mx-4"

                                            />
                                            <div>
                                                <p className='text-md'>{i.brand + " " + i.model}</p>
                                                <p className='text-stone-600'>{i.price + " €"}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-center mt-5'>{t('No chats opened')}</p>
                                )}
                            </div>
                        </TabPanel>
                        <TabPanel header={t("Pending reviews")} leftIcon="pi pi-clock mr-2">
                            <div className="h-[80vh] overflow-y-auto pr-2">
                                {pendingReviews.length > 0 ? pendingReviews.map((rev, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center cursor-pointer hover:bg-gray-100 py-2 px-4"
                                        onClick={() => {
                                            setSelectedReview(rev);
                                            setRateValue(null);
                                            setReviewText("");
                                            setVisibleDialog(true);
                                        }}
                                    >
                                        <img
                                            src={`data:image/png;base64,${rev.clothe.picture}`}
                                            className="w-17 h-17 object-cover rounded-md mr-4"
                                            alt={'Item picture'}
                                        />
                                        <div>
                                            <p className="text-md">{rev.clothe.brand} {rev.clothe.model}</p>
                                            <p className="text-sm text-stone-600">Seller: {rev.seller}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className='flex items-center justify-center mt-5'>
                                        <span>{t('no_pending_reviews')}</span>
                                        <i className='ml-2 pi pi-check-square'/>
                                    </div>
                                )}
                            </div>
                        </TabPanel>
                    </TabView>

                    {chat.length > 0 ? (
                        <div className={`flex flex-col h-[80vh] w-full lg:w-5/7 bg-white rounded-lg shadow p-6 space-y-2`}>
                            <div className="w-full flex px-5 pb-2 border-b-2 border-stone-800">
                                <div>
                                    <div
                                        className='cursor-pointer flex justify-between w-full'
                                    >
                                        <div
                                            className='flex'
                                            onClick={() => {
                                                setProfileId(chatterId!)
                                                setGlobalState(PROFILE)
                                            }}
                                        >
                                            {chatterPfp != null ?
                                                <Avatar
                                                    image={`data:image/png;base64,${chatterPfp}`}
                                                    size="large"
                                                    className='shadow-md rounded-md mr-3'
                                                />
                                                :
                                                <Avatar
                                                    icon="pi pi-user"
                                                    size="large"
                                                    className='shadow-md rounded-md mr-3'
                                                    style={{backgroundColor: '#ffffff', color: '#5e5e5e'}}
                                                />
                                            }
                                            <p className='text-stone-800'>{chatterName}</p>
                                        </div>


                                        <div className='ml-auto flex justify-end items-center lg:hidden'>
                                            <i className="pi pi-arrow-left text-stone-600 cursor-pointer"
                                               style={{fontSize: '1.5rem'}}
                                               onClick={() => {
                                                   setItem(null)
                                                   setChat([])
                                               }}
                                            />
                                        </div>

                                    </div>
                                    <div className='w-full mt-2'>
                                        <p className='text-stone-950'>{item?.brand + " " + item?.model}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable chat container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                <div className="flex flex-col space-y-2">
                                    {chat.map((item, index) => {
                                        // Get the current message's timestamp
                                        const currentTime = new Date(item!.time!);

                                        // Check if the current message is in the same minute as the previous one
                                        const showDate = index === 0 ||
                                            new Date(chat[index - 1].time!).getMinutes() !== currentTime.getMinutes() ||
                                            new Date(chat[index - 1].time!).getHours() !== currentTime.getHours() ||
                                            new Date(chat[index - 1].time!).getDate() !== currentTime.getDate() ||
                                            new Date(chat[index - 1].time!).getMonth() !== currentTime.getMonth() ||
                                            new Date(chat[index - 1].time!).getFullYear() !== currentTime.getFullYear();

                                        return (
                                            <div
                                                key={index}
                                                className={
                                                    item.sender === userId
                                                        ? "self-end flex flex-col items-end w-full"
                                                        : "self-start flex flex-col items-start w-full"
                                                }
                                            >
                                                {/* Date and time, only show for first message of the minute */}
                                                {showDate && (
                                                    <span
                                                        className={
                                                            item.sender === userId
                                                                ? "text-xs text-stone-400 block self-end"
                                                                : "text-xs text-stone-400 block self-start"
                                                        }
                                                    >
                                                        {currentTime.toLocaleString('es-ES', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                )}

                                                {/* Message */}
                                                <p
                                                    className={
                                                        item.sender === userId
                                                            ? "message-own text-white rounded-lg p-2"
                                                            : "bg-gray-300 text-black rounded-lg p-2"
                                                    }
                                                >
                                                    {item.message}
                                                </p>
                                            </div>
                                        );
                                    })}
                                    {/* Dummy element to auto-scroll into view */}
                                    <div ref={messagesEndRef}/>
                                </div>
                            </div>

                            {/* Input at the bottom */}
                            <div className="mt-2">
                                <input
                                    type="text"
                                    id="input2"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className='h-[80vh] hidden lg:flex w-full lg:w-5/7 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center'>
                            <i className="pi pi-inbox text-stone-600" style={{fontSize: '1.5rem'}}/>
                            <span className="text-stone-600 text-lg">{t('No chats opened')}</span>
                        </div>
                    )}
                </div>

                <Dialog
                    header="Leave a Review"
                    visible={visibleDialog}
                    style={{width: '30vw'}}
                    onHide={() => setVisibleDialog(false)}
                >
                    {selectedReview && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={`data:image/png;base64,${selectedReview.clothe.picture}`}
                                    className="w-20 h-20 object-cover rounded-md"
                                    alt={'Item Picture'}
                                />
                                <div>
                                    <p className="text-lg">{selectedReview.clothe.brand} {selectedReview.clothe.model}</p>
                                    <p className="text-sm text-stone-600">Seller: {selectedReview.seller}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2">Rating (required)</label>
                                <Rating value={rateValue!} cancel={false} onChange={(e) => setRateValue(e.value!)} />
                            </div>
                            <div>
                                <label className="block mb-2">Review (optional)</label>
                                <InputTextarea
                                    autoResize
                                    rows={3}
                                    value={reviewText}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setReviewText(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <Button
                                label="Submit"
                                icon="pi pi-check"
                                disabled={!rateValue}
                                onClick={() => {
                                    axios.put(`${HOSTNAME}/sales/review/${selectedReview.saleId}`, null, {
                                        params: {
                                            rate: rateValue,
                                            review: reviewText
                                        }
                                    }).then(() => {
                                        toast.current?.show({severity: 'success', summary: 'Review submitted'});
                                        setPendingReviews(pendingReviews.filter(p => p.saleId !== selectedReview.saleId));
                                        setVisibleDialog(false);
                                    }).catch(() => {
                                        showError(t('review_submit_fail'));
                                    });
                                }}
                            />
                        </div>
                    )}
                </Dialog>

            </div>
            <style>
                {`
                    /* Scoped override just for this file */
                    .no-tabview-padding .p-tabview-panels {
                        padding: 0 !important;
                    }
                `}
            </style>
        </div>
    )
}

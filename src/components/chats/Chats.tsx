import React, {useState, useContext, useEffect, useRef} from 'react'
import { UserIdContext } from '../../Navigation'
import {EMPTY, ENTER, GET, HOSTNAME, JSON} from "../../utils/Constants.tsx";
import { Header } from "../header/Header.tsx";
import { Item } from "../shop/data/Item.ts";
import axios from "axios";
import {Avatar} from "primereact/avatar";

// Define the Message type based on the database schema
type Message = {
    id: number;                 // Unique identifier for the message
    product: number | null;     // The associated product (nullable)
    sender: number | null;      // The sender's user ID (nullable)
    receiver: number | null;    // The receiver's user ID (nullable)
    message: string | null;     // The content of the message (nullable)
    time: number | null;        // Timestamp when the message was sent (nullable)
    buyer: number | null;       // The buyer's user ID (nullable)
    brand: string | null;
    model: string | null;
};

export const Chats = () => {
    const { userId } = useContext(UserIdContext)!
    // Clothes that have chat
    const [ chats, setChats ] = useState<Item[]>([])
    // Messages of the selected chat
    const [ chat, setChat ] = useState<Message[]>([])
    // A single chat item
    const [ item, setItem ] = useState<Item>()
    // Last message of the selected chat
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [ chatterPfp, setChatterPfp ] = useState<string | null>()
    const [ chatterName, setChatterName ] = useState<string | null>()

    useEffect(() => {
        fetchChats()
            .then()
            .catch(e =>
                // TODO snackbar
                console.error('Error fetching chats:', e)
            );
    }, [])

    useEffect(() => {
        if (!item) return;

        const interval = setInterval(() => {
            getChat(item.id!, item.publisher!);
        }, 3000);

        return () => clearInterval(interval);
    }, [item]);

    async function fetchChats() {
        const response = await fetch(`${HOSTNAME}/chats/${userId}`)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setChats(data)  // Set the fetched chats
    }

    function getChat(id: string, publisher: string) {
        const request = `${HOSTNAME}/message/user/${userId}/product/${id}`
        const xhr = new XMLHttpRequest()
        xhr.open(GET, request, true)
        xhr.responseType = JSON
        xhr.send()
        xhr.onload = () => {
            const contactUser = userId === publisher ? xhr.response[0].buyer : publisher
            console.log(contactUser)
            // Set the chat messages
            setChat(xhr.response)
            // If user isn't the seller, get the buyer picture instead
            getProfilePicture(contactUser).then()
            getUsername(contactUser).then()
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === ENTER) {
            const message = document.getElementById("input2") as HTMLInputElement
            const sender = userId === item!.publisher ? item!.publisher : chat[0].buyer
            const receiver = userId === item!.publisher ? chat[0].buyer : item!.publisher
            const request = `${HOSTNAME}/postMessage/${sender}/${receiver}/${item!.id}/${message.value}/${Date.now()}/${chat[0].buyer}`

            const xhr = new XMLHttpRequest()
            xhr.open(GET, request, true)
            xhr.responseType = JSON
            xhr.send()

            xhr.onload = function () {
                if (xhr.status === 200) {
                    getChat(item!.id!, item!.publisher!)
                    // Clear the input after sending the message
                    message.value = EMPTY
                }
            }
        }
    }

    // Scroll to the bottom when chat messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    async function getProfilePicture(userId: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/profilePicture/${userId}`);

            // Set the new profile picture in state
            setChatterPfp(response.data);
        } catch (error) {
            console.error(error);
            // Do nothing (user doesn't have profile picture)
            setChatterPfp(null);
        }
    }

    async function getUsername(userId: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/getUsername/${userId}`);

            // Set the new contact username in state
            setChatterName(response.data);
        } catch (error) {
            setChatterName('Unknown user');
            console.error('Error fetching profile picture:', error);
        }
    }

    return (
        <div>
            <Header />
            <div className="flex justify-center items-center w-full text-black pt-10">
                <div className="w-full flex px-5">
                    {chats.length > 0 ? (
                        <div className="w-1/4 max-h-[80vh] text-start bg-white rounded-lg shadow mr-5">
                            <div className="p-4 border-b-2 text-gray-800 flex items-center">
                                <i className="pi pi-inbox text-stone-800 mr-2" style={{fontSize: '1.2rem'}}/>
                                <span className='text-lg'>Chats</span>
                            </div>
                            {chats.map((i, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setItem(i)
                                        getChat(i!.id!, i!.publisher!)
                                    }}
                                    className={ i!.id === item?.id
                                        ? "flex py-2 cursor-pointer hover:opacity-80 bg-gray-100"
                                        : "flex py-2 cursor-pointer hover:opacity-80"
                                    }
                                >
                                    <img
                                        src={`data:image/png;base64,${i.picture}`}
                                        alt={i.brand}
                                        className="w-20 h-20 object-cover rounded-md mx-4"
                                    />
                                    <div className="flex flex-col">
                                        <span>{i.brand + " " + i.model}</span>
                                        <span className='text-stone-600'>{i.price + " €"}</span>
                                        <span className='text-stone-800'>{i.publisherName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>0 chats opened.</p>
                    )}

                    {chat.length > 0 ? (
                        <div className="flex flex-col h-[80vh] w-5/7 bg-white rounded-lg shadow p-6 space-y-2">
                            <div className="w-full flex px-5 pb-2 border-b-2 border-stone-800">
                                {chatterPfp != null ?
                                    <Avatar
                                        image={`data:image/png;base64,${chatterPfp}`}
                                        size="large"
                                        className='shadow-md rounded-md mx-3'
                                    />
                                    :
                                    <Avatar
                                        icon="pi pi-user"
                                        size="large"
                                        className='shadow-md rounded-md mx-3'
                                        style={{backgroundColor: '#ffffff', color: '#5e5e5e'}}
                                    />
                                }
                                <div>
                                    <p className='text-stone-800'>{chatterName}</p>
                                    <p className='text-stone-950'>{item?.brand + " " + item?.model}</p>
                                </div>
                            </div>

                            {/* Scrollable chat container */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                <div className="flex flex-col space-y-2">
                                    {chat.map((item, index) => (
                                        <div
                                            key={index}
                                            className={
                                                item.sender === userId
                                                    ? "self-end message-own text-white rounded-lg p-2"
                                                    : "self-start bg-gray-300 text-black rounded-lg p-2"
                                            }
                                        >
                                            <p>{item.message}</p>
                                        </div>
                                    ))}
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
                        <div className='h-[80vh] w-5/7 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center'>
                            <i className="pi pi-inbox text-stone-600" style={{fontSize: '1.5rem'}}/>
                            <span className="text-stone-600 text-lg">{'No chats opened'}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

import React, {useState, useContext, useEffect, useRef} from 'react'
import { UserIdContext } from '../../Navigation'
import {EMPTY, ENTER, GET, HOSTNAME, JSON} from "../../utils/Constants.tsx";
import { Header } from "../header/Header.tsx";
import { Item } from "../shop/data/Item.ts";

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

    useEffect(() => {
        fetchChats()
            .then()
            .catch(e =>
                // TODO snackbar
                console.error('Error fetching chats:', e)
            );
    })

    async function fetchChats() {
        const response = await fetch(`${HOSTNAME}/chats/${userId}`)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setChats(data)  // Set the fetched chats
    }

    function getChat(id: string) {
        const request = `${HOSTNAME}/message/user/${userId}/product/${id}`
        const xhr = new XMLHttpRequest()
        xhr.open(GET, request, true)
        xhr.responseType = JSON
        xhr.send()
        // Set the chat messages
        xhr.onload = () => { setChat(xhr.response) }
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
                    getChat(item!.id!)
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

    return (
        <div>
            <Header />
            <div className="flex justify-center items-center w-full text-black pt-10">
                <div className="w-full flex px-5">
                    {chats.length > 0 ? (
                        <div className="w-1/4 text-center">
                            {chats.map((item, index) => (
                                <div key={index} className="py-2">
                                    <p className="cursor-pointer" onClick={() => {
                                        getChat(item!.id!)
                                        setItem(item)
                                    }}>{item.brand + " " + item.model}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>0 chats opened.</p>
                    )}

                    {chat.length > 0 ? (
                        <div className="flex flex-col max-h-[calc(80vh)] w-5/7 bg-white rounded-lg p-6 space-y-2 shadow">
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
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    )
}

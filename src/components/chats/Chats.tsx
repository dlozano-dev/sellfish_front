import React, { useState, useContext, useEffect } from 'react'
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
    //Messages of a single chat
    const [ chat, setChat ] = useState<Message[]>([])
    // A single chat item
    const [ item, setItem ] = useState<Item>()

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

            console.log(request)

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

    return (
        <div>
            <Header />
            <div className="flex flex-col justify-center items-center w-full text-black pb-20">
                <h1 className="text-3xl font-semibold">C H A T S</h1>
                <div className="w-full flex px-5">
                    {chats.length > 0 ? (
                        <div className="text-left pr-5">
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
                        <div className="w-4/5">
                            <div className="flex flex-col space-y-2">
                                {chat.map((item, index) => (
                                    <div
                                        key={index}
                                        className={ item.sender === userId ?
                                            'self-end bg-black text-white rounded-lg p-2'
                                        :
                                            'self-start bg-gray-300'
                                        }
                                    >
                                        <p>{item.message}</p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    id="input2"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    onKeyDown={handleKeyDown}
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

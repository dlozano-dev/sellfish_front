import { useState, useContext } from 'react';
import { ItemContext } from '../../../Navigation';
import { GlobalContext } from '../../../Navigation'
import { UserIdContext } from '../../../Navigation'
import { Header } from "../../header/Header";
import { GET, HOSTNAME, JSON } from "../../../utils/Constants.js";

export const ItemDetails = () => {
    const {item} = useContext(ItemContext)!;
    const {setGlobalState} = useContext(GlobalContext)!;
    const {userId} = useContext(UserIdContext)!;
    const [isFav, setFav] = useState(false)

    function setAsFavorite() {
        const xhr = new XMLHttpRequest();
        xhr.open(GET, `${HOSTNAME}/liked/${userId}/${item.id}`);
        xhr.send();
        xhr.responseType = JSON;
        xhr.onload = () => {
            setFav(xhr.response)
        };
    }

    function checkFav() {
        const xhr = new XMLHttpRequest();
        xhr.open(GET, `${HOSTNAME}/isFav/${userId}/${item.id}`);
        xhr.send();
        xhr.responseType = JSON;
        xhr.onload = () => {
            setFav(xhr.response)
        };
    }

    checkFav()

    function testChat() {
        let message = prompt('Chat to the seller')
        let request = `${HOSTNAME}/postMessage/${userId}/${item.publisher}/${item.id}/${message}/${Date.now()}/${userId}`

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
        <div className="containerShop">
            <Header />
            <h1>Item details</h1>
            {/* Render clothes list or any other UI components */}
            <p>{item.brand + " " + item.model}</p>
            <p onClick={() => testChat()}>Contact seller</p>
            <p onClick={() => setGlobalState("Shop")}>Go back</p>
            <p onClick={() => setAsFavorite()} style={ isFav ? {color: 'greenYellow'} : {color: 'red'} }>{"Fav"}</p>
        </div>
    );
}
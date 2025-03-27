import React, { useContext } from 'react';
import { GlobalContext } from './Navigation.js';
import { UserContext } from './Navigation.js';
import { Login } from './components/login/Login';
import { Settings } from './components/settings/Settings';
import { Home } from "./components/home/Home.jsx";
import {HOME, SETTINGS} from "./utils/Constants.tsx";

function App() {
    const { globalState } = useContext(GlobalContext);
    const { user } = useContext(UserContext);

    return (
        <div className="w-screen h-screen">
            {
                // user === null ? <Login/> :
                // globalState === "Publish" ? <Publish/> :
                // globalState === "Shop" ? <Shop/> :
                // globalState === "ItemDetails" ? <ItemDetails/> :
                // globalState === "Wishlist" ? <Wishlist/> :
                // globalState === "Chats" ? <Chats/> :
                globalState === SETTINGS ? <Settings/> :
                globalState === HOME ? <Home/> : <Home/>
            }
        </div>
    )
}

export default App
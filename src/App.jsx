import React, { useContext } from 'react';
import { GlobalContext } from './Navigation';
import { UserContext } from './Navigation';
import { Login } from './components/login/Login'
import {Home} from "./components/home/Home.jsx";

function App() {
    const { globalState } = useContext(GlobalContext);
    const { user } = useContext(UserContext);

    return (
        <div className="w-screen h-screen">
            {
                user===null?
                    <Login/>
                // :globalState==="Configuration"?
                //     <Config/>
                // :globalState==="Publish"?
                //     <Publish/>
                // :globalState==="Shop"?
                //     <Shop/>
                // :globalState==="ItemDetails"?
                //     <ItemDetails/>
                // :globalState==="Wishlist"?
                //     <Wishlist/>
                // :globalState==="Chats"?
                //     <Chats/>
                :<Home/>
            }
        </div>
    )
}

export default App
import { useContext } from 'react';
import { GlobalContext } from './Navigation';
import { UserContext } from './Navigation';
import { Login } from './components/login/Login';
import { Settings } from './components/settings/Settings';
import { Home } from "./components/home/Home.tsx";
import {HOME, POST, SETTINGS, SHOP} from "./utils/Constants.tsx";
import {Post} from "./components/post/Post.tsx";
import {Shop} from "./components/shop/explorer/Shop.tsx";

function App() {
    const { globalState } = useContext(GlobalContext)!;
    const { user } = useContext(UserContext)!;

    return (
        <div className="w-screen h-screen">
            {
                user === null ? <Login/> :
                globalState === POST ? <Post/> :
                globalState === SHOP ? <Shop/> :
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
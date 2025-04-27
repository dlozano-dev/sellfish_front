import { useContext } from 'react';
import { GlobalContext } from './Navigation';
import { UserContext } from './Navigation';
import { Login } from './components/login/Login';
import { Settings } from './components/settings/Settings';
import { Home } from "./components/home/Home.tsx";
import {ABOUT_US, CHATS, CONTACT_US, HOME, POST, PROFILE, SETTINGS, SHOP, WISHLIST} from "./utils/Constants.tsx";
import {Post} from "./components/post/Post.tsx";
import {Shop} from "./components/shop/explorer/Shop.tsx";
import {Chats} from "./components/chats/Chats.tsx";
import {Profile} from "./components/profile/Profile.tsx";
import {Wishlist} from "./components/wishlist/Wishlist.tsx";
import {ContactUs} from "./components/contact_us/ContactUs.tsx";

function App() {
    const { globalState } = useContext(GlobalContext)!;
    const { user } = useContext(UserContext)!;

    return (
        <div className="w-screen h-screen">
            {
                user === null ? <Login/> :
                globalState === POST ? <Post/> :
                globalState === SHOP ? <Shop/> :
                globalState === PROFILE ? <Profile/> :
                globalState === WISHLIST ? <Wishlist/> :
                globalState === CHATS ? <Chats/> :
                globalState === SETTINGS ? <Settings/> :
                globalState === CONTACT_US ? <ContactUs/> :
                globalState === ABOUT_US ? <ContactUs/> :
                globalState === HOME ? <Home/> : <Home/>
            }
        </div>
    )
}

export default App
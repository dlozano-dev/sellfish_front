import React, { useContext } from 'react';
import logOut from "../../assets/Icons/logOut.png"
import userIcon from "../../assets/Icons/user.png"
import { GlobalContext } from '../../Navigation';
import { UserContext } from '../../Navigation';

export const Header = () => {
    const { setGlobalState } = useContext(GlobalContext);
    const {  setUser } = useContext(UserContext);

    function clickNav() {
        document.getElementById("mySidenav").classList.toggle("-translate-x-full");
    }

    return (
        <div className="flex justify-between items-center pl-4 w-full h-16">
            {/* Menu Icon */}
            <div className="flex flex-col space-y-1 cursor-pointer opacity-100 hover:opacity-60" onClick={clickNav}>
                <div className="w-9 h-1 bg-black rounded-md transition duration-300"></div>
                <div className="w-9 h-1 bg-black rounded-md transition duration-300"></div>
                <div className="w-9 h-1 bg-black rounded-md transition duration-300"></div>
            </div>

            {/* Icons */}
            <div className="flex space-x-4">
                <img src={String(userIcon)} alt="User Icon" className="w-8 h-8 rounded-lg p-2 cursor-pointer hover:opacity-60"/>
                <img src={String(logOut)} onClick={() => setUser(null)} alt="Log Out Icon" className="w-8 h-8 rounded-lg p-2 cursor-pointer hover:opacity-60"/>
            </div>

            {/* Sidebar Navigation */}
            <div id="mySidenav" className="fixed top-0 left-0 h-full w-88 bg-white text-gray-600 transition-transform duration-500 -translate-x-full">
                <span onClick={clickNav} className="absolute top-4 right-6 text-3xl cursor-pointer text-black">&times;</span>
                <nav className="mt-16 flex flex-col text-xl">
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState("Home")} className="pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]">Home</div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState("Shop")} className="pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]">Shop</div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState("Publish")} className="pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]">Publish Product</div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState("Wishlist")} className="pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]">Wishlist</div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState("Chats")} className="pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]">Chats</div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
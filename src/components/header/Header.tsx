import { useContext, useRef, useState } from 'react';
import d_menu from '../../assets/Icons/d-menu.svg';
import dagger_icon from '../../assets/Icons/dagger.svg';
import {GlobalContext, ProfileIdContext, ProfilePictureContext, UserIdContext} from '../../Navigation';
import { UserContext } from '../../Navigation';
import {CHATS, HOME, POST, PROFILE, SHOP, WISHLIST} from "../../utils/Constants";
import { Sidebar } from "primereact/sidebar";
import { OverlayPanel } from "primereact/overlaypanel";
import {Avatar} from "primereact/avatar";

export const Header = () => {
    const { setGlobalState } = useContext(GlobalContext)!;
    const { userId } = useContext(UserIdContext)!;
    const { setUser } = useContext(UserContext)!;
    const { setProfileId } = useContext(ProfileIdContext)!;
    const { profilePicture } = useContext(ProfilePictureContext)!;
    const [showSideBar, setShowSideBar] = useState(false);
    const op = useRef<OverlayPanel>(null);

    return (
        <div className='flex justify-between items-center pl-4 w-full h-20'>
            {/* Menu Icon */}
            <div className='cursor-pointer opacity-100 hover:opacity-60' onClick={() => setShowSideBar(true)}>
                <img src={String(d_menu)} alt='Menu icon' className='w-12 h-12 transition duration-300'/>
            </div>

            {/* Icons */}
            <div className='flex space-x-4 p-8 items-center'>
                <img src={String(dagger_icon)}
                     alt='Favorite Icon'
                     onClick={() => setGlobalState(WISHLIST)}
                     className='w-14 h-14 cursor-pointer hover:opacity-60'
                />
                <div className="card flex justify-end">
                    { profilePicture != null ?
                        <Avatar
                            image={`data:image/png;base64,${profilePicture}`}
                            size="large"
                            onClick={(e) => op.current?.toggle(e)}
                        />
                    :
                        <Avatar
                            icon="pi pi-user"
                            size="large"
                            onClick={(e) => op.current?.toggle(e)}
                            style={{ backgroundColor: '#ffffff', color: '#5e5e5e' }}
                        />
                    }

                    <OverlayPanel ref={op} className='w-48 bg-white rounded-lg shadow-lg text-gray-600 fill-gray-600'>
                        <div className='flex justify-between items-center px-4 py-2 border-b'>
                            <span className='text-gray-700 font-semibold'>Menu</span>
                        </div>

                        <div className='hover:cursor-pointer hover:bg-gray-100 hover:fill-black flex items-center justify-between'
                            onClick={ () => {
                                setProfileId(userId)
                                setGlobalState(PROFILE)
                            }}
                        >
                            <div
                                className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <i className="pi pi-user mr-4"/>
                                <span>Profile</span>
                            </div>
                        </div>

                        <div onClick={ () => setGlobalState(CHATS) } className='hover:cursor-pointer hover:bg-gray-100 hover:fill-black flex items-center justify-between'>
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <i className="pi pi-inbox mr-4"/>
                                <span>Chats</span>
                            </div>
                        </div>

                        <div onClick={() => setUser(null)} className='hover:cursor-pointer hover:bg-gray-100 hover:fill-black flex items-center justify-between'>
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <i className="pi pi-sign-out mr-4"/>
                                <span>Log out</span>
                            </div>
                        </div>
                    </OverlayPanel>
                </div>
            </div>

            {/* Sidebar Navigation */}
            <Sidebar visible={showSideBar} onHide={() => setShowSideBar(false)} className='p-0 m-0 min-h-0 sidebar'>
                <div className='hover:bg-gray-100 p-0 overflow-x-hidden'>
                    <div onClick={() => setGlobalState(HOME)} className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Home</div>
                </div>
                <div className='hover:bg-gray-100 overflow-x-hidden'>
                    <div onClick={() => setGlobalState(SHOP)} className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Shop</div>
                </div>
                <div className='hover:bg-gray-100 overflow-x-hidden'>
                    <div onClick={() => setGlobalState(POST)} className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Post a Product</div>
                </div>
                <div className='hover:bg-gray-100 overflow-x-hidden'>
                    <div onClick={() => setGlobalState(WISHLIST)} className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Wishlist</div>
                </div>
                <div className='hover:bg-gray-100 overflow-x-hidden'>
                    <div onClick={() => setGlobalState(CHATS)} className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Chats</div>
                </div>
                <div className='hover:bg-gray-100 overflow-x-hidden'>
                    <div className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'
                        onClick={ () => {
                            setProfileId(userId)
                            setGlobalState(PROFILE)
                        }}
                    >
                        Profile
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}
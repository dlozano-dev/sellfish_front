import { useContext, useRef, useState } from 'react';
import d_menu from '../../assets/Icons/d-menu.svg';
import dagger_icon from '../../assets/Icons/dagger.svg';
import { GlobalContext, ProfileIdContext, ProfilePictureContext, UserIdContext } from '../../Navigation.tsx';
import { UserContext } from '../../Navigation.tsx';
import { ABOUT_US, CHATS, CONTACT_US, HOME, POST, PROFILE, SHOP, WISHLIST } from "../../utils/Constants.tsx";
import { Sidebar } from "primereact/sidebar";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import sf_logo from "../../assets/brand_logos/sf-logo.png";
import {useTranslation} from "react-i18next";

export const Header = () => {
    const { globalState, setGlobalState } = useContext(GlobalContext)!;
    const { userId, setUserId } = useContext(UserIdContext)!;
    const { setUser } = useContext(UserContext)!;
    const { setProfileId } = useContext(ProfileIdContext)!;
    const { profilePicture } = useContext(ProfilePictureContext)!;
    const [showSideBar, setShowSideBar] = useState(false);
    const op = useRef<OverlayPanel>(null);
    const { t } = useTranslation();

    return (
        <div className='flex justify-between items-center px-4 w-full h-20 relative z-50'>
            {/* Menu Icon */}
            <div className='cursor-pointer opacity-100 hover:opacity-60 flex-shrink-0' onClick={() => setShowSideBar(true)}>
                <img src={String(d_menu)} alt='Menu icon' className='w-10 h-10 sm:w-12 sm:h-12 transition duration-300' />
            </div>

            {/* Centered Logo on non-HOME pages */}
            {globalState !== HOME && (
                <img
                    src={sf_logo}
                    alt={'Sellfish logo'}
                    className='hidden sm:block w-40 h-auto absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />
            )}

            {/* Right Side Icons */}
            <div className='flex items-center space-x-3 sm:space-x-4'>
                <img
                    src={String(dagger_icon)}
                    alt='Favorite Icon'
                    onClick={() => setGlobalState(WISHLIST)}
                    className='w-10 h-10 sm:w-14 sm:h-14 cursor-pointer hover:opacity-60'
                />

                <div className="card flex justify-end">
                    {profilePicture != null ? (
                        <Avatar
                            image={`data:image/png;base64,${profilePicture}`}
                            size="large"
                            onClick={(e) => op.current?.toggle(e)}
                        />
                    ) : (
                        <Avatar
                            icon="pi pi-user"
                            size="large"
                            onClick={(e) => op.current?.toggle(e)}
                            style={{ backgroundColor: '#ffffff', color: '#5e5e5e' }}
                        />
                    )}

                    {/* Dropdown Menu */}
                    <OverlayPanel ref={op} className='w-48 bg-white rounded-lg shadow-lg text-gray-600 fill-gray-600'>
                        <div className='flex justify-between items-center px-4 py-2 border-b'>
                            <span className='text-gray-700 font-semibold'>{t('Menu')}</span>
                        </div>

                        <div
                            className='hover:cursor-pointer hover:bg-gray-100 flex items-center justify-between'
                            onClick={() => {
                                setProfileId(userId);
                                setGlobalState(PROFILE);
                            }}
                        >
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <i className="pi pi-user mr-4" />
                                <span>{t('Profile')}</span>
                            </div>
                        </div>

                        <div
                            onClick={() => setGlobalState(CHATS)}
                            className='hover:cursor-pointer hover:bg-gray-100 flex items-center justify-between'
                        >
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <i className="pi pi-inbox mr-4" />
                                <span>{t('Chats')}</span>
                            </div>
                        </div>

                        <div
                            onClick={() => {
                                setUserId(null)
                                setUser(null)
                                setGlobalState(HOME)
                            }}
                            className='hover:cursor-pointer hover:bg-gray-100 flex items-center justify-between'
                        >
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <i className="pi pi-sign-out mr-4" />
                                <span>{t('Log out')}</span>
                            </div>
                        </div>
                    </OverlayPanel>
                </div>
            </div>

            {/* Sidebar Navigation for Mobile */}
            <Sidebar visible={showSideBar} onHide={() => setShowSideBar(false)} className='p-0 m-0 min-h-0 sidebar'>
                {[
                    { label: t('Home'), state: HOME },
                    { label: t('Shop'), state: SHOP },
                    { label: t('Post a Product'), state: POST },
                    { label: t('Wishlist'), state: WISHLIST },
                    { label: t('Chats'), state: CHATS },
                    { label: t('About Us'), state: ABOUT_US },
                    { label: t('Contact Us'), state: CONTACT_US },
                ].map((item, index) => (
                    <div key={index} className='hover:bg-gray-100 overflow-x-hidden'>
                        <div
                            onClick={() => setGlobalState(item.state)}
                            className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'
                        >
                            {item.label}
                        </div>
                    </div>
                ))}

                <div className='hover:bg-gray-100 overflow-x-hidden'>
                    <div
                        className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'
                        onClick={() => {
                            setProfileId(userId);
                            setGlobalState(PROFILE);
                        }}
                    >
                        Profile
                    </div>
                </div>
            </Sidebar>
        </div>
    );
}

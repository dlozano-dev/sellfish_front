import React, {useContext, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import { UserRound } from 'lucide-react';
import { CircleUserRound  } from 'lucide-react';
import { X as CloseIcon } from 'lucide-react';
// import { Swords  } from 'lucide-react';
import d_menu from '../../assets/Icons/d-menu.svg';
import dagger_icon from '../../assets/Icons/dagger.svg';
import { GlobalContext } from '../../Navigation';
import { UserContext } from '../../Navigation';

export const Header = () => {
    const { setGlobalState } = useContext(GlobalContext);
    const {  setUser } = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);

    function clickNav() {
        document.getElementById('mySidenav').classList.toggle('-translate-x-full');
    }

    return (
        <div className='flex justify-between items-center pl-4 w-full h-20'>
            {/* Menu Icon */}
            <div className='cursor-pointer opacity-100 hover:opacity-60' onClick={clickNav}>
                <img src={String(d_menu)} alt='Menu icon' className='w-12 h-12 transition duration-300'/>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className='absolute right-10 top-15 mt-2 w-48 bg-white rounded-lg shadow-lg text-gray-600 fill-gray-600'>
                        <div className='flex justify-between items-center px-4 py-2 border-b'>
                            <span className='text-gray-700 font-semibold'>Menu</span>
                            <CloseIcon className='w-5 h-5 cursor-pointer hover:text-black' onClick={() => setIsOpen(false)}/>
                        </div>

                        <div className='hover:cursor-pointer hover:bg-gray-100 hover:fill-black flex items-center justify-between'>
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <UserRound className='w-4 h-4 mr-4'/>
                                <span>Profile</span>
                            </div>
                        </div>

                        <div className='hover:cursor-pointer hover:bg-gray-100 hover:fill-black flex items-center justify-between'>
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <svg className='w-4 h-4 mr-4 fill-none' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path className='stroke-gray-600 stroke-[1.5] stroke-round' d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"/>
                                    <path className='stroke-gray-600 stroke-[1.5] stroke-round' d="M3.66122 10.6392C4.13377 10.9361 4.43782 11.4419 4.43782 11.9999C4.43781 12.558 4.13376 13.0638 3.66122 13.3607C3.33966 13.5627 3.13248 13.7242 2.98508 13.9163C2.66217 14.3372 2.51966 14.869 2.5889 15.3949C2.64082 15.7893 2.87379 16.1928 3.33973 16.9999C3.80568 17.8069 4.03865 18.2104 4.35426 18.4526C4.77508 18.7755 5.30694 18.918 5.83284 18.8488C6.07287 18.8172 6.31628 18.7185 6.65196 18.5411C7.14544 18.2803 7.73558 18.2699 8.21895 18.549C8.70227 18.8281 8.98827 19.3443 9.00912 19.902C9.02332 20.2815 9.05958 20.5417 9.15224 20.7654C9.35523 21.2554 9.74458 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8478 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.9021C15.0117 19.3443 15.2977 18.8281 15.7811 18.549C16.2644 18.27 16.8545 18.2804 17.3479 18.5412C17.6837 18.7186 17.9271 18.8173 18.1671 18.8489C18.693 18.9182 19.2249 18.7756 19.6457 18.4527C19.9613 18.2106 20.1943 17.807 20.6603 17C20.8677 16.6407 21.029 16.3614 21.1486 16.1272M20.3387 13.3608C19.8662 13.0639 19.5622 12.5581 19.5621 12.0001C19.5621 11.442 19.8662 10.9361 20.3387 10.6392C20.6603 10.4372 20.8674 10.2757 21.0148 10.0836C21.3377 9.66278 21.4802 9.13092 21.411 8.60502C21.3591 8.2106 21.1261 7.80708 20.6601 7.00005C20.1942 6.19301 19.9612 5.7895 19.6456 5.54732C19.2248 5.22441 18.6929 5.0819 18.167 5.15113C17.927 5.18274 17.6836 5.2814 17.3479 5.45883C16.8544 5.71964 16.2643 5.73004 15.781 5.45096C15.2977 5.1719 15.0117 4.6557 14.9909 4.09803C14.9767 3.71852 14.9404 3.45835 14.8478 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74458 2.35523 9.35523 2.74458 9.15224 3.23463C9.05958 3.45833 9.02332 3.71848 9.00912 4.09794C8.98826 4.65566 8.70225 5.17191 8.21891 5.45096C7.73557 5.73002 7.14548 5.71959 6.65205 5.4588C6.31633 5.28136 6.0729 5.18269 5.83285 5.15108C5.30695 5.08185 4.77509 5.22436 4.35427 5.54727C4.03866 5.78945 3.80569 6.19297 3.33974 7C3.13231 7.35929 2.97105 7.63859 2.85138 7.87273"/>
                                </svg>
                                <span>Settings</span>
                            </div>
                        </div>

                        <div onClick={() => setUser(null)} className='hover:cursor-pointer hover:bg-gray-100 hover:fill-black flex items-center justify-between'>
                            <div className='flex items-center w-full px-4 py-2 hover:text-black transition-transform duration-500 hover:translate-x-[10%]'>
                                <svg className='w-4 h-4 mr-4' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 471.2 471.2" xml:space="preserve"><g><g xmlns="http://www.w3.org/2000/svg"><path d="M227.619,444.2h-122.9c-33.4,0-60.5-27.2-60.5-60.5V87.5c0-33.4,27.2-60.5,60.5-60.5h124.9c7.5,0,13.5-6,13.5-13.5    s-6-13.5-13.5-13.5h-124.9c-48.3,0-87.5,39.3-87.5,87.5v296.2c0,48.3,39.3,87.5,87.5,87.5h122.9c7.5,0,13.5-6,13.5-13.5    S235.019,444.2,227.619,444.2z"/><path d="M450.019,226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l62.8,62.8h-273.9c-7.5,0-13.5,6-13.5,13.5    s6,13.5,13.5,13.5h273.9l-62.8,62.8c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l85.8-85.8    C455.319,239.9,455.319,231.3,450.019,226.1z"/></g></g></svg>
                                <span>Log out</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Icons */}
            <div className='flex space-x-4 p-8 items-center'>
                <img src={String(dagger_icon)} alt='Favorite Icon' className='w-14 h-14 cursor-pointer hover:opacity-60'/>
                {/*<Swords className='w-11 h-11 cursor-pointer hover:opacity-70 text-zinc-800'/>*/}
                <CircleUserRound className='w-11 h-11 cursor-pointer hover:opacity-70 text-zinc-800' onClick={() => setIsOpen(!isOpen)}/>
            </div>

            {/* Sidebar Navigation */}
            <div id='mySidenav'
                 className='fixed top-0 left-0 h-full w-88 bg-white text-gray-600 transition-transform duration-500 -translate-x-full'>
                <span onClick={clickNav}
                      className='absolute top-4 right-6 text-3xl cursor-pointer text-black'>&times;</span>
                <nav className='mt-16 flex flex-col text-xl'>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState('Home')}
                             className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Home
                        </div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState('Shop')}
                             className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Shop
                        </div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState('Publish')}
                             className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Publish
                            Product
                        </div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState('Wishlist')}
                             className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Wishlist
                        </div>
                    </div>
                    <div className='hover:bg-gray-100'>
                        <div onClick={() => setGlobalState('Chats')}
                             className='pl-10 py-4 hover:text-black cursor-pointer transition-transform duration-500 hover:translate-x-[10%]'>Chats
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
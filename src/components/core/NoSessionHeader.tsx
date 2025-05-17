import { useContext } from 'react';
import { GlobalContext } from '../../Navigation.tsx';
import { useTranslation } from "react-i18next";
import {LOGIN, REGISTER} from "../../utils/Constants.tsx";

export const NoSessionHeader = () => {
    const { setGlobalState } = useContext(GlobalContext)!;
    const { t } = useTranslation();

    return (
        <div className='flex justify-end items-center px-4 w-full h-20 relative z-50'>

            {/* Right Side Icons */}
            <div className='flex items-center space-x-3 sm:space-x-4 justify-between'>
                <button
                    onClick={() => setGlobalState(LOGIN)}
                    className='cursor-pointer hover:opacity-70 border border-stone-800 rounded p-2'
                >
                    {t('Log in')}
                </button>

                <button
                    onClick={() => setGlobalState(REGISTER)}
                    className='cursor-pointer hover:opacity-70 bg-stone-800 text-white rounded p-2'
                >
                    {t('Sign Up')}
                </button>
            </div>
        </div>
    );
}

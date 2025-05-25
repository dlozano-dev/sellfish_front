import { useState, useContext } from 'react';
import {EmailContext, GlobalContext, LoadingContext, ProfilePictureContext} from '../../Navigation';
import { UserContext } from '../../Navigation';
import { UserIdContext } from '../../Navigation';
import { useTranslation } from "react-i18next";
import Snackbar from '@mui/material/Snackbar';
import sf_icon from "../../assets/brand_logos/sf-logo.svg"
import {EMPTY, HOSTNAME, LOG_IN, SHOP, SIGN_UP} from "../../utils/Constants";
import Cookies from 'js-cookie';
import axios from "axios";
import {Button} from "primereact/button";

export const Login = ({
    navigationAction
}:{
    navigationAction: string;
}) => {
    const { setGlobalState } = useContext(GlobalContext)!;
    const { setUser } = useContext(UserContext)!;
    const { setEmail } = useContext(EmailContext)!;
    const { setProfilePicture } = useContext(ProfilePictureContext)!;
    const { setUserId } = useContext(UserIdContext)!;
    const [userInput, setUserInput] = useState<string>(EMPTY);
    const [emailInput, setEmailInput] = useState<string>(EMPTY);
    const [passwordInput, setPasswordInput] = useState<string>(EMPTY);
    const [snackBar, setSnackBar] = useState<string>(EMPTY);
    const [action, setAction] = useState(navigationAction) // Login or Sign Up
    const { t } = useTranslation();
    const {isLoading, setIsLoading} = useContext(LoadingContext)!;

    // Register user if not already exists
    function register() {
        setIsLoading(true);
        axios.get(`${HOSTNAME}/userExists/${emailInput}/${userInput}`)
            .then(res => {
                if (res.data) {
                    setSnackBar(t('error_user_already_registered'));
                } else {
                    axios.post(`${HOSTNAME}/register`, {
                        username: userInput,
                        email: emailInput,
                        password: passwordInput
                    }).then(() => {
                        setSnackBar(t("success_user_created"));
                        login(); // Auto login after register
                    }).catch(() => {
                        setSnackBar(t("error_registration_failed"));
                    });
                }
            })
            .catch(() => setSnackBar(t("error_checking_user_existence")))
            .finally(() => {setIsLoading(false)});
    }

    // Log user in and retrieve token + user info
    function login() {
        setIsLoading(true);
        axios.post(`${HOSTNAME}/login`, {
            username: userInput,
            password: passwordInput
        })
            .then(async res => {
                const token = res.data.token;
                Cookies.set('jwt', token); // Save token as cookie

                const me = await axios.get(`${HOSTNAME}/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userId = me.data.id;

                setGlobalState(SHOP);
                setUser(userInput);
                setUserId(userId);
                await getEmail(userId, token);
                await getProfilePicture(userId, token);
            })
            .catch(() => {
                setSnackBar(t("error_invalid_credentials"));
            })
            .finally(() => {setIsLoading(false)});
    }

    // Get user email
    async function getEmail(userId: string, token: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/getEmail/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmail(response.data);
        } catch {
            setEmail(EMPTY);
        }
    }

    // Get user profile picture
    async function getProfilePicture(userId: string, token: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/profilePicture/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfilePicture(response.data);
        } catch {
            setProfilePicture(null);
            console.error('Error fetching profile picture.');
        }
    }

    return (
        <div className='flex flex-col justify-center items-center px-4 sm:px-6 md:px-8'>
            <img src={String(sf_icon)} alt="Sellfish logo" className='w-60 sm:w-80 md:w-96 h-auto' />

            <div className='flex items-center w-full max-w-md h-18 m-4 bg-white rounded-md'>
                <i className="pi pi-user mx-4 sm:mx-6" style={{fontSize: '1.8rem', color: '#708090'}}/>
                <input
                    value={userInput}
                    onChange={e => setUserInput(e.target.value.trim())}
                    type="text"
                    placeholder={t('Name')}
                    id='user'
                    className='w-full h-full border-none outline-none text-base sm:text-lg md:text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                />
            </div>

            {action === LOG_IN ? <div></div> :
                <div className='flex items-center w-full max-w-md h-18 m-4 bg-white rounded-md'>
                    <i className="pi pi-envelope mx-4 sm:mx-6" style={{fontSize: '1.8rem', color: '#708090'}}/>
                    <input
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value.trim())}
                        type="email"
                        placeholder={t('Email')}
                        id='email'
                        className='w-full h-full border-none outline-none text-base sm:text-lg md:text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                    />
                </div>
            }

            <div className='flex items-center w-full max-w-md h-18 m-4 bg-white rounded-md'>
                <i className="pi pi-lock mx-4 sm:mx-6" style={{fontSize: '1.8rem', color: '#708090'}}/>
                <input
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value.trim())}
                    type="password"
                    placeholder={t('label_password')}
                    id='pass'
                    className='w-full h-full border-none outline-none text-base sm:text-lg md:text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                />
            </div>

            <div onClick={() => action === LOG_IN ? setAction(SIGN_UP) : setAction(LOG_IN)} className='cursor-pointer mb-6 text-center text-base sm:text-lg md:text-xl'>
                {action === LOG_IN ? t('Click here to create an account!') : t('Log in if you already have an account')}
            </div>

            <Button
                label={action === LOG_IN ? t('Log in') : t('Sign Up')}
                onClick={() => action === LOG_IN ? login() : register()}
                loading={isLoading}
                className='bg-black text-white w-full max-w-xs h-12 sm:h-14 md:h-16 flex justify-center items-center text-base sm:text-lg md:text-xl rounded-md cursor-pointer mb-4'
            />

            {/*<div onClick={() => action === LOG_IN ? login() : register()} className='bg-black text-white w-full max-w-xs h-12 sm:h-14 md:h-16 flex justify-center items-center text-base sm:text-lg md:text-xl rounded-md cursor-pointer mb-4'>*/}
            {/*    {action === LOG_IN ? t('Log in') : t('Sign Up')}*/}
            {/*</div>*/}

            <Snackbar
                open={!!snackBar}
                autoHideDuration={6000}
                onClose={() => { setSnackBar(EMPTY) }}
                message={snackBar}
            />
        </div>
    )
}

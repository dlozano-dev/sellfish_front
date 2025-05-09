import {useState, useContext} from 'react';
import {EmailContext, GlobalContext, ProfilePictureContext} from '../../Navigation';
import { UserContext } from '../../Navigation';
import { UserIdContext } from '../../Navigation';
import { useTranslation } from "react-i18next";
import Snackbar from '@mui/material/Snackbar';
import user_icon from "../../assets/person.png"
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import sf_icon from "../../assets/brand_logos/sf-logo.svg"
import {EMPTY, GET, HOME, HOSTNAME, JSON, LOGIN, SIGN_UP} from "../../utils/Constants";
import axios from "axios";

export const Login = () => {
    const [action, setAction] = useState(LOGIN) // Login or Sign Up
    const { setGlobalState } = useContext(GlobalContext)!;
    const { setUser } = useContext(UserContext)!;
    const { setEmail } = useContext(EmailContext)!;
    const { setProfilePicture } = useContext(ProfilePictureContext)!;
    const { setUserId } = useContext(UserIdContext)!;
    const [userInput, setUserInput] = useState<string>(EMPTY);
    const [emailInput, setEmailInput] = useState<string>(EMPTY);
    const [passwordInput, setPasswordInput] = useState<string>(EMPTY);
    const [snackBar, setSnackBar] = useState<string>(EMPTY);
    const { t } = useTranslation();

    function register() {
        const xhr = new XMLHttpRequest();
        xhr.open(GET, `${HOSTNAME}/userExists/${emailInput}/${userInput}`);
        xhr.send();
        xhr.responseType = JSON;
        xhr.onload = () => {
            const data = xhr.response;

            if (data) {
                setSnackBar(t('error_user_already_registered'));
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open(GET, `${HOSTNAME}/saveUser/${userInput}/${emailInput}/${passwordInput}`);
                xhr.send();
                xhr.responseType = JSON;
                xhr.onload = () => {
                    setSnackBar("User created successfully.");
                    login()
                };
            }
        };
    }

    function login() {
        const xhr = new XMLHttpRequest();
        xhr.open(GET, `${HOSTNAME}/login/${userInput}/${passwordInput}`);
        xhr.send();
        xhr.responseType = JSON;
        xhr.onload = () => {
            const data = xhr.response;
            if (data !== -1) {
                setGlobalState(HOME);
                setUser(userInput);
                setUserId(data);
                getEmail(data).then();
                getProfilePicture(data).then();
            }
        };
    }

    async function getEmail(userId: string) {
        const response = await axios.get<string>(`${HOSTNAME}/getEmail/${userId}`);
        setEmail(response.data);
    }

    async function getProfilePicture(userId: string) {
        try {
            const response = await axios.get<string>(`${HOSTNAME}/profilePicture/${userId}`);

            // Set the new profile picture in state
            setProfilePicture(response.data);
        } catch (error) {
            setProfilePicture(null);
            console.error('Error fetching profile picture:', error);
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <img src={ String(sf_icon) } alt="Sellfish logo" className='w-96 h-auto'/>

            <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                <img src={ String(user_icon) } alt="User icon" className='mx-6'/>
                <input
                    value={userInput}
                    onChange={e => setUserInput(e.target.value.trim())}
                    type="text"
                    placeholder='Name'
                    id='user'
                    className='w-full h-full border-none outline-none text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                />
            </div>

            { action===LOGIN ? <div></div> :
                <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                    <img src={ String(email_icon) } alt={EMPTY} className='mx-6'/>
                    <input
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value.trim())}
                        type="email"
                        placeholder='Email'
                        id='email'
                        className='w-full h-full border-none outline-none text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                    />
                </div>
            }

            <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                <img src={ String(password_icon) } alt={EMPTY} className='mx-6'/>
                <input
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value.trim())}
                    type="password"
                    placeholder='Password'
                    id='pass'
                    className='w-full h-full border-none outline-none text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                />
            </div>

            <div onClick={()=> action===LOGIN ? setAction(SIGN_UP) : setAction(LOGIN)} className='cursor-pointer mb-8 text-xl'>
                { action===LOGIN ? 'Click here to create an account!' : 'Log in if you already have an account'}
            </div>

            <div onClick={() => action===LOGIN ? login() : register()} className='bg-black text-xl cursor-pointer text-white w-1/10 h-18 flex justify-center items-center rounded-md'>
                { action===LOGIN ? 'Log in' : 'Sign up' }
            </div>

            <Snackbar
                open={!!snackBar}
                autoHideDuration={6000}
                onClose={() => { setSnackBar(EMPTY) }}
                message={snackBar}
            />
        </div>
    )
}
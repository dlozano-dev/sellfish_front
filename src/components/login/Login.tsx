import {useState, useContext} from 'react';
import * as Constants from '../../utils/Constants';
import { GlobalContext } from '../../Navigation';
import { UserContext } from '../../Navigation';
import { UserIdContext } from '../../Navigation';
import user_icon from "../../assets/person.png"
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import sf_icon from "../../assets/brand_logos/sf-logo.svg"
import {HOME} from "../../utils/Constants";
import Snackbar from '@mui/material/Snackbar';

export const Login = () => {
    const [action, setAction] = useState("Login") // Login or Sign Up
    const { setGlobalState } = useContext(GlobalContext)!;
    const { setUser } = useContext(UserContext)!;
    const { setUserId } = useContext(UserIdContext)!;
    const [userInput, setUserInput] = useState<string>("");
    const [emailInput, setEmailInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [snackBar, setSnackBar] = useState<string>("");

    function register() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${Constants.HOSTNAME}/userExists/${emailInput}/${userInput}`);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            const data = xhr.response;

            if (data) {
                setSnackBar("The email or the user are already registered.");
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", `${Constants.HOSTNAME}/saveUser/${userInput}/${emailInput}/${passwordInput}`);
                xhr.send();
                xhr.responseType = "json";
                xhr.onload = () => {
                    setSnackBar("User created successfully.");
                    login()
                };
            }
        };
    }

    function login() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${Constants.HOSTNAME}/login/${userInput}/${passwordInput}`);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            const data = xhr.response
            if (data !== -1) {
                setGlobalState(HOME);
                setUser(userInput);
                setUserId(data);
            }
        };
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

            { action==='Login' ? <div></div> :
                <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                    <img src={ String(email_icon) } alt="" className='mx-6'/>
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
                <img src={ String(password_icon) } alt="" className='mx-6'/>
                <input
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value.trim())}
                    type="password"
                    placeholder='Password'
                    id='pass'
                    className='w-full h-full border-none outline-none text-xl autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]'
                />
            </div>

            <div onClick={()=> action==='Login' ? setAction('Sign Up') : setAction('Login')} className='cursor-pointer mb-8 text-xl'>
                { action==='Login' ? 'Click here to create an account!' : 'Log in if you already have an account'}
            </div>

            <div onClick={() => action==='Login' ? login() : register()} className='bg-black text-xl cursor-pointer text-white w-1/10 h-18 flex justify-center items-center rounded-md'>
                { action==='Login' ? 'Log in' : 'Sign up' }
            </div>

            <Snackbar
                open={!!open}
                autoHideDuration={6000}
                onClose={() => { setSnackBar("") }}
                message={snackBar}
            />
        </div>
    )
}


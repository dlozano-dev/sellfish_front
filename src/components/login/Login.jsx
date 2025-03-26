import React, {useState, useContext} from 'react'
import * as Constants from '../../utils/Constants.js';
import { GlobalContext } from '../../Navigation';
import { UserContext } from '../../Navigation';
import { UserIdContext } from '../../Navigation';

import user_icon from "../../assets/person.png"
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import sf_icon from "../../assets/brand_logos/sf-logo.svg"

export const Login = () => {
    const [action, setAction] = useState("Login") // Login or Sign Up
    const { setGlobalState } = useContext(GlobalContext);
    const { setUser } = useContext(UserContext);
    const { setUserId } = useContext(UserIdContext);

    function signup() {
        // Ask for user
        let user = document.getElementById("user").value.trim();
        let email = document.getElementById("email").value.trim();
        let pass = document.getElementById("pass").value.trim();

        // Create user
        register(user, email, pass)
    }

    function register(user, email, pass) {
        let request = `${Constants.HOSTNAME}/userExists/${email}/${user}`
        const xhr = new XMLHttpRequest();
        xhr.open("GET", request);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            const data = xhr.response;
            console.log("User exists? " + data)
            if (data) {
                alert("El email ya está registrado o el usuario ya están registrados")
            } else {
                request = `${Constants.HOSTNAME}/saveUser/${user}/${email}/${pass}`
                const xhr = new XMLHttpRequest();
                xhr.open("GET", request);
                xhr.send();
                xhr.responseType = "json";
                xhr.onload = () => {
                    alert("El usuario ha sido creado correctamente")
                    // login
                    login()
                };
            }
        };
    }

    function login() {
        let user = document.getElementById("user").value.trim();
        let pass = document.getElementById("pass").value.trim();
        let request = `${Constants.HOSTNAME}/login/${user}/${pass}`
        const xhr = new XMLHttpRequest();
        xhr.open("GET", request);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
            let data = xhr.response
            console.log(data)
            if (data !== -1) {
                setGlobalState("Home");
                setUser(user);
                setUserId(data);
            }
        };
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <img src={ String(sf_icon) } alt="Sellfish logo" className='w-96 h-auto'/>

            <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                <img src={ String(user_icon) } alt="User icon" className='mx-6'/>
                <input type="text" placeholder='Name' id='user' className='w-full h-full border-none outline-none text-xl'/>
            </div>

            { action==='Login' ? <div></div> :
                <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                    <img src={ String(email_icon) } alt="" className='mx-6'/>
                    <input type="email" placeholder='Email' id='email' className='w-full h-full border-none outline-none text-xl'/>
                </div>
            }

            <div className='flex items-center w-3/10 h-18 m-6 bg-white rounded-md'>
                <img src={ String(password_icon) } alt="" className='mx-6'/>
                <input type="password" placeholder='Password' id='pass' className='w-full h-full border-none outline-none text-xl'/>
            </div>

            <div onClick={()=>{ action==='Login' ? setAction('Sign Up') : setAction('Login')}} className='cursor-pointer mb-8 text-xl'>
                { action==='Login' ? 'Click here to create an account!' : 'Log in if you already have an account'}
            </div>

            <div onClick={() => action==='Login' ? login() : signup()} className='bg-black text-xl cursor-pointer text-white w-1/10 h-18 flex justify-center items-center rounded-md'>
                { action==='Login' ? 'Log in' : 'Sign up' }
            </div>
        </div>
    )
}


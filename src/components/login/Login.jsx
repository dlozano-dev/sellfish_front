import React, {useState, useContext} from 'react'
import * as Constants from '../../utils/Constants.js';
import { GlobalContext } from '../../Navigation';
import { UserContext } from '../../Navigation';
import { UserIdContext } from '../../Navigation';
import './Login.css'

import user_icon from "../../assets/person.png"
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";

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
        <div className='container'>
            <div className='headerLogin'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>

            <div className='inputs'>
                <div className='input'>
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Name' id='user'/>
                </div>

                {action==='Login'?<div></div>:
                    <div className='input'>
                        <img src={email_icon} alt="" />
                        <input type="email" placeholder='Email' id='email'/>
                    </div>
                }

                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' id='pass'/>
                </div>
            </div>

            {action==='Sign Up'?<div></div>:
                <div className='forgot-password'>
                    Lost Password?
                    <span>Click Here!</span>
                </div>
            }

            <div className='submit-container'>
                <div className={action==='Login'?'submit gray':'submit'} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==='Sign Up'?'submit gray':'submit'} onClick={()=>{setAction("Login")}}>Login</div>
            </div>

            <div className="close-container">
                <div className='close' onClick={() => action==='Login' ? login() : signup()}>Send</div>
            </div>
        </div>
    )
}


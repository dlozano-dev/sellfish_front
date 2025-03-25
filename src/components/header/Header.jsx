import React, { useContext } from 'react';
import { GlobalContext } from '../../Navigation';
import { UserContext } from '../../Navigation';


import './Header.css'
import logOut from "../../assets/Icons/logOut.png"
import userIcon from "../../assets/Icons/user.png"

export const Header = () => {
  const { setGlobalState } = useContext(GlobalContext);
  const {  setUser } = useContext(UserContext);

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  return (
    <div className='header'>
      <div className='menu' onClick={() => openNav()}> 
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div> 
      </div>

      <div className='icons'>
        <img src={userIcon} className='icon' alt={""}/>
        <img src={logOut} className='icon' onClick={() => setUser(null)}  alt={""}/>
      </div>

      <div id="mySidenav" className="sidenav">
        <span className="closebtn" onClick={() => closeNav()}>&times;</span>
        <span onClick={() => setGlobalState("Home")}>Home</span>
        <span onClick={() => setGlobalState("Shop")}>Shop</span>
        <span onClick={() => setGlobalState("Wishlist")}>Wishlist</span>
        <span onClick={() => setGlobalState("Chats")}>Chats</span>
        <span>Cart</span>
        <span onClick={() => setGlobalState("Publish")}>Publish Product</span>
        <span onClick={() => setGlobalState("Configuration")}>Settings</span>
      </div>
    </div>
  )
}
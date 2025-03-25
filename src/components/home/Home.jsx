import React, { useContext } from 'react'
import { GlobalContext } from '../../Navigation';
import { Header } from "../header/Header"


import './Home.css'

export const Home = () => {
  const { setGlobalState } = useContext(GlobalContext);

  return (
    <div className='containerHome'>
      <Header/>
      <h1>H O M E</h1>
      <div>
        <h2 className='options' onClick={() => setGlobalState("Shop")}>Shop</h2>
      </div>
      <div>
        <h2 className='options' onClick={() => setGlobalState("Publish")}>Publish a product</h2>
      </div>
      <div>
        <h2 className='options'>Offers</h2>
      </div>
      <div>
        <h2 className='options' onClick={() => setGlobalState("Wishlist")}>Your Wishlist</h2>
      </div>
    </div>
  )
}
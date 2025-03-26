import React from 'react'
import { Header } from "../header/Header";
import bg from '../../assets/backgrounds/bg-table.png';

export const Home = () => {
    return (
        <div className="w-screen h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bg})` }}>
            <Header/>
        </div>
    )
}
import React from 'react'
import { Header } from "../header/Header";
import './Home.css';
import '../../index.css';
import bg from '../../assets/backgrounds/bg-table.jpg';

export const Home = () => {
    return (
        <div className="w-screen h-screen bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bg})` }}>
            <Header/>
        </div>
    )
}
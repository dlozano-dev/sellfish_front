import { Header } from "../core/Header.tsx";
import bg from '../../assets/backgrounds/bg-table.png';
import sf_logo from '../../assets/brand_logos/sf-logo.png';

export const Home = () => {
    return (
        <div className="w-screen h-screen bg-cover bg-no-repeat bg-center bg-fixed" style={{ backgroundImage: `url(${bg})` }}>
            <Header/>
            <main className="w-screen flex flex-col justify-center items-center mt-10">
                <img src={String(sf_logo)} alt={'Sellfish logo'} className='w-120 h-auto'/>
                <p className='w-170 text-center mt-10'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </p>
            </main>
        </div>
    )
}
import { Header } from "../core/Header.tsx";
import bg from '../../assets/backgrounds/bg-table.png';
import sf_logo from '../../assets/brand_logos/sf-logo.png';
import {NoSessionHeader} from "../core/NoSessionHeader.tsx";
import {useContext, useEffect} from "react";
import {EmailContext, GlobalContext, ProfilePictureContext, UserContext, UserIdContext} from "../../Navigation.tsx";
import Cookies from 'js-cookie';
import axios from "axios";
import {HOSTNAME, SHOP} from "../../utils/Constants.tsx";

export const Home = () => {
    const { userId } = useContext(UserIdContext)!;
    const { setGlobalState } = useContext(GlobalContext)!;
    const { setUser } = useContext(UserContext)!;
    const { setEmail } = useContext(EmailContext)!;
    const { setProfilePicture } = useContext(ProfilePictureContext)!;
    const { setUserId } = useContext(UserIdContext)!;

    useEffect(() => {
        const token = Cookies.get('jwt');

        // If token exists, try to auto-login
        if (token) {
            axios.get(`${HOSTNAME}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(async res => {
                const userId = res.data.id;
                setGlobalState(SHOP);
                setUser(res.data.username);
                setUserId(userId);

                try {
                    const emailRes = await axios.get(`${HOSTNAME}/getEmail/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setEmail(emailRes.data);
                } catch {
                    setEmail('');
                }

                try {
                    const profilePicRes = await axios.get(`${HOSTNAME}/profilePicture/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProfilePicture(profilePicRes.data);
                } catch {
                    setProfilePicture(null);
                }

            }).catch(() => {
                Cookies.remove('jwt');
                setUserId(null);
            });
        }
    }, []);

    return (
        <div
            className="min-h-screen w-full bg-cover bg-no-repeat bg-center bg-fixed"
            style={{backgroundImage: `url(${bg})`}}
        >
            { userId === null ? <NoSessionHeader/> : <Header/> }

            <main className="w-full flex flex-col justify-center items-center mt-10 px-4 sm:px-8 md:px-16">
                <img
                    src={String(sf_logo)}
                    alt="Sellfish logo"
                    className="w-40 sm:w-60 md:w-80 lg:w-96 h-auto"
                />
                <p className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center mt-6 text-sm sm:text-base md:text-lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam
                </p>
            </main>
        </div>
    )
}
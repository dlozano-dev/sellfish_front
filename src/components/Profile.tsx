import { Header } from "./header/Header.tsx";
import { TabView, TabPanel } from 'primereact/tabview';
import {useContext, useEffect, useRef, useState} from "react";
import {ProfileIdContext, UserIdContext} from "../Navigation.tsx";
import {EMPTY, HOSTNAME} from "../utils/Constants.tsx";
import axios from "axios";
import {Clothe} from "./shop/data/Clothe.ts";
import {Review} from "./core/data/Review.ts";
import {Toast} from "primereact/toast";
import {Rating} from "primereact/rating";
import {Avatar} from "primereact/avatar";
import {ItemComponent} from "./core/ItemComponent.tsx";
import {Dialog} from "primereact/dialog";
import {ItemDetails} from "./shop/itemDetails/ItemDetails.tsx";
import {Settings} from "./settings/Settings.tsx";

export const Profile = () => {
    const { userId } = useContext(UserIdContext)!;
    const { profileId } = useContext(ProfileIdContext)!;
    const [email, setEmail] = useState(EMPTY);
    const [user, setUser] = useState(EMPTY);
    const [showSettings, setShowSettings] = useState(false);
    const [profilePicture, setProfilePicture] = useState(EMPTY);
    const [clothes, setClothes] = useState<Clothe[]>([]);
    const [item, setItem] = useState<Clothe | undefined>(undefined);
    const [reviews, setReviews] = useState<Review[]>([]);
    const toast = useRef<Toast>(null);

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    }

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${HOSTNAME}/profile/${profileId}`);
            const data = response.data;

            setUser(data.username);
            setEmail(data.email);
            setProfilePicture(data.profilePicture);
            setClothes(data.clothes || []);
            setReviews(data.reviews || []);
        } catch {
            showError("Error loading profile");
        }
    };

    useEffect(() => {
        fetchProfile().then();
    });

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + parseFloat(String(r.rate!)), 0) / reviews.length
        : 0;

    return (
        <div className="w-full pb-10">
            <Header />

            <Toast ref={toast} />

            <div className="w-9/10 mx-auto rounded-lg bg-white p-7 mb-5 text-stone-700 flex justify-between">
                <div className="flex">
                    <img src={`data:image/png;base64,${profilePicture}`} alt={'Profile Picture'} className='w-20 h-20 rounded-md mr-3' />
                    <div>
                        <h1 className='text-2xl text-stone-900'>{user}</h1>
                        <h1 className='text-lg text-stone-600'>{email}</h1>
                        <Rating value={averageRating} readOnly cancel={false} />
                    </div>
                </div>

                {userId === profileId ?
                    <button
                        onClick={() => setShowSettings(true)}
                        className='rounded-md border border-stone-800 cursor-pointer hover:oppacity-80 p-2 space-x-2 h-10'
                    >
                        <i className="pi pi-pencil" style={{ fontSize: '1rem' }} />
                        <span>Edit profile</span>
                    </button>
                    :
                    <div></div>
                }
            </div>

            <TabView className="w-9/10 mx-auto">
                <TabPanel header="Items" leftIcon="pi pi-warehouse mr-2">
                    {clothes.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-4">
                            {clothes.map((i, index) => (
                                <ItemComponent key={index} setItem={setItem} item={i} />
                            ))}

                            {/* Single Dialog outside the map */}
                            <Dialog
                                header="Item Details"
                                visible={!!item} // Only visible if item is defined
                                style={{ width: '50vw' }}
                                onHide={() => setItem(undefined)}
                                dismissableMask
                                modal
                            >
                                {
                                    item && <ItemDetails item={item} fetchClothes={() => {
                                        fetchProfile().then()
                                    }}/>
                                }
                            </Dialog>
                        </div>
                    ) : (
                        <p>No items found.</p>
                    )}
                </TabPanel>
                <TabPanel header={"Reviews (" + reviews.length + ")"} leftIcon="pi pi-star mr-2">
                    {reviews.length > 0 ? (
                        <div className="pl-5 space-y-4">
                            {reviews.map((review) => (
                                <div className='flex items-center'>
                                    { review.buyerProfilePicture != null ?
                                        <Avatar
                                            image={`data:image/png;base64,${review.buyerProfilePicture}`}
                                            size="large"
                                            className='shadow-md mr-4'
                                        />
                                    :
                                        <Avatar
                                            icon="pi pi-user"
                                            size="large"
                                            className='shadow-md mr-4'
                                            style={{ backgroundColor: '#ffffff', color: '#5e5e5e' }}
                                        />
                                    }
                                    <div>
                                        <h1>{review.buyerUsername}</h1>
                                        <Rating value={review!.rate} readOnly cancel={false}/>
                                        <h1>{review.review ? review.review : EMPTY}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </TabPanel>
            </TabView>

            <Dialog
                header="Settings"
                visible={showSettings}
                style={{ width: '30vw' }}
                onHide={() => setShowSettings(false)}
                dismissableMask
                modal
            >
                <Settings />
            </Dialog>
        </div>
    )
}
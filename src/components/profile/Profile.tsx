import { Header } from "../core/Header.tsx";
import { TabView, TabPanel } from 'primereact/tabview';
import {useContext, useEffect, useRef, useState} from "react";
import {LoadingContext, ProfileIdContext, UserIdContext} from "../../Navigation.tsx";
import {EMPTY, HOSTNAME} from "../../utils/Constants.tsx";
import axios from "axios";
import {Clothe} from "../shop/data/Clothe.ts";
import {Review} from "../core/data/Review.ts";
import {Toast} from "primereact/toast";
import {Rating} from "primereact/rating";
import {Avatar} from "primereact/avatar";
import {ItemComponent} from "../core/items/ItemComponent.tsx";
import {Dialog} from "primereact/dialog";
import {ItemDetails} from "../shop/itemDetails/ItemDetails.tsx";
import {Settings} from "../settings/Settings.tsx";
import {ProgressSpinner} from "primereact/progressspinner";
import {useTranslation} from "react-i18next";

export const Profile = () => {
    const { userId } = useContext(UserIdContext)!;
    const { profileId } = useContext(ProfileIdContext)!;
    const {isLoading, setIsLoading} = useContext(LoadingContext)!;
    const [email, setEmail] = useState(EMPTY);
    const [user, setUser] = useState(EMPTY);
    const [showSettings, setShowSettings] = useState(false);
    const [profilePicture, setProfilePicture] = useState(EMPTY);
    const [clothes, setClothes] = useState<Clothe[]>([]);
    const [item, setItem] = useState<Clothe | undefined>(undefined);
    const [reviews, setReviews] = useState<Review[]>([]);
    const toast = useRef<Toast>(null);
    const { t } = useTranslation();

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    }

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${HOSTNAME}/profile/${profileId}`);
            const data = response.data;

            setUser(data.username);
            setEmail(data.email);
            setProfilePicture(data.profilePicture);
            setClothes(data.clothes || []);
            setReviews(data.reviews || []);
        } catch {
            showError(t('error_loading_profile'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile().then();
    }, []);

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + parseFloat(String(r.rate!)), 0) / reviews.length
        : 0;

    return (
        <div className="w-full pb-10">
            <Header />
            <Toast ref={toast} />

            { isLoading ? (
                <div className="card flex items-center justify-center w-full pt-10">
                    <ProgressSpinner
                        style={{width: '50px', height: '50px'}}
                        strokeWidth="6"
                        aria-label="Loading"
                        animationDuration=".8s"
                        className='p-progress-spinner-color'/>
                </div>
            ) : (
                <div className="w-full">
                    <div className="w-9/10 mx-auto rounded-lg bg-white p-5 md:p-7 mb-5 text-stone-700 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-col sm:flex-row">
                            { profilePicture != null ?
                                <img
                                    src={`data:image/png;base64,${profilePicture}`}
                                    alt={'profile Picture'}
                                    className='w-20 h-20 rounded-md mr-0 sm:mr-3 mb-3 sm:mb-0'
                                />
                                :
                                <Avatar
                                    icon="pi pi-user"
                                    size="xlarge"
                                    className='shadow-md mr-0 sm:mr-4 mb-3 sm:mb-0'
                                    style={{ backgroundColor: '#ffffff', color: '#5e5e5e' }}
                                />
                            }
                            <div>
                                <h1 className='text-2xl text-stone-900 break-words'>{user}</h1>
                                <h1 className='text-lg text-stone-600 break-words'>{email}</h1>
                                <Rating value={averageRating} readOnly cancel={false} />
                            </div>
                        </div>

                        {userId === profileId ? (
                            <button
                                onClick={() => setShowSettings(true)}
                                className='rounded-md border border-stone-800 cursor-pointer hover:opacity-80 px-3 py-2 h-10 flex items-center space-x-2 self-start md:self-center'
                            >
                                <i className="pi pi-pencil" style={{ fontSize: '1rem' }} />
                                <span>{t('Edit profile')}</span>
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>

                    <TabView className="w-9/10 mx-auto">
                        <TabPanel header={t("Items")} leftIcon="pi pi-warehouse mr-2">
                            {clothes.length > 0 ? (
                                <div className="flex flex-wrap justify-center gap-4">
                                    {clothes.map((i, index) => (
                                        <ItemComponent key={index} setItem={setItem} item={i} />
                                    ))}

                                    {/* Single Dialog outside the map */}
                                    <Dialog
                                        header="Item Details"
                                        visible={!!item}
                                        style={{ width: '90vw', maxWidth: '900px' }}
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
                                <p>{t('No Items Found')}</p>
                            )}
                        </TabPanel>
                        <TabPanel header={`${t('Reviews')} (${reviews.length})`} leftIcon="pi pi-star mr-2">
                            {reviews.length > 0 ? (
                                <div className="pl-2 md:pl-5 space-y-4">
                                    {reviews.map((review, idx) => (
                                        <div key={idx} className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                                            { review.buyerProfilePicture != null ?
                                                <Avatar
                                                    image={`data:image/png;base64,${review.buyerProfilePicture}`}
                                                    size="large"
                                                    className='shadow-md'
                                                />
                                                :
                                                <Avatar
                                                    icon="pi pi-user"
                                                    size="large"
                                                    className='shadow-md'
                                                    style={{ backgroundColor: '#ffffff', color: '#5e5e5e' }}
                                                />
                                            }
                                            <div>
                                                <h1 className="font-semibold">{review.buyerUsername}</h1>
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
                        header={t("settings")}
                        visible={showSettings}
                        style={{ width: '90vw', maxWidth: '500px' }}
                        onHide={() => {
                            fetchProfile().then()
                            setShowSettings(false)
                        }}
                        dismissableMask
                        modal
                    >
                        <Settings />
                    </Dialog>
                </div>
            )}
        </div>
    )
}
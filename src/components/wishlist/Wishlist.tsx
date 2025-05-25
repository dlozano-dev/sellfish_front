import {ItemComponent} from "../core/items/ItemComponent.tsx";
import {Dialog} from "primereact/dialog";
import {ItemDetails} from "../shop/itemDetails/ItemDetails.tsx";
import {useContext, useEffect, useRef, useState} from "react";
import {Clothe} from "../shop/data/Clothe.ts";
import {LoadingContext, UserIdContext} from "../../Navigation.tsx";
import axios from "axios";
import {HOSTNAME} from "../../utils/Constants.tsx";
import {Toast} from "primereact/toast";
import {Header} from "../core/Header.tsx";
import dagger_icon from "../../assets/Icons/dagger.svg";
import {useTranslation} from "react-i18next";
import {ProgressSpinner} from "primereact/progressspinner";

export const Wishlist = () => {
    const {userId} = useContext(UserIdContext)!;
    const [clothes, setClothes] = useState<Clothe[]>([]);
    const [item, setItem] = useState<Clothe | undefined>(undefined);
    const toast = useRef<Toast>(null);
    const {isLoading, setIsLoading} = useContext(LoadingContext)!;
    const { t } = useTranslation();

    const showError = (message: string) => {
        toast.current?.clear()
        toast.current?.show({severity:'error', summary: 'Error', detail: message, life: 3000});
    }

    const fetchFavorites = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${HOSTNAME}/wishlist/${userId}`);
            setClothes(response.data);
        } catch {
            showError("Error loading profile");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites().then();
    }, [userId]);

    return (
        <div className='w-full text-center'>
            <Header />
            <Toast ref={toast} />

            <div className='w-9/10 mx-auto'>
                <div className=' p-2 text-stone-700 flex items-center rounded-lg bg-white'>
                    <img
                        src={String(dagger_icon)}
                        alt='Favorite Icon'
                        className="w-16 h-16"
                    />
                    <span className='text-lg'>
                        {t('Favorite items')}
                    </span>
                </div>
                {clothes.length > 0 ? (
                    <div className="w-full mx-auto sm:p-2 pt-5 my-5 text-stone-700 flex flex-wrap justify-center gap-4 text-start">
                        {clothes.map((i, index) => (
                            <ItemComponent key={index} setItem={setItem} item={i}/>
                        ))}

                        {/* Single Dialog outside the map */}
                        <Dialog
                            header={t("Item Details")}
                            visible={!!item} // Only visible if item is defined
                            style={{ width: '90vw', maxWidth: '900px' }}
                            onHide={() => setItem(undefined)}
                            dismissableMask
                            modal
                        >
                            {
                                item && <ItemDetails item={item} fetchClothes={() => {
                                    fetchFavorites().then()
                                }}/>
                            }
                        </Dialog>
                    </div>
                ) : (
                    isLoading ? (
                        <div className="card items-center w-full flex pt-10">
                            <ProgressSpinner
                                style={{width: '50px', height: '50px'}}
                                strokeWidth="6"
                                aria-label="Loading"
                                animationDuration=".8s"
                                className='p-progress-spinner-color'
                            />
                        </div>
                    ) : (
                        <p className='py-5'>{t('No Items Found')}</p>
                    )
                )}
            </div>
        </div>
    )
}
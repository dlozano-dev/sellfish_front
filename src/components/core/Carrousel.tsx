import { Galleria } from 'primereact/galleria';
import { Image } from 'primereact/image';

const GalleriaComponent = ({ pictures }: { pictures: string[] } ) => {

    // Template to render each image in the carousel
    const itemTemplate = (item: string) => {
        return <Image src={`data:image/png;base64,${item}`} alt={item} width='350' preview indicatorIcon="pi pi-search"/>;
    }

    const thumbnailTemplate = (item: string) => {
        return <img src={`data:image/png;base64,${item}`} alt={item} style={{ display: 'block' }} />;
    }

    return (
        <div className="card">
            <Galleria
                value={pictures}
                numVisible={5}
                circular
                style={{ maxWidth: '640px' }}
                showItemNavigators
                showItemNavigatorsOnHover
                showIndicators
                showThumbnails={false}
                item={itemTemplate}
                thumbnail={thumbnailTemplate}
            />
        </div>
    )
};

export default GalleriaComponent;

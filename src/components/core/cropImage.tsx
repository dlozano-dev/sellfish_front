export default function getCroppedImg(
    imageSrc: string,
    pixelCrop: { x: number, y: number, width: number, height: number },
    outputWidth: number,
    outputHeight: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) return reject('Canvas context not found');

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                outputWidth,
                outputHeight
            );

            resolve(canvas.toDataURL('image/jpeg'));
        };

        image.onerror = (e) => reject(e);
    });
}

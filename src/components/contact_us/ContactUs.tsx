import { Header } from "../core/Header.tsx";
import { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { EMPTY } from "../../utils/Constants.tsx";

export const ContactUs = () => {
    const [name, setName] = useState(EMPTY);
    const [email, setEmail] = useState(EMPTY);
    const [message, setMessage] = useState(EMPTY);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);

    const showError = (message: string) => {
        toast.current?.clear();
        toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    };

    const showSuccess = (message: string) => {
        toast.current?.clear();
        toast.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
    };

    const handleSubmit = async () => {
        if (!name || !email || !message) {
            showError("All fields are required!");
            return;
        }
        setIsLoading(true);
        try {
            showSuccess("Your message has been sent successfully!");
            setName(EMPTY);
            setEmail(EMPTY);
            setMessage(EMPTY);
        } catch {
            showError("Error sending message. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full pb-10">
            <Header />
            <Toast ref={toast} />

            {isLoading ? (
                <div className="card items-center w-full flex pt-10">
                    <ProgressSpinner
                        style={{ width: '50px', height: '50px' }}
                        strokeWidth="6"
                        aria-label="Loading"
                        animationDuration=".8s"
                        className='p-progress-spinner-color' />
                </div>
            ) : (
                <div className="w-full pt-5">
                    <div className="w-5/10 mx-auto rounded-lg bg-white p-7 mb-5 text-stone-700 items-center">
                        <h1 className="text-3xl text-stone-900 mb-5">Contact Us</h1>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-stone-700">Name</label>
                                <InputText
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-stone-700">Email</label>
                                <InputText
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border rounded-md"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-stone-700">Message</label>
                                <InputTextarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-3 border rounded-md"
                                    rows={5}
                                />
                            </div>

                            <div className="w-full flex justify-end items-center mt-4">
                                <Button
                                    label="Submit"
                                    icon="pi pi-send"
                                    className="p-button p-button-primary p-3"
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

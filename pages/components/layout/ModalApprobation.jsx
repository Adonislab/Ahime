

import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Textarea } from "@material-tailwind/react";
import Image from 'next/image';
import 'react-toastify/dist/ReactToastify.css';


const auth = getAuth();
const country = "bj";
const ModalApprobation = ({ product, isOpen, updateProduct, onCancel }) => {
    const [formData, setFormData] = useState({
        fullName: product ? product.fullName : "Trois pour Cinq",
        email: product ? product.email : "1",
        phoneNumber: product ? product.phoneNumber : "2",
        idCard: product ? product.idCard : "3",
        details: product ? product.details : "4",
        categorie: product ? product.categorie : "5",
        id: product ? product.id : ""
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the radio button with value "ok" is selected
        const droneValue = document.querySelector('input[name="drone"]:checked')?.value;

        if (droneValue === 'ok') {
            try {


                const updatedProduct = {
                    ...product,
                    ...formData,
                };
                updateProduct(updatedProduct);
                // console.log(formData.id);
                onCancel();
            } catch (error) {
                console.error('Erreur lors de la validation :', error);
            }
        } else {
            // Handle the case where the "ok" radio button is not selected
            console.log("You must accept to proceed.");
        }
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === "wallet") {
            setNewWalletValue(value);
        }
    };

    return (
        <div style={{ display: isOpen ? 'block' : 'none' }}>

            <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
                <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-blue-500">
                    <a href={formData.idCard} target="_blank" rel="noopener noreferrer">
                        <Image
                            src={formData.idCard}
                            width={500}
                            height={500}
                            alt="Avatar"
                            objectPosition="center"
                            className="w-16 h-16 rounded-full border-4 border-white-500 dark:border-white"
                        />
                    </a>

                    {/* <p className="text-xl text-white-400 dark:text-white">
                        Allô Group, le sens de l'engagement !
                    </p> */}
                </div>

                <form onSubmit={handleSubmit} className=" space-y-4 md:space-y-6" action="#">

                    <div className='text-left'>
                        <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Noms et prénoms</label>
                        <input onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} type="name" value={formData.fullName} name="fullName" id="fullName" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John DOE" required="" />
                    </div>

                    <div className='text-left'>
                        <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Téléphone</label>
                        <PhoneInput
                            country={country}
                            value={formData.phoneNumber}
                            onChange={(phoneNumber) => setFormData({ ...formData, phoneNumber })}
                            inputProps={{
                                id: 'phone',
                                name: 'phone',
                                required: true,
                                placeholder: '   +229000000',
                                className: 'bg-indigo-50 border border-indigo-300 text-indigo-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                            }}
                            inputComponent={({ country, ...restProps }) => (
                                <input {...restProps} />
                            )}
                        />
                    </div>

                    <div className='text-left'>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Votre email</label>
                        <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" value={formData.email} id="email" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={formData.email} required="" />
                    </div>

                    <div className='text-left'>
                        <label htmlFor="details" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                            Détails sur votre activité
                        </label>
                        <Textarea
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            name="details"
                            id="details"
                            placeholder="Spécialisé dans les fast food/cuisine locale/..."
                            value={formData.details}
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required=""
                        />
                    </div>


                    <div className='text-left'>
                        <label htmlFor="categorie" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                            Choisissez le type de partenariat
                        </label>
                        <input onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} type="name" value={formData.categorie} name="categorie" id="categorie" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={formData.categorie} required="" />


                    </div>





                    <div>
                        <input type="radio" id="dewey" name="drone" value="ok" />
                        <label for="dewey"> J'accepte</label>
                    </div>

                    <div>
                        <input type="radio" id="louie" name="drone" value="no" />
                        <label for="louie"> Je décline</label>
                    </div>






                    <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Confirmer</button>
                </form>


            </div>
















        </div>
    );
};

export default ModalApprobation;

import DashLayout from "./components/layout/dashboardLayout";
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Router from 'next/router';
import Head from "@/utils/head";
import { Textarea } from "@material-tailwind/react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const db = getFirestore(firebaseConfig);
const auth = getAuth();
export default function Setting() {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        fullName: "",
        details: "",
        email: "",
        categorie: "",
        id:"",

    });

    const [user, setUser] = useState(null); // Ajout de l'état de l'utilisateur

    const fileInputRef = useRef(null);
    const country = 'bj';


    const uploadImageToFirebase = async (imageFile) => {
        const storage = getStorage();
        const imageCounter = Date.now();
        const fileName = auth.currentUser.uid + `approbation${imageCounter}`;
        const storageRef = ref(storage, `demandes/${fileName}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };
    const handleStatusChange = (e) => {
        // Mettre à jour le statut sélectionné lorsque l'utilisateur change la liste déroulante
        setFormData({ ...formData, selectedStatus: e.target.value });
    };

    useEffect(() => {
        const auth = getAuth();
        const fetchData = async (user) => {
            if (user) {
                setUser(user); // Stocker l'utilisateur dans l'état
                const userId = user.uid;
                try {
                    const docRef = doc(db, 'users', userId);
                    const docSnapshot = await getDoc(docRef);

                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        setFormData((prevData) => ({
                            ...prevData,
                            phoneNumber: data.phoneNumber,
                            profileImageUrl: data.profileImageUrl,
                            email: user.email,
                            id: userId
                        }));
                    } else {
                        console.log("Aucune donnée trouvée pour cet utilisateur.");
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des données depuis Firestore', error);
                }
            } else {
                setUser(null); // Effacer l'utilisateur de l'état si déconnecté
                console.log("L'utilisateur n'est pas authentifié.");
            }
        };

        onAuthStateChanged(auth, fetchData);
    }, []);




    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFormData({ ...formData, selectedFile });
            console.log(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.selectedFile) {
                const newImageURL = await uploadImageToFirebase(formData.selectedFile);
                // const newImageURL1 = await uploadImageToFirebase(formData.selectedFile1);

                // Mettre à jour le champ avatar dans Firebase Firestore avec l'URL de l'image

                const { fullName, phoneNumber, categorie, details, email, id } = formData;
                const userId = auth.currentUser.uid;
                const docRef = collection(db, 'administrateur');
                const docRefusers = doc(docRef, 'admin');
                const docSnapshotUsers = await getDoc(docRefusers);
                const userData = docSnapshotUsers.data();


                // Add the data to the "examen" array field
                await updateDoc(docRefusers, {
                    examen: arrayUnion({
                        fullName: fullName,
                        phoneNumber: phoneNumber,
                        idCard: newImageURL,
                        categorie: categorie,
                        details: details,
                        email: email,
                        id:id,
                        approuve : false
                    }),
                });
            }

            toast.success('Votre demande est en cours de traitement. Nous vous reviendrons dans 1h');
            setTimeout(() => {
                Router.push("/politique");
            }, 2000);
        } catch (error) {
            console.error('Echec d\'envoi', error);
            toast.error('Echec d\'envoi');
        }
    };

    console.log(formData);
    return (
        <DashLayout>
            <Head />
            <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
                <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-blue-500">
                    <Image
                        src={formData.profileImageUrl}
                        width={500}
                        height={500}
                        alt="Avatar"
                        objectPosition="center"
                        className="w-16 h-16 rounded-full border-4 border-white-500 dark:border-white"
                    />

                    <p className="text-xl text-white-400 dark:text-white">
                        Allô Group, le sens de l'engagement !
                    </p>
                </div>

                <form onSubmit={handleSubmit} className=" space-y-4 md:space-y-6" action="#">
                    <div className='text-left'>
                        <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Noms et prénoms</label>
                        <input onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} type="name" name="fullName" id="fullName" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John DOE" required="" />
                    </div>
                    <div className='text-left'>
                        <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Téléphone</label>
                        {/* <input onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} value={formData.phoneNumber} type="number" name="phoneNumber" id="phoneNumber" className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+229 XX-XX-XX-XX" required="true" /> */}

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
                            placeholder="Vos intentions"
                            value={formData.details}
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required=""
                            rows={8}
                        />
                    </div>

                    <div className='text-left'>        
                        <fieldset>
                            <legend>Les types  de partenariat sont :</legend>

                            <div>
                                <input type="radio"/>
                                <label for="huey">Marchand (Gestionnaire de Fast Food)</label>
                            </div>

                            <div>
                                <input type="radio" />
                                <label for="dewey">Livreur (Activité de livraison de bien)</label>
                            </div>

                            <div>
                                <input type="radio" />
                                <label for="louie">Chauffeur (Activité de conduite de personne)</label>
                            </div>

                            <div>
                                <input type="radio" />
                                <label for="louie">Shopkeeper (Gestionnaire de boutique de vente de bien)</label>
                            </div>

                            <div>
                                <input type="radio" />
                                <label for="louie">Gestionnaire d'évènement (Gestionnaire de boutique d'évenement comme les établissements de décoration)</label>
                            </div>
                        </fieldset>
                    </div>    

                    <div className='text-left'>
                        <label >
                            Choisissez le type de partenariat
                        </label>

                        <select
                            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                            name="categorie"
                            id="categorie"
                            className="bg-indigo-50 border border-indigo-300 text-indigo-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required=""
                            value={formData.categorie}
                        >
                            <option value="">Sélectionnez une option</option>
                            <option value="Marchand">Marchand</option>
                            <option value="Livreur">Livreur</option>
                            <option value="Chauffeur">Chauffeur</option>
                            <option value="Shopkeeper">Shopkeeper</option>
                            <option value="Event">Gestionnaire d'évenement</option>

                        </select>
                    </div>
                    <label htmlFor="idCard" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Chargez votre Chargez votre Pièce d'identité(CIP,CIN,Passeport,Carte biométrique)</label>

                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-gray-800 dark:bg-gray-100 hover-bg-gray-100 dark:border-gray-600 dark:hover:border-gray-200">
                        Chargez votre Pièce d'identité
                        <div className="flex flex-col items-center justify-center pt-3 pb-4">
                            <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Téléversez votre document</span> ou glissez et déposez</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, JPEG, PNG (MAX. 5mo)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                        {formData.selectedFile ? (
                            <div className="w-3/4 mx-auto bg-gray-200 rounded-full dark:bg-gray-600">
                                <div className="bg-orange-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "100%" }}> 100%</div>
                            </div>
                        ) : null}
                    </label>



                    {/* <label htmlFor="idCard" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">Chargez votre Pièce d'identité(CIP,CIN,Passeport,Carte biométrique)</label>

                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-gray-800 dark:bg-gray-100 hover-bg-gray-100 dark:border-gray-600 dark:hover:border-gray-200">
                        Chargez votre Pièce d'identité
                        <div className="flex flex-col items-center justify-center pt-3 pb-4">
                            <svg className="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Téléversez votre document</span> ou glissez et déposez</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">JPG,PNG,JPEG (MAX. 5mo)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                        {formData.selectedFile ? (
                            <div className="w-3/4 mx-auto bg-gray-200 rounded-full dark:bg-gray-600">
                                <div className="bg-orange-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "100%" }}> 100%</div>
                            </div>
                        ) : null}
                    </label> */}



                    <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Soumettre</button>
                </form>


            </div>
            <ToastContainer />
        </DashLayout>
    );
}

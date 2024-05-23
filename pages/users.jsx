import DashLayout from "./components/layout/dashboardLayout";
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import Router from 'next/router';
import Head from "@/utils/head";

const db = getFirestore(firebaseConfig);
const auth = getAuth();

export default function Users() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    avatar: "",
  });
  const country = 'bj';
  const fileInputRef = useRef(null);

  const uploadImageToFirebase = async (imageFile) => {
    const storage = getStorage();
    const fileName = auth.currentUser.uid;
    const storageRef = ref(storage, `profile_images/${fileName}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  useEffect(() => {
    const auth = getAuth();
    const fetchData = async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const docRef = doc(db, 'users', userId);
          const docSnapshot = await getDoc(docRef);
    
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setFormData((prevData) => ({
              ...prevData,
              fullName: data.fullName,
              phoneNumber: data.phoneNumber,
              profileImageUrl: data.profileImageUrl,
            }));
          } else {
            console.log("Aucune donnée trouvée pour cet utilisateur.");
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données depuis Firestore', error);
        }
      } else {
        console.log("L'utilisateur n'est pas authentifié.");
      }
    };
    
    onAuthStateChanged(auth, fetchData);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, selectedFile });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (formData.selectedFile) {
        const newImageURL = await uploadImageToFirebase(formData.selectedFile);
  
        // Mettre à jour le champ avatar dans Firebase Firestore avec l'URL de l'image
        const { fullName, phoneNumber, champion } = formData;
        const userId = auth.currentUser.uid;
        const docRef = doc(db, 'users', userId);
  
        // Utilisez l'URL de téléchargement dans le champ avatar
        await setDoc(docRef, {
          fullName: fullName,
          phoneNumber: phoneNumber,
          profileImageUrl: newImageURL, 
        }, { merge: true });
      }
  
      toast.success('Vous avez mis à jour votre profil');
      setTimeout(() => {
        Router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
      toast.error('Une erreur s\'est produite lors de la mise à jour du profil.');
    }
  };


  return (
    <DashLayout>
      <Head/>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-blue-500">
          <Image
            src={formData. profileImageUrl}
            width={500}
            height={500}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-4 border-white-500 dark:border-white"
          />

          <p className="text-xl text-white-400 dark:text-white">
            Ahime, le sens de l'engagement !!! 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="name" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Votre prénom
            </label>
            <input
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              type="text" name="fullName" id="name"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="John" required=""
              value={formData.fullName} />
          </div>

          <div className='text-left'>
            <label htmlFor="phone" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Complétez votre numéro de téléphone</label>
            <PhoneInput
              country={country}
              value={formData.phoneNumber}
              onChange={(phoneNumber) => setFormData({ ...formData, phoneNumber })}
              inputProps={{
                id: 'phone',
                name: 'phone',
                required: true,
                placeholder: '+229000000',
                className: 'bg-indigo-50 border border-indigo-300 text-indigo-700 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
              }}
              inputComponent={({ country, ...restProps }) => (
                <input {...restProps} />
              )}
            />
          </div>

          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-500 dark:hover:bg-gray-800 dark:bg-gray-100 hover-bg-gray-100 dark:border-gray-600 dark:hover:border-gray-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Téléversez votre photo</span> ou glissez et déposez</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            {formData.selectedFile ? (
              <div className="w-3/4 mx-auto bg-gray-200 rounded-full dark:bg-gray-600">
                <div className="bg-orange-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "100%" }}> 100%</div>
              </div>
            ) : null}
          </label>

          <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Mettre à jour mon compte</button>

          <p className="text-xl font-light text-white dark:text-indigo-400">
            Je veux collaborer avec Allô Group  <Link href="/setting" className="font-medium text-white hover:underline dark:text-primary-500">Collaborons</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </DashLayout>
  );
}

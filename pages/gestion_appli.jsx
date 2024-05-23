import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const auth = getAuth();

export default function Champion() {
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);
  const [imageCounter, setImageCounter] = useState(0);

  const uploadImageToFirebase = async (imageFile) => {
    const storage = getStorage();
    const fileName = `promotion_${auth.currentUser.uid}_${imageCounter}`;
    const storageRef = ref(storage, `statique/promotion/${fileName}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    setImageCounter(imageCounter + 1); 
    return downloadURL;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, selectedFile });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await uploadImageToFirebase(formData.selectedFile);
      toast.success('Vous avez ajouté une image pour la section promotion');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'image', error);
      toast.error('Une erreur s\'est produite lors de l\'ajout de l\'image.');
    }
  };

  return (
    <DashLayout>
      <Head/>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-blue-500">
          <p className="text-xl text-white-400 dark:text-white">
            Les promotions et nouveautés
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-500 dark:hover-bg-gray-800 dark:bg-gray-100 hover-bg-gray-100 dark:border-gray-600 dark:hover-border-gray-200">
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

          <button type="submit" className="w-full text-white bg-indigo-600 hover-bg-primary-700 focus-ring-4 focus-outline-none focus-ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark-bg-primary-600 dark-hover-bg-primary-700 dark-focus-ring-primary-800">
            Ajoutez l'image aux promtions
          </button>
        </form>
      </div>
      <ToastContainer />
    </DashLayout>
  );
}

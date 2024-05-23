import DashLayout from "./components/layout/dashboardLayout";
import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import Head from "@/utils/head";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const db = getFirestore(firebaseConfig);
const auth = getAuth();

export default function notification() {

  const [formData, setFormData] = useState({
    title:"",
    content:"",
  });

  const fileInputRef = useRef(null);
  

  const uploadImageToFirebase = async (imageFile) => {
    const storage = getStorage();
    const imageCounter = Date.now();
    const fileName = auth.currentUser.uid + `pub${imageCounter}`; 
    const storageRef = ref(storage, `statique/${fileName}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  useEffect(() => {
    const auth = getAuth();
    const fetchData = async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'administrateur', 'admin');
          const docSnapshot = await getDoc(docRef);
    
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setFormData((prevData) => ({
              ...prevData,
              title: data.title,
              content:data.content,
            }));
            setFormData((prevData) => ({
              ...prevData,
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

  const generateProductId = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois commencent à 0
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = currentDate.getMilliseconds().toString().padStart(3, '0');
  
    // Créez un identifiant unique en utilisant la date actuelle
    const productId = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  
    return productId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const docRef = doc(db, 'administrateur', 'admin');
      const docSnapshot = await getDoc(docRef);
  
      if (formData.selectedFile && docSnapshot.exists()) {
        const newImageURL = await uploadImageToFirebase(formData.selectedFile);
  
        const { title, content } = formData;
  
        // Obtenir les données existantes
        const userData = docSnapshot.data();
        const pub = userData.promotion || []; // Récupérer la liste existante ou initialiser une nouvelle liste
  
        // Ajouter une nouvelle publicité à la liste
        const productId = generateProductId();
        pub.push({
          id: productId,
          date: Date.now(),
          title: title,
          content: content,
          image: newImageURL,
        });
  
        // Mettre à jour les données dans Firebase
        await setDoc(docRef, { promotion: pub }, { merge: true });
  
        toast.success('Vous avez posté une promotion avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la publicité', error);
      toast.error("Il y a eu une erreur lors de l'édition d'une publicité");
    }
  };
  

  
  return (
    <DashLayout>
      <Head/>

      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-blue-500">
          <p className="text-xl text-white-400 dark:text-white">
          Ahime, le sens de l'engagement !!! 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="title" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Quel titre donnez vous à la publication ?
            </label>
            <input
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              type="text" name="title" id="title"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Les livres de Matthieu" required=""
              value={formData.title} />
          </div>

          
          <div className='text-left'>
            <label htmlFor="content" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Comment pourriez-vous décrire le contenu de cette publication ?
            </label>
            <textarea
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              name="content" id="content"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Descrivez le contenu de la pubicité"
              value={formData.content}
              rows={8} 
            />
          </div>

          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-500 dark:hover:bg-gray-800 dark:bg-gray-100 hover-bg-gray-100 dark:border-gray-600 dark:hover:border-gray-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Téléversez la photo du produit</span> ou glissez et déposez</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            {formData.selectedFile ? (
              <div className="w-3/4 mx-auto bg-gray-200 rounded-full dark:bg-gray-600">
                <div className="bg-orange-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "100%" }}> 100%</div>
              </div>
            ) : null}
          </label>

          <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Postez la publicité</button>

        </form>
      </div>
      <ToastContainer />
      
    </DashLayout>
  )
}


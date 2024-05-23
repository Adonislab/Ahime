import DashLayout from "./components/layout/dashboardLayout";
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';
import { getFirestore, doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Router from 'next/router';
import Head from "@/utils/head";


const db = getFirestore(firebaseConfig);
const auth = getAuth();

export default function ProduitAdd() {
  const [formData, setFormData] = useState({
    price: "",
    title: "",
    description: "",
    image: "",
    categorie: "",
    profileImageUrl: "",
    during: "",
    note: "",
  });
  const fileInputRef = useRef(null);


  const uploadImageToFirebase = async (imageFile) => {
    const storage = getStorage();
    const imageCounter = Date.now();
    const fileName = auth.currentUser.uid + `produit${imageCounter}`;
    const storageRef = ref(storage, `profile_images_marchand/${fileName}`);
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
          const docRef = doc(db, 'marchands', userId);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setFormData((prevData) => ({
              ...prevData,
              note: data.note,
              title: data.title,
              price: data.price,
              image: data.image,
              description: data.description,
              categorie: data.categorie,
              during: data.during,
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();


  //     try {
  //       const userId = auth.currentUser.uid;
  //       const docRef = doc(db, 'marchands', userId);
  //       const docSnapshot = await getDoc(docRef);


  //       if (formData.selectedFile && docSnapshot.exists()) {
  //         const newImageURL = await uploadImageToFirebase(formData.selectedFile);


  //         // Obtenez un identifiant unique basé sur la date actuelle
  //         const productId = generateProductId();

  //         const { title, price, description, categorie, during, note } = formData;

  //         const userData = docSnapshot.data();
  //         const userRole = userData.marchand;
  //         // const userApprobation = userData.approuve;
  //         const produits = userData.produits || [];
  //         // if (userRole === true && userApprobation === true) {
  //           if (userRole === "oui" ) {
  //           // Ajoutez le nouveau produit au tableau des produits
  //           produits.push({
  //             id: productId,
  //             note: note,
  //             title: title,
  //             price: price,
  //             description: description,
  //             categorie: categorie,
  //             image: newImageURL,
  //             during: during,
  //             isFavorite: false,
  //           });
  //           // Mettez à jour le document utilisateur avec le tableau mis à jour des produits
  //           await setDoc(docRef, { produits }, { merge: true });
  //           toast.success('Votre produit a été ajouté avec succès à votre boutique');
  //           setTimeout(() => {
  //             Router.push("/dashboardMarchand");
  //           }, 2000);
  //         } else {
  //           setTimeout(() => {
  //             Router.push("/marchand");
  //           }, 2000);
  //           toast.error("Vous n'avez pas de compte marchand pour créer un produit.");
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Erreur lors de la mise à jour du profil', error);
  //       toast.error("Il a une erreur au cours de la mise à jour de votre boutique");
  //     }

  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userId = auth.currentUser.uid;
  
      // Get the marchand document from the "marchands" collection
      const marchandDocRef = doc(db, 'marchands', userId);
      const marchandDocSnapshot = await getDoc(marchandDocRef);
  
      // Check if the marchand document exists
      if (marchandDocSnapshot.exists()) {
        // Get the user document from the "users" collection
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
  
        // Check if the user document exists
        if (userDocSnapshot.exists()) {
          const userApprobation = userDocSnapshot.data().approuve;
          console.log("User Approbation:", userApprobation);
  
          // Check if formData.selectedFile is defined
          if (formData.selectedFile) {
            const newImageURL = await uploadImageToFirebase(formData.selectedFile);
            // Obtenez un identifiant unique basé sur la date actuelle
            const productId = generateProductId();

            const { title, price, description, categorie, during, note } = formData;

            const userData = marchandDocSnapshot.data();
            const userRole = userData.marchand;
            // const userApprobation = userData.approuve;
            const produits = userData.produits || [];
            // if (userRole === true && userApprobation === true) {
            if (userRole === "oui") {
              // Ajoutez le nouveau produit au tableau des produits
              produits.push({
                id: productId,
                note: note,
                title: title,
                price: price,
                description: description,
                categorie: categorie,
                image: newImageURL,
                during: during,
                isFavorite: false,
              });
              // Mettez à jour le document utilisateur avec le tableau mis à jour des produits
              await setDoc(marchandDocRef, { produits }, { merge: true });
              toast.success('Votre produit a été ajouté avec succès à votre boutique');
              setTimeout(() => {
                Router.push("/dashboardMarchand");
              }, 2000);
            } else {
              setTimeout(() => {
                Router.push("/marchand");
              }, 2000);
              toast.error("Vous n'avez pas de compte marchand pour créer un produit.");
            }
            // Rest of your code...
          } else {
            console.log("formData.selectedFile is undefined.");
            // Handle the case where formData.selectedFile is undefined
          }
        } else {
          console.log("User document does not exist.");
          // Handle the case where the user document does not exist
        }
      } else {
        console.log("Marchand document does not exist.");
        // Handle the case where the marchand document does not exist
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred during the update of your shop");
    }
  };
  


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
            className="w-16 h-16 rounded-full border-4 border-white-500 dark:border-white"
          />

          <p className="text-xl text-white-400 dark:text-white">
            Allô Group, le sens de l'engagement !!!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="title" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Quel titre donnez vous à votre produit ?
            </label>
            <input
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              type="text" name="title" id="title"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Les Armandes aux olives" required=""
              value={formData.title} />
          </div>

          <div className='text-left'>
            <label htmlFor="price" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Combien vaut une unité de votre produit ?</label>
            <input
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              type="number" name="price" id="price"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="500F" required=""
              value={formData.price} />
          </div>

          <div className='text-left'>
            <label htmlFor="description" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Comment pourriez-vous décrire votre produit ?
            </label>
            <textarea
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              name="description" id="description"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Vendez les mérites de votre produit"
              value={formData.description}
              rows={8}
            />
          </div>

          <div className='text-left'>
            <label htmlFor="during" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Combien de temps faut-il avant la consommation finale du produit ?</label>
            <input
              onChange={(e) => setFormData({ ...formData, during: e.target.value })}
              type="number" name="during" id="during"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="5min" required=""
              value={formData.during} />
          </div>

          <div className='text-left'>
            <label htmlFor="note" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Quelle note spéciale avez vous pour la promtion de ce produit ?</label>
            <input
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              type="text" name="note" id="note"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Promotion"
              value={formData.note} />
          </div>

          <div className='text-left'>
            <label htmlFor="categorie" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              A quelle catégorie appartient votre produit ?
            </label>

            <select
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              name="categorie"
              id="categorie"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
              value={formData.categorie}
            >
              <option value="">Sélectionnez une option</option>
              <option value="Fast Food">Fast Food</option>
              <option value="Cuisine Africaine">Cuisine Africaine</option>
              <option value="Cuisine Américaine">Cuisine Américaine</option>
              <option value="Spécialité Européenne">Cuisine Européenne</option>
              <option value="Spécialité Béninoise">Spécialité Béninoise</option>
              <option value="Viandes-Poissons-etc">Viandes-Poissons-etc</option>
              <option value="Dessert">Dessert</option>
              <option value="Coktails">Coktails</option>
              <option value="Amuse bouche">Amuse bouche</option>
            </select>
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

          <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Postez le produit</button>

          <p className="text-xl font-light text-white dark:text-indigo-400">
            Je suis un marchand <Link href="/dashboardMarchand" className="font-medium text-white hover:underline dark:text-primary-500">Mise à jour de produit</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </DashLayout>
  );
}

import DashLayout from "./components/layout/dashboardLayout";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Router from 'next/router';
import Head from "@/utils/head";

const db = getFirestore(firebaseConfig);

export default function Setting() {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    email: "",
    selectedStatus: "",
    acceptTerms: false, 
  });

  const [user, setUser] = useState(null); // Ajout de l'état de l'utilisateur

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
              fullName: data.fullName,
              phoneNumber: data.phoneNumber,
              profileImageUrl: data.profileImageUrl,
              email: user.email,
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

  const handleNavigation = () => {
    // Effectuer la navigation en fonction du statut sélectionné
    const status = formData.selectedStatus;
    if (status === "utilisateur") {
      Router.push("/setting"); // Naviguer vers la page de setting
    } else if (status === "champion") {
      Router.push("/champion"); // Naviguer vers la page de champion
    } else if (status === "marchand") {
      Router.push("/marchand"); // Naviguer vers la page de marchand
    }
  };

  const handleLogout = () => {
    // Afficher une boîte de dialogue de confirmation
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');

    if (confirmed) {
      Router.push('/connexion'); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.acceptTerms) {
      toast.success('Félicitation, vous pouvez passer à la création du compte');
      setTimeout(() => {
        handleNavigation();
      }, 2000);
    } else {
      toast.error('Nous vous prions de lire et d\'accepter les termes du contrat');
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
            objectPosition="center"
            className="w-16 h-16 rounded-full border-4 border-white-500 dark:border-white"
          />

          <p className="text-xl text-white-400 dark:text-white">
            Allô Group, le sens de l'engagement ! 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="name" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Votre email : {formData.email}
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Votre prénom : {formData.fullName}
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Numéro de téléphone : + {formData.phoneNumber}
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Statut de mon compte :
              <select
                value={formData.selectedStatus}
                onChange={handleStatusChange}
                className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              >
                <option value="utilisateur">Utilisateur</option>
                <option value="champion">Champion</option>
                <option value="marchand">Marchand</option>
              </select>
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              <Link href="/setting">
                Mon portefeuille 
              </Link>
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              <Link href="/setting">
                Paramètre 
              </Link>
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              <Link href="/setting">
                Gestion utilisateur
              </Link>
            </label>
          </div>

          <div className='text-left'>
            <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              <input
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                checked={formData.acceptTerms} 
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              />
              J'ai lu et j'accepte les termes du contrat
            </label>
          </div>

          {user && ( // Afficher le bouton de changement de statut seulement si l'utilisateur est connecté
            <div className='text-left'>
              <button onClick={handleLogout} className="text-indigo-700 cursor-pointer">
                <label className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
                  Déconnexion
                </label>
              </button>
            </div>
          )}

          {user && ( // Afficher le bouton "Procédez au changement de statut" seulement si l'utilisateur est connecté
            <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover-bg-primary-700 dark:focus:ring-primary-800">
              Augmentez mes privilèges en ajoutant un autre statut
            </button>
          )}

          <p className="text-xl font-light text-white dark:text-indigo-400">
            Je veux collaborer avec Allô Group  <Link href="/setting" className="font-medium text-white hover:underline dark:text-primary-500">Collaborons</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </DashLayout>
  );
}

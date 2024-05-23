import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDoc,doc ,updateDoc, getDocs} from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ModalModificationChampion from "./components/layout/ModalModificationChampion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Gestion_Portefeuille_Champion() {

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const COLUMNS = [
        { label: <span className="text-blue-500">Utilisateurs</span>, renderCell: (item) => item.fullName },
        {
            label: <span className="text-blue-500">Type de profil</span>,
            renderCell: (item) => ("Champion"),
        },
        { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
        //   { label: <span className="text-blue-500">Photo</span>, renderCell: (item) => 
        //     <Image src={item.profileImageUrl} width={50} height={50}  alt={item.fullName}/>  
        //   },
        {
            label: <span className="text-blue-500">Portefeuille</span>, renderCell: (item) => (
                <>
                    {item.wallet} F
                </>
            )
        },
        {
            label: <span className="text-blue-500"></span>, renderCell: (item) => (
                <button className="text-white bg-purple-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> <FontAwesomeIcon icon={faEdit} /></button>)
        },
    ];

    

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);

        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);

                const usersRef = collection(db, "champions");
                const querySnapshot = await getDocs(usersRef);

                const userDataArray = [];
                querySnapshot.forEach((doc) => {
                    userDataArray.push(doc.data());
                });


                setUserData(userDataArray);
                setLoading(false);
            } else {
                setUser(null);
                setUserData([]);
                setLoading(false);
            }
        });
    }, []);


 

    const updateProduct = async (updatedProduct) => {
        console.log("updatedProduct:", updatedProduct);
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);
    
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            console.log(updatedProduct.id);
    
            try {
                // Accédez à la collection "champions"
                const championsRef = collection(db, "champions");
    
                // Récupérez tous les documents de la collection "champions"
                const championsSnapshot = await getDocs(championsRef);
    
                // Créez un tableau pour stocker les données des champions
                const championsData = [];
    
                // Parcourez chaque document
                championsSnapshot.forEach((doc) => {
                    championsData.push(doc.data());
                });
    
                console.log("--------------championsData: ", championsData);
    
                // Mettez à jour le tableau avec les données du champion modifié
                const updatedChampionsData = championsData.map((champion) => {
                    if (champion.id === updatedProduct.id) {
                        return { ...champion, wallet: updatedProduct.wallet };
                    } else {
                        return champion;
                    }
                });
    
                // Mettez à jour la collection "champions" avec les données modifiées
                await Promise.all(updatedChampionsData.map(async (champion) => {
                    const championDocRef = doc(championsRef, champion.id);
                    await updateDoc(championDocRef, { wallet: champion.wallet });
                }));
    
                console.log("Le produit a été mis à jour avec succès dans la collection champions.");
    
                // Accédez à la collection "users"
                const usersRef = collection(db, "users");
    
                // Récupérez tous les documents de la collection "users"
                const usersSnapshot = await getDocs(usersRef);
    
                // Recherchez l'index du document correspondant à updatedProduct.id
                const userIndex = usersSnapshot.docs.findIndex((user) => user.id === updatedProduct.id);
    
                if (userIndex !== -1) {
                    // Mettez à jour le document de l'utilisateur avec le nouveau portefeuille
                    const userDocRef = doc(usersRef, usersSnapshot.docs[userIndex].id);
                    await updateDoc(userDocRef, { wallet: updatedProduct.wallet });
    
                    console.log("Le portefeuille de l'utilisateur a été mis à jour avec succès dans la collection users.");
                } else {
                    console.error("Utilisateur introuvable dans la collection users.");
                }
    
                // Réactualisez les données après la modification.
                setUserData(updatedChampionsData);

                // Fermez le modal de modification ici
                toast.success('Modification réussie !', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                setSelectedProduct(null);
    
    
            } catch (error) {
                console.error("Erreur lors de la mise à jour du produit ou du portefeuille de l'utilisateur", error);
                toast.error('Échec de la modification. Veuillez réessayer.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        }
    };
    
    

// Pagination
const indexOfLastUser = currentPage * usersPerPage;
const indexOfFirstUser = indexOfLastUser - usersPerPage;
const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

const paginate = (pageNumber) => setCurrentPage(pageNumber);
const nextPage = () => setCurrentPage(currentPage + 1);
const prevPage = () => setCurrentPage(currentPage - 1);

if (loading) {
  return <p>Chargement...</p>;
}
    




    return (
        <DashLayout>
      <Head />
      {selectedProduct && (
        <ModalModificationChampion
          product={selectedProduct}
          isOpen={isModalOpen}
          updateProduct={updateProduct}
          onCancel={closeModal}
        />
      )}
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        Gestion des portefeuilles Champions
      </div>
      {/* <p className="mt-4 text-2xl text-orange-500"> Qui sont les grands utilisateurs de Allô Group ?</p> */}
      <p className="text-2xl text-blue-500">Nombre d'utilisateurs : {userData.length}</p>
      <table className="w-full table-fixed">
        <thead>
          <tr>
            {COLUMNS.map((column, index) => (
              <th key={index} className="px-4 py-2">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((item, index) => (
            <tr key={index}>
              {COLUMNS.map((column, columnIndex) => (
                <td key={columnIndex} className="px-4 py-2 border">
                  {column.renderCell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Précédent
        </button>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(userData.length / usersPerPage) }).map((_, index) => (
            <div
              key={index}
              onClick={() => paginate(index + 1)}
              className={`cursor-pointer hover:underline px-2 py-2 ${
                currentPage === index + 1 ? 'bg-blue-500 text-white rounded-full' : ''
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(userData.length / usersPerPage)}
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Suivant
        </button>
      </div>
      {/* End Pagination */}
    </DashLayout>
    )
}

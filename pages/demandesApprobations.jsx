import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDoc,doc ,updateDoc, getDocs,getDownloadURL} from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrashAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalApprobation from "./components/layout/ModalApprobation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function DemandesApprobations() {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        fullName: "",
        details: "",
        email: "",
        categorie: "",
        idCard: "",
        id:"",
        approuve: ""

    });
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
        { label: <span className="text-blue-500">Noms et prénoms</span>, renderCell: (item) => item.fullName },
        { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber, },
        
        {
            label: <span className="text-blue-500">Statut</span>,
            renderCell: (item) => {
                if(item.approuve == false){
                    return  <button className="text-white bg-red-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> En attente </button>
                } else{ return <button className="text-white bg-orange-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> Approuvé</button>}
            },
        },
        {
            label: <span className="text-blue-500">Approuver</span>, renderCell: (item) => (
                <button className="text-white bg-blue-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> <FontAwesomeIcon icon={faEye} /></button>)
        },
        {
            label: <span className="text-blue-500">Supprimer</span>, renderCell: (item) => (
                <button className="text-white bg-red-500 hover:text-white focus:outline-none" onClick={() => retirer(item)}> <FontAwesomeIcon icon={faTrash}  /></button>)
        },
        
    ];
    

    

   
    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);

        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                try {
                    const usersRef = collection(db, "administrateur");
                    const usersDoc = doc(usersRef, "admin");
                    const docSnapshot = await getDoc(usersDoc);

                    const userDataArray = [];
                    const data = docSnapshot.data();
                    const examenArray = data.examen || [];

                    examenArray.forEach((examen) => {
                        userDataArray.push({
                            fullName: examen.fullName,
                            email: examen.email,
                            phoneNumber: examen.phoneNumber,
                            details: examen.details,
                            categorie: examen.categorie,
                            idCard : examen.idCard,
                            id: examen.id,
                            approuve : examen.approuve
                            // Add other fields as needed

                        });
                        console.log("***********************",userDataArray[0]["approuve"]);
                    });

                    setUserData(userDataArray);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                }
            } else {
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
                // Accédez à la collection "administrateur"
                const adminRef = collection(db, "administrateur");
                const adminDocRef = doc(adminRef, "admin");
                const adminDocSnapshot = await getDoc(adminDocRef);
    
                // Récupérez la liste d'examens de l'administrateur
                const examenArray = adminDocSnapshot.data().examen || [];
    
                // Recherchez l'index de l'examen correspondant à updatedProduct.id
                const examenIndex = examenArray.findIndex((examen) => examen.id === updatedProduct.id);
    
                if (examenIndex !== -1) {
                    // Mettez à jour le champ "approuvé" dans l'examen
                    examenArray[examenIndex].approuve = true;
    
                    // Mettez à jour le document administrateur avec la nouvelle liste d'examens
                    await updateDoc(adminDocRef, { examen: examenArray });
    
                    console.log("Le champ 'approuvé' a été mis à jour dans la collection administrateur.");
    
                    // Accédez à la collection "users"
                    const usersRef = collection(db, "users");
    
                    // Récupérez le document de l'utilisateur correspondant à updatedProduct.id
                    const userDocRef = doc(usersRef, updatedProduct.id);
                    const userDocSnapshot = await getDoc(userDocRef);
    
                    if (userDocSnapshot.exists()) {
                        // Mettez à jour le champ "approuvé" dans le document de l'utilisateur
                        await updateDoc(userDocRef, { approuve: true });
    
                        console.log("Le champ 'approuvé' a été mis à jour dans la collection users.");
                    } else {
                        console.error("Utilisateur introuvable dans la collection users.");
                    }
    
                    // Réactualisez les données après la modification.
                    setUserData(examenArray);
    
                    // Fermez le modal de modification ici
                    toast.success('Modification réussie !', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                    });
                    setSelectedProduct(null);
                } else {
                    console.error("Examen introuvable dans la collection administrateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la mise à jour du champ 'approuvé'", error);
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
    




    const retirer = async (updatedProduct) => {
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);
        console.log(" updatedProduct: ", updatedProduct);
        
        if (auth.currentUser) {
            try {
                // Accédez à la collection "administrateur"
                const adminRef = collection(db, "administrateur");
                const adminDocRef = doc(adminRef, "admin");
                const adminDocSnapshot = await getDoc(adminDocRef);
    
                // Récupérez la liste d'examens de l'administrateur
                const examenArray = adminDocSnapshot.data().examen || [];
    
                // Recherchez l'index de l'examen correspondant à updatedProduct.id
                console.log("Examen array avant la recherche d'index : ", examenArray);
                console.log("Examen array avant la recherche d'index : ", updatedProduct.id);
                const examenIndex = examenArray.findIndex((examen) => examen.id === updatedProduct.id);
                console.log("Index de l'examen à retirer : ", examenIndex);
    
                if (examenIndex !== -1) {
                    // Affichez l'examen à retirer
                    console.log("Examen à retirer : ", examenArray[examenIndex]);
    
                    // Vérifiez si "approuve" est à true
                    if (examenArray[examenIndex].approuve) {
                        // Supprimez l'examen correspondant à updatedProduct.id
                        examenArray.splice(examenIndex, 1);
    
                        // Mettez à jour le document administrateur avec la nouvelle liste d'examens
                        await updateDoc(adminDocRef, { examen: examenArray });
    
                        console.log("L'examen a été retiré de la collection administrateur.");
    
                        // Fermez le modal ici si nécessaire
                        setSelectedProduct(null);
    
                        // Réactualisez les données après la modification.
                        setUserData(examenArray);
                    } else {
                        // Affichez un toast si "approuve" est à false
                        toast.error("Cet utilisateur n'est pas encore vérifié.", {
                            position: 'top-right',
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                        });
                    }
                } else {
                    console.error("Examen introuvable dans la collection administrateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de l'examen", error);
                toast.error('Échec de la suppression. Veuillez réessayer.', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        }
    };
    















    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    




    return (
        <DashLayout>
            <Head />
            {selectedProduct && (
        <ModalApprobation
          product={selectedProduct}
          isOpen={isModalOpen}
          // Passez la fonction updateProduct au composant ModalMarchand
          updateProduct={updateProduct}
          onCancel={closeModal}     
        />
      )}
            <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
               Approbations en attente
            </div>
            {/* <p className="mt-4 text-2xl text-orange-500"> Qui sont les grands utilisateurs  de Allô Group ?</p> */}
            <p className="text-2xl text-blue-500">Nombre d'approbations : {userData.length}</p>
            <table className="w-full table-fixed">
                <thead>
                    <tr>
                        {COLUMNS.map((column, index) => (
                            <th key={index} className="px-4 py-2">{column.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {userData.map((item, index) => (
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
            onClick={() => paginate(currentPage - 1)}
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
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(userData.length / usersPerPage)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Suivant
          </button>
        </div>
        {/* End Pagination */}
        <ToastContainer/>
        </DashLayout>
    )
}

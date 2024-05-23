import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from '../../../utils/firebaseConfig';

export default function MarchandTable() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const COLUMNS = [
    { label: <span className="text-blue-500">Nom du Champion</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Adresse</span>,
      renderCell: (item) => item.adresse,
    },
    { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
    { label: <span className="text-blue-500">Portefeuille</span>, renderCell: (item) => item.wallet + " FCFA" } ,
    { label: <span className="text-blue-500">Adresse</span>, renderCell: (item) => item.adresse },

    // { label: <span className="text-blue-500"></span>, renderCell: (item) => 
    //     <button className=" bg-red-500 text-white hover:text-white focus:outline-none" onClick={() => handleDelete(item)}>Supprimez</button> 
    // },
  ];

    const handleEdit = (item) => {
        alert('Modification');
    };

    const handleDelete = async (item) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
        
        const auth = getAuth();
        const db = getFirestore(firebaseConfig);
        const userId = item.id; 
        try {
            await deleteDoc(doc(db, "users", userId));
            // Réactualisez les données après la suppression.
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef);
            const userDataArray = [];
            querySnapshot.forEach((doc) => {
            userDataArray.push({ id: doc.id, ...doc.data() });
            });
            setUserData(userDataArray);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur", error);
        }
        }       
    }

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const marchandsRef = collection(db, "zems");
        const querySnapshot = await getDocs(marchandsRef);

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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <>
        <p className="text-2xl text-blue-500">Nombre de Chauffeur Allô Zem : {userData.length} </p>
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
    </> 
  );
}

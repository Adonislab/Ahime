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
    { label: <span className="text-blue-500">Chauffeur</span>, renderCell: (item) => item.fullName },
    { label: <span className="text-blue-500">No Client</span>, renderCell: (item) => item.commandes && item.commandes.length > 0 ? item.commandes[0]['numeroARecuperation'] : '', },
    {
      label: <span className="text-blue-500">Départ</span>,
      renderCell: (item) => item.commandes && item.commandes.length > 0 ? item.commandes[0]['addressRecuperation'] : '',
    },
    { 
      label: <span className="text-blue-500">Arrivée</span>, 
      renderCell: (item) => item.commandes && item.commandes.length > 0 ? item.commandes[0]['addressLivraison'] : '',
    },
    { label: <span className="text-blue-500">No Chauffeur</span>, renderCell: (item) => item.phoneNumber },
    { label: <span className="text-blue-500">Code</span>, renderCell: (item) => 
    <button 
      className="text-white bg-orange-500 hover:bg-orange-600 focus:outline-none p-4 rounded-lg"
      onClick={() => handleClick(item.commandes && item.commandes.length > 0 ? item.commandes[0] : '')}
      >{item.commandes && item.commandes.length > 0 ? item.commandes[0]['password'] : ''}
    </button>  
    }, 
];

const formatDateTime = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) {
    return ''; // ou une valeur par défaut si timestamp est undefined, null ou non un nombre
  }

  const date = new Date(Number(timestamp));
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second:'numeric'
  };

  return new Intl.DateTimeFormat('fr-FR', options).format(date);
};

const handleClick = (item) =>{
  const message = 
  `Receveur :${item.addressLivraison}\nNuméro du receveur : ${item.numeroALivraison}\nZone du commanditaire : ${item.addressRecuperation}\nNuméro du commanditaire : ${item.numeroARecuperation}\nType de Livraison : ${item.type_courses}\nTitre de la livraison : ${item.title}\nDétails sur la livraison : ${item.title}\nPrix de livraison : ${item.prix} F\nCode de transcation : ${item.password}\nDate de Livraison : ${formatDateTime(item.dateDeLivraison)}`; 
 alert(
  message
 );
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

        // Filtrer userData pour exclure les champions avec des commandes vides
        const championsWithCommands = userDataArray.filter((item) => item.commandes && item.commandes.length > 0);
        setUserData(championsWithCommands);
        
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
        <p className="text-2xl text-blue-500">Nombre de chauffeur en activité : {userData.length}</p>
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

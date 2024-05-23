
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useEffect, useState } from "react";

import 'react-toastify/dist/ReactToastify.css';


export default function Gestion_Portefeuille_Champion() {

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

 
  const COLUMNS = [
    { label: <span className="text-blue-500">Utilisateurs</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Type de profil</span>,
      renderCell: (item) => ("Chauffeur"),
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
    
  ];



  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const usersRef = collection(db, "zems");
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
<>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        Avoir des chauffeurs
      </div>
      <p className="text-2xl text-blue-500">Nombre de chauffeurs: {userData.length}</p>
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
              className={`cursor-pointer hover:underline px-2 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white rounded-full' : ''
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
      </>
      )
}

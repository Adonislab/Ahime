import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MarchandsChart from "./components/layout/MarchandsChart";
import BoutiquesChart from "./components/layout/BoutiquesChart";
import EventChart from "./components/layout/EventChart";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from '../utils/firebaseConfig';
import MarchandTable from "./components/layout/MarchandTable";
import ChampionTable from "./components/layout/ChampionTable";
import BoutiqueTable from "./components/layout/BoutiqueTable";
import EventTable from "./components/layout/EventTable";
import ChauffeurTable from "./components/layout/ChauffeurTable";
import Image from "next/image";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const COLUMNS = [
    { label: <span className="text-blue-500">Utilisateurs</span>, renderCell: (item) => item.fullName },
    {
      label: <span className="text-blue-500">Type de profil</span>,
      renderCell: (item) => (item.role),
    },
    { label: <span className="text-blue-500">Téléphone</span>, renderCell: (item) => item.phoneNumber },
    {
      label: <span className="text-blue-500">Photo</span>, renderCell: (item) =>
        <Image src={item.profileImageUrl} width={50} height={50} alt={item.fullName} />
    },
    {
      label: <span className="text-blue-500">Portefeuille</span>, renderCell: (item) => (
        <>
          {item.wallet} F
        </>
      )
    },
  ];

  const handleEdit = (item) => {
    alert('Modification');
  };

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const usersRef = collection(db, "users");
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


  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Chargement...</p>;
  }


  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <DashLayout>
      <Head />
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
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


      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        {/* <p className="mt-4 text-2xl text-orange-500"> Quelles sont les grandes tendances marchandes de Ahime Group ?</p> */}
        <MarchandTable />
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div>
          <p className="text-2xl text-orange-500">Les spécialités de cuisine au sein des restaurants Ahime Food</p>
          <MarchandsChart />
        </div>
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        {/* <p className="mt-4 text-2xl text-orange-500"> Quelles sont les grandes tendances marchandes de Ahime Group ?</p> */}
        <BoutiqueTable />
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div>
          <p className="text-2xl text-orange-500">Les spécialités au sein des boutiques Ahime Market</p>
          <BoutiquesChart />
        </div>
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        {/* <p className="mt-4 text-2xl text-orange-500"> Quelles sont les grandes tendances marchandes de Ahime Group ?</p> */}
        <EventTable/>
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div>
          <p className="text-2xl text-orange-500">Les spécialités des gestionnaires Ahime Event</p>
          <EventChart />
        </div>
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="mt-4 text-2xl text-orange-500">Livreurs</p>
        <ChampionTable />
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="mt-4 text-2xl text-orange-500">Chauffeurs </p>
        <ChauffeurTable />
      </div>
    </DashLayout>
  );
}

export default Dashboard;










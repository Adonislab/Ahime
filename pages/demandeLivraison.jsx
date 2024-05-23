import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc} from 'firebase/firestore';
import { firebaseConfig } from '../utils/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';



function DashboardLivraison() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [livraisonsPerPage] = useState(5);
  



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
  
  
    const deliveryInfos = (item) => {
      alert(`
        Commanditaire: ${item.numeroARecuperation}
        Adresse de recupération du colis: ${item.addressRecuperation}
        Destinataire: ${item.numeroALivraison}
        Adresse de destination du colis: ${item.addressLivraison}
        Colis: ${item.title}
        Type de course: ${item.type_courses}
        prix: ${item.prix}
        Date de Livraison: ${formatDateTime(item.dateDeLivraison)}
      `);
    };








  const COLUMNS = [
    { label: <span className="text-blue-500">Quoi</span>, renderCell: (item) => item.title },
    {
      label: <span className="text-blue-500">Départ</span>, 
      renderCell: (item) => item.addressRecuperation,
    },
    { label: <span className="text-blue-500">Arrivée</span>, renderCell: (item) => item.addressLivraison },
    { label: <span className="text-blue-500">Prix</span>, 
       renderCell: (item) =>(
        <span>
          {item.prix} FCFA
        </span>
      ),
    },
    { label: <span className="text-blue-500">Détails</span>, renderCell: (item) => (
        <button className="bg-blue-500 text-white hover:text-white focus:outline-none" onClick={() => deliveryInfos(item)}><FontAwesomeIcon icon={faInfoCircle} /></button>)
    },
  ];

  
  

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;
       
        // Utilisez l'ID de l'utilisateur pour chercher son document marchand
        const userDocRef = doc(db, "administrateur", "commandeCourses");
        
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          const userDocData = userDocSnapshot.data();
          

          if (userDocData) {
            // Utilisez userDocData pour afficher les livraions  
            setProducts(userDocData.courses); 
          } else {
            // Aucun document marchand trouvé pour l'utilisateur
            setProducts([]);
          }

          setLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des données du marchand", error);
        }
      } else {
        setUser(null);
        setProducts([]);
        setLoading(false);
      }
    });
  }, []);
  // Pagination
  const indexOfLastLivraison = currentPage * livraisonsPerPage;
  const indexOfFirstLivraison = indexOfLastLivraison - livraisonsPerPage;
  const currentLivraisons = products.slice(indexOfFirstLivraison, indexOfLastLivraison);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <DashLayout>
      <Head />
      
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        {/* <p className="mt-4 text-2xl text-orange-500">Quelles sont les grandes tendances de livraion Allô Group ?</p> */}
        <p className="text-2xl text-blue-500">Nombre de disponible : {products.length}</p>
        <table className="w-full table-fixed">
          <thead>
          <tr>
              {COLUMNS.map((column, index) => (
                <th key={index} className="px-4 py-2">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentLivraisons.map((item, index) => (
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

       


      </div>
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
          {Array.from({ length: Math.ceil(products.length / livraisonsPerPage) }).map((_, index) => (
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
          disabled={currentPage === Math.ceil(products.length / livraisonsPerPage)}
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Suivant
        </button>
      </div>
      {/* End Pagination */}

    </DashLayout>
  );
}

export default DashboardLivraison;

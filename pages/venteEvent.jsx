import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../utils/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import GraphiqueVente from './components/layout/GraphiqueVenteEvent';

function VenteEvent() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

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


  const productInfos = (item) => {
    alert(`
      Client: ${item.numeroLivraison}
      Nom de l'article: ${item.titre}
      Quantité: ${item.quantite}
      Reception de la commande : ${formatDateTime(item.id)}
    `);
  };
  
  const COLUMNS = [
    { label: <span className="text-blue-500">ID</span>, renderCell: (item) => item.titre },
    {
      label: <span className="text-blue-500">Qte</span>, renderCell: (item) => (
        item.quantite)
    },
    { label: <span className="text-blue-500">Prix total</span>, renderCell: (item) => <span>{item.paye} F</span> },
    {
      label: <span className="text-blue-500">Commissions</span>, renderCell: (item) => (
        <span>{parseInt(item.paye) * 0.025} F </span>)
    },
    {
      label: <span className="text-blue-500">Avoir</span>, renderCell: (item) => (
        <span>{parseInt(item.paye)-  (parseInt(item.paye) * 0.025)} F </span>)
    },
    { label: <span className="text-blue-500">Paye</span>, renderCell: (item) => 
      <div>
        <input type="checkbox" id="scales" name="scales"  />
      </div>
  },
    {
      label: <span className="text-blue-500">Plus</span>, renderCell: (item) => (
        <button className="bg-orange-500 text-white hover:text-white focus:outline-none" onClick={() => productInfos(item)}><FontAwesomeIcon icon={faInfoCircle} /></button>)
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
        const userDocRef = doc(db, "events", userId);
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          const userDocData = userDocSnapshot.data();
          console.log(userDocData);

          if (userDocData) {
            // Utilisez userDocData pour afficher les produits du marchand
            setProducts(userDocData.livraison || []); // Supposons que les produits sont stockés dans un tableau nommé "products"
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
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <DashLayout>
      <Head />
      
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
      <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#" >
        <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Payez ma commission de {}</button>      
      </form>
        {/* <p className="mt-4 text-2xl text-blue-500">Quelles sont les grandes tendances au sein de votre boutique Allô Group ?</p> */}
        <p className="text-2xl text-orange-500">Nombre d'articles en stock : {products.length}</p>
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {COLUMNS.map((column, index) => (
                <th key={index} className="px-4 py-2">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((item, index) => (
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
            {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
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
            disabled={currentPage === Math.ceil(products.length / productsPerPage)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Suivant
          </button>
        </div>
      </div>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="text-2xl text-orange-500">Bilan des meilleurs ventes de services selon la catégorie </p>
        <GraphiqueVente/>
      </div>
    </DashLayout >
  );
}

export default VenteEvent;

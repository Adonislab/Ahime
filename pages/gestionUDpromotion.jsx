import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from '../utils/firebaseConfig';
import ModalMarchand from "./components/layout/ModalPromotion"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function DashboardMarchand() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const COLUMNS = [
    { label: <span className="text-blue-500">Titre</span>, renderCell: (item) => item.title },
    { label: <span className="text-blue-500">Contenu</span>, renderCell: (item) =>  <span>{item.content}</span>},
    { label: <span className="text-blue-500">Produit</span>, renderCell: (item) => <Image src={item.image} width={100} height={100}  alt ="Souci de changement de l'image"/> },
    { label: <span className="text-blue-500"></span>, renderCell: (item) => (
        <button className="text-white bg-purple-500 hover:text-white focus:outline-none" onClick={() => openModal(item)}> <FontAwesomeIcon icon={faEdit} /></button>)
    },
    { label: <span className="text-blue-500"></span>, renderCell: (item) => (
        <button className="bg-red-500 text-white hover:text-white focus:outline-none" onClick={() => handleDelete(item)}><FontAwesomeIcon icon={faTrashAlt} /></button>)
    },
  ];

  const updateProduct = async (updatedProduct) => {
    console.log("updatedProduct:", updatedProduct);
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);
    if (auth.currentUser) {
    

      try {
        // Accédez au document du marchand
        const merchantDocRef = doc(db, "administrateur", 'admin');
        const merchantDocSnapshot = await getDoc(merchantDocRef);
        const merchantData = merchantDocSnapshot.data();

        if (merchantData) {
          // Accédez à la sous-collection de produits
          const products = merchantData.promotion || [];

          // Recherchez le produit à mettre à jour par son ID
          const productIndex = products.findIndex(product => product.id === updatedProduct.id);

          if (productIndex !== -1) {
            // Mettez à jour le produit dans la liste
            products[productIndex] = updatedProduct;

            // Mettez à jour la sous-collection de produits dans le document du marchand
            await updateDoc(merchantDocRef, { promotion: products });

            console.log("Le produit a été mis à jour avec succès.");
            // Réactualisez les données après la modification.
            setProducts(products);

            // Fermez le modal de modification ici
            setSelectedProduct(null);

            toast.success('Modification réussie !', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          } else {
            console.error("Produit introuvable dans la liste du marchand.");
            toast.error("Produit introuvable dans la liste du marchand.", {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        } else {
          console.error("Document du marchand introuvable.");
          toast.error("Document du marchand introuvable.", {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du produit", error);
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

  
  const handleDelete = async (item) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette promotion ?")) {
      const auth = getAuth();
      const db = getFirestore(firebaseConfig);
      if (auth.currentUser) {
       
        try {
          // Accédez au document du marchand
          const merchantDocRef = doc(db, "administrateur", "admin");
          const merchantDocSnapshot = await getDoc(merchantDocRef);
          const merchantData = merchantDocSnapshot.data();
          console.log("Les données " + merchantData);
  
          if (merchantData) {
            // Accédez à la sous-collection de produits
            const products = merchantData.promotion || [];
  
            // Recherchez le produit à supprimer par son ID
            const productIndex = products.findIndex(product => product.id === item.id);
  
            if (productIndex !== -1) {
              // Supprimez le produit de la liste
              products.splice(productIndex, 1);
  
              // Mettez à jour la sous-collection de produits dans le document du marchand
              await updateDoc(merchantDocRef, { promotion: products });
  
              console.log("Le produit a été supprimé avec succès.");
              // Réactualisez les données après la suppression.
              setProducts(products);
  
              // Fermez le modal de modification ici
              setSelectedProduct(null);
  
              toast.success('Promotion supprimée !', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              });
            } else {
              console.error("Produit introuvable dans la liste du marchand.");
              toast.error("Produit introuvable dans la liste du marchand.", {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              });
            }
          } else {
            console.error("Document du marchand introuvable.");
            toast.error("Document du marchand introuvable.", {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            });
          }
        } catch (error) {
          console.error("Erreur lors de la suppression du produit", error);
          toast.error('Échec de la suppression. Veuillez réessayer.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      }
    }
  };
  

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;
       
        // Utilisez l'ID de l'utilisateur pour chercher son document marchand
        const userDocRef = doc(db, "administrateur", "admin");
        
        try {
          const userDocSnapshot = await getDoc(userDocRef);
          const userDocData = userDocSnapshot.data();
          

          if (userDocData) {
            // Utilisez userDocData pour afficher les produits du marchand
            setProducts(userDocData.promotion); 
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
        <ModalMarchand
          product={selectedProduct}
          isOpen={isModalOpen}
          updateProduct={updateProduct}
          onCancel={closeModal}     
        />
      )}
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className="text-2xl text-blue-500">Nombre de publicité : {products.length}</p>
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

      
      <ToastContainer />
    </DashLayout>
  );
}

export default DashboardMarchand;

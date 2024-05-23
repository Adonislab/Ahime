import DashLayout from "../components/layout/dashboardLayout";
import Head from "@/utils/head";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";

export default function Produits() {
  const router = useRouter();
  const { id } = router.query; 

  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const parsedProduct = JSON.parse(id);
      setProduct(parsedProduct);
    }
  }, [id]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product !== null) {
      setLoading(false); // Marquer le chargement comme terminé une fois les données disponibles
    }
  }, [product]);

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

  const COLUMNS = [
    { label: <span className="text-blue-500">Article</span>, accessor: 'image' },
    { label: <span className="text-blue-500">Identifiant</span>, accessor: 'titre' },
    {
      label: <span className="text-blue-500">Catégorie</span>,
      accessor: 'categorie',
    },
    {
        label: <span className="text-blue-500">Qte</span>,
        accessor: 'quantite',
      },
    { label: <span className="text-blue-500">Fraix</span>, accessor: 'paye'},
    { 
        label: <span className="text-blue-500">Date</span>, 
        accessor: 'dateLivraison', 
        renderCell: (item) => (
          <span>{formatDateTime(item.dateLivraison)}</span>
        ),
      },
  ];  

  return (
    <DashLayout>
      <Head/>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        {loading ? (
          <p>Chargement ...</p>
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr>
                {COLUMNS.map((column, index) => (
                  <th key={index} className="px-4 py-2">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  {COLUMNS.map((column, columnIndex) => (
                    <td key={columnIndex} className="px-4 py-2 border">
                      {column.accessor === 'image' ? (
                        // Afficher une image ici, assurez-vous de remplacer 'imageURL' par l'URL de votre image.
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={100}
                          height={100}
                        />
                        ) : column.accessor === 'paye' ? (
                            `${item[column.accessor]} F`
                          ) : column.accessor === 'dateLivraison' ? (
                            formatDateTime(item[column.accessor])
                          ) : (
                            item[column.accessor]
                          
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashLayout> 
  );
}

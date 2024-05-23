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

  const COLUMNS = [
    { label: <span className="text-blue-500">Présentation</span>, accessor: 'image' },
    { label: <span className="text-blue-500">Produits</span>, accessor: 'title' },
    {
      label: <span className="text-blue-500">Catégories</span>,
      accessor: 'categorie',
    },
    { label: <span className="text-blue-500">Prix unitaire</span>, accessor: 'price'},
    // { label: <span className="text-blue-500">Nombre de vente</span>, accessor: 'sales' },
    // { label: <span className="text-blue-500">Total</span>, accessor: 'total'},
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
                      ) : column.accessor === 'price' || column.accessor === 'total' ? (
                        ` ${item[column.accessor]} F`
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

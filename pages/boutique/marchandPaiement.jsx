import DashLayout from "../components/layout/dashboardLayout";
import Head from "@/utils/head";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";

export default function Produits() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [commission, setCommission] = useState(0);
  useEffect(() => {
    if (id) {
      const parsedProduct = JSON.parse(id);

      setProduct(parsedProduct);
      // Calcul de la commission ici
      let totalCommission = 0;
      parsedProduct.forEach(item => {
        // Utilisez le même calcul que dans la boucle d'affichage
        totalCommission += parseInt(item.paye) * 0.025;
      });
      setCommission(totalCommission);

    }
  }, [id]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product !== null) {
      setLoading(false); // Marquer le chargement comme terminé une fois les données disponibles
      //console.log(product[1].prix)
    }
  }, [product]);

  const COLUMNS = [
    { label: <span className="text-blue-500">Présentation</span>, accessor: 'image' },
    { label: <span className="text-blue-500">Produits</span>, accessor: 'titre' },
    {
      label: <span className="text-blue-500">Quantité</span>,
      accessor: 'quantite',
    },
    { label: <span className="text-blue-500">Prix total</span>, accessor: 'paye' },
    { label: <span className="text-blue-500">Commission</span>, accessor: 'dû' },
    { label: <span className="text-blue-500">Avoir marchand</span>, accessor: 'total' },
  ];

  return (
    <DashLayout>
      <Head />
      <div
        className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14"
        style={{ background: 'orange', color: 'white', fontSize: '18px' }}
      >
        Votre commission : {commission} FCFA
      </div>
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
                          alt={item.titre}
                          width={100}
                          height={100}
                        />
                      ) : column.accessor === 'paye' ? (
                        ` ${item[column.accessor]} F`
                      ) : column.accessor === 'dû' ? (
                        ` ${parseInt(item.paye) * 0.025} F`
                      ) : column.accessor === 'total' ? (
                        ` ${parseInt(item.paye) - (parseInt(item.paye) * 0.025)} F`
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

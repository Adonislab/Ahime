import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from '../../../utils/firebaseConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphiqueVente() {
  const [user, setUser] = useState(null);
  const [cuisineCounts, setCuisineCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;

        const marchandsRef = doc(db, "boutiques", userId);
        const querySnapshot = await getDoc(marchandsRef);
        const categorie = querySnapshot.data();
        const categorieVente = categorie.livraison;
        const cuisineCount = {};

        categorieVente.forEach((data) => {
          const cuisine = data.categorie;

          if (cuisineCount[cuisine]) {
            cuisineCount[cuisine] += 1;
          } else {
            cuisineCount[cuisine] = 1;
          }
        });

        setCuisineCounts(cuisineCount);
        setLoading(false);
      } else {
        setUser(null);
        setCuisineCounts({});
      }
    });
  }, []);

  if (loading) {
    return <p>...</p>;
  }

  const chartData = {
    labels: Object.keys(cuisineCounts),
    datasets: [
      {
        label: "Nombre de catégorie de produits vendus",
        data: Object.values(cuisineCounts),
        backgroundColor: "rgba(255, 165, 0, 0.6)",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Nombre de catégorie de produit vendu',
      },
    },
  };

  return (
    <Bar data={chartData} options={options} />
  );
}

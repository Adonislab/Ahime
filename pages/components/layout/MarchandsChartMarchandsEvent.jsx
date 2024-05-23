import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection } from "firebase/firestore";
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

export default function MarchandsChartMarchands() {
  const [user, setUser] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;

        // Accédez au document du marchand de l'utilisateur
        const marchandsRef = doc(db, "events", userId);
        const marchandDoc = await getDoc(marchandsRef);

        if (marchandDoc.exists()) {
          const data = marchandDoc.data();

          // Initialisez le compteur de catégories
          const categoryCount = {};

          if (data.produits) {
            data.produits.forEach((product) => {
              const cuisine = product.categorie;

              if (categoryCount[cuisine]) {
                categoryCount[cuisine] += 1;
              } else {
                categoryCount[cuisine] = 1;
              }
            });
          }

          setCategoryCounts(categoryCount);
          setLoading(false);
        } else {
          console.log("Le document du marchand n'existe pas.");
          setLoading(false);
        }
      } else {
        setUser(null);
        setCategoryCounts({});
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  const chartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Nombre de catégories",
        data: Object.values(categoryCounts),
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
        text: 'Catégories de produit',
      },
    },
  };

  return (
    <Bar data={chartData} options={options} />
  );
}

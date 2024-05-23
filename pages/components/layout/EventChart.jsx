import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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

export default function MarchandsChart() {
  const [user, setUser] = useState(null);
  const [cuisineCounts, setCuisineCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore(firebaseConfig);

    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const marchandsRef = collection(db, "events");
        const querySnapshot = await getDocs(marchandsRef);

        const cuisineCount = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const cuisine = data.cuisine;

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
        label: "Nombre de boutique",
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
        text: 'Nombre de boutique par spécialité',
      },
    },
  };

  return (
    <Bar data={chartData} options={options} />
  );
}

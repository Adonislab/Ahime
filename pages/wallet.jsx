import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { firebaseConfig } from '../utils/firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {  doc, getDoc,getFirestore } from 'firebase/firestore';


function wallet() {
  const db = getFirestore(firebaseConfig);
  const auth = getAuth();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    fullName: "",
    wallet:"",
  });

  useEffect(() => {
    const auth = getAuth();
    const fetchData = async (user) => {
      if (user) {
        const userId = user.uid;
        try {
          const docRef = doc(db, 'users', userId);
          const docSnapshot = await getDoc(docRef);
    
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            
            setFormData((prevData) => ({
              ...prevData,
              fullName: data.fullName,
              phoneNumber: data.phoneNumber,
              wallet:data.wallet,
              
            }));
          } else {
            console.log("Aucune donnée trouvée pour cet utilisateur.");
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données depuis Firestore', error);
        }
      } else {
        console.log("L'utilisateur n'est pas authentifié.");
      }
    };
    
    onAuthStateChanged(auth, fetchData);
  }, []);

  return (
    <DashLayout>
      <Head />
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <div className="space-y-1">
          <h2 className="text-2xl">Votre portefeuille</h2>
          {/* <p>Vos informations</p> */}
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">

            <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-5">
            {formData.fullName}
            </div><div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-5">
            {formData.phoneNumber}

            </div>

          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-200 px-2">Votre solde</span>
            </div>
          </div>
          <div className="p-4 border border-gray-20 border-dashed rounded-lg dark:border-orange-500 mt-5 mx-auto flex items-center justify-center">
          {formData.wallet} FCFA

          </div>

        </div>
        {/* <div className="mt-4">
          <button className="w-full bg-blue-500 text-white py-2 rounded-md">Recharger</button>
        </div> */}
      </div>
    </DashLayout>
  )
}

export default wallet
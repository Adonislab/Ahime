'use client'
import { useKKiaPay } from 'kkiapay-react';
import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import { firebaseConfig } from '../utils/firebaseConfig';
import React, { useState, useEffect} from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {  doc, getDoc,getFirestore, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from 'next/router';
 
function paiementChampion() {
  const { openKkiapayWidget, 
          addKkiapayListener,
          removeKkiapayListener 
        } = useKKiaPay();      
  const db = getFirestore(firebaseConfig);
  const auth = getAuth();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    wallet:"",
    credit:0,
  });
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    open(formData.credit);  
    const userId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userId); 
    const creditActuel = formData.credit;
    console.log('La valeur de solde ' + creditActuel);
    getDoc(docRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const currentWallet = docSnapshot.data().wallet || 0;
          const updatedWallet = parseInt(currentWallet, 10) + parseInt(creditActuel, 10);
          console.log(updatedWallet);
  
          return setDoc(
            docRef,
            {
              wallet: updatedWallet,
            },
            { merge: true }
          );
        } else {
          console.log("Aucune donnée trouvée pour cet utilisateur.");
          throw new Error("Aucune donnée trouvée pour cet utilisateur.");
        }
      })
      .then(() => {
        // La mise à jour du compte utilisateur après le succès du paiement
        
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du compte utilisateur', error);
        toast.error('Erreur lors de la mise à jour de votre compte');
      });
  };
    
  function successHandler(response) {
    console.log(response);
    toast.success(`Paiement réussi`);
        setTimeout(() => {
          Router.push("/wallet");
        }, 5000);
  };
  
  function failureHandler(error) {
    console.log(error);
    toast.success(`Echec du paiement`);
        setTimeout(() => {
          Router.push("/wallet");
        }, 5000);
  };
  
   
  useEffect(() => {
    addKkiapayListener('success', successHandler)
    addKkiapayListener('failed', failureHandler)
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
    return () => {
      removeKkiapayListener('success',successHandler);
      removeKkiapayListener('failed', failureHandler);
    }
  }, [addKkiapayListener,removeKkiapayListener]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function open(credit) {
    openKkiapayWidget({
      amount: credit,
      api_key: "3425dc6035d711eca8f5b92f2997955b",
      sandbox: true,
      email: "randomgail@gmail.com",
      phone: "97000000",
    });
    
  }
 
  return (
    <DashLayout>
    <Head/>
    <div className="bg-indigo-700 p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
      <form onSubmit={handleSubmit} className='my-10'>
          <div className='my-5'>
          <p className="text-white"> Votre numéro </p>
          <input
              type='text'
              label="Votre numéro"
              name="phoneNumber"
              required={true}
              value={formData.phoneNumber}
              className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-1"

            />
          </div>
          <div className='my-5'>
          <p className="text-white"> Votre solde actuel</p>

            <input
              type='text'
              label="Montant"
              name="wallet"
              required={true}
              value={formData.wallet}
              className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-1"
            />  <span className="text-white">FCFA</span>
          </div> 
          <div className='my-5'>
          <p className="text-white"> Votre paiement </p>

            <input
              type='number'
              min="5"
              label="Montant"
              name="credit"
              required={true}
              value={formData.credit}
              onChange={handleInputChange}
              className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-1"
            />  <span className="text-white">FCFA</span>
          </div> 
          
          <input type="submit" value="Paiement du service" className='bg-white montserrat-medium py-3 w-full bg-orange text-lg cursor-pointer text-orange-500' />
          
      </form>
    </div>
    <ToastContainer />
    </DashLayout> 
  )
}

export default paiementChampion;
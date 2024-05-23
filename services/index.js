import { firebaseConfig } from '../utils/firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import Router from 'next/router';

const auth = getAuth(firebaseConfig);
const db = getFirestore(firebaseConfig);

export const register_user = async (formData) => {
  try {
    const { email, password, phoneNumber } = formData;

    if (!email) {
      return {
        success: false,
        message: "L'adresse e-mail est manquante.",
      };
    }
    // Créez un utilisateur Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Si l'utilisateur Firebase Auth est créé avec succès, enregistrez les données dans Firebase Firestore
    if (user) {
      const userId = user.uid;
      // Enregistrez l'utilisateur dans Firestore avec l'e-mail, le mot de passe et le numéro de téléphone
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        phoneNumber: phoneNumber,
      });
    }
    setTimeout(() => {
        Router.push("/connexion");
    }, 2000);
      return {
        success: true,
        message: 'Votre compte est créé avec succès',
        user: user.toJSON(),
      };
  } catch (error) {
    console.log('Error in register_user (service) => ', error);
    return {
      success: false,
      message: "Nous n'avons pas pu créer votre compte",
      error: error.message,
    };
  }
};

export const login_user = async (formData) => {
  try {
    const { email, password } = formData;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    setTimeout(() => {
      Router.push("/politique");
    }, 2000);

    return {
      success: true,
      message: 'Connexion réussie !!!',
      user: user.toJSON(),
    };
  } catch (error) {
    console.error('Error in login_user (service) => ', error);
    return {
      success: false,
      message: 'Mauvais mot de passe ou email !!!',
      error: error.message,
    };
  }
};


// import React, { useState, useRef } from 'react';
// import { getStorage, ref, uploadBytes, getDownloadURL, } from 'firebase/storage';
// import { getAuth } from 'firebase/auth';

// const auth = getAuth();

// const ModalModificationChampion = ({ product, isOpen, updateProduct, onCancel }) => {


//     const [formData, setFormData] = useState({

//         wallet: product ? product.wallet : "Trois pour Cinq"
//     });

//     const [newWalletValue, setNewWalletValue] = useState("");
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (formData.wallet) {
//             try {

//                 const updatedProduct = {
//                     ...product,
//                     wallet: newWalletValue || formData.wallet,

//                 };

//                 updateProduct(updatedProduct);


//             } catch (error) {
//                 console.error('Erreur lors de la modification du produit :', error);

//             }
//         }
//     };



//     const handleInputChange = (e) => {

//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//         if (name === "wallet") {
//             setNewWalletValue(value);
//         }
//     };


//     return (
//         <div style={{ display: isOpen ? 'block' : 'none' }}>
//             <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
//                 <p className='text-2xl text-orange-500' >Modification du portefeuille de : {product ? product.fullName : " "}</p>
//                 <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">

//                     <div className='text-left'>
//                         <label htmlFor="wallet" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Solde</label>
//                         <input
//                             onChange={handleInputChange}
//                             type="number"
//                             name="wallet"
//                             min={500}
//                             id="wallet"
//                             className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
//                             placeholder="500F" required=""
//                             value={newWalletValue !== "" ? newWalletValue : formData.wallet} />
//                     </div>




//                     <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Modifiez</button>

//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ModalModificationChampion;





























































import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const ModalModificationChampion = ({ product, isOpen, updateProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    wallet: product ? product.wallet : "Trois pour Cinq"
  });

  const [newWalletValue, setNewWalletValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newWalletValue !== "") {
      try {
        const updatedProduct = {
          ...product,
          wallet: parseInt(newWalletValue, 10) || parseInt(formData.wallet, 10),
        };

        updateProduct(updatedProduct);
      } catch (error) {
        console.error('Erreur lors de la modification du produit :', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "wallet") {
      setNewWalletValue(value);
    }
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className='text-2xl text-orange-500' >Modification du portefeuille de : {product ? product.fullName : " "}</p>
        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="wallet" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Solde</label>
            <input
              onChange={handleInputChange}
              type="number"
              name="wallet"
              min={500}
              id="wallet"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="500F" required=""
              value={newWalletValue !== "" ? newWalletValue : formData.wallet}
            />
          </div>

          <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Modifiez</button>
        </form>
      </div>
    </div>
  );
};

export default ModalModificationChampion;

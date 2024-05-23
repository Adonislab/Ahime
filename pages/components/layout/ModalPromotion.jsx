
import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const ModalMarchand = ({ product, isOpen, updateProduct, onCancel }) => {


  const [formData, setFormData] = useState({
    title: product ? product.title : "Le titre de votre produit",
    description: product ? product.content : "La description de votre produit",
  });

  const fileInputRef = useRef(null);

  const uploadImageToFirebase = async (imageFile) => {
    
    try {
      const storage = getStorage();
      const imageCounter = Date.now();
      const fileName = auth.currentUser.uid + `pub${imageCounter}`; 
      const storageRef = ref(storage, `statique/${fileName}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Mettez à jour le champ image dans le formulaire
      setFormData((prevData) => ({
        ...prevData,
        selectedFile: downloadURL,
      }));

      return downloadURL;
    } catch (error) {
      console.error('Erreur lors du téléversement de l\'image :', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.selectedFile) {
      try {
        // Effectuez ici la mise à jour du produit avec les nouvelles données et l'URL de l'image.
        // Utilisez la fonction updateProduct pour effectuer cette mise à jour.
        const newImageURL = await uploadImageToFirebase(formData.selectedFile);

        // Exemple :
        const updatedProduct = {
          ...product,
          title: formData.title,
          content: formData.description,
          image: newImageURL,
          date: Date.now(),
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
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, selectedFile });
    }
  };

  return (
    <div style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
        <p className='text-2xl text-orange-500' >Modification de la pub : {product ? product.title : " "}</p>
        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="title" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Quel titre donnez vous à la publication ?
            </label>
            <input
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              type="text" name="title" id="title"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Les livres de Matthieu" required=""
              value={formData.title} />
          </div>

          
          <div className='text-left'>
            <label htmlFor="content" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Comment pourriez-vous décrire le contenu de cette publication ?
            </label>
            <textarea
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              name="content" id="content"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Descrivez le contenu de la pubicité"
              value={formData.description}
              rows={8} 
            />
          </div>

          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-500 dark:hover:bg-gray-800 dark:bg-gray-100 hover-bg-gray-100 dark:border-gray-600 dark:hover:border-gray-200">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Téléversez la photo du produit</span> ou glissez et déposez</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            {formData.selectedFile ? (
              <div className="w-3/4 mx-auto bg-gray-200 rounded-full dark:bg-gray-600">
                <div className="bg-orange-400 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: "100%" }}> 100%</div>
              </div>
            ) : null}
          </label>

          <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Postez la publicité</button>

        </form>
      </div>
    </div>
  );
};

export default ModalMarchand;

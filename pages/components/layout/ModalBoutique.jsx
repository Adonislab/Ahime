
import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const ModalBoutique = ({ product, isOpen, updateProduct, onCancel }) => {


  const [formData, setFormData] = useState({
    title: product ? product.title : "Le titre de votre produit",
    price: product ? product.price : 500,
    description: product ? product.description : "La description de votre produit",
    during: product ? product.during : "La durée de traitement de votre produit",
    categorie: product ? product.categorie : "La catégorie de votre produit",
    note: product ? product.note : "Trois pour Cinq"
  });

  const fileInputRef = useRef(null);

  const uploadImageToFirebase = async (imageFile) => {
    try {
      const storage = getStorage();
      const imageCounter = Date.now();
      const fileName = auth.currentUser.uid + `produit${imageCounter}`;
      const storageRef = ref(storage, `profile_images_boutique/${fileName}`);
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
          note: formData.note,
          price: formData.price,
          description: formData.description,
          during: formData.during,
          categorie: formData.categorie,
          image: newImageURL,
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
        <p className='text-2xl text-orange-500' >Modification du produit : {product ? product.title : " "}</p>
        <form onSubmit={handleSubmit} className="bg-blue-500 space-y-4 md:space-y-6" action="#">
          <div className='text-left'>
            <label htmlFor="title" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Quel le titre donnez vous à votre produit ?
            </label>
            <input
              name="title"
              onChange={handleInputChange}
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Les Armandes aux olives"
              required=""
              value={formData.title} />
          </div>

          <div className='text-left'>
            <label htmlFor="price" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Combien vaut une unité de votre produit ?</label>
            <input
              onChange={handleInputChange}
              type="number"
              name="price"
              id="price"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="500F" required=""
              value={formData.price} />
          </div>

          <div className='text-left'>
            <label htmlFor="description" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              Comment pourriez-vous décrire votre produit ?
            </label>
            <textarea
              onChange={handleInputChange}
              name="description"
              id="description"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Vendez les mérites de votre produit"
              value={formData.description}
              rows={8}
            />
          </div>

          <div className='text-left'>
            <label htmlFor="during" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Combien de temps faut-il avant la consommation finale du produit ?</label>
            <input
              onChange={handleInputChange}
              type="number"
              name="during"
              id="during"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="5min" required=""
              value={formData.during} />
          </div>

          <div className='text-left'>
            <label htmlFor="categorie" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">
              A quelle catégorie appartient votre produit ?
            </label>

            <select
              onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
              name="categorie"
              id="categorie"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 text-xl rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required=""
              value={formData.categorie}
            >
              <option value="pas précis">Sélectionnez une option</option>
              <option value="Santé, beauté, cosmétiques bio">Santé, beauté, cosmétiques bio</option>
              <option value="Articles pour animaux de compagnie">Articles pour animaux de compagnie</option>
              <option value="Produits et accessoires pour le sport">Produits et accessoires pour le sport</option>
              <option value="Produits pour bébés et enfants">Produits pour bébés et enfants</option>
              <option value="Appareils électroniques et accessoires connectés">Appareils électroniques et accessoires connectés</option>
              <option value="DIY et produits artisanaux, éco-responsables">DIY et produits artisanaux, éco-responsables</option>
              <option value="Alimentation et produits locaux">Alimentation et produits locaux</option>
            </select>
          </div>

          <div className='text-left'>
            <label htmlFor="note" className="block mb-2 text-xl font-medium text-indigo-700 dark:text-white">Quelle note spéciale avez vous pour la promtion de ce produit ?</label>
            <input
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              type="text" name="note" id="note"
              className="bg-indigo-50 border border-indigo-300 text-indigo-700 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-white-600 block w-full p-2.5 dark:bg-indigo-700 dark:border-indigo-600 dark:placeholder-indigo-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-white-500"
              placeholder="Promotion"
              value={formData.note} />
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

          <button type="submit" className="w-full text-white bg-indigo-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Modifiez</button>

        </form>
      </div>
    </div>
  );
};

export default ModalBoutique;

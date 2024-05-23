import React from "react";
import { BsFillPlayCircleFill } from "react-icons/bs";


const About = () => {
  return (
    <div className="about-section-container" id="about">
      <div className="about-section-text-container text-white p-8">
        <p className="text-2xl font-bold text-orange-500">AHIME</p>
        <h1 className="text-4xl font-bold mt-4 text-blue-500">
        Votre Solution de Gestion de Boutique au Bénin ! 
        </h1>
        <p className="text-xl mt-4 text-black">
        Nous sommes déterminés à rendre chaque livraison aussi fluide que possible.
         Que vous soyez un particulier ou une entreprise, Ahime est là pour répondre 
         à vos besoins logistiques avec un service client exceptionnel et une équipe dévouée.
        </p>
        <p className="text-xl mt-4 text-black">
        Confiez vos envois à Ahime, et découvrez la tranquillité d'esprit que procure une 
        livraison sans tracas au Bénin. Contactez-nous dès aujourd'hui pour bénéficier de nos services
         de classe mondiale!
        </p>
        <div className="mt-8">
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-base mr-4">Plus</button>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-base">
            <BsFillPlayCircleFill className="inline-block" /> Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;

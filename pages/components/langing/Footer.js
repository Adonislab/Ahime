import React from "react";
import Logo from "../../../utils/Assets/Logo.png";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import Image from 'next/image'

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-8" id="footer">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="footer-section-one mb-4 md:mb-0 md:mr-8">
          <div className="footer-logo-container">
            <Image
              src={Logo}
              width={100}
              height={100}
              alt="Logo"
            /> 
          </div>
          <div className="footer-icons mt-2 flex">
            <BsTwitter className="mr-2" />
            <SiLinkedin className="mr-2" />
            <BsYoutube className="mr-2" />
            <FaFacebookF />
          </div>
        </div>
        <div className="footer-section-two text-center md:text-left">
          <div className="footer-section-columns mb-4">
            {/* <span className="block mr-4 mb-2 md:inline-block md:mr-4">A propos</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">Aide</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">Gestion</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">Partenariats</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">Clients</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">Boutique</span> */}
            Ahime - Votre partenaire de confiance pour toutes vos livraisons au Bénin!
          </div>
          <div className="footer-section-columns mb-4">
            {/* <span className="block mr-4 mb-2 md:inline-block md:mr-4">244-5333-7783</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">hello@food.com</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">press@food.com</span>
            <span className="block mr-4 mb-2 md:inline-block md:mr-4">contact@food.com</span> */}
          </div>
          {/* <div className="footer-section-columns">
            <span className="block mr-4 md:inline-block md:mr-4">Guide d'utulisation</span>
            <span className="block md:inline-block">Politique de confidentialité</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;

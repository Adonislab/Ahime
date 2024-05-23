import React from "react";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from "../../../utils/Assets/home-banner-background.png";
import BannerImage from "../../../utils/Assets/newimg.jpeg";
// import BannerImage from "../../../utils/Assets/home-banner-image.jpeg";
import Image from 'next/image'
import Link from 'next/link'

const Home = () => {
  return (
    <div className="bg-gray-100" id="home">
      <Navbar />

      <div className="relative py-16">
        <Image
          src={BannerBackground}
          alt="Banner Image"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />

        <div className="bg-cover bg-center bg-no-repeat py-16 relative" style={{ backgroundImage: `url(${BannerBackground})` }}>
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold text-blue-900"> {/* Ajoutez la classe text-blue-900 */}
                  Votre application d'intermédiation
                </h1>
                <p className="text-xl mt-4 text-blue-900"> {/* Ajoutez la classe text-blue-900 */}
                  Marque Africaine de services d'Intermédiations. Nous proposons des solutions
                  innovantes technologiques adaptées aux différentes réalités en Afrique.
                </p>
                <button className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg flex items-center">
                  <Link href="/connexion">Commencez </Link><FiArrowRight className="ml-2" />
                </button>
              </div>
              <div className="md:pl-16 hidden md:block">
                <Image
                  src={BannerImage}
                  width={200}
                  height={200}
                  alt="Banner Image"
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Home;

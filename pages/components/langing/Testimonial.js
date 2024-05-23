import React from "react";
import ProfilePic from "../../../utils/Assets/john-doe-image.png";
import { AiFillStar } from "react-icons/ai";
import Image from 'next/image'

const Testimonial = () => {
  return (
    <div className="bg-gray-100 py-16" id="avis">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <p className="text-gray-600">Avis des clients</p>
          <h1 className="text-3xl font-semibold text-orange-500">Que disent nos clients ?</h1>
          {/* <p className="mt-4 text-gray-700">
            Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
            elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
          </p> */}
        </div>
        <div className="flex flex-col items-center">
          <Image
              src={ProfilePic}
              width={500}
              height={500}
              alt="Picture of the author"
              className="w-20 h-20 rounded-full"
          />
          <p className="text-gray-700 mt-4">
          Le service de livraison d'Allô Group a transformé notre expérience d'achat en ligne. 
          Les colis arrivent toujours à temps, en parfait état, et le suivi en temps réel apporte une
           tranquillité d'esprit inestimable
          </p>
          <div className="flex items-center mt-4">
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
            <AiFillStar className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold mt-2 text-blue-500">John Doe</h2>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

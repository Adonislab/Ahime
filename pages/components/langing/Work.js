// import React from "react";
// import PickMeals from "../../../utils/Assets/pick-meals-image.png";
// import DeliveryMeals from "../../../utils/Assets/delivery-image.png";
// import Image from 'next/image'

// const Work = () => {
//   const workInfoData = [
//     {
//       image: PickMeals,
//       title: "Rapidité et Fiabilité",
//       text: "Allô Group garantit des services de livraison rapides et fiables pour colis, repas, courses et documents. Vos envois sont assurés d'arriver en toute sécurité et à temps.",
//     },
//     {
//       image: PickMeals,
//       title: "Couverture Nationale",
//       text: "Présents à travers le pays, notre large couverture garantit une réponse efficace à vos besoins de livraisons sur toute l'étendue du territoir national.",
//     },
//     {
//       image: PickMeals,
//       title: "Sécurité et Intégrité",
//       text: "La sécurité de vos colis est notre priorité. Nous assurons une manipulation délicate pour les articles sensibles et nous nous engageons à livrer vos biens en parfait état.",
//     },
//     {
//       image: DeliveryMeals,
//       title: "Flexibilité de Services",
//       text: "Allô Group offre des services de livraison polyvalents, répondant à des besoins variés tels que la livraison express, les courses en ligne, les repas à domicile et des services personnalisés.",
//     },
//     {
//       image: DeliveryMeals,
//       title: "Technologie de Pointe",
//       text: "Nous employons des technologies avancées pour garantir une traçabilité maximale de vos colis. Restez informé à chaque étape de la livraison grâce à notre système de suivi en temps réel.",
//     },
//     {
//       image: DeliveryMeals,
//       title: "Innovation et Adaptabilité",
//       text: "Allô Group innove en investissant dans les nouvelles technologies pour des solutions de livraison modernes, flexibles, et adaptées à l'évolution du marché",
//     },
//   ];
//   return (
//     <div className="bg-gray-100 py-16" id="work">
//       <div className="container mx-auto text-center">
//         <div className="mb-8">
//           <p className="text-gray-600">Notre organisation</p>
//           <h1 className="text-3xl font-semibold text-orange-500">Comment travaillons nous ?</h1>
//           <p className="mt-4 text-gray-700">
//             Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
//             elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
//           </p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {workInfoData.map((data) => (
//             <div key={data.title} className="flex flex-col items-center">
//               <div className="info-boxes-img-container">
//                 <Image src={data.image} alt={data.title} className="w-full h-auto" width={500} height={500}/>
//               </div>
//               <h2 className="text-xl font-semibold mt-4 text-blue-500">{data.title}</h2>
//               <p className="text-gray-700 mt-2">{data.text}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Work;















import React from "react";
import PickMeals from "../../../utils/Assets/market-3266880_1280.jpg";
import DeliveryMeals from "../../../utils/Assets/market-3304310_1280.jpg";
import Image from 'next/image'

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Rapidité et Fiabilité",
      text: "Ahime garantit des services de livraison rapides et fiables pour colis, repas, courses et documents. Vos envois sont assurés d'arriver en toute sécurité et à temps.",
    },
    {
      image: PickMeals,
      title: "Couverture Nationale",
      text: "Présents à travers le pays, notre large couverture garantit une réponse efficace à vos besoins de livraisons sur toute l'étendue du territoir national.",
    },
    {
      image: PickMeals,
      title: "Sécurité et Intégrité",
      text: "La sécurité de vos colis est notre priorité. Nous assurons une manipulation délicate pour les articles sensibles et nous nous engageons à livrer vos biens en parfait état.",
    },
    {
      image: DeliveryMeals,
      title: "Flexibilité de Services",
      text: "Ahime offre des services de livraison polyvalents, répondant à des besoins variés tels que la livraison express, les courses en ligne, les repas à domicile et des services personnalisés.",
    },
    {
      image: DeliveryMeals,
      title: "Technologie de Pointe",
      text: "Nous employons des technologies avancées pour garantir une traçabilité maximale de vos colis. Restez informé à chaque étape de la livraison grâce à notre système de suivi en temps réel.",
    },
    {
      image: DeliveryMeals,
      title: "Innovation et Adaptabilité",
      text: "Ahime innove en investissant dans les nouvelles technologies pour des solutions de livraison modernes, flexibles, et adaptées à l'évolution du marché",
    },
  ];
  return (
    <div className="bg-gray-100 py-16" id="work">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <p className="text-gray-600">Notre organisation</p>
          <h1 className="text-3xl font-semibold text-orange-500">Comment travaillons nous ?</h1>
          <p className="mt-4 text-gray-700 ">
          Nous comprenons l'importance cruciale d'une logistique impeccable et nous nous engageons à simplifier 
          vos besoins en matière de livraison avec efficacité et professionnalisme.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workInfoData.map((data) => (
            <div key={data.title} className="flex flex-col items-center overflow-hidden shadow-lg p-6 bg-white rounded-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
              <div className="info-boxes-img-container">
                <Image src={data.image} alt={data.title} className="w-full h-auto" width={500} height={500}/>
              </div>
              <h2 className="text-xl font-semibold mt-4 text-blue-500">{data.title}</h2>
              <p className="text-gray-700 mt-2">{data.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;

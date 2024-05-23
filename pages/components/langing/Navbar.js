// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useState } from "react";
// import Logo from "../../../utils/Assets/Logo.png";
// import { HiOutlineBars3 } from "react-icons/hi2";
// import Image from 'next/image'
// import Link from 'next/link'

// const Navbar = () => {
//   const [openMenu, setOpenMenu] = useState(false);
//   const menuOptions = [
//     {
//       text: "Acceuil",
//       icon: <span className="mr-2">🏠</span>,
//       anchor: "home",
//     },
//     {
//       text: "A propos",
//       icon: <span className="mr-2">ℹ️</span>,
//       anchor: "about",
//     },
//     {
//       text: "Qu'en dissent il ?",
//       icon: <span className="mr-2">💬</span>,
//       anchor: "avis",
//     },
//     {
//       text: "Contact",
//       icon: <span className="mr-2">📞</span>,
//       anchor: "contact",
//     },
//     {
//       text: "Boutique",
//       icon: <span className="mr-2">🛒</span>,
//       anchor: "boutique",
//     },
//   ];

//   const scrollToSection = (section) => {
//     const element = document.getElementById(section);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//     setOpenMenu(false); // Ferme le menu mobile après avoir cliqué sur une section
//   };

//   return (
//     <nav className="bg-white py-4 px-8 flex justify-between items-center">
//       <div className="nav-logo-container">
//         <Image
//           src={Logo}
//           width={100}
//           height={100}
//           alt="/"
//         />
//       </div>
//       <div className="navbar-links-container space-x-6">
//         {menuOptions.map((item, index) => (
//           <a key={index} onClick={() => scrollToSection(item.anchor)} className="text-gray-700 hover:text-blue-600 cursor-pointer">
//             {item.text}
//             <span className="ml-2">{item.icon}</span>
//           </a>
//         ))}

//         <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//           <Link href="/connexion">Tableau de board</Link>
//         </button>
//       </div>
//       <div className="navbar-menu-container">
//         <HiOutlineBars3
//           onClick={() => setOpenMenu(true)}
//           className="text-3xl text-gray-700 cursor-pointer"
//         />
//       </div>
//       {openMenu && (
//         <div className="fixed top-0 right-0 h-full w-3/4 bg-white z-50 p-8">
//           <div className="mb-4">
//             <h2 className="text-2xl font-bold">Menu</h2>
//           </div>
//           <ul>
//             {menuOptions.map((item, index) => (
//               <li key={index} className="mb-3">
//                 <a onClick={() => scrollToSection(item.anchor)} className="text-gray-700 hover:text-blue-600 cursor-pointer">
//                   {item.icon}
//                   <span className="ml-2">{item.text}</span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;











/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../../../utils/Assets/Logo.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import Image from 'next/image'
// import Link from 'next/link'
import { useRouter } from 'next/router';



const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const menuOptions = [
    {
      text: "Acceuil",
      icon: <span className="mr-2">🏠</span>,
      anchor: "home",
    },
    {
      text: "A propos",
      icon: <span className="mr-2">ℹ️</span>,
      anchor: "about",
    },
    {
      text: "Qu'en dissent-ils ?",
      icon: <span className="mr-2">💬</span>,
      anchor: "avis",
    },
    {
      text: "Contact",
      icon: <span className="mr-2">📞</span>,
      anchor: "contact",
    },
    {
      text: "Boutique",
      icon: <span className="mr-2">🛒</span>,
      anchor: "boutique",
    },
    {
      text: "Tableau de bord",
      icon: <span className="mr-2">📊</span>,
      anchor: "dashboard",
      className: "bg-blue-600 text-white px-4   rounded-lg hover:text-white-700", // Ajoutez les propriétés de classe ici
      onClick: () => {
        // Redirige vers la page de connexion
        router.push('/connexion');
        setOpenMenu(false); // Ferme le menu mobile après avoir cliqué sur le bouton
      },
    },
  ];

  const scrollToSection = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setOpenMenu(false); // Ferme le menu mobile après avoir cliqué sur une section
  };

  return (
    <nav className="bg-white py-4 px-8 flex justify-between items-center">
      <div className="nav-logo-container">
        <Image
          src={Logo}
          width={100}
          height={100}
          alt="/"
        />
      </div>
      <div className="navbar-links-container space-x-7 hidden md:flex">
        {menuOptions.map((item, index) => (
          <a
            key={index}
            onClick={item.onClick ? item.onClick : () => scrollToSection(item.anchor)}
            // className={`text-gray-700 hover:text-orange-600 cursor-pointer ${item.className ? item.className : ""}`}
            className={`text-gray-700 cursor-pointer ${item.className ? item.className : ""}`}
          >
            {item.text}
            <span className="ml-2">{item.icon}</span>
          </a>
        ))}
      </div>
      <div className="navbar-menu-container md:hidden">
        <HiOutlineBars3
          onClick={() => setOpenMenu(true)}
          className="text-3xl text-gray-700 cursor-pointer"
        />
      </div>
      {openMenu && (
        <div className="fixed top-0 right-0 h-full w-3/4 bg-white z-50 p-8">
          <div className="mb-4 flex justify-end">
            {/* Bouton de fermeture du menu */}
            <button
              onClick={() => setOpenMenu(false)}
              className="text-gray-700 text-xl cursor-pointer"
            >
              Fermer
            </button>
          </div>
          <ul>
            {menuOptions.map((item, index) => (
              <li key={index} className="mb-3">
                <a
                  onClick={item.onClick ? item.onClick : () => scrollToSection(item.anchor)}
                  className={`text-gray-700  cursor-pointer ${item.className ? item.className : ""}`}
                >
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
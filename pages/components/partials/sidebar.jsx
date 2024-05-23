import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Définir des constantes pour les rôles
const ROLES = {
  ADMIN: 'admin',
  COMPTABLE: 'comptable',
  DECIDEUR: 'decideur',
  CHAMPION: 'champion',
  MARCHAND: 'marchand',
  CHAUFFEUR: 'chauffeur',
  BOUTIQUE: 'shopkeeper',
  EVENT:'event',
};

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        const db = getFirestore();
        // Utilisez authUser.uid pour obtenir l'ID de l'utilisateur connecté
        const userId = authUser.uid;
        
        const userRolesDoc = doc(db, 'users', userId);

        // Exécutez la requête pour récupérer les rôles de l'utilisateur
        getDoc(userRolesDoc)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const rolesWithTrueHasRole = Object.keys(data).filter((role) => data[role] === true);
              setUserRoles(rolesWithTrueHasRole);
            }
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des rôles:', error);
          });
      } else {
        setUser(null);
        // Ne pas définir userRoles à vide pour afficher la page "Accueil" par défaut
      }
    });
  }, []);

  // Exemple de structure d'éléments liés aux rôles
  const roleItems = {
    [ROLES.ADMIN]: [
      {
        name: 'Tableau Administrateur',
        url: '/dashboard',
        icon: 'speedometer2',
      },
      {
        name: 'Gestion portefeuille champion',
        url: '/gestionPaiementChampion',
        icon: 'speedometer2',
      },
      {
        name: 'Gestion portefeuille chauffeur',
        url: '/gestionPaiementChauffeur',
        icon: 'speedometer2',
      },
      {
        name: "Liste des marchands",
        url: "/listeMarchand",
        icon: "question-diamond-fill"
      },
      {
        name: "Commande de repas en instance",
        url: "/boutiqueProduits",
        icon: "question-diamond-fill"
      },
      {
        name: "Liste des boutiques",
        url: "/listeShop",
        icon: "question-diamond-fill"
      },
      {
        name: "Commande de produit en instance",
        url: "/boutiqueProduitsAlloMarket",
        icon: "question-diamond-fill"
      },
      {
        name: "Liste des gestionnaires",
        url: "/listeGestionnaire",
        icon: "question-diamond-fill"
      },
      {
        name: "Commande évenement en instance",
        url: "/boutiqueProduitsEvent",
        icon: "question-diamond-fill"
      },
      {
        name: "Liste des livreurs",
        url: "/listeChampion",
        icon: "question-diamond-fill"
      },
      {
        name: "Livraison disponible",
        url: "/demandeLivraison",
        icon: "question-diamond-fill"
      },
      {
        name: "Liste des chauffeurs",
        url: "/listeChauffeur",
        icon: "question-diamond-fill"
      },
      {
        name: "Demande de zem",
        url: "/demandeLivraison",
        icon: "question-diamond-fill"
      },
      {
        name: "Chauffeur Actif",
        url: "/ChauffeurActivite",
        icon: "question-diamond-fill"
      },
     {
         name: "Champion Actif",
         url: "/ChampionActivite",
         icon: "question-diamond-fill"
       },
       {
        name: "Gestion Paiement Allô Food",
        url: "/paiementMarchandsAllogroup",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion Paiement Allô Market",
        url: "/paiementBoutiqueAllogroup",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion Paiement Allô Event",
        url: "/paiementEventAllogroup",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion des rôles",
        url: "/gestionRole",
        icon: "question-diamond-fill"
      },
      {
        name: "Création d'évènement",
        url: "/creationEvent",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion d'évènement",
        url: "/gestionEvent",
        icon: "question-diamond-fill"
      }, 
      {
        name: 'Rapports',
        url: '/repports',
        icon: 'clipboard2-data',
      },
      {
        name: "Gestion de l'Application",
        url: "/gestion_appli",
        icon: "question-diamond-fill"
      },
      {
        name: "Edition de pub",
        url: "/notification",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion des pub",
        url: "/gestionUDpromotion",
        icon: "question-diamond-fill"
      },
      {
        name: "Examen des demandes",
        url: "/demandesApprobations",
        icon: "question-diamond-fill"
      },
    ],
    [ROLES.DECIDEUR]: [
      {
        name: 'Rapports',
        url: '/reports',
        icon: 'clipboard2-data',
      },
      {
        name: 'Tableau de décison',
        url: "/listeDecideur",
        icon: 'speedometer2',
      },  
      {
        name: "Edition de pub",
        url: "/notification",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion des pub",
        url: "/gestionUDpromotion",
        icon: "question-diamond-fill"
      },
      {
        name: 'Gestion portefeuille Champion',
        url: '/gestionPaiementChampion',
        icon: 'speedometer2',
      },
      {
        name: 'Gestion portefeuille Chauffeur',
        url: '/gestionPaiementChauffeur',
        icon: 'speedometer2',
      },
      {
        name: "Commande en instance",
        url: "/boutiqueProduits",
        icon: "question-diamond-fill"
      },
      {
        name: "Champion Actif",
        url: "/ChampionActivite",
        icon: "question-diamond-fill"
      },
      {
        name: "Livraison disponible",
        url: "/demandeLivraison",
        icon: "question-diamond-fill"
      },
      {
        name: "Demande de zem",
        url: "/demandeLivraison",
        icon: "question-diamond-fill"
      },
      {
        name: "Chauffeur Actif",
        url: "/ChauffeurActivite",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion Paiement Allô Food",
        url: "/paiementMarchandsAllogroup",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion Paiement Allô Market",
        url: "/paiementBoutiqueAllogroup",
        icon: "question-diamond-fill"
      },
      {
        name: "Gestion Paiement Allô Event",
        url: "/paiementEventAllogroup",
        icon: "question-diamond-fill"
      },
    ],
    [ROLES.COMPTABLE]: [
      {
        name: 'Tableau de Vison',
        url: '/listeComptable',
        icon: 'speedometer2',
      }, 
    ],
    [ROLES.MARCHAND]: [
      {
        name: 'Mes ventes',
        url: '/venteMarchand',
        icon: 'speedometer2',
      },  
      {
        name: 'Marchand Board',
        url: '/dashboardMarchand',
        icon: 'speedometer2',
      }, 
      {
        name: "Compte Marchand",
        url: "/marchand",
        icon: "question-diamond-fill"
     },
     {
      name: "Mise à jour Compte Marchand",
      url: "/mise_ajour_marchand",
      icon: "question-diamond-fill"
   },
      {
        name: 'Création de produits',
        url: '/chat',
        icon: 'question-diamond-fill',
      },  
      {
        name: "Portefeuille",
        url: "/wallet",
        icon: "question-diamond-fill"
      },
      {
        name: 'Politique',
        url: '/politique',
        icon: 'question-diamond-fill',
      },
      // {
      //   name: 'Paiement',
      //   url: '/paiementMarchand',
      //   icon: 'question-diamond-fill',
      // },
    ],
    [ROLES.CHAMPION]: [
      {
        name: 'Champion Board',
        url: '/dashboardChampion',
        icon: 'speedometer2',
      },  
      {
        name: "Compte Champion",
        url: "/champion",
        icon: "question-diamond-fill"
     },
     {
      name: "Portefeuille",
      url: "/wallet",
      icon: "question-diamond-fill"
    },
    {
      name: 'Politique',
      url: '/politique',
      icon: 'question-diamond-fill',
    },
    // {
    //   name: 'Paiement',
    //   url: '/paiementChampion',
    //   icon: 'question-diamond-fill',
    // },
    ],
    [ROLES.CHAUFFEUR]: [
      {
        name: 'Chauffeur Board',
        url: '/dashboardChauffeur',
        icon: 'speedometer2',
      },  
      {
        name: "Compte Chauffeur",
        url: "/zem",
        icon: "question-diamond-fill"
     },
     {
      name: "Portefeuille",
      url: "/wallet",
      icon: "question-diamond-fill"
    },
    {
      name: 'Politique',
      url: '/politique',
      icon: 'question-diamond-fill',
    },
    // {
    //   name: 'Paiement',
    //   url: '/paiementChampion',
    //   icon: 'question-diamond-fill',
    // },
    ],
    [ROLES.BOUTIQUE]: [
      {
        name: 'Mes ventes',
        url: '/venteBoutique',
        icon: 'speedometer2',
      },  
      {
        name: 'Marchand Board',
        url: '/dashboardBoutique',
        icon: 'speedometer2',
      }, 
      {
        name: "Compte Marchand",
        url: "/boutiquier",
        icon: "question-diamond-fill"
     },
     {
      name: "Mise à jour compte Marchand",
      url: "/mise_jour_boutiquirer",
      icon: "question-diamond-fill"
   },
      {
        name: 'Création de produits',
        url: '/chatboutique',
        icon: 'question-diamond-fill',
      },  
      {
        name: "Portefeuille",
        url: "/wallet",
        icon: "question-diamond-fill"
      },
      {
        name: 'Politique',
        url: '/politique',
        icon: 'question-diamond-fill',
      },
      // {
      //   name: 'Paiement',
      //   url: '/paiementMarchand',
      //   icon: 'question-diamond-fill',
      // },
    ],
    [ROLES.EVENT]: [
      {
        name: 'Mes ventes',
        url: '/venteEvent',
        icon: 'speedometer2',
      },  
      {
        name: 'Event Board',
        url: '/dasbordEvent',
        icon: 'speedometer2',
      }, 
      {
        name: "Compte Event",
        url: "/gestionnairevent",
        icon: "question-diamond-fill"
     },
     {
      name: "Mise à jour compte Event",
      url: "/mise_a_jourevent",
      icon: "question-diamond-fill"
   },
      {
        name: 'Création de produits',
        url: '/chatEvent',
        icon: 'question-diamond-fill',
      },  
      {
        name: "Portefeuille",
        url: "/wallet",
        icon: "question-diamond-fill"
      },
      {
        name: 'Politique',
        url: '/politique',
        icon: 'question-diamond-fill',
      },
      // {
      //   name: 'Paiement',
      //   url: '/paiementMarchand',
      //   icon: 'question-diamond-fill',
      // },
    ],
  };

  // Élément de menu générique pour l'utilisateur sans rôle
  const defaultMenuItem = [
    {
      name: 'Accueil',
      url: '/politique',
      icon: 'question-diamond-fill',
    },
    {
      name: 'Demande de partenariat',
      url: '/demandePartenariat',
      icon: 'question-diamond-fill',
    },
  ];

  return (
    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full border-r border-gray-200 sm:translate-x-0 dark:bg-indigo-700 dark:border-indigo-700" aria-label="Sidebar">
      <div className="h-full px-3 pb-4 overflow-y-auto dark:bg-indigo-800">
        <ul className="space-y-2 font-medium">
          {userRoles.length > 0 ? (
              userRoles.map((role) => {
                const roleItem = roleItems[role];
                if (roleItem) {
                  return roleItem.map((item, index) => (
                    <li key={index}>
                      <Link href={item.url} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover-bg-gray-700 group ${router.asPath === item.url ? 'bg-orange-500' : ''}`}>
                        <i className={"bg-blue-900 p-1 px-2 rounded-md bi bi-" + item.icon}></i>
                        <span className="ml-3 font-semibold">{item.name}</span>
                      </Link>
                    </li>
                  ));
                }
                return null; // Rôle non trouvé dans roleItems
            })
          ) : (
            // Afficher la page "Accueil" si l'utilisateur n'a pas de rôle ou si aucun rôle avec `hasRole` à `true` n'a été trouvé
            defaultMenuItem.map((item, index) => (
              <li key={index}>
                <Link href={item.url} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover-bg-gray-700 group">
                  <i className={"bg-blue-900 p-1 px-2 rounded-md bi bi-" + item.icon}></i>
                  <span className="ml-3 font-semibold">{item.name}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}  
import DashLayout from "./components/layout/dashboardLayout";
import Head from "@/utils/head";
import Marchand from './components/layout/MarchandTable'
import Market from './components/layout/BoutiqueTable'
import Event from './components/layout/EventTable'
import Champion from "./components/layout/ChampionTableDecideur";
import Chauffeur from "./components/layout/ChauffeurTableDecideur";


export default function listeDecideur() {
  return (
    <DashLayout>
    <Head/>
    <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
       DEDIDEURS
    </div>  
    <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
    <Marchand/>
    </div>  

    <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
    <Market/>
    </div>

    <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
    <Event/>
    </div>

    <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
    <Champion/>
    </div> 

     <div className="p-4 border border-gray-20 border-dashe rounded-lg dark:border-orange-500 mt-14">
    <Chauffeur/>
    </div>  

    </DashLayout>
    
  )
}
